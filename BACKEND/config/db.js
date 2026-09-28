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

export const connectDB = async () => {
  // If already connected, reuse existing connection immediately
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cached.conn) {
    return cached.conn;
  }

  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mota_scholarship';

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
