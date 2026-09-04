const mongoose = require('mongoose');

global.isMongoConnected = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/clauseguard';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2500
    });
    global.isMongoConnected = true;
    console.log(`[Database] MongoDB Connected Successfully to ${mongoURI}`);
  } catch (error) {
    global.isMongoConnected = false;
    console.warn(`[Database Notice] MongoDB connection failed (${error.message}). Using Local JSON Fallback persistence layer.`);
  }
};

module.exports = connectDB;
