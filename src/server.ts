import dotenv from 'dotenv';
dotenv.config(); // 🔥 this must come before using process.env

import { Server } from 'http';
import app from './app';
import mongoose from 'mongoose';

let server: Server;
const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/library';

async function main() {
  try {
    server = app.listen(PORT, async () => {
      await mongoose.connect(MONGODB_URI);
      console.log('✅ Connected to Database');
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log('🚀 ~ main ~ error:', error);
  }
}
main();
