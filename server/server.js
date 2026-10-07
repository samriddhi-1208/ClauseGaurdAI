const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const chatRoutes = require('./routes/chatRoutes');
const demoRoutes = require('./routes/demoRoutes');

const helmet = require('helmet');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Security Headers with Helmet
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS Configuration
const rawOrigins = process.env.ALLOWED_ORIGINS || process.env.CLIENT_URL || 'http://localhost:5173,http://127.0.0.1:5173';
const allowedOrigins = rawOrigins
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

const isDev = process.env.NODE_ENV !== 'production';

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || (isDev && /^http:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(origin))) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploads Static Directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check Endpoint (not rate-limited)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ClauseGuard AI Express Server',
    mongoConnected: Boolean(global.isMongoConnected),
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// General API Rate Limiting for all other /api routes
app.use('/api', apiLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/demo', demoRoutes);

// Global Error Handler (Sanitizes stack traces and internal secrets)
app.use((err, req, res, next) => {
  console.error('[Unhandled Express Error]', err.message || err);
  const status = err.status || (err.message && err.message.startsWith('CORS') ? 403 : 500);
  const message = (process.env.NODE_ENV === 'production' && status === 500)
    ? 'Internal Server Error'
    : (err.message || 'Internal Server Error');

  res.status(status).json({
    success: false,
    message
  });
});

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`⚖️ ClauseGuard AI Backend Server Running on Port ${PORT}`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);
  console.log(`====================================================`);
});

process.on('SIGTERM', () => {
  console.log('[Server Shutdown] SIGTERM received. Closing HTTP server gracefully.');
  server.close(() => {
    console.log('[Server Shutdown] HTTP server closed.');
    process.exit(0);
  });
});
