
class Player {

  constructor(world, socket, data) {
    this.world = world;
    this.socket = socket;
    this.data = data;
  }

  log(...args) {
      console.log(`[Player ${this.data.id}]`, ...args);
  }

  moveTo({ position, angles }, informSelf = true) {
    if(position) this.data.position = position;
    if(angles) this.data.angles = angles;
    this.broadcastPlayerUpdate(informSelf);
  }

  applyDamage(damage) {
    if(!(damage > 0)) {
      this.log(`applyDamage invalid damage:`, damage);
      return;
    }
    this.data.health -= damage;

    if(this.data.health <= 0) {
      this.data.health = 0;
      this.kill();
    }else{
      this.sendPlayerSelfUpdate();
    }
  }

  kill() {
    this.respawn();
  }

  respawn() {
    this.data.health = 100;
    this.moveTo({
      position: this.world.getNextSpawnPosition(),
      angles: [0, 0, 0]
    });
  }

  // Network

  broadcastPlayerUpdate(alsoSendSelfUpdate) {
    this.socket.broadcast.emit('playerUpdate', this.data);
    if(alsoSendSelfUpdate) {
      this.sendPlayerSelfUpdate()
    }
  }

  sendPlayerSelfUpdate() {
    this.socket.emit('playerSelfUpdate', this.data);
  }
}

module.exports = Player;
