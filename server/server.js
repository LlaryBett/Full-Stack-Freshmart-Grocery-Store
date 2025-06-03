import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './src/app.js';
import cors from 'cors'; // Add this line

// Load environment variables
dotenv.config();

// Enable CORS
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5000',
    process.env.VERCEL_CLIENT_URL || 'https://full-stack-freshmart-grocery-store.vercel.app/'
  ],
  credentials: true
}));

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
