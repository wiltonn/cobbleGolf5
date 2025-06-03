/**
 * Cobble Hills Golf Booking App
 * Main Application File
 */

import express from 'express';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import routes from './routes';
import { initializeDatabase } from './database';
import { initializeScheduler } from './scheduler';

// Initialize the database
initializeDatabase();

// Create Express app
const app = express();

// Set up middleware
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Request logging
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Set up routes
app.use(routes);

// Serve the main HTML file for any other routes (SPA support)
app.get('*', (req, res) => {
  // Only serve the HTML file for browser requests, not API requests
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  } else {
    res.status(404).json({ success: false, errors: ['Not found'] });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  
  res.status(500).json({
    success: false,
    errors: ['An unexpected error occurred'],
    ...(process.env.NODE_ENV === 'development' ? { error: err.message, stack: err.stack } : {}),
  });
});

// Initialize the scheduler
initializeScheduler();

// Export the app for use in start.js
export default app;
