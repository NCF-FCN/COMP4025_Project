
export class PlayerData {
    constructor({ id, position, angles, health }) {
        this.id = id;
        this.position = position;
        this.angles = angles;
        this.health = health;
    }

    // Helper method to display in console
    toString() {
        return `PlayerData[${this.id}] { position = ${this.position}, position = ${this.angles}, health = ${this.health} }`;
    }
}
