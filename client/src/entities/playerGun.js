// Class for handling the local player, including controls
import { game } from "../game";
import { graphics } from "../graphics";
import { input } from "../input";
import { disposeNode } from "../map/common";
import { AnimationController } from "../animationController"
import * as THREE from '../three_legacy'
import { debugSliders } from "../ui/debugSliders";
import { setHudAmmo } from "../ui/hud";

export class PlayerGun {
    constructor(isLocalPlayer) {
        this.isLocalPlayer = isLocalPlayer;
        this.currentGun = null;
        this.scheduledReload = false;
        this.scheduledSwitchWeapon = null;
        this.weaponSwitchDuration = 1;
        this.offScreenWeaponAnimationController = new AnimationController({
            duration: this.weaponSwitchDuration / 2,
            isTwoWay: true,
            onBounce: () => {
                if (this.scheduledSwitchWeapon) {
                    this.switchWeaponInstant(this.scheduledSwitchWeapon);
                } else if (this.scheduledReload) {
                    this.setAmmoCount(this.currentGun.ammoSize);
                }
                this.scheduledSwitchWeapon = null;
                this.scheduledReload = false
            },
            onProgress: (progress) => {
                const newPosition =
                    new THREE.Vector3(0, 0, 0).lerp(
                        new THREE.Vector3(200, -25, 25),
                        progress
                    );
                this.gunGroup.position.set(newPosition.x, newPosition.y, newPosition.z);
            }
        });
        this.recoil = 0;
        this.recoilSmooth = 0;
        this.ammoCount = 0;
    }

    create({ loadModel, parentGroup }) {
        this.model = new THREE.Group();
        parentGroup.add(this.model);

        if (this.isLocalPlayer) {
            // anchor view model in front of camera
            this.model.position.set(25, -36.54, -35.74);
        } else {
            // anchor world model to the side of the player
            this.model.position.set(32.7, 93.25, -15.95);
        }

        this.gunGroup = new THREE.Group();
        this.model.add(this.gunGroup);
    }

    destroy() {
        this.model.traverse(disposeNode);
        this.model.parent.remove(this.model);
    }

    sendWeaponToServer() {
        console.log("sendWeaponToServer", this.currentGun)
        game.emit("weaponChange", {
            weapon: this.currentGun?.name,
        });
    }

    setAmmoCount(ammo) {
        this.ammoCount = ammo;
        setHudAmmo(this.ammoCount, this.currentGun?.ammoSize ?? this.ammoCount)
    }

    switchWeapon(newWeaponEntity) {
        this.scheduledSwitchWeapon = newWeaponEntity;
        this.offScreenWeaponAnimationController.duration = this.weaponSwitchDuration / 2;
        this.offScreenWeaponAnimationController.start();
    }

    switchWeaponInstant(newWeaponEntity) {
        if (this.currentGun) {
            game.destroyEntity(this.currentGun);
        }
        this.currentGun = newWeaponEntity;
        if (this.currentGun) {
            game.createEntity(newWeaponEntity, this.gunGroup);
            this.setAmmoCount(this.currentGun.ammoSize);
            if (this.isLocalPlayer) {
                this.sendWeaponToServer();
            }
        }
    }

    remoteFire() {
        this.currentGun.shotAnimation();
    }

    // Called every frame 
    update(deltaTime) {
        // Off screen animation
        this.offScreenWeaponAnimationController.update(deltaTime);

        // Reduce recoil to 30% of current value after 1 second
        this.recoil *= Math.pow(0.3, deltaTime);
        // Additionally reduce recoil by constant factor for sharper stop
        this.recoil -= deltaTime * 0.2;
        if (this.recoil < 0) this.recoil = 0;

        this.recoilSmooth = THREE.Math.lerp(this.recoilSmooth, this.recoil, Math.min(1, deltaTime * 20));

        const newAngles =
            new THREE.Vector3(0, 0, 0).lerp(
                new THREE.Vector3(Math.PI * 0.15, 0, 0),
                this.recoilSmooth
            );

        this.gunGroup.quaternion.setFromEuler(new THREE.Euler(newAngles.x, newAngles.y, newAngles.z, 'YXZ'));

        if (!this.currentGun) return;

        if (this.isLocalPlayer) {
            if (input.isDown(input.Binds.Reload)) {
                if (this.offScreenWeaponAnimationController.running) return; // reloading / switching weapon
                if (this.ammoCount >= this.currentGun.ammoSize) return; // full ammo
                this.scheduledReload = true;
                this.offScreenWeaponAnimationController.duration = this.currentGun.reloadTime / 2;
                this.offScreenWeaponAnimationController.start();
            }
            
            if (input.isDown(input.Binds.Fire)) {
                if (this.offScreenWeaponAnimationController.running) return; // reloading / switching weapon
                if (this.ammoCount <= 0) return; // no ammo

                const didFire = this.currentGun.fire();
                if (didFire) {
                    // Decrease ammo
                    this.setAmmoCount(this.ammoCount - 1);

                    // Add recoil
                    const gunRecoil = this.currentGun.recoil;
                    this.recoil += gunRecoil * (1 - this.recoil / 2);
                    if (this.recoil > 1) this.recoil = 1;

                    // Send over network
                    game.emit('weaponFire')
                }
            }
        }
    }
}
