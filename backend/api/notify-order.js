export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  if (req.headers.authorization !== `Bearer ${process.env.INTERNAL_FUNCTION_TOKEN}`) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  // Connect this event to Resend/SendGrid/Nodemailer using server-side secrets.
  return res.status(202).json({ accepted: true, event: 'order.notification', orderId: req.body?.orderId });
}
