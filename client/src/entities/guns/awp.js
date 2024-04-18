import * as THREE from '../../three_legacy'
import { graphics } from "../../graphics";
import { debugSliders } from "../../ui/debugSliders";
import { GunBase } from "./gunBase";

export class GunAwp extends GunBase {
    static name = 'AWP';

    constructor(isViewModel) {
        super(isViewModel);
        this.name = GunAwp.name;
        this.reloadTime = 4;
        this.ammoSize = 5;
        this.damage = 100;
        this.recoil = 0.9;
        this.fireRateDelay = 2;
        this.untilNextFire = 0;
    }

    createGun({ loadModel }) {
        this.gunModel.position.set(0.95, 22.5, -14.25);
        this.gunModel.scale.set(0.9, 0.9, 0.9);
        const gunAngles = new THREE.Euler(-0.0754, Math.PI, -0.07539, 'YXZ');
        this.gunModel.quaternion.setFromEuler(gunAngles);

        // debugSliders("AWP gunModel position", this.gunModel.position.toArray(), 10, (components) => {
        //     this.gunModel.position.set(...components);
        // })
        // debugSliders("AWP gunModel rotation", gunAngles.toArray(), Math.PI/4, (components) => {
        //     this.gunModel.quaternion.setFromEuler(new THREE.Euler(...components, 'YXZ'));
        // })

        loadModel("models/gun/awp/Backup/scene.gltf", (model) => {
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

        new Audio("sound/awp_sound.mp3").play();
        setTimeout(() => { new Audio("sound/bulletShell_hit_ground.mp3").play() }, "553");

        const bulletPos = this.worldPosition.addScaledVector(this.up, 12).addScaledVector(this.forward, 10);

        this.spawnBullet(bulletPos);
    }

    // Called every frame 
    update(deltaTime) {
        this.untilNextFire -= deltaTime;
    }
}
