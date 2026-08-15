import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  customerEmail: { type: String, required: true },
  items: { type: [OrderItemSchema], required: true },
  totalPrice: { type: Number, required: true, min: 0 },
  shipping: {
    firstName: String,
    lastName: String,
    email: String,
    address: String,
    city: String,
    zipCode: String,
  },
  status: { type: String, enum: ['placed', 'processing', 'completed', 'cancelled'], default: 'placed' },
}, { timestamps: true });

export default mongoose.model('Order', OrderSchema);
