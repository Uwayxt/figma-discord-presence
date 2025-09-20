#!/usr/bin/env node

/**
 * Figma Discord Rich Presence CLI
 * by @uwayxt
 */

const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');
const os = require('os');

class FigmaPresenceCLI {
  constructor() {
    this.configDir = path.join(os.homedir(), '.figma-presence');
    this.configFile = path.join(this.configDir, 'config.json');
    this.pidFile = path.join(this.configDir, 'figma-presence.pid');
    
    this.defaultConfig = {
      clientId: '',
      details: '🎨 Designing in Figma',
      state: 'Creating amazing designs',
      updateInterval: 15000,
      autoStart: false
    };
  }

  /**
   * Initialize CLI
   */
  async init() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
      this.showHelp();
      return;
    }

    const command = args[0];
    const options = args.slice(1);

    try {
      await this.ensureConfigDir();
      
      switch (command) {
        case 'start':
          await this.start();
          break;
        case 'stop':
          await this.stop();
          break;
        case 'status':
          await this.status();
          break;
        case 'restart':
          await this.restart();
          break;
        case 'config':
          await this.configCommand(options);
          break;
        case 'setup':
          await this.setup();
          break;
        case 'debug':
          await this.debug();
          break;
        case 'test':
          await this.test();
          break;
        case '--help':
        case '-h':
          this.showHelp();
          break;
        case '--version':
        case '-v':
          this.showVersion();
          break;
        default:
          console.log(`❌ Unknown command: ${command}`);
          this.showHelp();
      }
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  }

  /**
   * Start Figma presence
   */
  async start() {
    if (await this.isRunning()) {
      console.log('✅ Figma Discord Presence is already running!');
      return;
    }

    const config = await this.loadConfig();
    if (!config.clientId) {
      console.log('⚠️  No Client ID configured. Run: figma-presence setup');
      return;
    }

    console.log('🚀 Starting Figma Discord Presence...');
    console.log('🔧 Initializing background monitoring (one-time setup)...');
    
    const mainScript = path.join(__dirname, '..', 'src', 'index.js');
    const child = spawn('node', [mainScript], {
      detached: true,
      stdio: ['ignore', 'ignore', 'ignore'], // Fully detached
      windowsHide: true // Hide on Windows
    });

    child.unref();
    
    // Save PID
    await this.savePid(child.pid);
    
    console.log('✅ Figma Discord Presence started in background!');
    console.log(`📊 Process ID: ${child.pid}`);
    console.log('🎯 The app is now running silently in the background');
    console.log('💡 Use "figma-presence status" to check running status');
    console.log('💡 Use "figma-presence stop" to stop the service');
  }

  /**
   * Stop Figma presence
   */
  async stop() {
    if (!await this.isRunning()) {
      console.log('⚠️  Figma Discord Presence is not running');
      return;
    }

    try {
      const pid = await this.getPid();
      
      if (os.platform() === 'win32') {
        exec(`taskkill /pid ${pid} /f`);
      } else {
        process.kill(pid, 'SIGTERM');
      }
      
      await this.removePid();
      console.log('🛑 Figma Discord Presence stopped');
    } catch (error) {
      console.error('❌ Error stopping process:', error.message);
      await this.removePid(); // Clean up PID file anyway
    }
  }

  /**
   * Restart Figma presence
   */
  async restart() {
    console.log('🔄 Restarting Figma Discord Presence...');
    await this.stop();
    setTimeout(async () => {
      await this.start();
    }, 2000);
  }

  /**
   * Show status
   */
  async status() {
    const isRunning = await this.isRunning();
    const config = await this.loadConfig();
    
    console.log('📊 Figma Discord Presence Status\n');
    console.log(`Status: ${isRunning ? '✅ Running' : '❌ Stopped'}`);
    
    if (isRunning) {
      const pid = await this.getPid();
      console.log(`Process ID: ${pid}`);
    }
    
    console.log(`Client ID: ${config.clientId ? '✅ Configured' : '❌ Not set'}`);
    console.log(`Details: "${config.details}"`);
    console.log(`State: "${config.state}"`);
    console.log(`Update Interval: ${config.updateInterval}ms`);
    
    if (!config.clientId) {
      console.log('\n💡 Run "figma-presence setup" to configure Client ID');
    }
  }

  /**
   * Configuration management
   */
  async configCommand(options) {
    if (options.length === 0) {
      await this.showConfig();
      return;
    }

    const [key, ...values] = options;
    const value = values.join(' ');

    if (!value) {
      await this.getConfigValue(key);
    } else {
      await this.setConfigValue(key, value);
    }
  }

  /**
   * Debug Discord RPC connection
   */
  async debug() {
    console.log('🔍 Running Discord RPC Debug...\n');
    
    const config = await this.loadConfig();
    
    // Check basic config
    console.log('📋 Configuration Check:');
    console.log(`Client ID: ${config.clientId || '❌ NOT SET'}`);
    console.log(`Details: "${config.details}"`);
    console.log(`State: "${config.state}"`);
    
    if (!config.clientId) {
      console.log('\n❌ No Client ID found. Run: figma-presence setup');
      return;
    }
    
    // Test Discord RPC connection
    console.log('\n🔗 Testing Discord RPC Connection...');
    
    try {
      const DiscordRPC = require('discord-rpc');
      const client = new DiscordRPC.Client({ transport: 'ipc' });
      
      const timeout = setTimeout(() => {
        console.log('❌ Connection timeout - Make sure Discord Desktop is running');
        process.exit(1);
      }, 10000);
      
      client.on('ready', async () => {
        clearTimeout(timeout);
        console.log(`✅ Connected to Discord as: ${client.user.username}#${client.user.discriminator}`);
        
        // Test setting activity
        console.log('\n🎨 Testing Activity Set...');
        
        try {
          const activity = {
            details: '🔧 DEBUG: Testing Connection',
            state: 'Debug Mode Active',
            startTimestamp: Date.now(),
            instance: false
          };
          
          await client.setActivity(activity);
          console.log('✅ Activity set successfully!');
          console.log('👀 Check your Discord profile - you should see the debug status');
          
          setTimeout(async () => {
            await client.clearActivity();
            console.log('🧹 Debug activity cleared');
            client.destroy();
            console.log('\n✅ Debug completed successfully!');
            console.log('💡 If you saw the debug status, the connection works fine');
          }, 5000);
          
        } catch (error) {
          console.error('❌ Failed to set activity:', error.message);
          client.destroy();
        }
      });
      
      client.on('disconnected', () => {
        console.log('🔌 Disconnected from Discord');
      });
      
      await client.login({ clientId: config.clientId });
      
    } catch (error) {
      console.error('❌ Discord RPC Error:', error.message);
      
      if (error.message.includes('ENOENT')) {
        console.log('💡 Make sure Discord Desktop app is running (not web version)');
      } else if (error.message.includes('Invalid Client')) {
        console.log('💡 Check your Discord Application ID in the Developer Portal');
      }
    }
  }

  /**
   * Test Figma detection
   */
  async test() {
    console.log('🔍 Testing Figma Detection...\n');
    
    const WindowDetector = require('../src/utils/window');
    const detector = new WindowDetector();
    
    console.log(`Platform: ${require('os').platform()}`);
    console.log('Checking for Figma processes...\n');
    
    try {
      const isFigmaRunning = await detector.isFigmaRunning();
      const isFigmaWeb = await detector.isFigmaWebOpen();
      
      console.log(`Figma Desktop: ${isFigmaRunning ? '✅ Detected' : '❌ Not found'}`);
      console.log(`Figma Web: ${isFigmaWeb ? '✅ Detected' : '❌ Not found'}`);
      
      if (!isFigmaRunning && !isFigmaWeb) {
        console.log('\n💡 Tips:');
        console.log('- Make sure Figma Desktop is running');
        console.log('- Or open figma.com in your browser');
        console.log('- Wait a moment and try again');
      }
      
      // Show active window for debugging
      const activeWindow = await detector.getActiveWindow();
      console.log(`\nActive Window: ${activeWindow}`);
      
    } catch (error) {
      console.error('❌ Error during detection:', error.message);
    }
  }
  async setup() {
    console.log('🎯 Figma Discord Presence Setup\n');
    console.log('Follow these steps:');
    console.log('1. Go to https://discord.com/developers/applications');
    console.log('2. Click "New Application" and name it "Figma"');
    console.log('3. Copy the Application ID\n');
    
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    try {
      const clientId = await new Promise((resolve) => {
        rl.question('📝 Enter your Discord Application ID: ', resolve);
      });

      const details = await new Promise((resolve) => {
        rl.question('🎨 Custom status text (or press Enter for default): ', resolve);
      });

      const state = await new Promise((resolve) => {
        rl.question('📄 Custom state text (or press Enter for default): ', resolve);
      });

      rl.close();

      const config = await this.loadConfig();
      config.clientId = clientId.trim();
      if (details.trim()) config.details = details.trim();
      if (state.trim()) config.state = state.trim();

      await this.saveConfig(config);
      
      console.log('\n✅ Configuration saved successfully!');
      console.log('🚀 Run "figma-presence start" to begin');
      
    } catch (error) {
      rl.close();
      throw error;
    }
  }

  /**
   * Helper methods
   */
  async ensureConfigDir() {
    if (!fs.existsSync(this.configDir)) {
      fs.mkdirSync(this.configDir, { recursive: true });
    }
  }

  async loadConfig() {
    try {
      if (fs.existsSync(this.configFile)) {
        const data = fs.readFileSync(this.configFile, 'utf8');
        return { ...this.defaultConfig, ...JSON.parse(data) };
      }
    } catch (error) {
      console.warn('⚠️  Error loading config, using defaults');
    }
    return { ...this.defaultConfig };
  }

  async saveConfig(config) {
    fs.writeFileSync(this.configFile, JSON.stringify(config, null, 2));
  }

  async showConfig() {
    const config = await this.loadConfig();
    console.log('⚙️  Current Configuration:\n');
    Object.entries(config).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
  }

  async getConfigValue(key) {
    const config = await this.loadConfig();
    console.log(`${key}: ${config[key] || 'Not set'}`);
  }

  async setConfigValue(key, value) {
    const config = await this.loadConfig();
    config[key] = value;
    await this.saveConfig(config);
    console.log(`✅ Set ${key} = "${value}"`);
  }

  async isRunning() {
    try {
      const pid = await this.getPid();
      if (!pid) return false;

      // Check if process exists
      if (os.platform() === 'win32') {
        return new Promise((resolve) => {
          exec(`tasklist /fi "PID eq ${pid}"`, (error, stdout) => {
            resolve(!error && stdout.includes(pid.toString()));
          });
        });
      } else {
        try {
          process.kill(pid, 0); // Check if process exists without killing
          return true;
        } catch {
          return false;
        }
      }
    } catch {
      return false;
    }
  }

  async getPid() {
    try {
      if (fs.existsSync(this.pidFile)) {
        const pid = fs.readFileSync(this.pidFile, 'utf8').trim();
        return parseInt(pid);
      }
    } catch (error) {
      // Ignore errors
    }
    return null;
  }

  async savePid(pid) {
    fs.writeFileSync(this.pidFile, pid.toString());
  }

  async removePid() {
    try {
      if (fs.existsSync(this.pidFile)) {
        fs.unlinkSync(this.pidFile);
      }
    } catch (error) {
      // Ignore errors
    }
  }

  showHelp() {
    console.log(`
🎨 Figma Discord Rich Presence CLI by @uwayxt

USAGE:
  figma-presence <command> [options]

COMMANDS:
  start              Start the Discord presence
  stop               Stop the Discord presence
  restart            Restart the Discord presence
  status             Show current status
  debug              Debug Discord RPC connection
  test               Test Figma detection
  setup              Interactive configuration setup
  config [key] [val] View or set configuration values

OPTIONS:
  -h, --help         Show this help message
  -v, --version      Show version number

EXAMPLES:
  figma-presence setup                    # Initial setup
  figma-presence start                    # Start presence
  figma-presence debug                    # Test Discord connection
  figma-presence test                     # Test Figma detection
  figma-presence stop                     # Stop presence  
  figma-presence status                   # Check status
  figma-presence config clientId 123456  # Set client ID
  figma-presence config details "Working on UI"  # Custom status

For more information, visit:
https://github.com/uwayxt/figma-discord-presence
`);
  }

  showVersion() {
    const packageJson = require('../package.json');
    console.log(`figma-discord-presence v${packageJson.version}`);
  }
}

// Run CLI
const cli = new FigmaPresenceCLI();
cli.init().catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});