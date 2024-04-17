
// Class for handling the local player, including controls

import { AnimationController } from "../animationController";
import { game } from "../game";
import { input } from "../input";
import { disposeNode } from "../map/common";

import * as THREE from '../three_legacy'
import { debugSliders } from "../ui/debugSliders";
import { setHudHP, setHudMP } from "../ui/hud";
import { GunGlock } from "./guns/glock";
import { PlayerGun } from "./playerGun";

export class LocalPlayer {
    height = 150;
    speed = 150;
    runSpeed = 300;
    turnSpeed = Math.PI * 0.5;
    position = new THREE.Vector3(0, 0, 100);
    positionWithOffsets = new THREE.Vector3(0, 0, 100);
    jumpHeight = 60;
    jumpOffset = 0;
    angles = new THREE.Euler(0, 0, 0, 'YXZ');
    health = 100;
    mp = 100;
    maxMp = 100;
    mpRunUsage = 50;
    mpJumpInstantUsage = 20;
    mpRegen = 25;

    constructor() {
        this.jumpAnimation = new AnimationController({
            duration: 0.5,
            // one way to implement custom gravity-like curve
            isTwoWay: false,
            onProgress: (progress) => {
                this.jumpOffset = Math.sin(progress * Math.PI) * this.jumpHeight 
            }
        })
    }

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
        this.gunEntity = new PlayerGun(true);
        game.createEntity(this.gunEntity, this.model);
        
        this.gunEntity.switchWeaponInstant(new GunGlock(true));
        
        // debug/test weapon switching
        setTimeout(() => {
            this.gunEntity.switchWeapon(new GunGlock(true));
        }, 10000);
    }

    destroy() {
        game.destroyEntity(this.gunEntity);

        this.model.traverse(disposeNode);
        this.model.parent.remove(this.model);
    }

    updateFromServer(data) {
        this.position = new THREE.Vector3(...data.position);
        this.angles = new THREE.Euler(...data.angles, 'YXZ');
        this.health = data.health;
        setHudHP(this.health);
    }

    // Called every frame 
    update(deltaTime) {
        const lastPosition = this.positionWithOffsets.clone();
        const lastAngles = this.angles.clone();

        // Running and MP calculation

        const forwardAmount = input.isDown(input.Binds.Forward) - input.isDown(input.Binds.Back);
        const rightAmount = input.isDown(input.Binds.Right) - input.isDown(input.Binds.Left);

        const canRun = this.mp > 0;
        const runPressed = input.isDown(input.Binds.Run);
        const isRunning = canRun && runPressed;

        if(isRunning) {
            this.mp -= this.mpRunUsage * deltaTime;
            if(this.mp < 0) this.mp = 0;
        }else if(!runPressed) {
            this.mp += this.mpRegen * deltaTime;
            if(this.mp > this.maxMp) this.mp = this.maxMp;
        }

        // Input Position

        const speed = isRunning ? this.runSpeed : this.speed;

        this.position.addScaledVector(this.forward, forwardAmount * speed * deltaTime);
        this.position.addScaledVector(this.right, rightAmount * speed * deltaTime);
        
        // Jump

        const isOnGround = !this.jumpAnimation.running;
        const canJump = isOnGround && this.mp > this.mpJumpInstantUsage;

        if(canJump && input.isDown(input.Binds.Jump)) {
            this.jumpAnimation.start();
            this.mp -= this.mpJumpInstantUsage
        }

        this.jumpAnimation.update(deltaTime);

        this.positionWithOffsets = this.position.clone();    
        this.positionWithOffsets.addScaledVector(this.up, this.jumpOffset);

        // Input Angles

        this.angles.x = input.pitch;
        this.angles.y = input.yaw;

        // Apply to model

        const eyesPosition = this.positionWithOffsets.clone().addScaledVector(this.up, this.height);
        // view model should be fixed to eyes
        this.model.position.set(eyesPosition.x, eyesPosition.y, eyesPosition.z);
        this.model.quaternion.setFromEuler(this.angles);

        // Apply to camera

        camera.position.set(eyesPosition.x, eyesPosition.y, eyesPosition.z);
        camera.quaternion.setFromEuler(this.angles);

        // Apply hud MP

        setHudMP(this.mp);

        // Send to server
        
        const positionChanged = lastPosition.distanceToSquared(this.positionWithOffsets) > 0.001;
        const anglesChanged = (Math.abs(lastAngles.x - this.angles.x) + Math.abs(lastAngles.y - this.angles.y)) > 0.001;

        if(positionChanged || anglesChanged) {
            game.emit("move", {
                position: this.position.toArray(),
                angles: this.angles.toArray().slice(0, 3),
            });
        }
    }
}
