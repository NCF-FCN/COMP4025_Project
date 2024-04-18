import * as THREE from '../../three_legacy'
import { AnimationController } from "../../animationController";
import { graphics } from "../../graphics";
import { debugSliders } from "../../ui/debugSliders";
import { GunBase } from "./gunBase";

export class GunGlock extends GunBase {
    static name = 'Glock';

    constructor(isViewModel) {
        super(isViewModel);
        this.name = GunGlock.name;
        this.reloadTime = 2.5;
        this.ammoSize = 12;
        this.damage = 30;
        this.recoil = 0.2;

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

    createGun({ loadModel }) {
        this.gunTrigger = new THREE.Object3D();
        this.gunBolt = new THREE.Object3D();

        // debugSliders("Gun Entity position", this.model.position.toArray(), 50, (components) => {
        //     this.model.position.set(...components);
        // })
        // debugSliders("Gun Entity rotation", 0, Math.PI/4, (components) => {
        //     this.model.quaternion.setFromEuler(new THREE.Euler(...components, 'YXZ'));
        // })

        // debugSliders("Gun rotation", gunAngles.toArray(), Math.PI/4, (components) => {
        //     this.gunModel.quaternion.setFromEuler(new THREE.Euler(...components, 'YXZ'));
        // })

        this.gunModel.position.set(0, 10, -20);
        this.gunModel.scale.set(0.15, 0.15, 0.15);
        const gunAngles = new THREE.Euler(0.1, 1.69175, -0.07539);
        this.gunModel.quaternion.setFromEuler(gunAngles);

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
    }

    get barrelQuaternion() {
        // barrel rotation relative to this.gunModel
        var quaternion = new THREE.Quaternion();
        quaternion.setFromEuler(new THREE.Euler(0, -Math.PI / 2, 0, 'YXZ'));
        return quaternion;
    }

    canFire() {
        return !this.gunBoltAnimation.running || (
            this.gunBoltAnimation.finishedOneWay &&
            this.gunBoltAnimation.progress < 0.3
        );
    }

    shotAnimation() {
        this.gunBoltAnimation.start();

        new Audio("sound/9mm_sound.mp3").play();
        setTimeout(() => { new Audio("sound/bulletShell_hit_ground.mp3").play() }, "553");

        const accuracy = (Math.random() - 0.5) * 0.7;
        const forwardWithOffset = this.forward.clone().add(new THREE.Vector3(accuracy, accuracy, accuracy));
        const bulletPos = this.worldPosition.addScaledVector(this.up, 19).addScaledVector(forwardWithOffset, 10);
        this.spawnBullet(bulletPos);
    }

    // Called every frame 
    update(deltaTime) {
        this.gunBoltAnimation.update(deltaTime);
    }
}
