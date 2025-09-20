/**
 * Figma Discord Rich Presence
 * by @uwayxt
 * 
 * Automatically shows your Figma activity on Discord
 */

const DiscordRPC = require('discord-rpc');
const config = require('./config');
const ActivityManager = require('./activity');
const WindowDetector = require('./utils/window');
const fs = require('fs');
const path = require('path');
const os = require('os');

class FigmaDiscordPresence {
  constructor() {
    this.client = new DiscordRPC.Client({ transport: 'ipc' });
    this.activityManager = new ActivityManager(this.client);
    this.windowDetector = new WindowDetector();
    this.isConnected = false;
    this.updateInterval = null;
    this.userConfig = this.loadUserConfig();
  }

  /**
   * Load user configuration from CLI
   */
  loadUserConfig() {
    try {
      const configDir = path.join(os.homedir(), '.figma-presence');
      const configFile = path.join(configDir, 'config.json');
      
      if (fs.existsSync(configFile)) {
        const userConfig = JSON.parse(fs.readFileSync(configFile, 'utf8'));
        console.log('📁 Loaded user configuration');
        return userConfig;
      }
    } catch (error) {
      console.warn('⚠️  Could not load user config, using defaults');
    }
    return {};
  }

  /**
   * Get effective configuration (merge default + user config)
   */
  getConfig() {
    return {
      CLIENT_ID: this.userConfig.clientId || config.CLIENT_ID,
      PRESENCE_CONFIG: {
        ...config.PRESENCE_CONFIG,
        details: this.userConfig.details || config.PRESENCE_CONFIG.details,
        state: this.userConfig.state || config.PRESENCE_CONFIG.state
      },
      UPDATE_INTERVAL: this.userConfig.updateInterval || config.UPDATE_INTERVAL
    };
  }

  /**
   * Initialize and start the Discord RPC client
   */
  async start() {
    const effectiveConfig = this.getConfig();
    
    if (!effectiveConfig.CLIENT_ID || effectiveConfig.CLIENT_ID === 'YOUR_APPLICATION_ID_HERE') {
      console.error('❌ No Discord Application ID configured!');
      console.log('💡 Run: figma-presence setup');
      process.exit(1);
    }

    try {
      if (!effectiveConfig.QUIET_MODE) {
        console.log('🚀 Starting Figma Discord Presence...');
      }
      
      // Connect to Discord
      await this.connectToDiscord();
      
      // Start monitoring Figma
      this.startMonitoring();
      
      if (!effectiveConfig.QUIET_MODE) {
        console.log('✅ Figma Discord Presence is now running!');
        console.log('💡 Make sure Figma is running to see the status on Discord');
      }
      
    } catch (error) {
      console.error('❌ Failed to start:', error.message);
      process.exit(1);
    }
  }

  /**
   * Connect to Discord RPC
   */
  async connectToDiscord() {
    const effectiveConfig = this.getConfig();
    
    return new Promise((resolve, reject) => {
      this.client.on('ready', () => {
        console.log('🔗 Connected to Discord RPC');
        console.log(`👤 Logged in as: ${this.client.user.username}#${this.client.user.discriminator}`);
        console.log(`🆔 Application ID: ${effectiveConfig.CLIENT_ID}`);
        console.log('🔧 Debug: RPC Connection established successfully');
        this.isConnected = true;
        resolve();
      });

      this.client.on('disconnected', () => {
        console.log('🔌 Disconnected from Discord');
        this.isConnected = false;
        this.reconnect();
      });

      // Login to Discord
      this.client.login({ clientId: effectiveConfig.CLIENT_ID })
        .catch(reject);
    });
  }

  /**
   * Start monitoring Figma application
   */
  startMonitoring() {
    const effectiveConfig = this.getConfig();
    
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    console.log(`🔍 Monitoring Figma every ${effectiveConfig.UPDATE_INTERVAL / 1000} seconds...`);
    
    this.updateInterval = setInterval(async () => {
      await this.checkAndUpdateStatus();
    }, effectiveConfig.UPDATE_INTERVAL);

    // Initial check
    this.checkAndUpdateStatus();
  }

  /**
   * Check Figma status and update Discord accordingly
   */
  async checkAndUpdateStatus() {
    const effectiveConfig = this.getConfig();
    
    try {
      const isFigmaRunning = await this.windowDetector.isFigmaRunning();
      // Remove separate web check since it's now integrated
      
      const figmaDetected = isFigmaRunning;
      
      // Only log status changes, not every check
      if (figmaDetected !== this.lastFigmaStatus) {
        if (figmaDetected) {
          console.log('🎨 Figma detected! Setting Discord activity...');
        } else {
          console.log('❌ Figma not detected, clearing activity...');
        }
        this.lastFigmaStatus = figmaDetected;
      }
      
      if (figmaDetected) {
        await this.activityManager.setFigmaActivity(effectiveConfig.PRESENCE_CONFIG);
      } else {
        await this.activityManager.clearActivity();
      }
    } catch (error) {
      console.error('❌ Error during status check:', error.message);
      if (effectiveConfig.DEBUG) {
        console.error('🔧 Stack trace:', error.stack);
      }
    }
  }

  /**
   * Reconnect to Discord if disconnected
   */
  async reconnect() {
    console.log('🔄 Attempting to reconnect to Discord...');
    
    setTimeout(async () => {
      try {
        await this.connectToDiscord();
        this.startMonitoring();
        console.log('✅ Reconnected successfully!');
      } catch (error) {
        console.error('❌ Reconnection failed:', error.message);
        this.reconnect(); // Try again
      }
    }, 5000);
  }

  /**
   * Graceful shutdown
   */
  async shutdown() {
    console.log('🛑 Shutting down Figma Discord Presence...');
    
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    // Cleanup window detector
    if (this.windowDetector) {
      this.windowDetector.cleanup();
    }

    if (this.isConnected) {
      await this.activityManager.clearActivity();
      this.client.destroy();
    }

    console.log('👋 Goodbye!');
    process.exit(0);
  }

  /**
   * Get current status info
   */
  getStatus() {
    return {
      connected: this.isConnected,
      activity: this.activityManager.getStatus(),
      platform: process.platform,
      uptime: process.uptime()
    };
  }
}

// Create and start the presence
const figmaPresence = new FigmaDiscordPresence();

// Handle graceful shutdown
process.on('SIGINT', () => figmaPresence.shutdown());
process.on('SIGTERM', () => figmaPresence.shutdown());

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  figmaPresence.shutdown();
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start the application
figmaPresence.start().catch((error) => {
  console.error('💥 Failed to start application:', error);
  process.exit(1);
});