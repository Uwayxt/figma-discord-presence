/**
 * Figma Discord Rich Presence Configuration
 * by @uwayxt
 */

module.exports = {
  // Discord Application ID - Replace with your own from Discord Developer Portal
  // Visit: https://discord.com/developers/applications
  CLIENT_ID: 'YOUR_APPLICATION_ID_HERE', // Replace this with your actual Application ID
  
  // Debug mode - set to true for more logging
  DEBUG: false,
  
  // Quiet mode - minimal console output when running in background
  QUIET_MODE: true,
  
  // Rich Presence Settings
  PRESENCE_CONFIG: {
    details: '🎨 Designing in Figma',
    state: 'Creating amazing designs',
    largeImageKey: 'figma_logo', // Upload image to Discord App with this key
    largeImageText: 'Figma - Professional Design Tool',
    smallImageKey: 'online_status',
    smallImageText: 'Online'
    // Commented out buttons for now - uncomment after testing basic presence works
    // buttons: [
    //   {
    //     label: 'View My Portfolio',
    //     url: 'https://your-portfolio.com'
    //   },
    //   {
    //     label: 'Hire Me', 
    //     url: 'https://your-contact.com'
    //   }
    // ]
  },

  // Update interval in milliseconds (15 seconds)
  UPDATE_INTERVAL: 15000,

  // Process names to detect Figma
  FIGMA_PROCESSES: {
    windows: ['Figma.exe', 'FigmaAgent.exe'],
    darwin: ['Figma', 'Figma Helper'], // macOS
    linux: ['figma-linux', 'Figma']
  },

  // Browser detection for Figma Web
  BROWSER_TITLES: [
    'Figma',
    'figma.com',
    'Figma - ',
    'Design - Figma'
  ]
};