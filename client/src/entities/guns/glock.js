
// Class for handling the local player, including controls

import { AnimationController } from "../../animationController";
import { game } from "../../game";
import { graphics } from "../../graphics";
import { input } from "../../input";
import { disposeNode } from "../../map/common";

import * as THREE from '../../three_legacy'
import { debugSliders } from "../../ui/debugSliders";
import { Bullet } from "../ammo/bullet";

export class GunGlock {

    constructor(isViewModel) {
        this.isViewModel = isViewModel;
        
		this.gunBoltAnimation = new AnimationController({
			duration: 0.2,
			isTwoWay: true,
			onProgress: (progress) => {
				const pos = new THREE.Vector3(0, 0, 0).lerp(
                    new THREE.Vector3(-20, 0, 0),
                    progress,
                );
				this.gunBolt.position.set(pos.x, pos.y, pos.z);
			}
		});
		this.gunTriggerAnimation = new AnimationController({
			duration: 0.4,
			isTwoWay: true,
			onProgress: (progress) => {
				this.gunTrigger.rotation.z = THREE.Math.lerp(0, -0.3, progress);
			}
		});
    }

    create({ loadModel, parentGroup }) {
        // bullet prefab
        this.bulletModel = new THREE.Group();

        // main model
        this.model = new THREE.Group();
        parentGroup.add(this.model);

        // placeholder objects for gun parts
        this.gunTrigger = new THREE.Object3D();
        this.gunBolt = new THREE.Object3D();

        this.gunModel = new THREE.Group();
        this.model.add(this.gunModel);
        this.gunModel.position.set(0, 10, -20);
        this.gunModel.scale.set(0.15, 0.15, 0.15);
        const gunAngles = new THREE.Euler(-0.0754, 1.69175, -0.07539);
        this.gunModel.quaternion.setFromEuler(gunAngles)

        // debugSliders("Gun Entity position", this.model.position.toArray(), 50, (components) => {
        //     this.model.position.set(...components);
        // })
        // debugSliders("Gun Entity rotation", 0, Math.PI/4, (components) => {
        //     this.model.quaternion.setFromEuler(new THREE.Euler(...components, 'YXZ'));
        // })
        
        // debugSliders("Gun rotation", gunAngles.toArray(), Math.PI/4, (components) => {
        //     this.gunModel.quaternion.setFromEuler(new THREE.Euler(...components, 'YXZ'));
        // })

        // Player viewmodel
        if(this.isViewModel) {
            loadModel("models/player/scene.gltf", (model) => {
                model.position.set(-92.28, -42.23, 3.04);
                const playerAngles = new THREE.Euler(4.08555, 1.03902, 3.1415, 'YXZ');
                model.quaternion.setFromEuler(playerAngles);
                model.scale.set(100, 100, 100);
                // debugSliders("Viewmodel rotation", playerAngles.toArray(), Math.PI/8, (components) => {
                //     model.quaternion.setFromEuler(new THREE.Euler(...components, 'YXZ'));
                // })
                // debugSliders("Viewmodel position", model.position.toArray(), 5, (components) => {
                //     model.position.set(...components);
                // })
                this.model.add(model);
            });
        }
        
        // Gun parts
        loadModel("models/gun/glock/body.glb", (model) => {
            graphics.shader(model);
            this.gunModel.add(model);
        });
        loadModel("models/gun/glock/bolt.glb", (model) => {
            this.gunBolt = model;
            graphics.shader(model);
            this.gunModel.add(model);
        });
        loadModel("models/gun/glock/trigger.glb", (model) => {
            this.gunTrigger = model;
            graphics.shader(model);
            model.position.set(-17, 112, 0);
            this.gunModel.add(model);
        });
        
        // Bullet prefab
        loadModel("models/gun/bullet/scene.gltf", (model) => {
            model.scale.set(0.3, 0.3, 0.3);
            model.position.set(0, 140, 0);
            model.rotation.y = Math.PI / 2;
            this.bulletModel.add(model);
        });
    }

    destroy() {
        this.bulletModel.traverse(disposeNode);
        this.model.traverse(disposeNode);
        this.model.parent.remove(this.model);
    }

    get worldQuaternion() {
        var quaternion = new THREE.Quaternion();
        this.model.getWorldQuaternion(quaternion);
        return quaternion;
    }

    get worldPosition() {
        var vector = new THREE.Vector3();
        this.gunModel.getWorldPosition(vector);
        return vector;
    }

    get forward() {
        var forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(this.worldQuaternion);
        return forward;
    }

    get up() {
        var forward = new THREE.Vector3(0, 1, 0);
        forward.applyQuaternion(this.worldQuaternion);
        return forward;
    }

    fire() {
        // can shoot when bolt finished animating, or is near complete
        const canShoot = !this.gunBoltAnimation.running || (
            this.gunBoltAnimation.finishedOneWay &&
            this.gunBoltAnimation.progress < 0.3
        );
        
        if(!canShoot) return false;

        this.showFire();
        return true;
    }

    showFire() {
        this.gunBoltAnimation.start();
        this.gunTriggerAnimation.start();

        new Audio("sound/9mm_sound.mp3").play();

        const bulletPos = this.worldPosition
            .addScaledVector(this.up, 19)
            .addScaledVector(this.forward, 21);

        const bullet = new Bullet(this.worldQuaternion, this.isViewModel);
        game.createEntity(bullet);
        bullet.model.position.set(bulletPos.x, bulletPos.y, bulletPos.z);
    }

    // Called every frame 
    update(deltaTime) {
        this.gunBoltAnimation.update(deltaTime);
        this.gunTriggerAnimation.update(deltaTime);
    }
}
