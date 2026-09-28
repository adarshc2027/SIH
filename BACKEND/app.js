import path from 'path';
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import schemeRoutes from './routes/schemeRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import deficiencyRoutes from './routes/deficiencyRoutes.js';
import verifierRoutes from './routes/verifierRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

// Parse and collect allowed client origins
const getAllowedOrigins = () => {
  const defaultOrigins = [
    'https://sih-2b5ii91r8-adarshc2027-1145.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://localhost:4173'
  ].map((url) => url.replace(/\/+$/, ''));

  if (process.env.CLIENT_URL) {
    const configured = process.env.CLIENT_URL
      .split(',')
      .map((url) => url.trim().replace(/\/+$/, ''))
      .filter(Boolean);
    return Array.from(new Set([...defaultOrigins, ...configured]));
  }

  return defaultOrigins;
};

// Enable robust CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (mobile apps, server-to-server, curl, Postman)
    if (!origin) {
      return callback(null, true);
    }

    const allowed = getAllowedOrigins();

    // Direct match against allowed origins
    if (allowed.includes(origin)) {
      return callback(null, true);
    }

    // Automatically allow Vercel deployment and preview URLs
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    // Permissive in local development
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads directory (supports both local disk and serverless /tmp)
const localUploads = path.resolve('uploads');
if (fs.existsSync(localUploads)) {
  app.use('/uploads', express.static(localUploads));
}
if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
  const tmpUploads = path.join('/tmp', 'uploads');
  if (!fs.existsSync(tmpUploads)) {
    try {
      fs.mkdirSync(tmpUploads, { recursive: true });
    } catch (e) {
      // Safe ignore in restricted environment
    }
  }
  app.use('/uploads', express.static(tmpUploads));
}

// Public Health Check API (always responds directly)
app.use('/api/health', healthRoutes);

// Ensure MongoDB database connection is ready for all data API routes
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(new Error(`Database connection failed: ${error.message}`));
  }
});

// Authentication API
app.use('/api/auth', authRoutes);

// Public Welfare Schemes API
app.use('/api/schemes', schemeRoutes);

// Applicant Applications API
app.use('/api/applications', applicationRoutes);

// Statutory Document Management API
app.use('/api/documents', documentRoutes);

// Deficiency Management API
app.use('/api/deficiencies', deficiencyRoutes);

// Level-1 Verification Officer Scrutiny Desk API
app.use('/api/verifier', verifierRoutes);

// Portal Notifications API
app.use('/api/notifications', notificationRoutes);

// Admin-Protected Scheme & System Management API
app.use('/api/admin', adminRoutes);

// Root informational endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Ministry of Tribal Affairs (MoTA) Scholarship & Fellowship Management API',
    documentation: '/api/health',
    status: 'ACTIVE'
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

export default app;
