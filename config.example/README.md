# Configuration Files

This directory contains **example configuration files** for SmartCams v2.0.

## Setup Instructions

1. **Copy the example files to the `config/` directory:**
   ```bash
   cp config.example/_serverconfig.json config/_serverconfig.json
   cp config.example/_cameraconfig.json config/_cameraconfig.json
   ```

2. **Edit the configuration files** with your actual settings:
   - Update IP addresses to match your network
   - Change default passwords
   - Configure camera URLs and credentials
   - Add/remove cameras as needed

## Configuration Files

### `_serverconfig.json`
Server and user authentication configuration.

**Important Settings:**
- `httpport` - Web server port (default: 8001)
- `publicdir` - Static files directory
- `admins` - Admin users with full access
- `users` - Regular users with assigned cameras
- `guests` - View-only guest users
- `login` - Enable/disable authentication ("true" or "false")

**Security Note:** Always change default passwords in production!

### `_cameraconfig.json`
Default camera configuration (used when no user-specific config exists).

**Camera Types:**
- `pelcod` - Pelco-D PTZ camera (RS-485 over TCP/IP)
- `pelcod-web` - Pelco-D camera with web video stream
- `web` - Standard IP camera with HTTP stream
- `web2` - Alternative web camera type
- `mpegstream` - MPEG/MJPEG stream
- `esp32cam` - ESP32-CAM module

**Camera Settings:**
- `id` - Camera address (for Pelco-D cameras: 1-255)
- `ip` - Camera IP address for video stream
- `cip` - Control IP (for Pelco-D: RS-485 converter IP)
- `cport` - Control port (typically 4001 for RS-485 converters)
- `url` - Video stream URL path
- `user`/`pass` - Camera authentication credentials

### Per-User Camera Files

Create user-specific camera configurations:
- Format: `[username].cams.json`
- Example: `kiki.cams.json`, `joe.cams.json`
- Structure: Same as `_cameraconfig.json`

Each user can have different cameras and layouts assigned.

## Pelco-D Camera Setup

For PTZ cameras using Pelco-D protocol:

1. **Hardware Requirements:**
   - RS-485 to Ethernet converter
   - Camera with RS-485 interface
   - Network connection

2. **Camera Configuration:**
   - Set camera address (1-255) on the PTZ camera hardware
   - Configure baud rate (typically 2400 or 9600)
   - Set protocol to Pelco-D

3. **Network Configuration:**
   - `cip` - IP address of RS-485 converter
   - `cport` - TCP port of converter (usually 4001)
   - `id` - Camera address (must match hardware setting)

4. **Testing:**
   ```bash
   # Test TCP connection to RS-485 converter
   telnet [converter-ip] [port]
   ```

## Screen Layout Configuration

The `config.screen` section controls the camera grid:

- `columns` - Number of cameras per row (2, 3, or 4)
- `rows` - Number of rows per tab
- `picdirectory` - Path to UI images/icons
- `buttonpics` - Icon file names for control buttons

**Examples:**
- 2x2 grid = 4 cameras per tab
- 3x2 grid = 6 cameras per tab
- 4x2 grid = 8 cameras per tab

## Security Considerations

⚠️ **Never commit your actual `config/` directory to version control!**

The `config/` directory is excluded in `.gitignore` to protect:
- User passwords
- Camera IP addresses
- Network topology
- Authentication credentials

Always keep your actual configuration files private and secure.

## Troubleshooting

**Server won't start:**
- Verify JSON syntax (use a JSON validator)
- Check file names match exactly (case-sensitive)
- Ensure `config/` directory exists

**Cameras not loading:**
- Verify IP addresses are correct
- Check network connectivity
- Test camera URLs in browser/VLC
- Review camera credentials

**Pelco-D commands not working:**
- Verify `cip` and `cport` settings
- Check camera `id` matches hardware
- Test telnet connection to converter
- Verify baud rate settings match
