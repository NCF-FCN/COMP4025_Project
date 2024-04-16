import { RemotePlayer } from "./entities/remotePlayer";
import { game } from "./game";


export class RemotePlayerManager {
    constructor() {
        this.players = {};
    }

    log(...args) {
        console.log("[RemotePlayerManager]", ...args);
    }

    playerConnect(playerData) {
        if (playerData.id in this.players) {
            this.log("playerConnect: player already exists!", playerData.id);
            return;
        }

        const entity = new RemotePlayer();
        entity.setData(new PlayerData(playerData));
        game.createEntity(entity);
        this.players[playerData.id] = entity;
        this.log("player connected:", playerData.id);
    }

    playerDisconnect({ id }) {
        if (!(id in this.players)) {
            this.log("playerDisconnected: player doesn't exist!", id);
            return;
        }

        const entity = this.players[id];
        game.destroyEntity(entity);
        delete this.players[id];
        this.log("player disconnected:", id);
    }

    playerMove(playerData) {
        if (!(playerData.id in this.players)) {
            this.log("playerMove: player doesn't exist!", playerData.id);
            return;
        }

        this.players[playerData.id].setData(new PlayerData(playerData));
    }
}

