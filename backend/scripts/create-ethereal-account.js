import nodemailer from 'nodemailer';

const account = await nodemailer.createTestAccount();

console.log('\nEthereal account created. Add these values to backend/.env:\n');
console.log(`SMTP_HOST=${account.smtp.host}`);
console.log(`SMTP_PORT=${account.smtp.port}`);
console.log(`SMTP_USER=${account.user}`);
console.log(`SMTP_PASS=${account.pass}`);
console.log(`SMTP_FROM=${account.user}`);
console.log('NOTIFICATION_RECIPIENT=shopsphere@example.com');
console.log(`\nEthereal web inbox: ${account.web}\n`);
