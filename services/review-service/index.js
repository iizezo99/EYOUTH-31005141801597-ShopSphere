import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './db.js';

await connectDatabase();
app.listen(process.env.PORT || 5100, '0.0.0.0');
