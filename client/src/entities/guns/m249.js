
import * as THREE from '../../three_legacy'

import { AnimationController } from "../../animationController";
import { graphics } from "../../graphics";
import { debugSliders } from "../../ui/debugSliders";
import { GunBase } from "./gunBase";

export class GunM249 extends GunBase {
    static name = 'M249';

    constructor(isViewModel) {
        super(isViewModel);
        this.name = GunM249.name;
        this.reloadTime = 6;
        this.ammoSize = 60;
        this.damage = 10;
        this.recoil = 0.3;
        this.fireRateDelay = 0.1;
        this.untilNextFire = 0;
    }

    createGun({ loadModel }) {
        this.gunModel.position.set(0.95, 22.5, -14.25);
        this.gunModel.scale.set(110, 110, 110);
        const gunAngles = new THREE.Euler(-0.0754, Math.PI, -0.07539, 'YXZ');
        this.gunModel.quaternion.setFromEuler(gunAngles);

        // debugSliders("M249 gunModel position", this.gunModel.position.toArray(), 10, (components) => {
        //     this.gunModel.position.set(...components);
        // })
        // debugSliders("M249 gunModel rotation", gunAngles.toArray(), Math.PI/4, (components) => {
        //     this.gunModel.quaternion.setFromEuler(new THREE.Euler(...components, 'YXZ'));
        // })

        loadModel("models/gun/m249/Backup/scene.gltf", (model) => {
            graphics.shader(model);
            this.gunModel.add(model);
        });
    }

    get barrelQuaternion() {
        // barrel rotation relative to this.gunModel
        var quaternion = new THREE.Quaternion();
        quaternion.setFromEuler(new THREE.Euler(0, -Math.PI, 0, 'YXZ'));
        return quaternion;
    }

    canFire() {
        return this.untilNextFire <= 0;
    }

    shotAnimation() {
        this.untilNextFire = this.fireRateDelay;

        new Audio("sound/m249_sound.mp3").play();
        setTimeout(() => { new Audio("sound/bulletShell_hit_ground.mp3").play() }, "553");

        const accuracy = (Math.random() - 0.5);
        const forwardWithOffset = this.forward.clone().add(new THREE.Vector3(accuracy, accuracy, accuracy));
        const bulletPos = this.worldPosition.addScaledVector(this.up, 9).addScaledVector(forwardWithOffset, 10);
        this.spawnBullet(bulletPos);
    }

    // Called every frame 
    update(deltaTime) {
        this.untilNextFire -= deltaTime;
    }
}
