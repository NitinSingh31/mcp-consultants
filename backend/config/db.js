const mongoose = require('mongoose');

let isMongoConnected = false;

async function connectMongoDB() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI || MONGODB_URI.includes('<username>') || MONGODB_URI.includes('<password>')) {
    console.error('❌ MONGODB_URI is not properly configured in .env.');
    return false;
  }

  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 8000
    });
    isMongoConnected = true;
    console.log('✅ Successfully connected to MongoDB Atlas!');
    return true;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    isMongoConnected = false;
    return false;
  }
}

function getIsMongoConnected() {
  return isMongoConnected;
}

module.exports = {
  connectMongoDB,
  getIsMongoConnected
};
