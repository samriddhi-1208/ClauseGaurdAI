const rateLimit = require('express-rate-limit');

// Strict rate limiter for authentication endpoints (prevent brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 10, // Max 10 attempts per window per IP
  standardHeaders: true, // Return standard `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.'
    });
  }
});

// General API rate limiter for general abuse prevention
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please slow down and try again shortly.'
    });
  }
});

module.exports = {
  authLimiter,
  apiLimiter
};
