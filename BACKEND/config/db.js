import mongoose from 'mongoose';
import dns from 'dns';

// Safe DNS server fallback for MongoDB Atlas SRV lookups on restrictive networks
try {
  if (dns && typeof dns.setServers === 'function') {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  }
} catch (e) {
  // DNS configuration modification might not be allowed in all sandboxes; safe to ignore
}

// Global cached connection for serverless function reuse
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Sanitize MongoDB URI to strip quotes, whitespace, or accidental CLI/key prefixes
const cleanMongoUri = (rawUri) => {
  if (!rawUri || typeof rawUri !== 'string') {
    return 'mongodb://127.0.0.1:27017/mota_scholarship';
  }
  let cleaned = rawUri.trim();

  // Strip accidental "MONGO_URI=" prefix if pasted with the key name
  if (cleaned.startsWith('MONGO_URI=')) {
    cleaned = cleaned.replace(/^MONGO_URI=/, '').trim();
  }

  // Strip accidental "mongosh" command prefix if copied from MongoDB Atlas connection modal
  if (cleaned.startsWith('mongosh')) {
    cleaned = cleaned.replace(/^mongosh\s+/, '').trim();
  }

  // Strip surrounding single, double, or backtick quotes
  cleaned = cleaned.replace(/^["'`]+/, '').replace(/["'`]+$/, '').trim();

  return cleaned;
};

export const connectDB = async () => {
  // If already connected, reuse existing connection immediately
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cached.conn) {
    return cached.conn;
  }

  const rawUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mota_scholarship';
  const mongoUri = cleanMongoUri(rawUri);

  if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
    throw new Error(
      `Invalid MONGO_URI format. The connection string must start with 'mongodb://' or 'mongodb+srv://'. Check your Vercel Environment Variables.`
    );
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000
    };

    cached.promise = mongoose.connect(mongoUri, opts).then((mongooseInstance) => {
      console.log(`[Database] MongoDB Connected: ${mongooseInstance.connection.host}/${mongooseInstance.connection.name}`);
      return mongooseInstance.connection;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error(`[Database Error]: ${error.message}`);
    throw error;
  }
};
