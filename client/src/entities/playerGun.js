
// Class for handling the local player, including controls

import { game } from "../game";
import { graphics } from "../graphics";
import { input } from "../input";
import { disposeNode } from "../map/common";
import { AnimationController } from "../animationController"

import * as THREE from '../three_legacy'
import { debugSliders } from "../ui/debugSliders";

export class PlayerGun {

	constructor(isLocalPlayer) {
		this.isLocalPlayer = isLocalPlayer;
		this.currentGun = null;
		this.scheduledSwitchWeapon = null;
		this.switchWeaponAnimationController = new AnimationController({
			duration: 0.5,
			isTwoWay: true,
			onBounce: () => {
				if(!this.scheduledSwitchWeapon) return;
				this.switchWeaponInstant(this.scheduledSwitchWeapon);
				this.scheduledSwitchWeapon = null;
			},
			onProgress: (progress) => {
				const newPosition = 
					new THREE.Vector3(0, 0, 0).lerp(
						new THREE.Vector3(50, -25, 25),
						progress
					);
				this.gunGroup.position.set(newPosition.x, newPosition.y, newPosition.z);
			}
		});
		this.recoilAnimationController = new AnimationController({
			duration: 0.15,
			isTwoWay: true,
			onProgress: (progress) => {
				const newAngles = 
          new THREE.Vector3(0, 0, 0).lerp(
            new THREE.Vector3(Math.PI * 0.1, 0, 0),
            progress
          );
        this.gunGroup.quaternion.setFromEuler(new THREE.Euler(newAngles.x, newAngles.y, newAngles.z, 'YXZ'))
			}
		});
	}

	create({ loadModel, parentGroup }) {
		this.model = new THREE.Group();
		parentGroup.add(this.model);
    
    if(this.isLocalPlayer) {
      // anchor view model in front of camera
      this.model.position.set(25, -36.54, -35.74);
    }else{
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

	switchWeapon(newWeaponEntity) {
		this.scheduledSwitchWeapon = newWeaponEntity;
		this.switchWeaponAnimationController.start();
	}

	switchWeaponInstant(newWeaponEntity) {
		if(this.currentGun) {
			game.destroyEntity(this.currentGun);
		}
		game.createEntity(newWeaponEntity, this.gunGroup);
		this.currentGun = newWeaponEntity;
	}

  remoteFire() {
    this.currentGun.showFire();
  }

	// Called every frame 
	update(deltaTime) {
		// Off screen animation
		this.switchWeaponAnimationController.update(deltaTime);
    this.recoilAnimationController.update(deltaTime);

    if(!this.currentGun) return;

    if(this.isLocalPlayer) {
      if(input.isDown(input.Binds.Fire)) {
        const didFire = this.currentGun.fire();
        if(didFire) {
          this.recoilAnimationController.start();

          game.emit('weaponFire')
        }
      }
    }
	}
}
