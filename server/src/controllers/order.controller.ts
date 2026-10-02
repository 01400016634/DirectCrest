import type { Response, Request } from 'express';
import type { AuthRequest } from '../middleware/auth.js';
import { Order, OrderItem, User, Role } from '../models/Schema.js';
import { checkOwnershipOrRole } from '../utils/security.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { items, formData, total, subtotal, deliveryFee, discount } = req.body;
    
    // Find or create user
    let user = await User.findOne({ email: formData.email });
    if (!user && formData.email) {
      // Find default USER role
      let userRole = await Role.findOne({ name: 'USER' });
      if (!userRole) {
        userRole = await Role.create({ name: 'USER', permissions: [] });
      }
      user = await User.create({
        firstName: formData.name?.split(' ')[0] || 'Unknown',
        lastName: formData.name?.split(' ').slice(1).join(' ') || '',
        email: formData.email,
        password: 'OAuthOrPhoneUser' + Math.random().toString(36), // Dummy password since they use Firebase/Clerk
        roleId: userRole._id
      });
    }

    // Create main order
    const order = await Order.create({
      userId: user?._id,
      total,
      subtotal,
      deliveryFee,
      discount,
      discountCode: formData.discountCode,
      customerInfo: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
      },
      deliveryOption: formData.deliveryOption,
      paymentMethod: formData.paymentMethod,
    });
    
    // Create order items
    if (items && items.length > 0) {
      const orderItems = items.map((item: any) => ({
        orderId: order._id,
        productId: item._id || item.productId, // Fallback if _id is not present
        quantity: item.quantity,
        priceSnapshot: item.price || 0,
      }));
      await OrderItem.insertMany(orderItems);
    }
    
    res.status(201).json({ success: true, trackingNumber: order._id });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private (CUSTOMER, etc)
export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ userId: req.user._id });
    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private (Owner or ORDER_MANAGER/ADMIN)
export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    // IDOR Protection Check
    const hasAccess = checkOwnershipOrRole(req, order.userId!.toString(), ['SUPER_ADMIN', 'ADMIN', 'ORDER_MANAGER', 'SUPPORT_AGENT']);
    if (!hasAccess) {
      res.status(403).json({ error: 'Not authorized to view this order (IDOR prevented)' });
      return;
    }

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (ORDER_MANAGER, ADMIN, SUPER_ADMIN)
export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
