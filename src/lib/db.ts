import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://Singhvivek:Bajaj%40150@ac-s3m0olm-shard-00-00.afuk4uq.mongodb.net:27017,ac-s3m0olm-shard-00-01.afuk4uq.mongodb.net:27017,ac-s3m0olm-shard-00-02.afuk4uq.mongodb.net:27017/icoland?ssl=true&replicaSet=atlas-hhefxe-shard-0&authSource=admin&appName=Cluster0';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
