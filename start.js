/**
 * Cobble Hills Golf Booking App
 * Server Startup File
 */

require('dotenv').config();
const app = require('./src/index');

// Get port from environment variable or use default
const PORT = process.env.PORT || 3000;

// Start the server
const server = app.listen(PORT, () => {
  console.log(`
  ┌───────────────────────────────────────────────┐
  │                                               │
  │   Cobble Hills Golf Booking App               │
  │                                               │
  │   Server running at http://localhost:${PORT}      │
  │                                               │
  │   API Documentation: http://localhost:${PORT}/api  │
  │                                               │
  └───────────────────────────────────────────────┘
  `);
});

// Handle graceful shutdown
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

function gracefulShutdown() {
  console.log('\nShutting down gracefully...');
  
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
  
  // Force close after 10 seconds if graceful shutdown fails
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
}
