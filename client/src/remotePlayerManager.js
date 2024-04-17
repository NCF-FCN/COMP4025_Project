import { RemotePlayer } from "./entities/remotePlayer";
import { game } from "./game";


export class RemotePlayerManager {
  constructor() {
    this.players = {};
  }

  log(...args) {
    console.log("[RemotePlayerManager]", ...args);
  }

  getPlayerById(id) {
    if(!(id in this.players)) {
      this.log("getPlayerById: player doesn't exist!", id, new Error());
      return;
    }

    return this.players[id];
  }

  playerConnect(playerData) {
    if(playerData.id in this.players) {
      this.log("playerConnect: player already exists!", playerData.id);
      return;
    }

    const entity = new RemotePlayer();
    game.createEntity(entity);
    entity.setData(playerData);
    this.players[playerData.id] = entity;
    this.log("player connected:", playerData.id);
  }

  playerDisconnect({ id }) {
    const entity = this.getPlayerById(id);
    if(!entity) return;

    game.destroyEntity(entity);
    delete this.players[id];
    this.log("player disconnected:", id);
  }
  
  updateFromServer(playerData) {
    const entity = this.getPlayerById(playerData.id);
    if(!entity) return;
    
    this.players[playerData.id].setData(playerData);
  }

  weaponFire({ id }) {
    const entity = this.getPlayerById(id);
    if(!entity) return;
    entity.weaponFire();
  }
}

