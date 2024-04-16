const express = require('express');
const http = require('http');
var cors = require('cors')
const { Server } = require('socket.io');
const path = require('path');
const { GameServer } = require('./gameServer');

const app = express();
const server = http.createServer(app);

const clientDistPath = path.join(__dirname, "..", "..", "client", "dist");

// Serve static files from the project directory
app.use(express.static(clientDistPath));

// Use CORS headers
app.use(cors())

// Use websocket server
const io = new Server(server, {
    cors: { 
        origin: '*'
    }
});

// Route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
});

const gameServer = new GameServer();

io.on('connection', (socket) => {
    gameServer.onIncomingConnection(socket);
});

const PORT = 3001;
const HOST_INTERFACE = '0.0.0.0'
server.listen(PORT, HOST_INTERFACE, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Serving files from ${clientDistPath}`);
});
