/**
 * Discord Rich Presence Activity Manager
 * by @uwayxt
 */

const config = require('./config');

class ActivityManager {
  constructor(client) {
    this.client = client;
    this.startTime = Date.now();
    this.isActive = false;
  }

  /**
   * Set Figma activity status
   */
  async setFigmaActivity(presenceConfig = null) {
    const effectiveConfig = presenceConfig || config.PRESENCE_CONFIG;
    
    try {
      const activity = {
        details: effectiveConfig.details,
        state: effectiveConfig.state,
        startTimestamp: this.startTime,
        instance: false
      };

      // Only add images if they exist in config
      if (effectiveConfig.largeImageKey) {
        activity.largeImageKey = effectiveConfig.largeImageKey;
        activity.largeImageText = effectiveConfig.largeImageText;
      }
      
      if (effectiveConfig.smallImageKey) {
        activity.smallImageKey = effectiveConfig.smallImageKey;
        activity.smallImageText = effectiveConfig.smallImageText;
      }

      // Only add buttons if they have valid URLs
      if (effectiveConfig.buttons && effectiveConfig.buttons.length > 0) {
        const validButtons = effectiveConfig.buttons.filter(btn => 
          btn.url && btn.url.startsWith('http')
        );
        if (validButtons.length > 0) {
          activity.buttons = validButtons;
        }
      }

      console.log('🔧 Debug: Setting activity with data:', JSON.stringify(activity, null, 2));
      
      await this.client.setActivity(activity);
      
      if (!this.isActive) {
        console.log('✅ Figma Discord presence activated!');
        console.log(`🎨 Status: ${activity.details}`);
        console.log(`📝 State: ${activity.state}`);
        console.log('⏳ Please wait 10-15 seconds for Discord to update...');
        this.isActive = true;
      }
    } catch (error) {
      console.error('❌ Error setting Figma activity:', error.message);
      console.error('🔧 Full error:', error);
      
      // Common error suggestions
      if (error.message.includes('Invalid Asset')) {
        console.log('💡 Tip: Remove or fix largeImageKey/smallImageKey in your config');
      } else if (error.message.includes('Invalid Button')) {
        console.log('💡 Tip: Check your button URLs are valid HTTP/HTTPS links');
      }
    }
  }

  /**
   * Clear Discord activity
   */
  async clearActivity() {
    try {
      await this.client.clearActivity();
      
      if (this.isActive) {
        console.log('🔄 Figma presence cleared - App not detected');
        this.isActive = false;
      }
    } catch (error) {
      console.error('❌ Error clearing activity:', error.message);
    }
  }

  /**
   * Update activity with custom details
   */
  async updateActivity(details, state) {
    try {
      const activity = {
        details: details || config.PRESENCE_CONFIG.details,
        state: state || config.PRESENCE_CONFIG.state,
        startTimestamp: this.startTime,
        largeImageKey: config.PRESENCE_CONFIG.largeImageKey,
        largeImageText: config.PRESENCE_CONFIG.largeImageText,
        smallImageKey: config.PRESENCE_CONFIG.smallImageKey,
        smallImageText: config.PRESENCE_CONFIG.smallImageText,
        buttons: config.PRESENCE_CONFIG.buttons,
        instance: false
      };

      await this.client.setActivity(activity);
      console.log(`🔄 Activity updated: ${details}`);
    } catch (error) {
      console.error('❌ Error updating activity:', error.message);
    }
  }

  /**
   * Get current activity status
   */
  getStatus() {
    return {
      isActive: this.isActive,
      startTime: this.startTime,
      uptime: Date.now() - this.startTime
    };
  }

  /**
   * Reset start time
   */
  resetStartTime() {
    this.startTime = Date.now();
  }
}

module.exports = ActivityManager;