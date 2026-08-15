import nodemailer from 'nodemailer';

export function isNotificationConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.NOTIFICATION_RECIPIENT
  );
}

export async function sendOrderNotification({ orderId, subject, text }) {
  if (!isNotificationConfigured()) {
    const error = new Error('Notification email is not configured');
    error.code = 'NOTIFICATION_NOT_CONFIGURED';
    throw error;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    tls: { rejectUnauthorized: false },
  });

  return transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.NOTIFICATION_RECIPIENT,
    subject: subject || `ShopSphere order ${orderId}`,
    text,
  });
}
