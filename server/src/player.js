
class Player {

  constructor(world, socket, data) {
    this.world = world;
    this.socket = socket;
    this.data = data;
  }

  log(...args) {
      console.log(`[Player ${this.data.id}]`, ...args);
  }

  moveTo({ position, angles }, informSelf = true, dontBroadcast = false) {
    if(position) this.data.position = position;
    if(angles) this.data.angles = angles;
    if(!dontBroadcast) {
      this.broadcastPlayerUpdate(informSelf);
    }
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
    }
    this.sendPlayerSelfUpdate();
  }

  kill() {
    this.broadcastDeath();
  }

  respawn(dontBroadcast = false) {
    this.data.health = 100;
    this.moveTo({
      position: this.world.getNextSpawnPosition(),
      angles: [0, 0, 0]
    }, true, dontBroadcast);
  }
  
  weaponChange(weapon) {
    this.data.weapon = weapon;
    this.broadcastWeaponChange();
  }

  // Network

  broadcastWeaponChange() {
    this.socket.broadcast.emit('weaponChange', {
      id: this.data.id,
      weapon: this.data.weapon,
    })
  }

  broadcastDeath() {
    this.socket.broadcast.emit('playerDeath', {
      id: this.data.id,
    })
  }

  broadcastPlayerUpdate(alsoSendSelfUpdate) {
    this.socket.broadcast.emit('playerUpdate', this.data.getClientUpdate());
    if(alsoSendSelfUpdate) {
      this.sendPlayerSelfUpdate()
    }
  }

  sendPlayerSelfUpdate() {
    this.socket.emit('playerSelfUpdate', this.data.getClientUpdate());
  }
}

module.exports = Player;
