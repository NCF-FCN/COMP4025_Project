
// Class for handling the local player, including controls

import { game } from "../game";
import { input } from "../input";
import { disposeNode } from "../map/common";

import * as THREE from '../three_legacy'
import { debugAngleSliders } from "../ui/debugSliders";
import { GunGlock } from "./gunGlock";

export class LocalPlayer {
    height = 150;
    speed = 200;
    turnSpeed = Math.PI * 0.5;
    position = new THREE.Vector3(0, 0, 100);
    angles = new THREE.Euler(0, 0, 0, 'YXZ');

    get eyesForward() {
        return new THREE.Vector3(0, 0, -1).applyEuler(this.angles);
    }
    
    // Ignore pitch, move on XZ plane
    get forward() {
        return new THREE.Vector3(0, 0, -1).applyAxisAngle(this.up, this.angles.y);
    }
    
    get right() {
        return new THREE.Vector3(1, 0, 0).applyEuler(this.angles);
    }

    // assume player never rolls, only changes pitch and yaw
    get up() {
        return new THREE.Vector3(0, 1, 0);
    }

    create({ loadModel, parentGroup }) {
        // model is achored to eyes
        this.model = new THREE.Group();
        parentGroup.add(this.model);
        
        // Create gun entity attached to local player
        this.gunEntity = new GunGlock(true);
        game.createEntity(this.gunEntity, this.model);
    }

    destroy() {
        game.destroyEntity(this.gunEntity);

        this.model.traverse(disposeNode);
        this.model.parent.remove(this.model);
    }

    respawn(data) {
        this.position = new THREE.Vector3(...data.position);
        this.angles = new THREE.Euler(...data.angles, 'YXZ');
    }

    // Called every frame 
    update(deltaTime) {
        const lastPosition = this.position.clone();
        const lastAngles = this.angles.clone();

        // Input Position

        const forwardAmount = input.isDown(input.Binds.Forward) - input.isDown(input.Binds.Back);
        const rightAmount = input.isDown(input.Binds.Right) - input.isDown(input.Binds.Left);

        this.position.addScaledVector(this.forward, forwardAmount * this.speed * deltaTime);
        this.position.addScaledVector(this.right, rightAmount * this.speed * deltaTime);

        // Input Angles

        const pitchAmount = input.isDown(79) - input.isDown(76); // O - L keys
        const yawAmount = input.isDown(75) - input.isDown(186);  // K - ; keys

        this.angles.x += pitchAmount * this.turnSpeed * deltaTime;
        this.angles.y += yawAmount * this.turnSpeed * deltaTime;

        // Apply to model

        const eyesPosition = this.position.clone().addScaledVector(this.up, this.height);
        // view model should be fixed to eyes
        this.model.position.set(eyesPosition.x, eyesPosition.y, eyesPosition.z);
        this.model.quaternion.setFromEuler(this.angles);

        // Apply to camera

        camera.position.set(eyesPosition.x, eyesPosition.y, eyesPosition.z);
        camera.quaternion.setFromEuler(this.angles);

        // Send to server
        
        const positionChanged = lastPosition.distanceToSquared(this.position) > 0.001;
        const anglesChanged = (Math.abs(lastAngles.x - this.angles.x) + Math.abs(lastAngles.y - this.angles.y)) > 0.001;

        if(positionChanged || anglesChanged) {
            game.emit("move", {
                position: this.position.toArray(),
                angles: this.angles.toArray().slice(0, 3),
            });
        }
    }
}
