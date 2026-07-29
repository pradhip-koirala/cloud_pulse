import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer;

export const connectDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    // If no MongoDB URI is provided, use in-memory MongoDB for development
    if (!mongoUri || mongoUri.includes('localhost:27017')) {
      console.log('Starting in-memory MongoDB server...');
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log('In-memory MongoDB connected successfully');
    } else {
      // Use the provided MongoDB URI (e.g., MongoDB Atlas)
      await mongoose.connect(mongoUri);
      console.log('MongoDB connected successfully');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  if (mongoServer) {
    await mongoServer.stop();
  }
  console.log('MongoDB connection closed');
  process.exit(0);
});
