import 'dotenv/config';
import mongoose from 'mongoose';
import app from '../app.js';

if (process.env.MONGO_URI && mongoose.connection.readyState === 0) {
  await mongoose.connect(process.env.MONGO_URI);
}

export default app;
