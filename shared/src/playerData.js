
export class PlayerData {
    constructor({ id, position, angles, health, weapon }) {
        this.id = id;
        this.position = position;
        this.angles = angles;
        this.health = health;
        this.weapon = weapon;
    }

    getClientUpdate() {
        return {
            id: this.id,
            position: this.position,
            angles: this.angles,
            health: this.health
        };
    }

    // Helper method to display in console
    toString() {
        return `PlayerData[${this.id}] { position = ${this.position}, position = ${this.angles}, health = ${this.health} }`;
    }
}
