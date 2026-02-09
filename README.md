# SmartCams v2.0

A real-time smart camera monitoring and control system built with Node.js, Express, and Socket.IO.

## Features

- Real-time camera feed viewing
- Camera control interface
- Multi-camera support
- Web-based control panel
- Session management
- Socket.IO for real-time communication

## Technologies

- **Backend**: Node.js, Express.js
- **Real-time Communication**: Socket.IO
- **Template Engine**: EJS
- **Session Management**: express-session

## Installation

1. Clone the repository:
```bash
git clone git@github.com:Bi7Wis3/SmartCams_v2.0.git
cd SmartCams_v2.0
```

2. Install dependencies:
```bash
npm install
```

3. Configure the server:
   - Set up your camera configurations in the `config/` directory
   - Update `serverconfig.json` with your settings

4. Start the server:
```bash
npm start
```

## Usage

Access the web interface at `http://localhost:[PORT]` (check your server configuration for the port number).

## Project Structure

- `server.js` - Main server file
- `public/` - Static assets (images, CSS, JavaScript)
- `views/` - EJS templates
- `config/` - Configuration files

## License

ISC

## Author

Bi7Wis3
