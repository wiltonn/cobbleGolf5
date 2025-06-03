/**
 * Cobble Hills Golf Booking App
 * Scheduler Module
 */

import cron from 'node-cron';
import { getSettings } from '../database/index.js';
import * as booking from '../services/booking.js';
import * as player from '../services/player.js';

// Store the scheduled tasks
let scheduledTasks = {};

/**
 * Initialize the scheduler
 */
function initializeScheduler() {
  const settings = getSettings();
  
  if (settings.scheduler.enabled) {
    scheduleBookingTask();
    console.log('Scheduler initialized');
  } else {
    console.log('Scheduler is disabled');
  }
}

/**
 * Schedule the booking task
 */
function scheduleBookingTask() {
  // Clear any existing scheduled tasks
  stopScheduler();
  
  const settings = getSettings();
  
  if (!settings.scheduler.enabled) {
    console.log('Scheduler is disabled');
    return;
  }
  
  const cronExpression = settings.scheduler.cronExpression;
  
  // Validate the cron expression
  if (!cron.validate(cronExpression)) {
    console.error(`Invalid cron expression: ${cronExpression}`);
    return;
  }
  
  // Schedule the task
  scheduledTasks.bookingTask = cron.schedule(cronExpression, async () => {
    try {
      await runBookingTask();
    } catch (error) {
      console.error('Error running booking task:', error);
    }
  });
  
  console.log(`Booking task scheduled with cron expression: ${cronExpression}`);
}

/**
 * Run the booking task
 */
async function runBookingTask() {
  console.log('Running booking task');
  
  const settings = getSettings();
  
  if (!settings.scheduler.enabled) {
    console.log('Scheduler is disabled');
    return;
  }
  
  // Calculate the target date
  const now = new Date();
  const targetDate = new Date();
  targetDate.setDate(now.getDate() + settings.scheduler.bookingDaysAhead);
  
  const formattedDate = targetDate.toISOString().split('T')[0];
  
  // Get the preferred tee time
  const preferredTime = settings.scheduler.preferredTeeTime;
  const flexibilityMinutes = settings.scheduler.teeTimeFlexibilityMinutes;
  
  // Convert preferred time to minutes since midnight
  const [prefHours, prefMinutes] = preferredTime.split(':').map(Number);
  const preferredTimeMinutes = prefHours * 60 + prefMinutes;
  
  // Calculate the time range
  const startTimeMinutes = Math.max(0, preferredTimeMinutes - flexibilityMinutes);
  const endTimeMinutes = Math.min(24 * 60 - 1, preferredTimeMinutes + flexibilityMinutes);
  
  // Convert back to HH:MM format
  const startTime = `${Math.floor(startTimeMinutes / 60).toString().padStart(2, '0')}:${(startTimeMinutes % 60).toString().padStart(2, '0')}`;
  const endTime = `${Math.floor(endTimeMinutes / 60).toString().padStart(2, '0')}:${(endTimeMinutes % 60).toString().padStart(2, '0')}`;
  
  // Get the default number of players
  const defaultPlayers = settings.defaultPlayers;
  
  // Search for available tee times
  console.log(`Searching for tee times on ${formattedDate} between ${startTime} and ${endTime} for ${defaultPlayers} players`);
  
  const searchResult = await booking.searchTeeTimes({
    date: formattedDate,
    startTime,
    endTime,
    players: defaultPlayers,
  });
  
  if (!searchResult.success || !searchResult.teeTimes || searchResult.teeTimes.length === 0) {
    console.log('No available tee times found');
    return;
  }
  
  // Sort tee times by proximity to preferred time
  const sortedTeeTimes = [...searchResult.teeTimes].sort((a, b) => {
    const [aHours, aMinutes] = a.time24.split(':').map(Number);
    const [bHours, bMinutes] = b.time24.split(':').map(Number);
    
    const aMinutesSinceMidnight = aHours * 60 + aMinutes;
    const bMinutesSinceMidnight = bHours * 60 + bMinutes;
    
    const aDiff = Math.abs(aMinutesSinceMidnight - preferredTimeMinutes);
    const bDiff = Math.abs(bMinutesSinceMidnight - preferredTimeMinutes);
    
    return aDiff - bDiff;
  });
  
  // Get the closest tee time
  const bestTeeTime = sortedTeeTimes[0];
  
  console.log(`Found best tee time: ${bestTeeTime.time} (${bestTeeTime.time24})`);
  
  // Get all players
  const players = player.getAllPlayers();
  
  if (players.length < defaultPlayers) {
    console.log(`Not enough players configured. Need ${defaultPlayers}, but only have ${players.length}`);
    return;
  }
  
  // Select the first N players
  const selectedPlayers = players.slice(0, defaultPlayers).map(p => p.id);
  
  // Book the tee time
  const bookingData = {
    date: formattedDate,
    time: bestTeeTime.time24,
    players: selectedPlayers,
    useCart: settings.defaultUseCart,
    bookingUrl: bestTeeTime.bookingUrl,
    status: 'pending',
  };
  
  // Find a player with an email for notifications
  const playerWithEmail = players.find(p => p.email);
  const notificationEmail = playerWithEmail ? playerWithEmail.email : null;
  
  console.log(`Attempting to book tee time: ${bestTeeTime.time} (${bestTeeTime.time24}) on ${formattedDate}`);
  
  const bookingResult = await booking.bookTeeTime(bookingData, notificationEmail);
  
  if (bookingResult.success) {
    console.log(`Successfully booked tee time: ${bestTeeTime.time} (${bestTeeTime.time24}) on ${formattedDate}`);
    console.log(`Confirmation number: ${bookingResult.booking.confirmationNumber}`);
  } else {
    console.error('Failed to book tee time:', bookingResult.errors);
  }
}

/**
 * Stop the scheduler
 */
function stopScheduler() {
  // Stop all scheduled tasks
  Object.values(scheduledTasks).forEach(task => {
    if (task && typeof task.stop === 'function') {
      task.stop();
    }
  });
  
  // Clear the tasks object
  scheduledTasks = {};
  
  console.log('Scheduler stopped');
}

/**
 * Update the scheduler settings
 */
function updateScheduler() {
  const settings = getSettings();
  
  if (settings.scheduler.enabled) {
    scheduleBookingTask();
    console.log('Scheduler updated');
  } else {
    stopScheduler();
    console.log('Scheduler disabled');
  }
}

/**
 * Get the scheduler status
 * @returns {Object} - The scheduler status
 */
function getSchedulerStatus() {
  const settings = getSettings();
  
  return {
    enabled: settings.scheduler.enabled,
    cronExpression: settings.scheduler.cronExpression,
    bookingDaysAhead: settings.scheduler.bookingDaysAhead,
    preferredTeeTime: settings.scheduler.preferredTeeTime,
    teeTimeFlexibilityMinutes: settings.scheduler.teeTimeFlexibilityMinutes,
    nextRunTime: getNextRunTime(),
    isRunning: Object.keys(scheduledTasks).length > 0,
  };
}

/**
 * Get the next run time for the scheduler
 * @returns {string|null} - The next run time as an ISO string, or null if not scheduled
 */
function getNextRunTime() {
  const settings = getSettings();
  
  if (!settings.scheduler.enabled || !scheduledTasks.bookingTask) {
    return null;
  }
  
  try {
    // Use the cron-parser library to calculate the next run time
    const parser = require('cron-parser');
    const interval = parser.parseExpression(settings.scheduler.cronExpression);
    return interval.next().toISOString();
  } catch (error) {
    console.error('Error calculating next run time:', error);
    return null;
  }
}

/**
 * Run the booking task manually
 * @returns {Promise<Object>} - Result object with success flag and any errors
 */
async function runBookingTaskManually() {
  try {
    await runBookingTask();
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error running booking task manually:', error);
    return {
      success: false,
      errors: [error.message],
    };
  }
}

export {
  initializeScheduler,
  scheduleBookingTask,
  stopScheduler,
  updateScheduler,
  getSchedulerStatus,
  runBookingTaskManually,
};
