# Configuration Files

This directory contains **example configuration files** for SmartCams v2.0.

## ⚠️ IMPORTANT: User-to-Camera File Mapping

**Each user in `_serverconfig.json` MUST have a matching `[username].cams.json` file!**

### How It Works:

```
_serverconfig.json                    Camera Config Files
├─ admin (user)          ────────────→ admin.cams.json
├─ user (user)           ────────────→ user.cams.json
├─ guest (user)          ────────────→ guest.cams.json
└─ sarah (user)          ────────────→ sarah.cams.json
```

**Example:**
- If you create a user named `"john"` in `_serverconfig.json`
- You MUST create `john.cams.json` with his camera assignments
- When John logs in, the server loads `john.cams.json`

## Setup Instructions

1. **Copy server configuration:**
   ```bash
   cd config/
   cp _serverconfig.example.json _serverconfig.json
   ```

2. **Copy camera configurations for each user:**
   ```bash
   # Copy default/fallback config (used when no user-specific config exists)
   cp _cameraconfig.example.json _cameraconfig.json

   # Copy per-user camera configs
   cp admin.cams.example.json admin.cams.json
   cp user.cams.example.json user.cams.json
   ```

3. **Edit `_serverconfig.json`:**
   ```bash
   nano _serverconfig.json
   ```
   - Add/remove users as needed
   - Change passwords (IMPORTANT!)
   - Note the username for each user

4. **For EACH user, create/edit their camera file:**
   - File name MUST match username: `[username].cams.json`
   - Assign cameras specific to that user
   - Configure their grid layout (columns/rows)
   - Set their allowed controls

## Example Files Included

```
config/
├── _serverconfig.example.json      → Server settings + user accounts (TEMPLATE)
├── _cameraconfig.example.json      → Default/fallback camera config (TEMPLATE)
├── admin.cams.example.json         → Camera config for user "admin" (TEMPLATE)
├── user.cams.example.json          → Camera config for user "user" (TEMPLATE)
└── README.md                       → This file

After setup:
├── _serverconfig.json              → Your actual server config (git ignored)
├── _cameraconfig.json              → Your actual default config (git ignored)
├── admin.cams.json                 → Your actual admin cameras (git ignored)
└── user.cams.json                  → Your actual user cameras (git ignored)
```

**Notice:** The usernames `"admin"` and `"user"` in `_serverconfig.example.json` have matching template files `admin.cams.example.json` and `user.cams.example.json`. This is NOT a coincidence - it's required!

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

### Per-User Camera Files (REQUIRED!)

**Every user needs their own camera config file!**

**File Naming Convention:**
```
Username in _serverconfig.json  →  Camera config filename
─────────────────────────────────────────────────────────
"admin"                         →  admin.cams.json
"user"                          →  user.cams.json
"sarah"                         →  sarah.cams.json
"joe"                           →  joe.cams.json
```

**Structure:** Same as `_cameraconfig.json`

**Example Workflow:**

1. Add user to `_serverconfig.json`:
   ```json
   "users": [
     {"id": 100, "name": "bob", "password": "bobpass", "role": "user"}
   ]
   ```

2. Create `bob.cams.json`:
   ```bash
   cd config/
   cp user.cams.example.json bob.cams.json
   nano bob.cams.json
   ```

3. Assign Bob's cameras in `bob.cams.json`

**What Happens:**
- When Bob logs in, server automatically loads `config/bob.cams.json`
- Bob sees only HIS cameras in HIS layout
- Different users can see different cameras with different permissions

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

⚠️ **Never commit your actual configuration `.json` files to version control!**

### What's Safe to Commit (Already in the repo):
✅ `config/` directory itself
✅ `*.example.json` template files
✅ `README.md` documentation

### What's Protected by .gitignore (NEVER committed):
❌ `_serverconfig.json` - Contains user passwords
❌ `_cameraconfig.json` - Contains camera IPs and credentials
❌ `*.cams.json` - Contains your actual camera assignments and network topology

### How It Works:

The `.gitignore` file contains:
```
config/*.json          # Ignore all .json files
!config/*.example.json # But ALLOW .example.json files
```

This means:
- Template files (`.example.json`) are safe and public
- Your actual config files (`.json`) stay private and secure
- You can freely edit your configs without risk of accidentally committing secrets

**Always keep your actual configuration files (without `.example` in the name) private and secure!**

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
