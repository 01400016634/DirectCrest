import mongoose, { Schema } from 'mongoose';

const opts = { timestamps: true };

export const RoleSchema = new Schema({ name: { type: String, required: true, unique: true } }, opts);
export const UserSchema = new Schema({ 
  email: { type: String, required: true, unique: true }, 
  passwordHash: { type: String }, 
  googleId: { type: String, unique: true, sparse: true },
  firstName: String,
  lastName: String,
  isEmailVerified: { type: Boolean, default: false },
  otpSecret: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  roleId: { type: Schema.Types.ObjectId, ref: 'Role' },
  wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
}, opts);
export const CountrySchema = new Schema({ code: String, name: String, phoneCode: String, currencyCode: String }, opts);
export const CurrencySchema = new Schema({ code: String, symbol: String }, opts);
export const LanguageSchema = new Schema({ code: String, name: String }, opts);

export const AddressSchema = new Schema({ 
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
  label: { type: String, default: 'Home' }, // Home, Office
  countryId: { type: Schema.Types.ObjectId, ref: 'Country', required: true },
  phone: String,
  level1: { type: String, required: true }, // Division (BD), State (IN), Province (PK)
  level2: { type: String, required: true }, // District (BD, IN), City (PK)
  level3: String, // Upazila (BD)
  postalCode: { type: String, required: true },
  street: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
}, opts);
export const CategorySchema = new Schema({ name: String, parentId: { type: Schema.Types.ObjectId, ref: 'Category' } }, opts);
export const BrandSchema = new Schema({ name: String, logoUrl: String }, opts);

export const ProductSchema = new Schema({ 
  name: { type: String, required: true },
  description: String,
  descriptionTranslations: { type: Map, of: String, default: {} },
  sku: { type: String, unique: true }, 
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
  brandId: { type: Schema.Types.ObjectId, ref: 'Brand' },
  retailPrice: Number, 
  wholesaleStartingPrice: Number,
  wholesaleTiers: [{
    minQuantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  condition: { type: String, enum: ['NEW', 'USED', 'REFURBISHED', 'OPEN_BOX', 'PRE_ORDER'] },
  status: { type: String, enum: ['DRAFT', 'PUBLISHED'], default: 'DRAFT' },
  stock: { type: Number, default: 0 },
  weight: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  sourceCountryId: { type: Schema.Types.ObjectId, ref: 'Country' },
  isFeatured: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  threeDModelUrl: String
}, opts);

ProductSchema.index({ name: 'text', description: 'text', sku: 'text' });

export const ProductVariantSchema = new Schema({ productId: { type: Schema.Types.ObjectId, ref: 'Product' }, name: String, price: Number, sku: String }, opts);
export const ProductImageSchema = new Schema({ productId: { type: Schema.Types.ObjectId, ref: 'Product' }, url: String, isPrimary: Boolean }, opts);
export const ProductVideoSchema = new Schema({ productId: { type: Schema.Types.ObjectId, ref: 'Product' }, url: String }, opts);
export const ProductAttributeSchema = new Schema({ productId: { type: Schema.Types.ObjectId, ref: 'Product' }, key: String, value: String }, opts);
export const InventorySchema = new Schema({ productId: { type: Schema.Types.ObjectId, ref: 'Product' }, variantId: { type: Schema.Types.ObjectId, ref: 'ProductVariant' }, quantity: Number }, opts);

export const SupplierSchema = new Schema({ name: String, contactInfo: String, isPrivate: { type: Boolean, default: true } }, opts);
export const SupplierProductSchema = new Schema({ supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier' }, productId: { type: Schema.Types.ObjectId, ref: 'Product' }, cost: { type: Number, select: false } }, opts); // Cost is private

export const CartSchema = new Schema({ userId: { type: Schema.Types.ObjectId, ref: 'User' } }, opts);
export const CartItemSchema = new Schema({ cartId: { type: Schema.Types.ObjectId, ref: 'Cart' }, productId: { type: Schema.Types.ObjectId, ref: 'Product' }, quantity: Number }, opts);
export const WishlistSchema = new Schema({ userId: { type: Schema.Types.ObjectId, ref: 'User' } }, opts);
export const WishlistItemSchema = new Schema({ wishlistId: { type: Schema.Types.ObjectId, ref: 'Wishlist' }, productId: { type: Schema.Types.ObjectId, ref: 'Product' } }, opts);

export const OrderSchema = new Schema({ userId: { type: Schema.Types.ObjectId, ref: 'User' }, total: Number, status: { type: String, enum: ['Pending', 'PAID', 'Processing', 'Shipped', 'Delivered'], default: 'Pending' }, shippingAddress: { type: Schema.Types.Mixed }, trackingNumber: String, carrier: String, quoteId: { type: Schema.Types.ObjectId, ref: 'Quote' }, userDeleted: { type: Boolean, default: false } }, opts);
export const OrderItemSchema = new Schema({ orderId: { type: Schema.Types.ObjectId, ref: 'Order' }, productId: { type: Schema.Types.ObjectId, ref: 'Product' }, variantId: { type: Schema.Types.ObjectId, ref: 'ProductVariant' }, quantity: Number, priceSnapshot: Number }, opts);

export const PaymentSchema = new Schema({ orderId: { type: Schema.Types.ObjectId, ref: 'Order' }, amount: Number, status: String }, opts);
export const PaymentTransactionSchema = new Schema({ paymentId: { type: Schema.Types.ObjectId, ref: 'Payment' }, gateway: String, reference: String }, opts);

export const ShipmentSchema = new Schema({ orderId: { type: Schema.Types.ObjectId, ref: 'Order' }, carrier: String, trackingNumber: String, status: String }, opts);
export const TrackingEventSchema = new Schema({ shipmentId: { type: Schema.Types.ObjectId, ref: 'Shipment' }, status: String, location: String }, opts);

export const ShippingMethodSchema = new Schema({ name: String }, opts);
export const ShippingZoneSchema = new Schema({ name: String, countries: [String] }, opts);
export const ShippingRateSchema = new Schema({ 
  zoneId: { type: Schema.Types.ObjectId, ref: 'ShippingZone' }, 
  methodName: String, 
  rateType: { type: String, enum: ['FLAT', 'WEIGHT'], default: 'FLAT' },
  rate: Number,
  minWeight: Number,
  maxWeight: Number
}, opts);

export const ProductRequestSchema = new Schema({ 
  userId: { type: Schema.Types.ObjectId, ref: 'User' }, 
  productTitle: { type: String, required: true }, 
  description: { type: String, required: true }, 
  targetPrice: Number, 
  quantity: { type: Number, required: true }, 
  imageLink: String, 
  status: { type: String, enum: ['Pending', 'Quoted', 'Rejected', 'Paid'], default: 'Pending' } 
}, opts);
export const QuoteSchema = new Schema({ 
  requestId: { type: Schema.Types.ObjectId, ref: 'ProductRequest' }, 
  finalPrice: { type: Number, required: true }, 
  shippingCost: { type: Number, required: true },
  internalSupplierCost: { type: Number, select: false, required: true }, // strictly private
  notes: String
}, opts);

export const PurchaseOrderSchema = new Schema({ supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier' }, status: String }, opts);
export const PurchaseOrderItemSchema = new Schema({ poId: { type: Schema.Types.ObjectId, ref: 'PurchaseOrder' }, productId: { type: Schema.Types.ObjectId, ref: 'Product' }, quantity: Number }, opts);
export const WholesaleRequestSchema = new Schema({ userId: { type: Schema.Types.ObjectId, ref: 'User' }, productId: { type: Schema.Types.ObjectId, ref: 'Product' }, requestedQuantity: Number }, opts);

export const CouponSchema = new Schema({ 
  code: { type: String, required: true, unique: true }, 
  discountType: { type: String, enum: ['PERCENTAGE', 'FIXED'], default: 'FIXED' },
  value: { type: Number, required: true },
  expiryDate: Date,
  usageLimit: Number,
  usageCount: { type: Number, default: 0 }
}, opts);
export const DiscountSchema = new Schema({ productId: { type: Schema.Types.ObjectId, ref: 'Product' }, discountAmount: Number }, opts);
export const ReviewSchema = new Schema({ productId: { type: Schema.Types.ObjectId, ref: 'Product' }, userId: { type: Schema.Types.ObjectId, ref: 'User' }, rating: Number, comment: String }, opts);
export const InvoiceSchema = new Schema({ orderId: { type: Schema.Types.ObjectId, ref: 'Order' }, pdfUrl: String }, opts);
export const NotificationSchema = new Schema({ userId: { type: Schema.Types.ObjectId, ref: 'User' }, message: String, isRead: Boolean }, opts);
export const AuditLogSchema = new Schema({ entity: String, entityId: String, action: String, userId: { type: Schema.Types.ObjectId, ref: 'User' } }, opts);

export const Role = mongoose.models.Role || mongoose.model('Role', RoleSchema);
export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Country = mongoose.models.Country || mongoose.model('Country', CountrySchema);
export const Currency = mongoose.models.Currency || mongoose.model('Currency', CurrencySchema);
export const Language = mongoose.models.Language || mongoose.model('Language', LanguageSchema);
export const Address = mongoose.models.Address || mongoose.model('Address', AddressSchema);
export const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
export const Brand = mongoose.models.Brand || mongoose.model('Brand', BrandSchema);
export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export const ProductVariant = mongoose.models.ProductVariant || mongoose.model('ProductVariant', ProductVariantSchema);
export const ProductImage = mongoose.models.ProductImage || mongoose.model('ProductImage', ProductImageSchema);
export const ProductVideo = mongoose.models.ProductVideo || mongoose.model('ProductVideo', ProductVideoSchema);
export const ProductAttribute = mongoose.models.ProductAttribute || mongoose.model('ProductAttribute', ProductAttributeSchema);
export const Inventory = mongoose.models.Inventory || mongoose.model('Inventory', InventorySchema);
export const Supplier = mongoose.models.Supplier || mongoose.model('Supplier', SupplierSchema);
export const SupplierProduct = mongoose.models.SupplierProduct || mongoose.model('SupplierProduct', SupplierProductSchema);
export const Cart = mongoose.models.Cart || mongoose.model('Cart', CartSchema);
export const CartItem = mongoose.models.CartItem || mongoose.model('CartItem', CartItemSchema);
export const Wishlist = mongoose.models.Wishlist || mongoose.model('Wishlist', WishlistSchema);
export const WishlistItem = mongoose.models.WishlistItem || mongoose.model('WishlistItem', WishlistItemSchema);
export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
export const OrderItem = mongoose.models.OrderItem || mongoose.model('OrderItem', OrderItemSchema);
export const Payment = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
export const PaymentTransaction = mongoose.models.PaymentTransaction || mongoose.model('PaymentTransaction', PaymentTransactionSchema);
export const Shipment = mongoose.models.Shipment || mongoose.model('Shipment', ShipmentSchema);
export const TrackingEvent = mongoose.models.TrackingEvent || mongoose.model('TrackingEvent', TrackingEventSchema);
export const ShippingMethod = mongoose.models.ShippingMethod || mongoose.model('ShippingMethod', ShippingMethodSchema);
export const ShippingZone = mongoose.models.ShippingZone || mongoose.model('ShippingZone', ShippingZoneSchema);
export const ShippingRate = mongoose.models.ShippingRate || mongoose.model('ShippingRate', ShippingRateSchema);
export const ProductRequest = mongoose.models.ProductRequest || mongoose.model('ProductRequest', ProductRequestSchema);
export const Quote = mongoose.models.Quote || mongoose.model('Quote', QuoteSchema);
export const PurchaseOrder = mongoose.models.PurchaseOrder || mongoose.model('PurchaseOrder', PurchaseOrderSchema);
export const PurchaseOrderItem = mongoose.models.PurchaseOrderItem || mongoose.model('PurchaseOrderItem', PurchaseOrderItemSchema);
export const WholesaleRequest = mongoose.models.WholesaleRequest || mongoose.model('WholesaleRequest', WholesaleRequestSchema);
export const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);
export const Discount = mongoose.models.Discount || mongoose.model('Discount', DiscountSchema);
export const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
export const Invoice = mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);
export const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
export const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
