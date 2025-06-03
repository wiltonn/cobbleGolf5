/**
 * Cobble Hills Golf Booking App
 * Database Module
 */

import fs from 'fs';
import path from 'path';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb';
import { v4 as uuidv4 } from 'uuid';

// Get database path from environment variables or use default
const dbPath = process.env.DB_PATH || './data/db.json';

// Ensure the data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create or load the database file
const adapter = new JSONFile(dbPath);
const db = new Low(adapter);

/**
 * Initialize the database with default data if it doesn't exist
 */
async function initializeDatabase() {
  await db.read();
  
  // Set default data if the database is empty
  db.data = db.data || {
    players: [],
    bookings: [],
    settings: {
      notifications: {
        enabled: true,
        emailOnBookingSuccess: true,
        emailOnBookingFailure: true,
        emailReminderEnabled: true,
        emailReminderHoursBefore: 24,
      },
      scheduler: {
        enabled: false,
        cronExpression: process.env.SCHEDULER_CRON || '0 7 * * *',
        bookingDaysAhead: parseInt(process.env.DEFAULT_BOOKING_DAYS_AHEAD || '7', 10),
        preferredTeeTime: process.env.DEFAULT_PREFERRED_TEE_TIME || '10:00',
        teeTimeFlexibilityMinutes: parseInt(process.env.DEFAULT_TEE_TIME_FLEXIBILITY || '60', 10),
      },
      defaultPlayers: parseInt(process.env.DEFAULT_PLAYERS || '4', 10),
      defaultUseCart: process.env.DEFAULT_USE_CART === 'true',
    },
  };
  
  await db.write();
  console.log('Database initialized successfully');
}

/**
 * Get all items from a collection
 * @param {string} collection - The collection name
 * @returns {Array} - Array of items
 */
function getAll(collection) {
  return db.data[collection] || [];
}

/**
 * Get an item by ID from a collection
 * @param {string} collection - The collection name
 * @param {string} id - The item ID
 * @returns {Object|null} - The found item or null
 */
function getById(collection, id) {
  return db.data[collection].find(item => item.id === id) || null;
}

/**
 * Create a new item in a collection
 * @param {string} collection - The collection name
 * @param {Object} data - The item data
 * @returns {Object} - The created item
 */
async function create(collection, data) {
  const item = {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...data,
  };
  
  db.data[collection].push(item);
  await db.write();
  
  return item;
}

/**
 * Update an item in a collection
 * @param {string} collection - The collection name
 * @param {string} id - The item ID
 * @param {Object} data - The updated data
 * @returns {Object|null} - The updated item or null if not found
 */
async function update(collection, id, data) {
  const index = db.data[collection].findIndex(item => item.id === id);
  
  if (index === -1) {
    return null;
  }
  
  const updatedItem = {
    ...db.data[collection][index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  
  db.data[collection][index] = updatedItem;
  await db.write();
  
  return updatedItem;
}

/**
 * Delete an item from a collection
 * @param {string} collection - The collection name
 * @param {string} id - The item ID
 * @returns {boolean} - True if deleted, false if not found
 */
async function remove(collection, id) {
  const initialLength = db.data[collection].length;
  db.data[collection] = db.data[collection].filter(item => item.id !== id);
  
  if (initialLength === db.data[collection].length) {
    return false;
  }
  
  await db.write();
  return true;
}

/**
 * Query items in a collection based on a filter function
 * @param {string} collection - The collection name
 * @param {Function} filterFn - The filter function
 * @returns {Array} - Array of matching items
 */
function query(collection, filterFn) {
  return db.data[collection].filter(filterFn);
}

/**
 * Update settings in the database
 * @param {Object} settings - The settings object
 * @returns {Object} - The updated settings
 */
async function updateSettings(settings) {
  db.data.settings = {
    ...db.data.settings,
    ...settings,
    updatedAt: new Date().toISOString(),
  };
  
  await db.write();
  return db.data.settings;
}

/**
 * Get all settings from the database
 * @returns {Object} - The settings object
 */
function getSettings() {
  return db.data.settings;
}

export {
  initializeDatabase,
  getAll,
  getById,
  create,
  update,
  remove,
  query,
  updateSettings,
  getSettings,
  db,
};
