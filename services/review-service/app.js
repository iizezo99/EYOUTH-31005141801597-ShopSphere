import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const allowedOrigins = new Set([
  process.env.FRONTEND_URL,
  'https://eyouth-31005141801597-shop-sphere-q.vercel.app',
].filter(Boolean));

app.use(cors({
  origin: (origin, callback) => callback(null, !origin || allowedOrigins.has(origin)),
  credentials: true,
}));
app.use(express.json());

const Review = mongoose.models.Review || mongoose.model('Review', new mongoose.Schema({
  productId: { type: String, required: true, index: true },
  userId: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true, maxlength: 2000 },
}, { timestamps: true }));

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'review-service' }));

app.get('/reviews/:productId', async (req, res, next) => {
  try {
    res.json(await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 }));
  } catch (error) {
    next(error);
  }
});

app.post('/reviews', async (req, res, next) => {
  try {
    const { productId, userId, rating, comment } = req.body;
    if (!productId || !userId || !Number.isInteger(rating) || rating < 1 || rating > 5 || !comment?.trim()) {
      return res.status(400).json({ error: 'productId, userId, rating (1-5), and comment are required' });
    }
    const review = await Review.create({ productId, userId, rating, comment: comment.trim() });
    return res.status(201).json(review);
  } catch (error) {
    return next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error('Review service error:', error);
  res.status(500).json({ error: 'Review service request failed' });
});

export default app;
