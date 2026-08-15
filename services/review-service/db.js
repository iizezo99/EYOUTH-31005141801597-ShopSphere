import mongoose from 'mongoose';

let connectionPromise;

export async function connectDatabase() {
  if (!process.env.MONGO_URI) {
    const error = new Error('MONGO_URI is not configured');
    error.code = 'MONGO_URI_MISSING';
    throw error;
  }

  if (mongoose.connection.readyState === 1) return;
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGO_URI).catch((error) => {
      connectionPromise = undefined;
      throw error;
    });
  }
  await connectionPromise;
}
