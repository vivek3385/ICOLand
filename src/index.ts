import './config/env'; // Validate env vars first
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { env } from './config/env';
import { connectDB } from './config/db';
import { initJobs } from './services/jobsService';
import { errorHandler, notFound } from './middleware/errorHandler';

// Route imports
import authRoutes from './routes/auth';
import transactionRoutes from './routes/transactions';
import rewardRoutes from './routes/rewards';
import adminRoutes from './routes/admin';

const app = express();

// ─── Security Middleware ─────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: [env.FRONTEND_URL, 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Admin-Key'],
  })
);

// ─── Rate Limiting ───────────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { error: 'Too many requests. Please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many auth attempts. Please wait 15 minutes.' },
});

app.use(globalLimiter);

// ─── Body Parsing ────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Logging ─────────────────────────────────────────────────────────────────
if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
}

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ICOLand Backend',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

app.get('/', (req, res) => {
  res.json({
    message: '🚀 ICOLand Backend API',
    version: '1.0.0',
    docs: '/health',
    endpoints: {
      auth: '/api/auth',
      transactions: '/api/transactions',
      rewards: '/api/rewards',
      admin: '/api/admin',
    },
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/admin', adminRoutes);

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Bootstrap ───────────────────────────────────────────────────────────────
async function bootstrap() {
  console.log('\n╔═══════════════════════════════════════╗');
  console.log('║      🚀 ICOLand Backend Service       ║');
  console.log('╚═══════════════════════════════════════╝\n');

  await connectDB();
  initJobs();

  app.listen(env.PORT, () => {
    console.log(`\n🌐 Server running at http://localhost:${env.PORT}`);
    console.log(`📋 Health check: http://localhost:${env.PORT}/health`);
    console.log(`🔑 Environment: ${env.NODE_ENV}`);
    console.log(`💱 Token: ${env.TOKEN_SYMBOL} @ $${env.TOKEN_PRICE_USD}\n`);
  });
}

bootstrap().catch((err) => {
  console.error('❌ Fatal startup error:', err);
  process.exit(1);
});

export default app;
