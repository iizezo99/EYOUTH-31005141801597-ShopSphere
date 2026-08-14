import app from '../app.js';
import mongoose from 'mongoose';

if (process.env.MONGO_URI && mongoose.connection.readyState === 0) {
  await mongoose.connect(process.env.MONGO_URI);
}

export default app;
