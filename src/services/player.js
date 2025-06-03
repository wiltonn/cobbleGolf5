/**
 * Cobble Hills Golf Booking App
 * Player Service
 */

const { getAll, getById, create, update, remove, query } = require('../database');
const { validatePlayer } = require('../utils/validators');

// Collection name in the database
const COLLECTION = 'players';

/**
 * Get all players
 * @returns {Array} - Array of player objects
 */
function getAllPlayers() {
  return getAll(COLLECTION);
}

/**
 * Get a player by ID
 * @param {string} id - The player ID
 * @returns {Object|null} - The player object or null if not found
 */
function getPlayerById(id) {
  return getById(COLLECTION, id);
}

/**
 * Create a new player
 * @param {Object} playerData - The player data
 * @returns {Object} - Result object with success flag, player data, and any errors
 */
async function createPlayer(playerData) {
  // Validate the player data
  const validation = validatePlayer(playerData);
  
  if (!validation.isValid) {
    return {
      success: false,
      errors: validation.errors,
    };
  }
  
  try {
    // Create the player
    const player = await create(COLLECTION, playerData);
    
    return {
      success: true,
      player,
    };
  } catch (error) {
    console.error('Error creating player:', error);
    
    return {
      success: false,
      errors: ['Failed to create player'],
    };
  }
}

/**
 * Update a player
 * @param {string} id - The player ID
 * @param {Object} playerData - The updated player data
 * @returns {Object} - Result object with success flag, player data, and any errors
 */
async function updatePlayer(id, playerData) {
  // Validate the player data
  const validation = validatePlayer(playerData);
  
  if (!validation.isValid) {
    return {
      success: false,
      errors: validation.errors,
    };
  }
  
  try {
    // Update the player
    const player = await update(COLLECTION, id, playerData);
    
    if (!player) {
      return {
        success: false,
        errors: ['Player not found'],
      };
    }
    
    return {
      success: true,
      player,
    };
  } catch (error) {
    console.error('Error updating player:', error);
    
    return {
      success: false,
      errors: ['Failed to update player'],
    };
  }
}

/**
 * Delete a player
 * @param {string} id - The player ID
 * @returns {Object} - Result object with success flag and any errors
 */
async function deletePlayer(id) {
  try {
    // Delete the player
    const deleted = await remove(COLLECTION, id);
    
    if (!deleted) {
      return {
        success: false,
        errors: ['Player not found'],
      };
    }
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting player:', error);
    
    return {
      success: false,
      errors: ['Failed to delete player'],
    };
  }
}

/**
 * Search for players by name
 * @param {string} name - The name to search for
 * @returns {Array} - Array of matching player objects
 */
function searchPlayersByName(name) {
  if (!name) {
    return [];
  }
  
  const searchTerm = name.toLowerCase();
  
  return query(COLLECTION, player => 
    player.name.toLowerCase().includes(searchTerm)
  );
}

module.exports = {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
  searchPlayersByName,
};
