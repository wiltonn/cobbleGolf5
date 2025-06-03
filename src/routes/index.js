/**
 * Cobble Hills Golf Booking App
 * Routes Index
 */

const express = require('express');
const playerRoutes = require('./player');
const settingsRoutes = require('./settings');
const bookingRoutes = require('./booking');

const router = express.Router();

// API routes
router.use('/api/players', playerRoutes);
router.use('/api/settings', settingsRoutes);
router.use('/api/bookings', bookingRoutes);

// Health check route
router.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// API documentation route
router.get('/api', (req, res) => {
  res.json({
    name: 'Cobble Hills Golf Booking API',
    version: '1.0.0',
    endpoints: {
      players: {
        base: '/api/players',
        methods: {
          'GET /': 'Get all players',
          'GET /:id': 'Get a player by ID',
          'POST /': 'Create a new player',
          'PUT /:id': 'Update a player',
          'DELETE /:id': 'Delete a player',
          'GET /search/:name': 'Search for players by name',
        },
      },
      settings: {
        base: '/api/settings',
        methods: {
          'GET /': 'Get all settings',
          'GET /notifications': 'Get notification settings',
          'PUT /notifications': 'Update notification settings',
          'GET /scheduler': 'Get scheduler settings',
          'PUT /scheduler': 'Update scheduler settings',
          'GET /default-players': 'Get default players count',
          'PUT /default-players': 'Update default players count',
          'GET /default-use-cart': 'Get default use cart setting',
          'PUT /default-use-cart': 'Update default use cart setting',
        },
      },
      bookings: {
        base: '/api/bookings',
        methods: {
          'GET /': 'Get all bookings',
          'GET /:id': 'Get a booking by ID',
          'GET /upcoming/list': 'Get upcoming bookings',
          'GET /past/list': 'Get past bookings',
          'POST /': 'Create a new booking',
          'PUT /:id': 'Update a booking',
          'DELETE /:id': 'Delete a booking',
          'POST /search': 'Search for available tee times',
          'POST /book': 'Book a tee time',
          'GET /scheduler/status': 'Get the scheduler status',
          'POST /scheduler/run': 'Run the booking task manually',
        },
      },
      system: {
        base: '/api',
        methods: {
          'GET /health': 'Health check',
          'GET /': 'API documentation',
        },
      },
    },
  });
});

module.exports = router;
