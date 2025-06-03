/**
 * Cobble Hills Golf Booking App
 * Settings Routes
 */

import express from 'express';
import * as settings from '../services/settings.js';
import { updateScheduler } from '../scheduler/index.js';

const router = express.Router();

/**
 * GET /api/settings
 * Get all settings
 */
router.get('/', (req, res) => {
  try {
    const allSettings = settings.getAllSettings();
    res.json({ success: true, settings: allSettings });
  } catch (error) {
    console.error('Error getting settings:', error);
    res.status(500).json({ success: false, errors: ['Failed to get settings'] });
  }
});

/**
 * GET /api/settings/notifications
 * Get notification settings
 */
router.get('/notifications', (req, res) => {
  try {
    const notificationSettings = settings.getNotificationSettings();
    res.json({ success: true, settings: notificationSettings });
  } catch (error) {
    console.error('Error getting notification settings:', error);
    res.status(500).json({ success: false, errors: ['Failed to get notification settings'] });
  }
});

/**
 * PUT /api/settings/notifications
 * Update notification settings
 */
router.put('/notifications', async (req, res) => {
  try {
    const result = await settings.updateNotificationSettings(req.body);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error updating notification settings:', error);
    res.status(500).json({ success: false, errors: ['Failed to update notification settings'] });
  }
});

/**
 * GET /api/settings/scheduler
 * Get scheduler settings
 */
router.get('/scheduler', (req, res) => {
  try {
    const schedulerSettings = settings.getSchedulerSettings();
    res.json({ success: true, settings: schedulerSettings });
  } catch (error) {
    console.error('Error getting scheduler settings:', error);
    res.status(500).json({ success: false, errors: ['Failed to get scheduler settings'] });
  }
});

/**
 * PUT /api/settings/scheduler
 * Update scheduler settings
 */
router.put('/scheduler', async (req, res) => {
  try {
    const result = await settings.updateSchedulerSettings(req.body);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    // Update the scheduler with the new settings
    updateScheduler();
    
    res.json(result);
  } catch (error) {
    console.error('Error updating scheduler settings:', error);
    res.status(500).json({ success: false, errors: ['Failed to update scheduler settings'] });
  }
});

/**
 * GET /api/settings/default-players
 * Get default players count
 */
router.get('/default-players', (req, res) => {
  try {
    const defaultPlayers = settings.getDefaultPlayersCount();
    res.json({ success: true, defaultPlayers });
  } catch (error) {
    console.error('Error getting default players count:', error);
    res.status(500).json({ success: false, errors: ['Failed to get default players count'] });
  }
});

/**
 * PUT /api/settings/default-players
 * Update default players count
 */
router.put('/default-players', async (req, res) => {
  try {
    const { count } = req.body;
    
    if (count === undefined) {
      return res.status(400).json({
        success: false,
        errors: ['Count is required'],
      });
    }
    
    const result = await settings.updateDefaultPlayersCount(count);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error updating default players count:', error);
    res.status(500).json({ success: false, errors: ['Failed to update default players count'] });
  }
});

/**
 * GET /api/settings/default-use-cart
 * Get default use cart setting
 */
router.get('/default-use-cart', (req, res) => {
  try {
    const defaultUseCart = settings.getDefaultUseCart();
    res.json({ success: true, defaultUseCart });
  } catch (error) {
    console.error('Error getting default use cart setting:', error);
    res.status(500).json({ success: false, errors: ['Failed to get default use cart setting'] });
  }
});

/**
 * PUT /api/settings/default-use-cart
 * Update default use cart setting
 */
router.put('/default-use-cart', async (req, res) => {
  try {
    const { useCart } = req.body;
    
    if (useCart === undefined) {
      return res.status(400).json({
        success: false,
        errors: ['Use cart is required'],
      });
    }
    
    const result = await settings.updateDefaultUseCart(useCart);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error updating default use cart setting:', error);
    res.status(500).json({ success: false, errors: ['Failed to update default use cart setting'] });
  }
});

export default router;
