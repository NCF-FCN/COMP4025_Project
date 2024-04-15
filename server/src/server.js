const express = require('express');
const http = require('http');
var cors = require('cors')
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);

const clientDistPath = path.join(__dirname, "..", "..", "client", "dist");

// Serve static files from the project directory
app.use(express.static(clientDistPath));

// Use CORS headers
app.use(cors())

// Use websocket server
const io = new Server(server, {
    allowEIO3: true,
    cors: { 
        origin: '*'
    }
});

// Route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// test import from shared project
const { PlayerData } = require('shared')
console.log(PlayerData)
const playerData = new PlayerData(null, 123);
console.log(playerData.toString())

const players = {};

class Player {
    
}

const gameInfo = {
    map: 'warehouse',
}

io.on('connection', (socket) => {
    console.log('A user connected');
    players[socket.id] = {
        x: 0,
        y: 0,
        health: 100
    };

    socket.broadcast.emit('playerConnected', {id: socket.id});

    socket.emit('gameInfo', gameInfo);

    socket.on('disconnect', () => {
        console.log('User disconnected');
        socket.broadcast.emit('playerDisconnected', {id: socket.id});
        delete players[socket.id];
    });

    socket.on('move', (data) => {
        if (players[socket.id]) {
            players[socket.id].x = data.x;
            players[socket.id].y = data.y;
            socket.broadcast.emit('playerMoved', {id: socket.id, x: data.x, y: data.y});
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Serving files from ${clientDistPath}`);
});