/**
 * Cobble Hills Golf Booking App
 * Validators Module
 */

const validator = require('validator');

/**
 * Validate a player object
 * @param {Object} player - The player object to validate
 * @returns {Object} - Validation result with isValid and errors properties
 */
function validatePlayer(player) {
  const errors = [];
  
  if (!player) {
    errors.push('Player data is required');
    return { isValid: false, errors };
  }
  
  // Name validation
  if (!player.name) {
    errors.push('Name is required');
  } else if (typeof player.name !== 'string') {
    errors.push('Name must be a string');
  } else if (player.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  } else if (player.name.trim().length > 100) {
    errors.push('Name must be at most 100 characters long');
  }
  
  // Email validation (optional)
  if (player.email !== undefined && player.email !== null && player.email !== '') {
    if (typeof player.email !== 'string') {
      errors.push('Email must be a string');
    } else if (!validator.isEmail(player.email)) {
      errors.push('Email must be a valid email address');
    }
  }
  
  // Phone validation (optional)
  if (player.phone !== undefined && player.phone !== null && player.phone !== '') {
    if (typeof player.phone !== 'string') {
      errors.push('Phone must be a string');
    } else if (!validator.isMobilePhone(player.phone, 'any')) {
      errors.push('Phone must be a valid phone number');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate a booking object
 * @param {Object} booking - The booking object to validate
 * @returns {Object} - Validation result with isValid and errors properties
 */
function validateBooking(booking) {
  const errors = [];
  
  if (!booking) {
    errors.push('Booking data is required');
    return { isValid: false, errors };
  }
  
  // Date validation
  if (!booking.date) {
    errors.push('Date is required');
  } else if (!validator.isISO8601(booking.date)) {
    errors.push('Date must be a valid ISO 8601 date string (YYYY-MM-DD)');
  }
  
  // Time validation
  if (!booking.time) {
    errors.push('Time is required');
  } else if (!validator.matches(booking.time, /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
    errors.push('Time must be in 24-hour format (HH:MM)');
  }
  
  // Players validation
  if (!booking.players || !Array.isArray(booking.players)) {
    errors.push('Players must be an array');
  } else if (booking.players.length < 1) {
    errors.push('At least one player is required');
  } else if (booking.players.length > 4) {
    errors.push('Maximum of 4 players allowed');
  }
  
  // Use cart validation
  if (booking.useCart !== undefined && booking.useCart !== null) {
    if (typeof booking.useCart !== 'boolean') {
      errors.push('Use cart must be a boolean');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate notification settings
 * @param {Object} settings - The notification settings to validate
 * @returns {Object} - Validation result with isValid and errors properties
 */
function validateNotificationSettings(settings) {
  const errors = [];
  
  if (!settings) {
    errors.push('Notification settings are required');
    return { isValid: false, errors };
  }
  
  // Enabled validation
  if (settings.enabled !== undefined && settings.enabled !== null) {
    if (typeof settings.enabled !== 'boolean') {
      errors.push('Enabled must be a boolean');
    }
  }
  
  // Email on booking success validation
  if (settings.emailOnBookingSuccess !== undefined && settings.emailOnBookingSuccess !== null) {
    if (typeof settings.emailOnBookingSuccess !== 'boolean') {
      errors.push('Email on booking success must be a boolean');
    }
  }
  
  // Email on booking failure validation
  if (settings.emailOnBookingFailure !== undefined && settings.emailOnBookingFailure !== null) {
    if (typeof settings.emailOnBookingFailure !== 'boolean') {
      errors.push('Email on booking failure must be a boolean');
    }
  }
  
  // Email reminder enabled validation
  if (settings.emailReminderEnabled !== undefined && settings.emailReminderEnabled !== null) {
    if (typeof settings.emailReminderEnabled !== 'boolean') {
      errors.push('Email reminder enabled must be a boolean');
    }
  }
  
  // Email reminder hours before validation
  if (settings.emailReminderHoursBefore !== undefined && settings.emailReminderHoursBefore !== null) {
    if (typeof settings.emailReminderHoursBefore !== 'number') {
      errors.push('Email reminder hours before must be a number');
    } else if (settings.emailReminderHoursBefore < 1 || settings.emailReminderHoursBefore > 72) {
      errors.push('Email reminder hours before must be between 1 and 72');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate scheduler settings
 * @param {Object} settings - The scheduler settings to validate
 * @returns {Object} - Validation result with isValid and errors properties
 */
function validateSchedulerSettings(settings) {
  const errors = [];
  
  if (!settings) {
    errors.push('Scheduler settings are required');
    return { isValid: false, errors };
  }
  
  // Enabled validation
  if (settings.enabled !== undefined && settings.enabled !== null) {
    if (typeof settings.enabled !== 'boolean') {
      errors.push('Enabled must be a boolean');
    }
  }
  
  // Cron expression validation
  if (settings.cronExpression !== undefined && settings.cronExpression !== null) {
    if (typeof settings.cronExpression !== 'string') {
      errors.push('Cron expression must be a string');
    }
    // Note: Detailed cron validation would require a cron parser library
  }
  
  // Booking days ahead validation
  if (settings.bookingDaysAhead !== undefined && settings.bookingDaysAhead !== null) {
    if (typeof settings.bookingDaysAhead !== 'number') {
      errors.push('Booking days ahead must be a number');
    } else if (settings.bookingDaysAhead < 1 || settings.bookingDaysAhead > 30) {
      errors.push('Booking days ahead must be between 1 and 30');
    }
  }
  
  // Preferred tee time validation
  if (settings.preferredTeeTime !== undefined && settings.preferredTeeTime !== null) {
    if (typeof settings.preferredTeeTime !== 'string') {
      errors.push('Preferred tee time must be a string');
    } else if (!validator.matches(settings.preferredTeeTime, /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      errors.push('Preferred tee time must be in 24-hour format (HH:MM)');
    }
  }
  
  // Tee time flexibility minutes validation
  if (settings.teeTimeFlexibilityMinutes !== undefined && settings.teeTimeFlexibilityMinutes !== null) {
    if (typeof settings.teeTimeFlexibilityMinutes !== 'number') {
      errors.push('Tee time flexibility minutes must be a number');
    } else if (settings.teeTimeFlexibilityMinutes < 0 || settings.teeTimeFlexibilityMinutes > 240) {
      errors.push('Tee time flexibility minutes must be between 0 and 240');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate tee time search options
 * @param {Object} options - The tee time search options to validate
 * @returns {Object} - Validation result with isValid and errors properties
 */
function validateTeeTimeSearchOptions(options) {
  const errors = [];
  
  if (!options) {
    errors.push('Search options are required');
    return { isValid: false, errors };
  }
  
  // Date validation
  if (!options.date) {
    errors.push('Date is required');
  } else if (!validator.isISO8601(options.date)) {
    errors.push('Date must be a valid ISO 8601 date string (YYYY-MM-DD)');
  }
  
  // Start time validation (optional)
  if (options.startTime !== undefined && options.startTime !== null && options.startTime !== '') {
    if (typeof options.startTime !== 'string') {
      errors.push('Start time must be a string');
    } else if (!validator.matches(options.startTime, /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      errors.push('Start time must be in 24-hour format (HH:MM)');
    }
  }
  
  // End time validation (optional)
  if (options.endTime !== undefined && options.endTime !== null && options.endTime !== '') {
    if (typeof options.endTime !== 'string') {
      errors.push('End time must be a string');
    } else if (!validator.matches(options.endTime, /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      errors.push('End time must be in 24-hour format (HH:MM)');
    }
  }
  
  // Players validation (optional)
  if (options.players !== undefined && options.players !== null) {
    if (typeof options.players !== 'number') {
      errors.push('Players must be a number');
    } else if (options.players < 1 || options.players > 4) {
      errors.push('Players must be between 1 and 4');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

module.exports = {
  validatePlayer,
  validateBooking,
  validateNotificationSettings,
  validateSchedulerSettings,
  validateTeeTimeSearchOptions,
};
