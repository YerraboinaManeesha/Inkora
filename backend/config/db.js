const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/inkora';
    await mongoose.connect(uri);
    console.log(`[Inkora] MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error('[Inkora] MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
