import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './src/app.js';

// Load environment variables
dotenv.config();

// MongoDB Connection
const mongoURI = process.env.MONGO_URI;  // Changed from MONGODB_URI to MONGO_URI
console.log('Attempting to connect to MongoDB at:', mongoURI);

mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
    // Start server only after successful DB connection
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// Error handlers
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});
