/**
 * Cobble Hills Golf Booking App
 * Booking Service
 */

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { getAll, getById, create, update, remove, query } = require('../database');
const { validateBooking, validateTeeTimeSearchOptions } = require('../utils/validators');
const { sendBookingConfirmation, sendBookingFailure } = require('./notification');
const { getPlayerById } = require('./player');
const { getSettings } = require('./settings');

// Add stealth plugin to puppeteer
puppeteer.use(StealthPlugin());

// Collection name in the database
const COLLECTION = 'bookings';

// Cobble Hills Golf Course URL
const COBBLE_HILLS_URL = 'https://admin.teeon.com/portal/golfnorth/teetimes/cobblehills';
const LOGIN_URL = 'https://admin.teeon.com/portal/golfnorth/login';

/**
 * Get all bookings
 * @returns {Array} - Array of booking objects
 */
function getAllBookings() {
  return getAll(COLLECTION);
}

/**
 * Get a booking by ID
 * @param {string} id - The booking ID
 * @returns {Object|null} - The booking object or null if not found
 */
function getBookingById(id) {
  return getById(COLLECTION, id);
}

/**
 * Get upcoming bookings
 * @returns {Array} - Array of upcoming booking objects
 */
function getUpcomingBookings() {
  const now = new Date();
  
  return query(COLLECTION, booking => {
    const bookingDate = new Date(`${booking.date}T${booking.time}`);
    return bookingDate >= now;
  });
}

/**
 * Get past bookings
 * @returns {Array} - Array of past booking objects
 */
function getPastBookings() {
  const now = new Date();
  
  return query(COLLECTION, booking => {
    const bookingDate = new Date(`${booking.date}T${booking.time}`);
    return bookingDate < now;
  });
}

/**
 * Create a new booking
 * @param {Object} bookingData - The booking data
 * @returns {Object} - Result object with success flag, booking data, and any errors
 */
async function createBooking(bookingData) {
  // Validate the booking data
  const validation = validateBooking(bookingData);
  
  if (!validation.isValid) {
    return {
      success: false,
      errors: validation.errors,
    };
  }
  
  try {
    // Create the booking
    const booking = await create(COLLECTION, bookingData);
    
    return {
      success: true,
      booking,
    };
  } catch (error) {
    console.error('Error creating booking:', error);
    
    return {
      success: false,
      errors: ['Failed to create booking'],
    };
  }
}

/**
 * Update a booking
 * @param {string} id - The booking ID
 * @param {Object} bookingData - The updated booking data
 * @returns {Object} - Result object with success flag, booking data, and any errors
 */
async function updateBooking(id, bookingData) {
  // Validate the booking data
  const validation = validateBooking(bookingData);
  
  if (!validation.isValid) {
    return {
      success: false,
      errors: validation.errors,
    };
  }
  
  try {
    // Update the booking
    const booking = await update(COLLECTION, id, bookingData);
    
    if (!booking) {
      return {
        success: false,
        errors: ['Booking not found'],
      };
    }
    
    return {
      success: true,
      booking,
    };
  } catch (error) {
    console.error('Error updating booking:', error);
    
    return {
      success: false,
      errors: ['Failed to update booking'],
    };
  }
}

/**
 * Delete a booking
 * @param {string} id - The booking ID
 * @returns {Object} - Result object with success flag and any errors
 */
async function deleteBooking(id) {
  try {
    // Delete the booking
    const deleted = await remove(COLLECTION, id);
    
    if (!deleted) {
      return {
        success: false,
        errors: ['Booking not found'],
      };
    }
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting booking:', error);
    
    return {
      success: false,
      errors: ['Failed to delete booking'],
    };
  }
}

/**
 * Search for available tee times
 * @param {Object} options - Search options
 * @param {string} options.date - The date to search for (YYYY-MM-DD)
 * @param {string} options.startTime - The earliest time to search for (HH:MM)
 * @param {string} options.endTime - The latest time to search for (HH:MM)
 * @param {number} options.players - The number of players (1-4)
 * @returns {Object} - Result object with success flag, tee times, and any errors
 */
async function searchTeeTimes(options) {
  // Validate the search options
  const validation = validateTeeTimeSearchOptions(options);
  
  if (!validation.isValid) {
    return {
      success: false,
      errors: validation.errors,
    };
  }
  
  try {
    // Launch a headless browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    
    const page = await browser.newPage();
    
    // Navigate to the Cobble Hills tee time page
    await page.goto(COBBLE_HILLS_URL, { waitUntil: 'networkidle2' });
    
    // Format the date for the search form (MM/DD/YYYY)
    const searchDate = new Date(options.date);
    const formattedDate = `${searchDate.getMonth() + 1}/${searchDate.getDate()}/${searchDate.getFullYear()}`;
    
    // Set the date in the search form
    await page.evaluate((date) => {
      document.querySelector('input[name="date"]').value = date;
    }, formattedDate);
    
    // Click the search button
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('button[type="submit"]'),
    ]);
    
    // Extract the available tee times
    const teeTimes = await page.evaluate((searchOptions) => {
      const times = [];
      const teeTimeElements = document.querySelectorAll('.tee-time-slot');
      
      teeTimeElements.forEach(element => {
        const timeText = element.querySelector('.time')?.textContent.trim();
        const availableText = element.querySelector('.available')?.textContent.trim();
        const priceText = element.querySelector('.price')?.textContent.trim();
        
        if (timeText && availableText) {
          // Parse the time
          const timeParts = timeText.match(/(\d+):(\d+)\s*(AM|PM)/i);
          if (!timeParts) return;
          
          let hours = parseInt(timeParts[1], 10);
          const minutes = parseInt(timeParts[2], 10);
          const period = timeParts[3].toUpperCase();
          
          // Convert to 24-hour format
          if (period === 'PM' && hours < 12) hours += 12;
          if (period === 'AM' && hours === 12) hours = 0;
          
          const time24 = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          
          // Check if the time is within the specified range
          if (searchOptions.startTime && time24 < searchOptions.startTime) return;
          if (searchOptions.endTime && time24 > searchOptions.endTime) return;
          
          // Parse available spots
          const availableSpots = parseInt(availableText.match(/\d+/)[0], 10);
          
          // Check if there are enough spots for the requested number of players
          if (searchOptions.players && availableSpots < searchOptions.players) return;
          
          // Parse price
          const price = priceText ? parseFloat(priceText.replace(/[^0-9.]/g, '')) : null;
          
          // Get the booking URL
          const bookButton = element.querySelector('a.book-button');
          const bookingUrl = bookButton ? bookButton.getAttribute('href') : null;
          
          times.push({
            time: timeText,
            time24,
            availableSpots,
            price,
            bookingUrl,
          });
        }
      });
      
      return times;
    }, options);
    
    // Close the browser
    await browser.close();
    
    return {
      success: true,
      date: options.date,
      teeTimes,
    };
  } catch (error) {
    console.error('Error searching for tee times:', error);
    
    return {
      success: false,
      errors: ['Failed to search for tee times'],
    };
  }
}

/**
 * Book a tee time
 * @param {Object} bookingData - The booking data
 * @param {string} bookingData.date - The date (YYYY-MM-DD)
 * @param {string} bookingData.time - The time (HH:MM)
 * @param {Array} bookingData.players - Array of player IDs
 * @param {boolean} bookingData.useCart - Whether to use a cart
 * @param {string} bookingData.bookingUrl - The URL to book the tee time (optional)
 * @param {string} email - The email address to send confirmation to
 * @returns {Object} - Result object with success flag, booking data, and any errors
 */
async function bookTeeTime(bookingData, email) {
  // Validate the booking data
  const validation = validateBooking(bookingData);
  
  if (!validation.isValid) {
    return {
      success: false,
      errors: validation.errors,
    };
  }
  
  try {
    // Check if we have credentials
    if (!process.env.COBBLE_HILLS_USERNAME || !process.env.COBBLE_HILLS_PASSWORD) {
      return {
        success: false,
        errors: ['Cobble Hills credentials not configured'],
      };
    }
    
    // Get the player objects
    const playerObjects = [];
    for (const playerId of bookingData.players) {
      const player = getPlayerById(playerId);
      if (!player) {
        return {
          success: false,
          errors: [`Player with ID ${playerId} not found`],
        };
      }
      playerObjects.push(player);
    }
    
    // Launch a headless browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    
    const page = await browser.newPage();
    
    // Navigate to the login page
    await page.goto(LOGIN_URL, { waitUntil: 'networkidle2' });
    
    // Fill in the login form
    await page.type('input[name="username"]', process.env.COBBLE_HILLS_USERNAME);
    await page.type('input[name="password"]', process.env.COBBLE_HILLS_PASSWORD);
    
    // Submit the login form
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('button[type="submit"]'),
    ]);
    
    // Check if login was successful
    const isLoggedIn = await page.evaluate(() => {
      return !document.querySelector('.login-error');
    });
    
    if (!isLoggedIn) {
      await browser.close();
      return {
        success: false,
        errors: ['Failed to log in to Cobble Hills'],
      };
    }
    
    // If a booking URL was provided, navigate to it
    if (bookingData.bookingUrl) {
      await page.goto(bookingData.bookingUrl, { waitUntil: 'networkidle2' });
    } else {
      // Otherwise, search for the tee time
      await page.goto(COBBLE_HILLS_URL, { waitUntil: 'networkidle2' });
      
      // Format the date for the search form (MM/DD/YYYY)
      const searchDate = new Date(bookingData.date);
      const formattedDate = `${searchDate.getMonth() + 1}/${searchDate.getDate()}/${searchDate.getFullYear()}`;
      
      // Set the date in the search form
      await page.evaluate((date) => {
        document.querySelector('input[name="date"]').value = date;
      }, formattedDate);
      
      // Click the search button
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
        page.click('button[type="submit"]'),
      ]);
      
      // Find and click the book button for the specified time
      const bookingTime = bookingData.time;
      const bookButtonClicked = await page.evaluate((time) => {
        const teeTimeElements = document.querySelectorAll('.tee-time-slot');
        
        for (const element of teeTimeElements) {
          const timeText = element.querySelector('.time')?.textContent.trim();
          
          if (timeText) {
            // Parse the time
            const timeParts = timeText.match(/(\d+):(\d+)\s*(AM|PM)/i);
            if (!timeParts) continue;
            
            let hours = parseInt(timeParts[1], 10);
            const minutes = parseInt(timeParts[2], 10);
            const period = timeParts[3].toUpperCase();
            
            // Convert to 24-hour format
            if (period === 'PM' && hours < 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;
            
            const time24 = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            
            if (time24 === time) {
              const bookButton = element.querySelector('a.book-button');
              if (bookButton) {
                bookButton.click();
                return true;
              }
            }
          }
        }
        
        return false;
      }, bookingTime);
      
      if (!bookButtonClicked) {
        await browser.close();
        return {
          success: false,
          errors: [`Tee time ${bookingData.time} not found or not available`],
        };
      }
      
      // Wait for the booking page to load
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
    }
    
    // Fill in the booking form
    
    // Select the number of players
    await page.select('select[name="players"]', bookingData.players.length.toString());
    
    // Fill in player information
    for (let i = 0; i < playerObjects.length; i++) {
      const player = playerObjects[i];
      await page.type(`input[name="player${i + 1}"]`, player.name);
      
      if (player.email) {
        await page.type(`input[name="email${i + 1}"]`, player.email);
      }
      
      if (player.phone) {
        await page.type(`input[name="phone${i + 1}"]`, player.phone);
      }
    }
    
    // Select cart option
    if (bookingData.useCart) {
      await page.click('input[name="cart"][value="yes"]');
    } else {
      await page.click('input[name="cart"][value="no"]');
    }
    
    // Submit the booking form
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('button[type="submit"]'),
    ]);
    
    // Check if booking was successful
    const bookingResult = await page.evaluate(() => {
      const confirmationElement = document.querySelector('.confirmation-number');
      if (confirmationElement) {
        return {
          success: true,
          confirmationNumber: confirmationElement.textContent.trim(),
        };
      } else {
        const errorElement = document.querySelector('.booking-error');
        return {
          success: false,
          error: errorElement ? errorElement.textContent.trim() : 'Unknown booking error',
        };
      }
    });
    
    // Close the browser
    await browser.close();
    
    if (!bookingResult.success) {
      // Send booking failure notification
      if (email) {
        await sendBookingFailure(bookingData, bookingResult.error, email);
      }
      
      return {
        success: false,
        errors: [bookingResult.error],
      };
    }
    
    // Create the booking in the database
    const booking = await create(COLLECTION, {
      ...bookingData,
      confirmationNumber: bookingResult.confirmationNumber,
      status: 'confirmed',
    });
    
    // Send booking confirmation
    if (email) {
      await sendBookingConfirmation(booking, email);
    }
    
    return {
      success: true,
      booking,
    };
  } catch (error) {
    console.error('Error booking tee time:', error);
    
    // Send booking failure notification
    if (email) {
      await sendBookingFailure(bookingData, error.message, email);
    }
    
    return {
      success: false,
      errors: ['Failed to book tee time'],
    };
  }
}

module.exports = {
  getAllBookings,
  getBookingById,
  getUpcomingBookings,
  getPastBookings,
  createBooking,
  updateBooking,
  deleteBooking,
  searchTeeTimes,
  bookTeeTime,
};
