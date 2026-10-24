import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return true;

  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/technova';
  
  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500,
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`[Database] Notice: Could not connect to MongoDB at ${mongoUri}.`);
    console.warn(`[Database] Running in In-Memory Demo Mode with sample dataset.`);
    console.warn(`[Database] To connect your own MongoDB, set MONGODB_URI in server/.env`);
    return false;
  }
};

export const getDbStatus = () => isConnected;
