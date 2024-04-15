
// Class for handling the local player, including controls

import { game } from "../game";
import { input } from "../input";

import THREE from '../three_legacy'

export class LocalPlayer {
    height = 150; 
    speed = 3.5;
    turnSpeed = Math.PI * 0.01;

    // Called every frame
    update() {
        // todo: move camera to global game state
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);

        let positionUpdated = false;

        if (input.isDown(input.Binds.Forward)) { // W key
            camera.position.addScaledVector(direction, this.speed);
            positionUpdated = true;
        }

        if (input.isDown(input.Binds.Back)) { // S key
            camera.position.addScaledVector(direction, -this.speed);
            positionUpdated = true;
        }

        const right = new THREE.Vector3();
        right.crossVectors(camera.up, direction).normalize();

        if (input.isDown(input.Binds.Left)) { // A key
            camera.position.addScaledVector(right, this.speed);
            positionUpdated = true;
        }

        if (input.isDown(input.Binds.Right)) { // D key
            camera.position.addScaledVector(right, -this.speed);
            positionUpdated = true;
        }

        if(positionUpdated) {
            game.socket.emit("move", {
                x: camera.position.x,
                y: camera.position.z,
            });
        }
        
        // todo: use mouse instead of keys
        if (input.isDown(75)) { // K key
            camera.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.turnSpeed));
        }

        if (input.isDown(186)) { // ; key
            camera.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -this.turnSpeed));
        }

        if (input.isDown(79)) { // O key
            camera.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.turnSpeed));
        }

        if (input.isDown(76)) { // L key
            camera.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -this.turnSpeed));
        }
    }
}
