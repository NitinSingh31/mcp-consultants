const mongoose = require('mongoose');

let isMongoConnected = false;

// Listen to Mongoose connection lifecycle events
mongoose.connection.on('connected', () => {
  isMongoConnected = true;
});

mongoose.connection.on('disconnected', () => {
  isMongoConnected = false;
  console.warn('⚠️ MongoDB connection lost. Attempting auto-reconnect...');
});

mongoose.connection.on('reconnected', () => {
  isMongoConnected = true;
  console.log('✅ MongoDB connection successfully re-established.');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB runtime connection error:', err.message);
});

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
    console.error('❌ MongoDB initial connection error:', err.message);
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
