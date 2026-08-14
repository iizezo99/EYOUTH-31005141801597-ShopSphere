import "dotenv/config";
import mongoose from 'mongoose';
import * as prismaPackage from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import app from './app.js';

const { PrismaClient } = prismaPackage;

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

const start = async () => {
  if (!process.env.DATABASE_URL || !process.env.MONGO_URI || !process.env.JWT_SECRET) {
    throw new Error('DATABASE_URL, MONGO_URI, and JWT_SECRET must be configured');
  }
  await mongoose.connect(process.env.MONGO_URI);
  console.log(JSON.stringify({ type: 'startup', message: 'MongoDB connected' }));
  const server = app.listen(PORT, HOST, () => console.log(JSON.stringify({ type: 'startup', port: PORT })));
  const shutdown = async (signal) => {
    console.log(JSON.stringify({ type: 'shutdown', signal }));
    server.close(async () => { await mongoose.disconnect(); await prisma.$disconnect(); process.exit(0); });
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

start().catch((error) => {
  console.error(JSON.stringify({ type: 'startup_error', message: error.message }));
  process.exit(1);
});
