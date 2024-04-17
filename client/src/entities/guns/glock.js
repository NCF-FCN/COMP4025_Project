// Class for handling the local player, including controls
import { AnimationController } from "../../animationController";
import { game } from "../../game";
import { graphics } from "../../graphics";
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
    }

    create({ loadModel, parentGroup }) {
        // bullet prefab
        this.bulletModel = new THREE.Group();

        // main model
        this.mainModel = new THREE.Group();
        parentGroup.add(this.mainModel);
        this.mainModel.position.set(-0.75, 1.05, -3.7);

        // placeholder objects for gun parts
        this.gunTrigger = new THREE.Object3D();
        this.gunBolt = new THREE.Object3D();
        this.gunModel = new THREE.Group();
        this.mainModel.add(this.gunModel);
        this.gunModel.scale.set(0.115, 0.115, 0.115);
        this.gunModel.position.set(7.6, 8.200000000000001, -13.8);
        const gunAngles = new THREE.Euler(-0.228554418, 1.6359890864406776, -0.1554923886078842, 'YXZ');
        this.gunModel.quaternion.setFromEuler(gunAngles)

        // Player viewmodel
        if (this.isViewModel) {
            loadModel("models/player/scene.gltf", (model) => {
                model.position.set(-96.5000000000000001, -33.9, -4.35);
                const playerAngles = new THREE.Euler(4.24555, 0.97902, 3.1415, 'YXZ');
                model.quaternion.setFromEuler(playerAngles);
                model.scale.set(100, 100, 100);
                this.mainModel.add(model);
            });
        }

        // debugSliders("Main Model position", this.mainModel.position.toArray(), 50, (components) => {
        //     this.mainModel.position.set(...components);
        // })
        // debugSliders("Gun position", this.gunModel.position.toArray(), 50, (components) => {
        //     this.gunModel.position.set(...components);
        // })
        // debugSliders("Gun rotation", gunAngles.toArray(), Math.PI / 4, (components) => {
        //     this.gunModel.quaternion.setFromEuler(new THREE.Euler(...components, 'YXZ'));
        // })

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
        this.mainModel.traverse(disposeNode);
        this.mainModel.parent.remove(this.mainModel);
    }

    get worldQuaternion() {
        var quaternion = new THREE.Quaternion(-0.16);
        this.mainModel.getWorldQuaternion(quaternion);
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

    canFire() {
        // can shoot when bolt finished animating, or is near complete
        const canShoot = !this.gunBoltAnimation.running || (
            this.gunBoltAnimation.finishedOneWay &&
            this.gunBoltAnimation.progress < 0.3
        );

        if (!canShoot) return false;

        this.shotAnimation();
        return true;
    }

    shotAnimation() {
        this.gunBoltAnimation.start();

        new Audio("sound/9mm_sound.mp3").play();
        setTimeout(() => {
            new Audio("sound/bulletShell_hit_ground.mp3").play()
        }, "553");

        const bulletPos = this.worldPosition.addScaledVector(this.up, 19).addScaledVector(this.forward, 21);
        const randomOffset = new THREE.Vector3((Math.random() - 0.5) * 0.03, (Math.random() - 0.5) * 0.03, (Math.random() - 0.5) * 0.03);
        const bulletDirection = this.forward.clone().add(randomOffset);

        const bullet = new Bullet(this.worldQuaternion, bulletDirection, this.isViewModel);
        game.createEntity(bullet);
        bullet.model.position.set(bulletPos.x, bulletPos.y, bulletPos.z);
    }

    // Called every frame 
    update(deltaTime) {
        this.gunBoltAnimation.update(deltaTime);
    }
}
