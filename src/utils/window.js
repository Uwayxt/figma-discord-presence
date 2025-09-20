/**
 * Window & Process Detection Utility
 * by @uwayxt
 */

const { exec } = require('child_process');
const os = require('os');
const config = require('../config');

class WindowDetector {
  constructor() {
    this.platform = os.platform();
    this.lastCheck = 0;
    this.cacheTimeout = 2000; // Cache for 2 seconds
    this.cachedResult = false;
  }

  /**
   * Check if Figma is currently running
   */
  async isFigmaRunning() {
    const now = Date.now();
    if (now - this.lastCheck < this.cacheTimeout) {
      return this.cachedResult;
    }

    try {
      let result = false;

      switch (this.platform) {
        case 'win32':
          result = await this.checkWindowsProcess();
          break;
        case 'darwin':
          result = await this.checkMacProcess();
          break;
        case 'linux':
          result = await this.checkLinuxProcess();
          break;
        default:
          console.warn('⚠️ Unsupported platform:', this.platform);
          result = false;
      }

      this.lastCheck = now;
      this.cachedResult = result;
      return result;

    } catch (error) {
      console.error('❌ Error checking Figma process:', error.message);
      return false;
    }
  }

  /**
   * Check Windows processes
   */
  checkWindowsProcess() {
    return new Promise((resolve) => {
      const command = 'tasklist /fo csv /nh';
      
      // Hide CMD window dengan windowsHide option
      exec(command, { 
        timeout: 5000,
        windowsHide: true,  // This hides CMD window!
        stdio: ['ignore', 'pipe', 'pipe']
      }, (error, stdout) => {
        if (error) {
          console.warn('⚠️ Error checking Windows processes:', error.message);
          resolve(false);
          return;
        }

        const processes = config.FIGMA_PROCESSES.windows;
        const isRunning = processes.some(process => 
          stdout.toLowerCase().includes(process.toLowerCase())
        );

        // Only log during initial check, not every 15 seconds
        if (config.DEBUG) {
          console.log(`🔍 Windows check: ${isRunning ? 'Figma found' : 'Figma not found'}`);
        }
        resolve(isRunning);
      });
    });
  }

  /**
   * Check macOS processes
   */
  checkMacProcess() {
    return new Promise((resolve) => {
      const command = 'ps aux';
      
      exec(command, { 
        timeout: 5000,
        stdio: ['ignore', 'pipe', 'pipe']  // Hide output
      }, (error, stdout) => {
        if (error) {
          console.warn('⚠️ Error checking Mac processes:', error.message);
          resolve(false);
          return;
        }

        const processes = config.FIGMA_PROCESSES.darwin;
        const isRunning = processes.some(process => 
          stdout.includes(process)
        );

        if (config.DEBUG) {
          console.log(`🔍 Mac check: ${isRunning ? 'Figma found' : 'Figma not found'}`);
        }
        resolve(isRunning);
      });
    });
  }

  /**
   * Check Linux processes
   */
  checkLinuxProcess() {
    return new Promise((resolve) => {
      const command = 'ps aux';
      
      exec(command, (error, stdout) => {
        if (error) {
          resolve(false);
          return;
        }

        const processes = config.FIGMA_PROCESSES.linux;
        const isRunning = processes.some(process => 
          stdout.toLowerCase().includes(process.toLowerCase())
        );

        resolve(isRunning);
      });
    });
  }

  /**
   * Check if Figma web is open in browser (Windows only)
   */
  async isFigmaWebOpen() {
    if (this.platform !== 'win32') {
      return false;
    }

    return new Promise((resolve) => {
      const command = 'powershell "Get-Process | Where-Object {$_.ProcessName -match \\"chrome|firefox|edge|opera\\"} | ForEach-Object {$_.MainWindowTitle}"';
      
      exec(command, (error, stdout) => {
        if (error) {
          resolve(false);
          return;
        }

        const titles = config.BROWSER_TITLES;
        const isFigmaOpen = titles.some(title => 
          stdout.toLowerCase().includes(title.toLowerCase())
        );

        resolve(isFigmaOpen);
      });
    });
  }

  /**
   * Get active window title (for debugging)
   */
  async getActiveWindow() {
    try {
      switch (this.platform) {
        case 'win32':
          return await this.getWindowsActiveWindow();
        case 'darwin':
          return await this.getMacActiveWindow();
        default:
          return 'Unknown';
      }
    } catch (error) {
      return 'Error getting active window';
    }
  }

  getWindowsActiveWindow() {
    return new Promise((resolve) => {
      const command = 'powershell "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Screen]::PrimaryScreen.WorkingArea"';
      exec(command, (error, stdout) => {
        resolve(error ? 'Unknown' : stdout.trim());
      });
    });
  }

  getMacActiveWindow() {
    return new Promise((resolve) => {
      const command = 'osascript -e "tell application \\"System Events\\" to get name of first application process whose frontmost is true"';
      exec(command, (error, stdout) => {
        resolve(error ? 'Unknown' : stdout.trim());
      });
    });
  }

  /**
   * Clear cache manually
   */
  clearCache() {
    this.lastCheck = 0;
    this.cachedResult = false;
  }
}

module.exports = WindowDetector;