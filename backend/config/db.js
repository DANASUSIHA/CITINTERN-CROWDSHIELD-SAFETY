const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/crowdshield';
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('\n--- SYSTEM NOTICE ---');
    console.log('Ensure that MongoDB is running locally (e.g., net start MongoDB) or');
    console.log('configure your remote MONGO_URI in server/.env.');
    console.log('---------------------\n');
    process.exit(1);
  }
};

module.exports = connectDB;
