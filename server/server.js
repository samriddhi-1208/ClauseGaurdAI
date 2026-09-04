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

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploads Static Directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ClauseGuard AI Express Server',
    mongoConnected: global.isMongoConnected,
    port: PORT,
    timestamp: new Date()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/demo', demoRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Express Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`⚖️ ClauseGuard AI Backend Server Running on Port ${PORT}`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);
  console.log(`====================================================`);
});
