import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import patientRoutes from './routes/patients.routes.js';
import caseRoutes from './routes/cases.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { ApiError } from './utils/errors.js';

export function createApp() {
  const app = express();

  const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
    .split(',')
    .map((s) => s.trim());

  app.use(helmet());
  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '2mb' }));
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  // Basic rate limiting on auth endpoints to slow down brute-force attempts.
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 50,
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

  app.use('/api/auth', authLimiter, authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/patients', patientRoutes);
  app.use('/api/cases', caseRoutes);
  app.use('/api/admin', adminRoutes);

  // 404 for unmatched API routes
  app.use('/api', (req, res) => {
    res.status(404).json({ error: 'Not found', path: req.originalUrl });
  });

  // Centralized error handler — every route uses asyncHandler so errors land here.
  app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
      return res.status(err.statusCode).json({ error: err.message, details: err.details });
    }
    console.error('Unhandled server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}
