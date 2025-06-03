/**
 * Cobble Hills Golf Booking App
 * Player Routes
 */

import express from 'express';
import * as player from '../services/player.js';

const router = express.Router();

/**
 * GET /api/players
 * Get all players
 */
router.get('/', (req, res) => {
  try {
    const players = player.getAllPlayers();
    res.json({ success: true, players });
  } catch (error) {
    console.error('Error getting players:', error);
    res.status(500).json({ success: false, errors: ['Failed to get players'] });
  }
});

/**
 * GET /api/players/:id
 * Get a player by ID
 */
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const playerData = player.getPlayerById(id);
    
    if (!playerData) {
      return res.status(404).json({ success: false, errors: ['Player not found'] });
    }
    
    res.json({ success: true, player: playerData });
  } catch (error) {
    console.error('Error getting player:', error);
    res.status(500).json({ success: false, errors: ['Failed to get player'] });
  }
});

/**
 * POST /api/players
 * Create a new player
 */
router.post('/', async (req, res) => {
  try {
    const result = await player.createPlayer(req.body);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating player:', error);
    res.status(500).json({ success: false, errors: ['Failed to create player'] });
  }
});

/**
 * PUT /api/players/:id
 * Update a player
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await player.updatePlayer(id, req.body);
    
    if (!result.success) {
      if (result.errors.includes('Player not found')) {
        return res.status(404).json(result);
      }
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error updating player:', error);
    res.status(500).json({ success: false, errors: ['Failed to update player'] });
  }
});

/**
 * DELETE /api/players/:id
 * Delete a player
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await player.deletePlayer(id);
    
    if (!result.success) {
      if (result.errors.includes('Player not found')) {
        return res.status(404).json(result);
      }
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error deleting player:', error);
    res.status(500).json({ success: false, errors: ['Failed to delete player'] });
  }
});

/**
 * GET /api/players/search/:name
 * Search for players by name
 */
router.get('/search/:name', (req, res) => {
  try {
    const { name } = req.params;
    const players = player.searchPlayersByName(name);
    res.json({ success: true, players });
  } catch (error) {
    console.error('Error searching players:', error);
    res.status(500).json({ success: false, errors: ['Failed to search players'] });
  }
});

export default router;
