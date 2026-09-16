import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import schemeRoutes from './routes/schemeRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import deficiencyRoutes from './routes/deficiencyRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

// Enable CORS for client applications
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive in development
  },
  credentials: true
}));

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads directory (for documents)
app.use('/uploads', express.static('uploads'));

// Public Health Check API
app.use('/api/health', healthRoutes);

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
