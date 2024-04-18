const { PlayerData } = require("shared");
const Player = require("./player");
const { WarehouseWorld } = require("./warehouseWorld");

class GameServer {
    constructor() {
        this.gameInfo = {
            map: 'warehouse',
        };
        this.world = new WarehouseWorld();
        this.players = {};
    }

    log(...args) {
        console.log("[GameServer]", ...args);
    }

    getPlayerById(id) {
        if(!(id in this.players)) {
            this.log(`getPlayerById invalid id:`, id);
            return null;
        }
        return this.players[id];
    }

    onIncomingConnection(socket) {
        const thisPlayer = this.players[socket.id] = new Player(
            this.world,
            socket,
            new PlayerData({ 
                id: socket.id,
            }),
        );
        
        this.log(`A user connected: ${thisPlayer.data.id}`);

        // Initialize this player
        thisPlayer.respawn(true);

        // Send playerConnected of other existing players to connecting player
        for(let { data } of Object.values(this.players)) {
            if(data.id !== socket.id) {
                socket.emit('playerConnected', data);
            }
        }
        // Send playerConnected to other players
        socket.broadcast.emit('playerConnected', thisPlayer.data);

        thisPlayer.sendPlayerSelfUpdate();

        socket.on('disconnect', () => {
            this.log('User disconnected', thisPlayer.data.id);
            socket.broadcast.emit('playerDisconnected', {id: socket.id});
            delete this.players[socket.id];
        });

        socket.on('move', (data) => {
            // fields: position, angles
            thisPlayer.moveTo({
                position: data.position,
                angles: data.angles
            }, false);
        });
        
        socket.on('respawn', () => {
            thisPlayer.respawn();
        });

        socket.on('weaponFire', (data) => {
            socket.broadcast.emit('weaponFire', {
                id: thisPlayer.data.id,
            })
        });

        socket.on('weaponChange', (data) => {
            thisPlayer.data.weapon = data.weapon;
            thisPlayer.weaponChange(data.weapon);
        });

        socket.on('bulletHit', (data) => {
            // fields: target, damage
            const target = this.getPlayerById(data.target);
            target.applyDamage(data.damage);
        });
    }
}

module.exports = { GameServer }
