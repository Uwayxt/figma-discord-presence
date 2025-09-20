# 🎨 Figma Discord Rich Presence

**by @uwayxt**

Automatically display your Figma activity status on Discord! Show your professional design work to friends and colleagues with a beautiful rich presence that updates in real-time.

[![npm version](https://img.shields.io/npm/v/figma-discord-presence.svg)](https://www.npmjs.com/package/figma-discord-presence)
[![npm downloads](https://img.shields.io/npm/dm/figma-discord-presence.svg)](https://www.npmjs.com/package/figma-discord-presence)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![Discord Status Preview](https://via.placeholder.com/400x100/7289DA/ffffff?text=🎨+Designing+in+Figma)

## ✨ Features

- 🎯 **Automatic Detection** - Detects both Figma Desktop and Web versions
- 🎨 **Professional Status** - Shows "🎨 Designing in Figma" on your Discord profile  
- ⚡ **Real-time Updates** - Updates automatically in background
- 🖥️ **Cross-platform** - Works on Windows, macOS, and Linux
- 🔗 **Custom Buttons** - Add portfolio and contact links
- 🎭 **Rich Presence** - Timestamps, icons, and detailed status
- 🔄 **Auto Reconnect** - Handles Discord disconnections gracefully
- 🚀 **Global CLI** - Install once, use anywhere with simple commands
- 🤫 **Silent Background** - Runs quietly without disturbing your workflow

## 📸 Preview

When you're using Figma, your Discord profile will show:

```
🎨 Designing in Figma
Creating amazing designs
🕐 for 2 hours 31 minutes
[View Portfolio] [Hire Me]
```

## 🚀 Quick Start

### Global Installation (Recommended)

```bash
# Install globally via npm
npm install -g figma-discord-presence

# Quick setup
figma-presence setup

# Start the presence
figma-presence start

# That's it! 🎉
```

## 🎮 CLI Commands

### Setup & Configuration
```bash
figma-presence setup                    # Interactive setup wizard
figma-presence config                   # View current config
figma-presence config clientId 123456  # Set Discord Application ID
figma-presence config details "Working on UI"  # Custom status text
```

### Process Management  
```bash
figma-presence start                    # Start Discord presence
figma-presence stop                     # Stop Discord presence
figma-presence restart                  # Restart Discord presence
figma-presence status                   # Check running status
```

### Debugging & Testing
```bash
figma-presence debug                    # Test Discord connection
figma-presence test                     # Test Figma detection
figma-presence --help                   # Show help
figma-presence --version                # Show version
```

## ⚙️ Setup Discord Application

### 1. Create Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and name it "Figma"
3. Copy the **Application ID**

### 2. Add Rich Presence Assets (Optional)

1. Go to "Rich Presence" → "Art Assets"
2. Upload a Figma logo image with key: `figma_logo`
3. Upload a status icon with key: `online_status`

### 3. Configure Client ID

```bash
# Method 1: Interactive setup
figma-presence setup

# Method 2: Direct config
figma-presence config clientId YOUR_APPLICATION_ID_HERE
```

## 🎯 Usage Examples

### Personal Branding
Show clients and colleagues that you're actively working on design projects.

### Team Collaboration  
Let your design team know when you're available for feedback or collaboration.

### Professional Status
Display a productive, professional status instead of "Playing a game".

## 🖥️ Platform Support

| Platform | Support | Features |
|----------|---------|----------|
| **Windows** | ✅ Full | Desktop + Web detection, Background monitoring |
| **macOS** | ✅ Full | Desktop detection, Process monitoring |  
| **Linux** | ✅ Basic | Desktop detection |

## 🛠️ Configuration Options

```bash
# Status Text
figma-presence config details "🎨 Designing in Figma"
figma-presence config state "Creating amazing designs"

# Update Interval (milliseconds)
figma-presence config updateInterval 15000

# Enable/Disable Debug Mode
figma-presence config debug true
```

## 🐛 Troubleshooting

### Common Issues

**❌ "Could not connect to Discord"** 
```bash
# Make sure Discord Desktop is running (not web version)
figma-presence debug
```

**❌ "Figma not detected"**
```bash
# Test Figma detection
figma-presence test
```

**❌ "Invalid Client ID"**
- Make sure you're using the Application ID, not Client Secret
- Run `figma-presence setup` to reconfigure

**❌ Activity not showing on Discord**
- Check Discord → Settings → Activity Privacy
- Enable "Display current activity as a status message"
- Restart Discord and try again

### Debug Commands

```bash
figma-presence debug          # Test Discord RPC connection
figma-presence test          # Test Figma process detection  
figma-presence status        # Show current running status
```

## 📊 Advanced Usage

### Custom Status Messages

```bash
# Set custom details
figma-presence config details "🚀 Building awesome UI"

# Set custom state  
figma-presence config state "Design system work"

# Add portfolio buttons (edit config file)
figma-presence config
```

### Running as System Service

**Windows (Task Scheduler)**
```bash
# Add to Windows startup
figma-presence start
# The process will run in background
```

**macOS (launchd)**
```bash
# Create launchd plist for auto-start
figma-presence start
```

**Linux (systemd)**
```bash
# Create systemd service
figma-presence start
```

## 🤝 Contributing

Contributions are welcome! Please feel free to:

- 🐛 Report bugs
- 💡 Suggest new features  
- 🔧 Submit pull requests
- 📝 Improve documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [NPM Package](https://www.npmjs.com/package/figma-discord-presence)
- [GitHub Repository](https://github.com/uwayxt/figma-discord-presence)
- [Discord Developer Portal](https://discord.com/developers/applications)
- [Issue Tracker](https://github.com/uwayxt/figma-discord-presence/issues)

---

**Made with ❤️ by @uwayxt**

*Show the world you're a professional designer! ✨*

## 🎖️ Badge for your README

Show off that you're using Figma Discord Presence:

```markdown
[![Figma Discord Presence](https://img.shields.io/badge/Discord-Figma%20Status-7289da?logo=discord&logoColor=white)](https://www.npmjs.com/package/figma-discord-presence)
```

[![Figma Discord Presence](https://img.shields.io/badge/Discord-Figma%20Status-7289da?logo=discord&logoColor=white)](https://www.npmjs.com/package/figma-discord-presence)# 🎨 Figma Discord Rich Presence

**by @uwayxt**

Automatically display your Figma activity status on Discord! Show your professional design work to friends and colleagues with a beautiful rich presence.

![Discord Status Preview](https://via.placeholder.com/400x100/7289DA/ffffff?text=🎨+Designing+in+Figma)

## ✨ Features

- 🎯 **Automatic Detection** - Detects both Figma Desktop and Web versions
- 🎨 **Professional Status** - Shows "🎨 Designing in Figma" on your Discord profile  
- ⚡ **Real-time Updates** - Updates every 15 seconds automatically
- 🖥️ **Cross-platform** - Works on Windows, macOS, and Linux
- 🔗 **Custom Buttons** - Add portfolio and contact links
- 🎭 **Rich Presence** - Timestamps, icons, and detailed status
- 🔄 **Auto Reconnect** - Handles Discord disconnections gracefully

## 📸 Preview

When you're using Figma, your Discord profile will show:

```
🎨 Designing in Figma
Creating amazing designs
🕐 for 2 hours 31 minutes
```

With optional buttons for your portfolio and contact links!

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 14+ installed
- Discord Desktop app running
- Figma Desktop or Web access

### 2. Clone & Install

```bash
git clone https://github.com/uwayxt/figma-discord-presence
cd figma-discord-presence
npm install
```

### 3. Setup Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and name it "Figma"
3. Copy the **Application ID**
4. Go to "Rich Presence" → "Art Assets"
5. Upload a Figma logo image with key: `figma_logo`
6. Upload a status icon with key: `online_status`

### 4. Configure

Edit `src/config.js`:

```javascript
module.exports = {
  CLIENT_ID: 'YOUR_APPLICATION_ID_HERE', // Paste your Application ID
  
  PRESENCE_CONFIG: {
    details: '🎨 Designing in Figma',
    state: 'Creating amazing designs',
    // ... customize other settings
  }
};
```

### 5. Run

```bash
npm start
```

That's it! The presence will automatically activate when you open Figma.

## ⚙️ Configuration

### Basic Settings

| Setting | Description | Default |
|---------|-------------|---------|
| `CLIENT_ID` | Discord Application ID | Required |
| `details` | Main status text | "🎨 Designing in Figma" |
| `state` | Subtitle text | "Creating amazing designs" |
| `UPDATE_INTERVAL` | Check interval (ms) | 15000 (15 seconds) |

### Custom Buttons

Add up to 2 buttons to your presence:

```javascript
buttons: [
  {
    label: 'View My Portfolio',
    url: 'https://your-portfolio.com'
  },
  {
    label: 'Hire Me',
    url: 'https://your-contact.com'
  }
]
```

### Rich Presence Images

Upload these images to your Discord Application:

- `figma_logo` - Main Figma icon (512x512 recommended)
- `online_status` - Small status indicator (256x256 recommended)

## 🖥️ Platform Support

### Windows
- Detects `Figma.exe` and `FigmaAgent.exe` processes
- Detects Figma web in Chrome/Firefox/Edge browsers

### macOS  
- Detects `Figma` and `Figma Helper` processes
- Activity monitor integration

### Linux
- Detects `figma-linux` and `Figma` processes
- Process list monitoring

## 📱 Usage Examples

### Personal Branding
Show clients and colleagues that you're actively working on design projects.

### Team Collaboration
Let your design team know when you're available for feedback or collaboration.

### Professional Status
Display a productive, professional status instead of "Playing a game".

## 🛠️ Development

### Project Structure

```
figma-discord-presence/
├── package.json          # Dependencies & scripts
├── README.md            # This file
├── LICENSE              # MIT License
└── src/
    ├── index.js         # Main entry point
    ├── config.js        # Configuration settings
    ├── activity.js      # Rich presence logic
    └── utils/
        └── window.js    # Process detection utilities
```

### Scripts

```bash
npm start           # Start the presence
npm run dev         # Start with nodemon (auto-restart)
```

### Debug Mode

Set environment variable for detailed logging:

```bash
DEBUG=true npm start
```

## 🐛 Troubleshooting

### Common Issues

**❌ "Invalid Client ID"**
- Make sure you're using the Application ID, not Client Secret
- Check that the ID is exactly copied from Discord Developer Portal

**❌ "Could not connect to Discord"** 
- Ensure Discord Desktop is running (not just web version)
- Try restarting Discord and running the script again

**❌ "Figma not detected"**
- Make sure Figma Desktop is running, not just browser tab
- Check that the process name matches your system

**❌ "RPC Connection Failed"**
- Close and reopen Discord
- Run Discord as administrator (Windows)
- Check if other Discord RPC apps are running

### Getting Help

1. Check the [Issues](https://github.com/uwayxt/figma-discord-presence/issues) page
2. Create a new issue with:
   - Your operating system
   - Node.js version (`node --version`)
   - Error messages or logs
   - Steps to reproduce

## 🤝 Contributing

Contributions are welcome! Please feel free to:

- 🐛 Report bugs
- 💡 Suggest new features  
- 🔧 Submit pull requests
- 📝 Improve documentation

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Discord for the Rich Presence API
- Figma for creating an amazing design tool
- The Node.js community for excellent packages

## 🔗 Links

- [Discord Developer Portal](https://discord.com/developers/applications)
- [Discord Rich Presence Documentation](https://discord.com/developers/docs/rich-presence/how-to)
- [Figma](https://figma.com)

---

**Made with ❤️ by @uwayxt**

*Show the world you're a professional designer! ✨*

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/uwayxt/figma-discord-presence)
![GitHub forks](https://img.shields.io/github/forks/uwayxt/figma-discord-presence)  
![GitHub issues](https://img.shields.io/github/issues/uwayxt/figma-discord-presence)
![NPM version](https://img.shields.io/npm/v/figma-discord-presence)
