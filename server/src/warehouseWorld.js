
class WarehouseWorld {
    constructor() {
        this.spawnPoints = [
            [-300, 0, 1500],
            [-620, 0, -1400]
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
