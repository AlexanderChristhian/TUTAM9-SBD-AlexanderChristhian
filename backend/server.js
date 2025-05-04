require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit'); // Rate limiter
const helmet = require('helmet'); // Security headers
const xss = require('xss-clean'); // Prevent XSS attacks
const { errorHandler } = require('./middlewares/errorHandler'); // Centralized error handler

const app = express();
const PORT = process.env.PORT || 5000;

// Update CORS configuration to allow requests from your frontend
const corsOptions = {
  origin: '*', // Allow all origins temporarily for testing
  origin: [
    'http://localhost:5173',
    'https://tutam-9-sbd-alexander-christhian-backend.vercel.app',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS middleware first - this is critical!
app.use(cors(corsOptions));

// Additional CORS handling for preflight requests
app.options('*', cors(corsOptions));

// Other middleware
app.use(helmet({
  crossOriginResourcePolicy: false
}));
app.use(xss());
app.use(bodyParser.json());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
  })
);

// Import Routes
const userRoutes = require('./routes/userRoutes')();
const scoreRoutes = require('./routes/scoreRoutes')();
app.use('/user', userRoutes);
app.use('/score', scoreRoutes);

// Centralized error handling middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});