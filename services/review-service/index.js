import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';

await mongoose.connect(process.env.MONGO_URI);
app.listen(process.env.PORT || 5100, '0.0.0.0');
