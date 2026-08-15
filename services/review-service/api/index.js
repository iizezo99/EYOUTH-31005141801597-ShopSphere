import 'dotenv/config';
import app from '../app.js';
import { connectDatabase } from '../db.js';

export default async function handler(req, res) {
  if (req.url === '/health' || req.url?.startsWith('/health?')) {
    return app(req, res);
  }

  try {
    await connectDatabase();
    return app(req, res);
  } catch (error) {
    console.error('Review service database connection failed:', error.message);
    return res.status(503).json({ error: 'Review service database is unavailable' });
  }
}
