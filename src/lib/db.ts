import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env'
  );
}

// Global is used here to maintain a cached connection across hot reloads in development.
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    };

    // Determine target database name
    const dbName = process.env.MONGODB_NAME || 'icoland';
    let targetURI = MONGODB_URI;

    // Standard database name injections
    const uriWithoutCreds = MONGODB_URI.replace(/:([^@]*)@/, '@');
    const hasDbName = /\.net(:\d+)?(,[\w.:]+)*\/[a-zA-Z0-9_-]+(\?|$)/.test(uriWithoutCreds);
    
    if (!hasDbName) {
      if (MONGODB_URI.includes('/?')) {
        targetURI = MONGODB_URI.replace('/?', `/${dbName}?`);
      } else if (MONGODB_URI.includes('?')) {
        targetURI = MONGODB_URI.replace('?', `/${dbName}?`);
      } else {
        targetURI = MONGODB_URI.endsWith('/') ? `${MONGODB_URI}${dbName}` : `${MONGODB_URI}/${dbName}`;
      }
    }

    const safeURI = targetURI.replace(/:([^@]+)@/, ':****@');
    console.log(`🔌 Connecting to MongoDB Atlas: ${safeURI}`);

    cached.promise = mongoose.connect(targetURI, opts).then((mongooseInstance) => {
      console.log(`✅ Connected to MongoDB Database: "${mongooseInstance.connection.db.databaseName}"`);
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
