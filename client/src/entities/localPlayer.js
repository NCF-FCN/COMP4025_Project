// Class for handling the local player, including controls
import { AnimationController } from "../animationController";
import { game } from "../game";
import { graphics } from "../graphics";
import { input } from "../input";
import { disposeNode } from "../map/common";
import * as THREE from '../three_legacy'
import { debugSliders } from "../ui/debugSliders";
import { setHudHP, setHudMP } from "../ui/hud";
import { playDamageEffect, setDeadUI } from "../ui/respawn";
import { DebugRay } from "./debugRay";
import { GunAwp } from "./guns/awp";
import { GunGlock } from "./guns/glock";
import { PlayerGun } from "./playerGun";

// const showDebugRays = true;
const showDebugRays = false;

export class LocalPlayer {
    height = 150;
    speed = 200;
    runSpeed = 350;
    turnSpeed = Math.PI * 0.5;
    position = new THREE.Vector3(0, 0, 100);
    positionWithOffsets = new THREE.Vector3(0, 0, 100);
    jumpHeight = 70;
    jumpOffset = 0;
    angles = new THREE.Euler(0, 0, 0, 'YXZ');
    health = 100;
    currentMp = 100;
    maxMp = 200;
    mpRunUsage = 30;
    mpJumpInstantUsage = 20;
    mpRegen = 15;

    constructor() {
        this.jumpAnimation = new AnimationController({
            duration: 1.2,
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

    get dead() {
        return this.health <= 0;
    }

    create({ loadModel, parentGroup }) {
        // model is achored to eyes
        this.model = new THREE.Group();
        parentGroup.add(this.model);
        this.model.entityType = "localPlayer";

        // Create gun entity attached to local player
        this.gunEntity = new PlayerGun(true);
        game.createEntity(this.gunEntity, this.model);

        this.gunEntity.switchWeaponInstant(new GunGlock(true));

        setTimeout(
            () => this.gunEntity.switchWeaponInstant(new GunAwp(true)),
            10000,
        )
    }

    destroy() {
        game.destroyEntity(this.gunEntity);

        this.model.traverse(disposeNode);
        this.model.parent.remove(this.model);
    }

    updateFromServer(data) {
        this.position = new THREE.Vector3(...data.position);
        this.angles = new THREE.Euler(...data.angles, 'YXZ');
        input.pitch = this.angles.x;
        input.yaw = this.angles.y;

        const lastHealth = this.health;
        this.health = data.health;
        const healthDelta = this.health - lastHealth;

        setDeadUI(this.health <= 0);
        if (healthDelta < 0) {
            playDamageEffect();
        }

        setHudHP(this.health);
    }

    connectedToServer() {
        this.gunEntity.sendWeaponToServer();
    }

    raycastCollisions(playerPosition, moveDirection, moveDistance) {
        const playerRadius = 50;

        // check at different heights
        const startOffsets = [
            new THREE.Vector3(0, 16, 0), // near ground
            new THREE.Vector3(0, this.height / 2, 0), // mid-way
            new THREE.Vector3(0, this.height, 0), // eyes
        ];

        for (let startOffset of startOffsets) {
            const origin = startOffset.add(playerPosition);

            const hits = graphics.raycastIgnore(
                origin,
                moveDirection,
                [this.model]
            );
            if (!hits.length) continue;
            const closestHit = hits[0];
            if (closestHit.distance < playerRadius + moveDistance) {
                if (showDebugRays) {
                    if (this.debugRay) {
                        try {
                            game.destroyEntity(this.debugRay);
                        } catch (e) { /* ignore errors when ray deleted itself */ }
                    }
                    this.debugRay = new DebugRay(graphics.raycaster.ray, hits, 5);

                    game.createEntity(this.debugRay);
                }
                return; // don't move
            }
        }

        playerPosition.addScaledVector(moveDirection, moveDistance);
    }

    // Called every frame 
    update(deltaTime) {
        if (this.dead) return;

        const lastPosition = this.positionWithOffsets.clone();
        const lastAngles = this.angles.clone();

        // Running and MP calculation
        const forwardAmount = input.isDown(input.Binds.Forward) - input.isDown(input.Binds.Back);
        const rightAmount = input.isDown(input.Binds.Right) - input.isDown(input.Binds.Left);

        const isRunning = this.currentMp > 0 && input.isDown(input.Binds.Run);
        if (isRunning) {
            this.currentMp -= this.mpRunUsage * deltaTime;
            if (this.currentMp < 0) this.currentMp = 0;
        } else {
            this.currentMp += this.mpRegen * deltaTime;
            if (this.currentMp > this.maxMp) this.currentMp = this.maxMp;
        }

        // Input Position
        if (Math.abs(forwardAmount) + Math.abs(rightAmount) > 0) {
            const speed = isRunning ? this.runSpeed : this.speed;
            const direction = this.forward.clone().multiplyScalar(forwardAmount).addScaledVector(this.right, rightAmount).normalize();

            this.raycastCollisions(this.position, direction, speed * deltaTime);
        }

        // Jump
        const isOnGround = !this.jumpAnimation.running;
        if (isOnGround && this.currentMp > this.mpJumpInstantUsage && input.isDown(input.Binds.Jump)) {
            this.jumpAnimation.start();
            this.currentMp -= this.mpJumpInstantUsage
        }

        this.jumpAnimation.update(deltaTime);
        this.positionWithOffsets = this.position.clone();
        this.positionWithOffsets.addScaledVector(this.up, this.jumpOffset);

        // Input Angles
        this.angles.x = input.pitch;
        this.angles.y = input.yaw;

        // Apply to model
        const eyesPosition = this.positionWithOffsets.clone().addScaledVector(this.up, this.height);
        if (!input.isDown(input.Binds.DebugFreezePlayer)) {
            this.debugFreeze = true;
            this.model.position.set(eyesPosition.x, eyesPosition.y, eyesPosition.z);
            this.model.quaternion.setFromEuler(this.angles);
        }

        // Apply to camera
        camera.position.set(eyesPosition.x, eyesPosition.y, eyesPosition.z);
        camera.quaternion.setFromEuler(this.angles);

        // Apply hud MP
        setHudMP(this.currentMp);

        // Send to server
        const positionChanged = lastPosition.distanceToSquared(this.positionWithOffsets) > 0.001;
        const anglesChanged = (Math.abs(lastAngles.x - this.angles.x) + Math.abs(lastAngles.y - this.angles.y)) > 0.001;

        if (positionChanged || anglesChanged) {
            game.emit("move", {
                position: this.position.toArray(),
                angles: this.angles.toArray().slice(0, 3),
            });
        }
    }
}