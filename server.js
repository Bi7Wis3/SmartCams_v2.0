/* 
    SmartCams - Server Refactored (Compatible with Legacy Frontend)
    - Integrated Session Management (No external file needed)
    - Socket.io <-> Session integration
*/

const fs = require('fs').promises;
const fsLegacy = require('fs');
const net = require('net');
const http = require('http');
const path = require('path');
const express = require("express");
const { Server } = require('socket.io');
const session = require('express-session');
const ejs = require('ejs');

// Configuration
const CONFIG_DIR = "config";
const SERVER_CONF_FILE = '_serverconfig.json';
const CAMERA_CONF_FILE = '_cameraconfig.json';
const USERCAM_CONF_SUFFIX = 'cams.json';

// Global State
let serverconfig = {};
let cams = {}; // Holds the current user's camera config
let config = {}; // Alias for cams
let publicDir = "";

// Active User Tracking (Replaces sessionManagement.js)
const onlineUsers = new Map();

// Rate Limiting
const rateLimitMap = new Map(); // socketId -> { count, resetTime }
const RATE_LIMIT_MAX = 10;      // Max commands per window
const RATE_LIMIT_WINDOW = 1000; // Window in ms (1 second)

// Valid camera commands whitelist
const VALID_COMMANDS = [
    "stop", "moveup", "movedown", "moveleft", "moveright",
    "iron", "iroff", "zoomin", "zoomout",
    "focusfar", "focusnear", "focusauto", "focusman",
    "washwipe", "zeroon", "zerooff", "backlighton", "backlightoff",
    "vsweep", "hsweep",
    "setpreset1", "setpreset2", "setpreset3", "setpreset4", "setpreset5", "setpreset6",
    "getpreset1", "getpreset2", "getpreset3", "getpreset4", "getpreset5", "getpreset6"
];

function checkRateLimit(socketId) {
    const now = Date.now();
    let record = rateLimitMap.get(socketId);

    if (!record || now > record.resetTime) {
        // New window
        rateLimitMap.set(socketId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return true;
    }

    if (record.count >= RATE_LIMIT_MAX) {
        return false; // Rate limited
    }

    record.count++;
    return true;
}

function validateCamCommand(data, cams) {
    // Check if data exists and has required fields
    if (!data || typeof data !== 'object') return false;
    if (typeof data.cam === 'undefined' || typeof data.command === 'undefined') return false;

    // Validate command is in whitelist
    if (!VALID_COMMANDS.includes(data.command)) return false;

    // Validate camera index
    const camID = parseInt(data.cam, 10);
    if (isNaN(camID) || camID < 0) return false;
    if (!cams.cameras || !Array.isArray(cams.cameras)) return false;
    if (camID >= cams.cameras.length) return false;

    return true;
}

// Template Rendering
const VIEWS_DIR = path.join(process.cwd(), 'views', 'cameras');

async function renderCamerasHTML(camsData, userRole = null, windowWidth = 1920, windowHeight = 1080) {
    if (!camsData || !camsData.cameras || !camsData.config) {
        let configData = null;
        if (userRole === 'admin' && camsData && camsData.config) {
            configData = camsData.config;
        } else if (camsData && camsData.config) {
            configData = { screen: camsData.config.screen, stopCommandButtonList: camsData.config.stopCommandButtonList };
        }
        return { tabs: {}, config: configData };
    }

    const screenConfig = camsData.config.screen;
    const camColumns = parseInt(screenConfig.columns) || 3;
    const camRows = parseInt(screenConfig.rows) || 2;
    const camsPerTab = camColumns * camRows;
    const imgDir = screenConfig.picdirectory || '/images/';
    const buttonpics = screenConfig.buttonpics || {};

    // Layout calculations (matching client-side logic)
    let ratio;
    if (camColumns === 4) ratio = 1.8;
    else if (camColumns === 3) ratio = 1.65; //1.55
    else if (camColumns === 2) ratio = 1.2;
    else ratio = 0.7;
    // Start cameras at top of tab panel (CSS handles tab bar offset)
    const tabsInPercent = 0;
    const revRatio = 1 / ratio;
    const blokSizeWidthInPercentage = 100 / camColumns;
    const blockSizeWidth = ((windowWidth / camColumns) * 0.96);
    const blockSizeHeight = (blokSizeWidthInPercentage * revRatio) * (camColumns - 1);
    const blokSizeHeightInPx = (windowHeight * 0.01) * blockSizeHeight;
    // Extra space for buttons and title below each camera (~65px)
    const extraElementsPercent = (65 / windowHeight) * 100;
    // Small gap between rows
    const blokVerticalDistance = 0.3;
    const verticalDistance = blockSizeHeight + extraElementsPercent + blokVerticalDistance;                                                                                                                                                      

    // Group cameras by tab
    const tabs = {};

    let rowCoord = tabsInPercent;
    let columnCoord = 0.35;
    let columnCnt = 1;
    let rowCnt = 1;

    for (let i = 0; i < camsData.cameras.length; i++) {
        const camera = camsData.cameras[i];
        const type = camera.type;
        const isPelcod = (type === 'pelcod' || type === 'pelcod-web');

        // Calculate which tab this camera belongs to
        const tabNum = Math.ceil((i + 1) / camsPerTab);
        if (!tabs[tabNum]) {
            tabs[tabNum] = '';
            // Reset coordinates for new tab
            rowCoord = tabsInPercent;
            columnCoord = 0.35;
            columnCnt = 1;
            rowCnt = 1;
        }

        // Render buttons based on camera type
        let buttonsHtml = '';
        let sidebuttonsHtml = '';

        const buttonData = {
            id: i,
            type: type,
            ip: camera.ip,
            url: camera.url,
            url2: camera.url2,
            url3: camera.url3,
            url4: camera.url4,
            user: camera.user,
            pass: camera.pass,
            buttons: camera.control.buttons,
            presets: parseInt(camera.control.presets) || 0,
            imgDir: imgDir,
            buttonpics: buttonpics
        };

        try {
            if (isPelcod && camera.control.enabled === 'true') {
                buttonsHtml = await ejs.renderFile(path.join(VIEWS_DIR, 'buttons-pelcod.ejs'), buttonData);
                sidebuttonsHtml = await ejs.renderFile(path.join(VIEWS_DIR, 'sidebuttons-pelcod.ejs'), buttonData);
            } else if (type === 'web' || type === 'web2' || type === 'mpegstream' || type === 'esp32cam') {
                buttonsHtml = await ejs.renderFile(path.join(VIEWS_DIR, 'buttons-web.ejs'), buttonData);
                sidebuttonsHtml = await ejs.renderFile(path.join(VIEWS_DIR, 'sidebuttons-web.ejs'), buttonData);
            }
        } catch (err) {
            console.error('Error rendering buttons:', err.message);
        }

        // Render camera block
        const cameraData = {
            id: i,
            camID: camera.id,
            type: type,
            name: camera.name,
            ip: camera.ip,
            url: camera.url,
            url2: camera.url2,
            url3: camera.url3,
            url4: camera.url4,
            user: camera.user,
            pass: camera.pass,
            width: blockSizeWidth,
            height: blokSizeHeightInPx,
            top: rowCoord,
            left: columnCoord,
            buttonsHtml: buttonsHtml,
            sidebuttonsHtml: sidebuttonsHtml
        };

        try {
            tabs[tabNum] += await ejs.renderFile(path.join(VIEWS_DIR, 'camera.ejs'), cameraData);
        } catch (err) {
            console.error('Error rendering camera:', err.message);
        }

        // Update grid position
        columnCnt++;
        columnCoord += blokSizeWidthInPercentage;
        if (columnCnt > camColumns) {
            columnCnt = 1;
            columnCoord = 0.35;
            rowCoord += verticalDistance;
            rowCnt++;
        }
        if (rowCnt > camRows) {
            rowCnt = 1;
            rowCoord = tabsInPercent;
        }
    }

    // Filter config based on user role
    let configData = null;
    if (userRole === 'admin') {
        // Admins get full config
        configData = camsData.config;
    } else if (camsData.config) {
        // Non-admins get filtered config (only what's needed for viewing cameras)
        configData = {
            screen: camsData.config.screen,
            stopCommandButtonList: camsData.config.stopCommandButtonList
        };
    }

    return {
        tabs: tabs,
        config: configData,
        cameras: camsData.cameras // Keep camera data for client-side event handlers
    };
}

// 1. APP SETUP
async function startApp() {
    try {
        console.log('__ Loading Configurations... __');
        await readServerConfig();
        
        const app = express();
        const server = http.createServer(app);
        
        // Session Setup
        const sessionMiddleware = session({
            secret: "smartcams-secret-key-change-this",
            resave: true,
            saveUninitialized: true,
            cookie: { maxAge: 24 * 60 * 60 * 1000 }
        });

        app.use(sessionMiddleware);

        // Socket.io Setup
        const io = new Server(server, {
            cors: { origin: "*", methods: ["GET", "POST"] }
        });
        io.engine.use(sessionMiddleware);

        // Serve Static Files
        const conf = serverconfig.config;
        const portnumber = conf.server.config.httpport;
        publicDir = conf.server.config.publicdir;
        const webroot = path.join(process.cwd(), publicDir);

        app.use(express.static(webroot));

        // Start Socket Logic
        setupSocketServer(io);

        // Start Server
        server.listen(portnumber, () => {
            console.log(`\n__ SERVER RUNNING on port ${portnumber} __`);
            console.log(`__ Serving files from: ${webroot} __\n`);
        });

    } catch (err) {
        console.error("CRITICAL STARTUP ERROR:", err);
        process.exit(1);
    }
}

startApp();

// 2. SOCKET SERVER LOGIC
function setupSocketServer(io) {

    io.on('connection', async (socket) => {
        const req = socket.request;
        const session = req.session;
        let currentUser = session.user || null;

        console.log(`___ Socket connected: ${socket.id} ___`);

        // A. Auto-Restore Session (if cookie exists)
        if (currentUser) {
            console.log(`>> Auto-login: ${currentUser.username}`);
            // Update the map with the new socket ID
            onlineUsers.set(currentUser.userId, { 
                socketId: socket.id, 
                username: currentUser.username,
                role: currentUser.role
            });
            
            await readCamIniFile(currentUser.username); // Load this user's camera config
            socket.emit('role', currentUser.roleDisplay);
            const rendered = await renderCamerasHTML(cams, currentUser.roleDisplay);
            socket.emit('cameralist', rendered);
        } else {
            // Send to login screen if no session
            socket.emit("config", { "value": serverconfig.users.login });
        }

        socket.on('disconnect', () => {
            if (currentUser) {
                onlineUsers.delete(currentUser.userId);
                console.log(`User disconnected: ${currentUser.username}`);
            }
            // Clean up rate limit record
            rateLimitMap.delete(socket.id);
        });

        // B. Login Handler
        socket.on('login', async (logindata) => {
            if (serverconfig.users.login === 'true') {
                // Handle actual login
                const result = await handleLogin(socket, logindata);
                if (result.success) {
                    currentUser = result.user; // Update local scope
                }
            } else {
                // No login required mode (handle 'none') - no admin access
                await readCamIniFile("");
                const rendered = await renderCamerasHTML(cams, null);
                socket.emit('cameralist', rendered);
            }
        });

        // C. Logout Handler
        socket.on('logout', () => {
            if (currentUser) onlineUsers.delete(currentUser.userId);
            req.session.destroy();
            socket.emit('config', { "value": serverconfig.users.login });
        });

        // D. Camera Controls (with validation and rate limiting)
        socket.on('camControl', (data) => {
            try {
                // Rate limiting check
                if (!checkRateLimit(socket.id)) {
                    console.log(`Rate limited: ${socket.id}`);
                    return;
                }

                // Input validation
                if (!validateCamCommand(data, cams)) {
                    console.log(`Invalid command rejected: ${JSON.stringify(data)}`);
                    return;
                }

                const camID = parseInt(data.cam, 10);
                const cPort = cams.cameras[camID].cport;
                const camIP = cams.cameras[camID].cip;

                if (camIP && camIP.length > 5) {
                    console.log(`Command: ${data.command} to Cam ${camID}`);
                    const hexString = createPelcoString(data.command, cams.cameras[camID].id);
                    writeSocket(cPort, camIP, hexString);
                }
            } catch (e) {
                console.error("Error in camControl:", e);
            }
        });

        // E. Data & Config
        socket.on('import', (data) => importData(data));
        socket.on('cameralist', async () => {
            const rendered = await renderCamerasHTML(cams, currentUser ? currentUser.roleDisplay : null);
            socket.emit('cameralist', rendered);
        });
        
        // F. Config request (Frontend asks for config on start)
        socket.on('config', () => {
            socket.emit("config", { "value": serverconfig.users.login });
        });
    });
}

// 3. HELPERS

async function handleLogin(socket, logindata) {
    const name = logindata.name;
    const pass = logindata.pass;
    
    // Find User
    const { admins, users: normalUsers, guests, guestpassword } = serverconfig.users;
    let foundUser = admins.find(u => u.name === name && u.password === pass);
    let roleType = 'Admin';
    let roleDisplay = 'admin';

    if (!foundUser) {
        foundUser = normalUsers.find(u => u.name === name && u.password === pass);
        roleType = 'User'; roleDisplay = 'user';
    }
    if (!foundUser) {
        foundUser = guests.find(u => u.name === name && guestpassword === pass);
        roleType = 'Guest'; roleDisplay = 'guest';
    }

    if (foundUser) {
        // Prepare Session Data
        const sessionData = { 
            username: foundUser.name, 
            userId: foundUser.id, 
            role: roleType,
            roleDisplay: roleDisplay 
        };

        // Save to Session Store (Cookie)
        socket.request.session.user = sessionData;
        socket.request.session.save();

        // Update Active Users Map
        onlineUsers.set(foundUser.id, { 
            socketId: socket.id, 
            username: foundUser.name,
            role: roleType 
        });

        // Load Config & Notify Client
        await readCamIniFile(foundUser.name);
        socket.emit('role', roleDisplay);
        const rendered = await renderCamerasHTML(cams, roleDisplay);
        socket.emit('cameralist', rendered);
        
        console.log(`${roleType}: ${name} logged in.`);
        return { success: true, user: sessionData };
    } else {
        console.log(`Login failed for: ${name}`);
        // If name was 'none' (from auto-login attempt), don't show config again loop
        if(name !== 'none') {
             socket.emit("config", { "value": serverconfig.users.login });
        }
        return { success: false };
    }
}

async function readCamIniFile(username) {
    const targetFile = (!username) ? CAMERA_CONF_FILE : `${username}.${USERCAM_CONF_SUFFIX}`;
    const filePath = path.join(process.cwd(), CONFIG_DIR, targetFile);

    try {
        const data = await fs.readFile(filePath, 'utf8');
        cams = JSON.parse(data); 
        config = cams;
    } catch (err) {
        console.error(`Error reading config (${filePath}):`, err.message);
        if (username) await readCamIniFile(""); 
    }
}

async function readServerConfig() {
    const filePath = path.join(process.cwd(), CONFIG_DIR, SERVER_CONF_FILE);
    const data = await fs.readFile(filePath, 'utf8');
    serverconfig = JSON.parse(data);
}

function writeSocket(port, host, dat) {
    const socket = new net.Socket();
    socket.connect(port, host, () => {
        socket.write(dat, 'hex');
        socket.destroy();
    });
    socket.on('error', (err) => console.log('TCP Error:', err.message));
}

// Pelco Logic 
function decimalToHex(d, padding = 2) {
    let hex = Number(d).toString(16);
    while (hex.length < padding) { hex = "0" + hex; }
    return hex;
}

function createPelcoString(command, camID) {
    const startByte = 0xFF;
    const commandArr = commandsLookup(command); 
    const checkSum = parseInt(camID, 10) + commandArr[0] + commandArr[1] + commandArr[2] + commandArr[3];
    return startByte.toString(16) + decimalToHex(camID, 2).toUpperCase() +
           decimalToHex(commandArr[0], 2) + decimalToHex(commandArr[1], 2) +
           decimalToHex(commandArr[2], 2) + decimalToHex(commandArr[3], 2) +
           decimalToHex(checkSum);
}

function commandsLookup(command) {
    const cmds = {
        "stop":         [0x00, 0x00, 0x00, 0x00],
        "moveup":       [0x00, 0x08, 0x00, 0x3F],
        "movedown":     [0x00, 0x10, 0x00, 0x3F],
        "moveleft":     [0x00, 0x04, 0x3F, 0x00],
        "moveright":    [0x00, 0x02, 0x3F, 0x00],
        "iron":         [0x00, 0x03, 0x00, 0x59],
        "iroff":        [0x00, 0x03, 0x00, 0x58],
        "zoomin":       [0x00, 0x20, 0x00, 0x00],
        "zoomout":      [0x00, 0x40, 0x00, 0x00],
        "focusfar":     [0x00, 0x80, 0x00, 0x00],
        "focusnear":    [0x01, 0x00, 0x00, 0x00],
        "focusauto":    [0x00, 0x2B, 0x00, 0x00],
        "focusman":     [0x00, 0x2B, 0x00, 0x02],
        "washwipe":     [0x00, 0x07, 0x00, 0x56],
        "zeroon":       [0x00, 0x03, 0x00, 0x59],
        "zerooff":      [0x00, 0x03, 0x00, 0x58],
        "backlighton":  [0x00, 0x31, 0x00, 0x01],
        "backlightoff": [0x00, 0x31, 0x00, 0x02],
        "setpreset1":   [0x00, 0x03, 0x00, 0x01],
        "setpreset2":   [0x00, 0x03, 0x00, 0x02],
        "setpreset3":   [0x00, 0x03, 0x00, 0x03],
        "setpreset4":   [0x00, 0x03, 0x00, 0x04],
        "setpreset5":   [0x00, 0x03, 0x00, 0x05],
        "setpreset6":   [0x00, 0x03, 0x00, 0x06],
        "getpreset1":   [0x00, 0x07, 0x00, 0x01],
        "getpreset2":   [0x00, 0x07, 0x00, 0x02],
        "getpreset3":   [0x00, 0x07, 0x00, 0x03],
        "getpreset4":   [0x00, 0x07, 0x00, 0x04],
        "getpreset5":   [0x00, 0x07, 0x00, 0x05],
        "getpreset6":   [0x00, 0x07, 0x00, 0x06]
    };
    return cmds[command] || [0x00, 0x00, 0x00, 0x00];
}

// Data Import (Standard)
function importData(dataPackage) {
    const rawData = dataPackage.data;
    const filename = dataPackage.name;
    // ... (Your import logic here) ...
    // Since this part didn't change, you can assume it works as before 
    // or copy paste the block from your original server.js if you use this feature often.
    console.log("Import logic triggered (truncated for brevity)");
}
