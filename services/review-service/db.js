import mongoose from 'mongoose';

let connectionPromise;

export async function connectDatabase() {
  const mongoUri = process.env.REVIEW_MONGO_URI || process.env.MONGO_URI;
  if (!mongoUri) {
    const error = new Error('Review database connection is not configured');
    error.code = 'MONGO_URI_MISSING';
    throw error;
  }

  if (mongoose.connection.readyState === 1) return;
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(mongoUri).catch((error) => {
      connectionPromise = undefined;
      throw error;
    });
  }
  await connectionPromise;
}
