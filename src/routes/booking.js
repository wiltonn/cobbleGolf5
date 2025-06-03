/**
 * Cobble Hills Golf Booking App
 * Booking Routes
 */

const express = require('express');
const { booking } = require('../services');
const { getSchedulerStatus, runBookingTaskManually } = require('../scheduler');

const router = express.Router();

/**
 * GET /api/bookings
 * Get all bookings
 */
router.get('/', (req, res) => {
  try {
    const bookings = booking.getAllBookings();
    res.json({ success: true, bookings });
  } catch (error) {
    console.error('Error getting bookings:', error);
    res.status(500).json({ success: false, errors: ['Failed to get bookings'] });
  }
});

/**
 * GET /api/bookings/:id
 * Get a booking by ID
 */
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const bookingData = booking.getBookingById(id);
    
    if (!bookingData) {
      return res.status(404).json({ success: false, errors: ['Booking not found'] });
    }
    
    res.json({ success: true, booking: bookingData });
  } catch (error) {
    console.error('Error getting booking:', error);
    res.status(500).json({ success: false, errors: ['Failed to get booking'] });
  }
});

/**
 * GET /api/bookings/upcoming
 * Get upcoming bookings
 */
router.get('/upcoming/list', (req, res) => {
  try {
    const bookings = booking.getUpcomingBookings();
    res.json({ success: true, bookings });
  } catch (error) {
    console.error('Error getting upcoming bookings:', error);
    res.status(500).json({ success: false, errors: ['Failed to get upcoming bookings'] });
  }
});

/**
 * GET /api/bookings/past
 * Get past bookings
 */
router.get('/past/list', (req, res) => {
  try {
    const bookings = booking.getPastBookings();
    res.json({ success: true, bookings });
  } catch (error) {
    console.error('Error getting past bookings:', error);
    res.status(500).json({ success: false, errors: ['Failed to get past bookings'] });
  }
});

/**
 * POST /api/bookings
 * Create a new booking
 */
router.post('/', async (req, res) => {
  try {
    const result = await booking.createBooking(req.body);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ success: false, errors: ['Failed to create booking'] });
  }
});

/**
 * PUT /api/bookings/:id
 * Update a booking
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await booking.updateBooking(id, req.body);
    
    if (!result.success) {
      if (result.errors.includes('Booking not found')) {
        return res.status(404).json(result);
      }
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ success: false, errors: ['Failed to update booking'] });
  }
});

/**
 * DELETE /api/bookings/:id
 * Delete a booking
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await booking.deleteBooking(id);
    
    if (!result.success) {
      if (result.errors.includes('Booking not found')) {
        return res.status(404).json(result);
      }
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ success: false, errors: ['Failed to delete booking'] });
  }
});

/**
 * POST /api/bookings/search
 * Search for available tee times
 */
router.post('/search', async (req, res) => {
  try {
    const result = await booking.searchTeeTimes(req.body);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error searching for tee times:', error);
    res.status(500).json({ success: false, errors: ['Failed to search for tee times'] });
  }
});

/**
 * POST /api/bookings/book
 * Book a tee time
 */
router.post('/book', async (req, res) => {
  try {
    const { bookingData, email } = req.body;
    
    if (!bookingData) {
      return res.status(400).json({
        success: false,
        errors: ['Booking data is required'],
      });
    }
    
    const result = await booking.bookTeeTime(bookingData, email);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Error booking tee time:', error);
    res.status(500).json({ success: false, errors: ['Failed to book tee time'] });
  }
});

/**
 * GET /api/bookings/scheduler/status
 * Get the scheduler status
 */
router.get('/scheduler/status', (req, res) => {
  try {
    const status = getSchedulerStatus();
    res.json({ success: true, status });
  } catch (error) {
    console.error('Error getting scheduler status:', error);
    res.status(500).json({ success: false, errors: ['Failed to get scheduler status'] });
  }
});

/**
 * POST /api/bookings/scheduler/run
 * Run the booking task manually
 */
router.post('/scheduler/run', async (req, res) => {
  try {
    const result = await runBookingTaskManually();
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error running booking task:', error);
    res.status(500).json({ success: false, errors: ['Failed to run booking task'] });
  }
});

module.exports = router;
