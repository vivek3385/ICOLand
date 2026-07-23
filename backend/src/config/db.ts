import mongoose from 'mongoose';
import { env } from './env';

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) {
    console.log('📦 Using existing MongoDB connection');
    return;
  }

  let targetURI = env.MONGODB_URI;

  // Inject database name if not present
  const uriWithoutCreds = env.MONGODB_URI.replace(/:([^@]*)@/, '@');
  const hasDbName = /\.net(:\d+)?(,[\w.:]+)*\/[a-zA-Z0-9_-]+(\?|$)/.test(uriWithoutCreds);

  if (!hasDbName) {
    const dbName = env.MONGODB_NAME;
    if (env.MONGODB_URI.includes('/?')) {
      targetURI = env.MONGODB_URI.replace('/?', `/${dbName}?`);
    } else if (env.MONGODB_URI.includes('?')) {
      targetURI = env.MONGODB_URI.replace('?', `/${dbName}?`);
    } else {
      targetURI = env.MONGODB_URI.endsWith('/')
        ? `${env.MONGODB_URI}${dbName}`
        : `${env.MONGODB_URI}/${dbName}`;
    }
  }

  const safeURI = targetURI.replace(/:([^@]+)@/, ':****@');
  console.log(`🔌 Connecting to MongoDB: ${safeURI}`);

  try {
    await mongoose.connect(targetURI, {
      serverSelectionTimeoutMS: 10000,
      bufferCommands: false,
    });

    isConnected = true;
    const dbName = mongoose.connection.db.databaseName;
    console.log(`✅ MongoDB connected — Database: "${dbName}"`);
  } catch (error: any) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🛑 MongoDB connection closed (SIGINT)');
  process.exit(0);
});
