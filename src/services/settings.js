/**
 * Cobble Hills Golf Booking App
 * Settings Service
 */

const { getSettings, updateSettings } = require('../database');
const { validateNotificationSettings, validateSchedulerSettings } = require('../utils/validators');

/**
 * Get all settings
 * @returns {Object} - The settings object
 */
function getAllSettings() {
  return getSettings();
}

/**
 * Get notification settings
 * @returns {Object} - The notification settings object
 */
function getNotificationSettings() {
  const settings = getSettings();
  return settings.notifications;
}

/**
 * Update notification settings
 * @param {Object} notificationSettings - The updated notification settings
 * @returns {Object} - Result object with success flag, settings data, and any errors
 */
async function updateNotificationSettings(notificationSettings) {
  // Validate the notification settings
  const validation = validateNotificationSettings(notificationSettings);
  
  if (!validation.isValid) {
    return {
      success: false,
      errors: validation.errors,
    };
  }
  
  try {
    // Get current settings
    const currentSettings = getSettings();
    
    // Update notification settings
    const updatedSettings = await updateSettings({
      ...currentSettings,
      notifications: {
        ...currentSettings.notifications,
        ...notificationSettings,
      },
    });
    
    return {
      success: true,
      settings: updatedSettings.notifications,
    };
  } catch (error) {
    console.error('Error updating notification settings:', error);
    
    return {
      success: false,
      errors: ['Failed to update notification settings'],
    };
  }
}

/**
 * Get scheduler settings
 * @returns {Object} - The scheduler settings object
 */
function getSchedulerSettings() {
  const settings = getSettings();
  return settings.scheduler;
}

/**
 * Update scheduler settings
 * @param {Object} schedulerSettings - The updated scheduler settings
 * @returns {Object} - Result object with success flag, settings data, and any errors
 */
async function updateSchedulerSettings(schedulerSettings) {
  // Validate the scheduler settings
  const validation = validateSchedulerSettings(schedulerSettings);
  
  if (!validation.isValid) {
    return {
      success: false,
      errors: validation.errors,
    };
  }
  
  try {
    // Get current settings
    const currentSettings = getSettings();
    
    // Update scheduler settings
    const updatedSettings = await updateSettings({
      ...currentSettings,
      scheduler: {
        ...currentSettings.scheduler,
        ...schedulerSettings,
      },
    });
    
    return {
      success: true,
      settings: updatedSettings.scheduler,
    };
  } catch (error) {
    console.error('Error updating scheduler settings:', error);
    
    return {
      success: false,
      errors: ['Failed to update scheduler settings'],
    };
  }
}

/**
 * Get default players count
 * @returns {number} - The default players count
 */
function getDefaultPlayersCount() {
  const settings = getSettings();
  return settings.defaultPlayers;
}

/**
 * Update default players count
 * @param {number} count - The new default players count
 * @returns {Object} - Result object with success flag, settings data, and any errors
 */
async function updateDefaultPlayersCount(count) {
  // Validate the count
  if (typeof count !== 'number' || count < 1 || count > 4) {
    return {
      success: false,
      errors: ['Default players count must be a number between 1 and 4'],
    };
  }
  
  try {
    // Get current settings
    const currentSettings = getSettings();
    
    // Update default players count
    const updatedSettings = await updateSettings({
      ...currentSettings,
      defaultPlayers: count,
    });
    
    return {
      success: true,
      defaultPlayers: updatedSettings.defaultPlayers,
    };
  } catch (error) {
    console.error('Error updating default players count:', error);
    
    return {
      success: false,
      errors: ['Failed to update default players count'],
    };
  }
}

/**
 * Get default use cart setting
 * @returns {boolean} - The default use cart setting
 */
function getDefaultUseCart() {
  const settings = getSettings();
  return settings.defaultUseCart;
}

/**
 * Update default use cart setting
 * @param {boolean} useCart - The new default use cart setting
 * @returns {Object} - Result object with success flag, settings data, and any errors
 */
async function updateDefaultUseCart(useCart) {
  // Validate the use cart setting
  if (typeof useCart !== 'boolean') {
    return {
      success: false,
      errors: ['Default use cart must be a boolean'],
    };
  }
  
  try {
    // Get current settings
    const currentSettings = getSettings();
    
    // Update default use cart setting
    const updatedSettings = await updateSettings({
      ...currentSettings,
      defaultUseCart: useCart,
    });
    
    return {
      success: true,
      defaultUseCart: updatedSettings.defaultUseCart,
    };
  } catch (error) {
    console.error('Error updating default use cart setting:', error);
    
    return {
      success: false,
      errors: ['Failed to update default use cart setting'],
    };
  }
}

module.exports = {
  getAllSettings,
  getNotificationSettings,
  updateNotificationSettings,
  getSchedulerSettings,
  updateSchedulerSettings,
  getDefaultPlayersCount,
  updateDefaultPlayersCount,
  getDefaultUseCart,
  updateDefaultUseCart,
};
