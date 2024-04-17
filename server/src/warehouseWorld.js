
class WarehouseWorld {
  constructor() {
    this.spawnPoints = [
      [0, 0, 100],
      [100, 0, 100],
      [100, 0, 200],
      [0, 0, 200],
    ];
    this.nextSpawnPoint = 0;
  }

  getNextSpawnPosition() {
      const point = this.spawnPoints[this.nextSpawnPoint];
      this.nextSpawnPoint = (this.nextSpawnPoint + 1) % this.spawnPoints.length;
      return point;
  }
}

module.exports = { WarehouseWorld };
