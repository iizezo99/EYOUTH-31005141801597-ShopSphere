import nodemailer from 'nodemailer';

const requestBuckets = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 20;
const productionFrontendOrigin = 'https://eyouth-31005141801597-shop-sphere-q.vercel.app';

function isAllowedOrigin(origin) {
  return !origin || origin === productionFrontendOrigin || origin === process.env.FRONTEND_URL;
}

function applyCors(req, res) {
  const origin = req.headers.origin;
  if (!isAllowedOrigin(origin)) return false;

  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Request-Id');
  return true;
}

function isRateLimited(ip) {
  const now = Date.now();
  const bucket = requestBuckets.get(ip) || { startedAt: now, count: 0 };
  if (now - bucket.startedAt >= WINDOW_MS) {
    bucket.startedAt = now;
    bucket.count = 0;
  }
  bucket.count += 1;
  requestBuckets.set(ip, bucket);
  return bucket.count > MAX_REQUESTS;
}

export default async function handler(req, res) {
  if (!applyCors(req, res)) return res.status(403).json({ message: 'Origin not allowed' });
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ message: 'Too many notification requests. Try again later.' });
  }

  if (!process.env.INTERNAL_FUNCTION_TOKEN || req.headers.authorization !== `Bearer ${process.env.INTERNAL_FUNCTION_TOKEN}`) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { orderId, subject = 'ShopSphere order notification', text } = req.body || {};
  if (!orderId || !text) {
    return res.status(400).json({ message: 'orderId and text are required' });
  }

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.NOTIFICATION_RECIPIENT) {
    return res.status(503).json({ message: 'Notification email is not configured' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.NOTIFICATION_RECIPIENT,
      subject,
      text
    });

    return res.status(202).json({ accepted: true, event: 'order.notification', orderId });
  } catch (error) {
    console.error('Notification delivery failed:', error);
    return res.status(502).json({ message: 'Notification delivery failed' });
  }
}
