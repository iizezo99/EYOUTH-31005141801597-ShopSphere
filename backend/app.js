import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use((req, res, next) => {
  req.requestId = req.get('x-request-id') || crypto.randomUUID();
  res.setHeader('x-request-id', req.requestId);
  const startedAt = Date.now();
  res.on('finish', () => console.log(JSON.stringify({ type: 'http_request', requestId: req.requestId, method: req.method, path: req.originalUrl, status: res.statusCode, durationMs: Date.now() - startedAt })));
  next();
});

const apiLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  limit: Number(process.env.RATE_LIMIT_MAX || 300),
  standardHeaders: 'draft-8', legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .concat('http://localhost:5173');
const allowAllCors = process.env.ALLOW_ALL_CORS === 'true';

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowAllCors || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origin is not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api', apiLimiter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'ecommerce-backend',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health/ready', (req, res) => {
  const ready = Boolean(process.env.DATABASE_URL && process.env.MONGO_URI && process.env.JWT_SECRET);
  res.status(ready ? 200 : 503).json({ status: ready ? 'ready' : 'not_ready', requestId: req.requestId });
});

app.get('/', (req, res) => {
  res.send('✅ Backend is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);

app.use((err, req, res, next) => {
  console.error(JSON.stringify({ type: 'unhandled_error', requestId: req.requestId, message: err.message }));
  res.status(err.statusCode || 500).json({ message: 'Internal server error', requestId: req.requestId });
});

export default app;
