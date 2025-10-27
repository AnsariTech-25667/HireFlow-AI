/*
 * HireFlow AI Backend Server - Next-Generation Hiring Platform
 * Built by: Maaz Ansari
 * Email: maazansari25667@gmail.com
 * Senior Full-Stack Engineer • AI Integration & Real-time Systems
 * Location: Pune, India
 */

import './config/instrument.js';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import * as Sentry from '@sentry/node';
import { clerkWebhooks } from './controllers/webhooks.js';
import companyRoutes from './routes/companyRoutes.js';
import connectCloudinary from './config/cloudinary.js';
import jobRoutes from './routes/jobRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { clerkMiddleware } from '@clerk/express';

// Initialize Express App -
const app = express();

// Connect to database
connectDB();
await connectCloudinary();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// API Routes
app.get('/', (req, res) =>
  res.json({
    message: 'Job Portal API - Built by Maaz Ansari',
    author: 'Maaz Ansari',
    email: 'maazansari25667@gmail.com',
    location: 'Pune, India',
    status: 'Active',
  })
);

// Health check endpoint for monitoring and CI/CD
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'HireFlow AI Backend',
    version: '1.0.0',
  });
});

app.get('/debug-sentry', function mainHandler(_req, _res) {
  throw new Error("Sentry test error - Maaz Ansari's Job Portal");
});
app.post('/webhooks', clerkWebhooks);
app.use('/api/company', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);

// Port
const PORT = process.env.PORT || 5000;

Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () => {
  console.log(`Job Portal Server by Maaz Ansari is running on port ${PORT}`);
  console.log(
    `Creator: Maaz Ansari | Email: maazansari25667@gmail.com | Location: Pune, India`
  );
});
