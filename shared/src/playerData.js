
export class PlayerData {
    constructor(position, health) {
        this.name = "UNNAMED";
        this.position = position;
        this.health = health;
    }

    // Helper method to display in console
    toString() {
        return `PlayerData[${this.name}] { position = ${this.position}, health = ${this.health} }`;
    }
}
