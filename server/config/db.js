import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hireconnect';
  try {
    // Attempt local/configured mongo connection with short timeout
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[HireConnect DB] MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.warn(`[HireConnect DB] Standard MongoDB connection failed (${err.message}). Starting MongoMemoryServer for instant zero-setup execution...`);
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`[HireConnect DB] In-Memory MongoDB Instance initialized at: ${memoryUri}`);
    } catch (memErr) {
      console.error('[HireConnect DB] Failed to start fallback MongoDB:', memErr.message);
      process.exit(1);
    }
  }
};
