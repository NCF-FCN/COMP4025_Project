
// Global game instance
// keeps track of current loaded map, local player, and any global state

import { LocalPlayer } from "./entities/localPlayer";
import { Connection } from "./network/Connection";

class Game {
  // todo: move three.js renderer, camera etc here
  constructor() {
    this.map = null;
    this.connection = null;
    this.socket = null;
    this.localPlayer = new LocalPlayer();
  }

  changeWorld(map) {
    // todo: move map loading here, right now warehouse is loaded only
    if(this.map) {
      this.map.unload(this);
    }
    this.map = map;
    this.map.load(this);
  }

  disconnect() {
    if(this.connection) {
      this.connection.dispose();
      this.connection = null;
    }
  }

  connect(address) {
    this.disconnect();
    this.connection = new Connection(this, address);
  }

  onConnectionCreated(socket) {
    this.socket = socket;

    socket.on("gameInfo", data => {
      console.log("[GAME] Socket message gameInfo:", data);
      // todo: load map given by server
    });

    socket.on("playerConnected", data => {
      console.log("[GAME] Socket message playerConnected:", data);
      if(socket.id === data.id) {
        console.log("[GAME] This is our own connection!");
      }
    });

    socket.on("playerDisconnected", data => {
      console.log("[GAME] Socket message playerDisconnected:", data);
    });

    socket.on("playerMoved", data => {
      console.log("[GAME] Socket message playerMoved:", data);
    });
  }
}

const game = new Game();

export { game };
