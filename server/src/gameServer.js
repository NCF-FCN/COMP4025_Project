const { PlayerData } = require("shared");

class GameServer {
    constructor() {
        this.gameInfo = {
            map: 'warehouse',
        };
        this.spawnPoints = [
            [0, 0, 100],
            [100, 0, 100],
            [100, 0, 200],
            [0, 0, 200],
        ];
        this.nextSpawnPoint = 0;
        this.players = {};
    }

    log(...args) {
        console.log("[GameServer]", ...args);
    }

    getNextSpawnPosition() {
        const point = this.spawnPoints[this.nextSpawnPoint];
        this.nextSpawnPoint = (this.nextSpawnPoint + 1) % this.spawnPoints.length;
        return point;
    }

    onIncomingConnection(socket) {
        const thisPlayerData = this.players[socket.id] = new PlayerData({ 
            id: socket.id, 
            position: this.getNextSpawnPosition(),
            angles: [0, 0, 0],
            health: 100,
        });
        
        this.log(`A user connected: ${thisPlayerData}`);

        // socket.emit('gameInfo', gameInfo);
        

        // Send respawn to connecting player
        socket.emit('respawn', thisPlayerData);

        // Send playerConnected of other existing players to connecting player
        for(let data of Object.values(this.players)) {
            if(data.id !== socket.id) {
                socket.emit('playerConnected', data);
            }
        }

        // Send playerConnected to other players
        socket.broadcast.emit('playerConnected', thisPlayerData);

        socket.on('disconnect', () => {
            this.log('User disconnected');
            socket.broadcast.emit('playerDisconnected', {id: socket.id});
            delete this.players[socket.id];
        });

        socket.on('move', (data) => {
            thisPlayerData.position = data.position;
            thisPlayerData.angles = data.angles;
            socket.broadcast.emit('playerMoved', thisPlayerData);
        });
    }
}

module.exports = { GameServer }
