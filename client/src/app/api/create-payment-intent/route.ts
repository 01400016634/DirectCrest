import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import connectDB from '@/lib/mongoose';
import { Product, ProductVariant, Order, OrderItem, Quote, ProductRequest, Coupon } from '@/lib/models/Schema';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2026-08-26.dahlia', // Updated API version
});

const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.93,
  GBP: 0.79,
  JPY: 151.20,
  CAD: 1.36,
  AUD: 1.52,
};

// Helper to calculate server-side prices
const prepareItems = async (items: { productId: string; variantId?: string; quantity: number }[], shippingCost: number, couponCode?: string) => {
  await connectDB();
  
  const serverItems = [];
  let total = 0;
  
  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) continue;

    let basePrice = product.retailPrice;
    if (item.variantId) {
      const variant = await ProductVariant.findById(item.variantId);
      if (variant) {
        basePrice = variant.price;
      }
    }
    
    let effectivePrice = basePrice;
    if (product.wholesaleTiers && product.wholesaleTiers.length > 0) {
      const applicableTier = [...product.wholesaleTiers]
        .sort((a, b) => b.minQuantity - a.minQuantity)
        .find(tier => item.quantity >= tier.minQuantity);
      if (applicableTier) {
        effectivePrice = applicableTier.price;
      }
    }
    
    total += effectivePrice * item.quantity;
    serverItems.push({
      ...item,
      effectivePrice
    });
  }
  
  const subtotal = total;

  // Apply Coupon if provided
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    if (coupon) {
      const isValid = (!coupon.expiryDate || new Date(coupon.expiryDate) >= new Date()) && 
                      (!coupon.usageLimit || (coupon.usageCount || 0) < coupon.usageLimit);
      
      if (isValid) {
        let discount = 0;
        if (coupon.discountType === 'PERCENTAGE') {
          discount = (subtotal * (coupon.value || 0)) / 100;
        } else {
          discount = coupon.value || 0;
        }
        discount = Math.min(discount, subtotal);
        total -= discount;
      }
    }
  }
  
  // Add dynamic shipping cost
  total += shippingCost || 0;
  
  total = Math.max(0, total); // Ensure total is never negative
  return {
    amount: Math.round(total * 100), // Stripe expects cents
    serverItems
  };
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, shippingAddress, quoteId, userId, shippingCost = 15.00, couponCode, currency = 'USD' } = body;

    await connectDB();

    let amount = 0;
    let order;

    if (quoteId) {
      // Custom Quote Checkout
      const quote = await Quote.findById(quoteId);
      if (!quote) {
        return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
      }
      const productRequest = await ProductRequest.findById(quote.requestId);
      if (!productRequest) {
        return NextResponse.json({ error: 'Product Request not found' }, { status: 404 });
      }

      const total = (quote.finalPrice * productRequest.quantity) + quote.shippingCost;
      amount = Math.round(total * 100);

      if (amount <= 0) {
        return NextResponse.json({ error: 'Invalid order amount' }, { status: 400 });
      }

      order = await Order.create({
        total: amount / 100, // store as dollars
        status: 'PENDING',
        shippingAddress,
        userId: userId || undefined,
        quoteId,
      });

      // We can also create a mock OrderItem for the custom sourcing request
      await OrderItem.create({
        orderId: order._id,
        quantity: productRequest.quantity,
        priceSnapshot: quote.finalPrice,
        // Since there is no actual productId, we won't reference one. Or we could just not create an OrderItem.
      });

    } else {
      // Standard Checkout
      if (!items || items.length === 0) {
        return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
      }

      const prepared = await prepareItems(items, shippingCost, couponCode);
      amount = prepared.amount;
      const serverItems = prepared.serverItems;

      if (amount <= 0) {
        return NextResponse.json({ error: 'Invalid order amount' }, { status: 400 });
      }

      order = await Order.create({
        total: amount / 100, // store as dollars
        status: 'PENDING',
        shippingAddress,
        userId: userId || undefined,
      });

      for (const item of serverItems) {
        await OrderItem.create({
          orderId: order._id,
          productId: item.productId,
          variantId: item.variantId || undefined,
          quantity: item.quantity,
          priceSnapshot: item.effectivePrice,
        });
      }
    }

    // Create a PaymentIntent with the order amount and currency
    const rate = EXCHANGE_RATES[currency as string] || 1;
    const finalAmountInCurrency = amount * rate;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(finalAmountInCurrency),
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: order._id.toString(),
        quoteId: quoteId || '',
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: unknown) {
    console.error('Stripe error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create payment intent';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
