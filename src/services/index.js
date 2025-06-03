/**
 * Cobble Hills Golf Booking App
 * Services Index
 */

const notificationService = require('./notification');
const playerService = require('./player');
const settingsService = require('./settings');
const bookingService = require('./booking');

module.exports = {
  notification: notificationService,
  player: playerService,
  settings: settingsService,
  booking: bookingService,
};
