const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the project directory
app.use(express.static(__dirname));

// Route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const players = {};

class Player {
    
}

io.on('connection', (socket) => {
    console.log('A user connected');
    players[socket.id] = {
        x: 0,
        y: 0,
        health: 100
    };

    socket.on('disconnect', () => {
        console.log('User disconnected');
        delete players[socket.id];
    });

    socket.on('move', (data) => {
        if (players[socket.id]) {
            players[socket.id].x = data.x;
            players[socket.id].y = data.y;
            io.emit('playerMoved', {id: socket.id, x: data.x, y: data.y});
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});