import Cart from '../models/cart.js';
import Order from '../models/order.js';
import { sendOrderNotificationViaFunction } from '../services/notificationService.js';

export const createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cannot create an order from an empty cart' });
    }

    const order = await Order.create({
      userId: req.user.userId,
      customerEmail: req.user.email,
      items: cart.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      totalPrice: cart.totalPrice,
      shipping: req.body?.shipping || {},
    });

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    let notification = 'sent';
    try {
      const itemLines = order.items
        .map((item) => `- ${item.name} x ${item.quantity} ($${(item.price * item.quantity).toFixed(2)})`)
        .join('\n');
      await sendOrderNotificationViaFunction({
        orderId: order.id,
        subject: `New ShopSphere order ${order.id}`,
        text: [
          `New order received from ${order.customerEmail}.`,
          `Order ID: ${order.id}`,
          `Total: $${order.totalPrice.toFixed(2)}`,
          '',
          itemLines,
        ].join('\n'),
      });
    } catch (error) {
      notification = error.code === 'NOTIFICATION_NOT_CONFIGURED' ? 'not_configured' : 'failed';
      console.error(JSON.stringify({ type: 'order_notification_failed', orderId: order.id, message: error.message }));
    }

    return res.status(201).json({ order, notification });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to create order' });
  }
};
