const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { db, saveData } = require('../storage/store');

const JWT_SECRET = process.env.JWT_SECRET || 'clauseguard_legaltech_jwt_secret_key_2026';

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields (name, email, password) are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (global.isMongoConnected) {
      const existing = await User.findOne({ email: normalizedEmail });
      if (existing) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword
      });

      const token = jwt.sign({ id: user._id.toString(), email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

      return res.status(201).json({
        success: true,
        token,
        user: { id: user._id.toString(), name: user.name, email: user.email }
      });
    } else {
      // Local JSON Fallback
      const existing = db.users.find(u => u.email === normalizedEmail);
      if (existing) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        id: `user_${Date.now()}_${Math.floor(Math.random()*1000)}`,
        name,
        email: normalizedEmail,
        password: hashedPassword,
        createdAt: new Date().toISOString()
      };

      db.users.push(newUser);
      saveData();

      const token = jwt.sign({ id: newUser.id, email: newUser.email, name: newUser.name }, JWT_SECRET, { expiresIn: '7d' });

      return res.status(201).json({
        success: true,
        token,
        user: { id: newUser.id, name: newUser.name, email: newUser.email }
      });
    }
  } catch (error) {
    console.error('[Auth Register Error]', error);
    return res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (global.isMongoConnected) {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password credentials.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password credentials.' });
      }

      const token = jwt.sign({ id: user._id.toString(), email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

      return res.json({
        success: true,
        token,
        user: { id: user._id.toString(), name: user.name, email: user.email }
      });
    } else {
      // Local JSON Fallback
      const user = db.users.find(u => u.email === normalizedEmail);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password credentials.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password credentials.' });
      }

      const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

      return res.json({
        success: true,
        token,
        user: { id: user.id, name: user.name, email: user.email }
      });
    }
  } catch (error) {
    console.error('[Auth Login Error]', error);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

exports.getMe = async (req, res) => {
  return res.json({
    success: true,
    user: req.user
  });
};
