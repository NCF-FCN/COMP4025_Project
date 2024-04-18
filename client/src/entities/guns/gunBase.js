import { game } from "../../game";
import { disposeNode } from "../../map/common";
import * as THREE from '../../three_legacy'
import { debugSliders } from "../../ui/debugSliders";
import { Bullet } from "../ammo/bullet";

export class GunBase {
    constructor(isViewModel) {
        this.isViewModel = isViewModel;
    }

    create({ loadModel, parentGroup }) {
        // main model
        this.model = new THREE.Group();
        parentGroup.add(this.model);

        this.gunModel = new THREE.Group();
        this.model.add(this.gunModel);

        if (this.isViewModel) {
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

        this.createGun({ loadModel });
    }

    destroy() {
        this.model.traverse(disposeNode);
        this.model.parent.remove(this.model);
    }

    get worldQuaternion() {
        var quaternion = new THREE.Quaternion();
        this.gunModel.getWorldQuaternion(quaternion);
        quaternion.multiply(this.barrelQuaternion);
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

    spawnBullet(bulletPos) {
        const bullet = new Bullet(bulletPos, this.worldQuaternion, this.isViewModel, this.model, this.damage || 50);
        game.createEntity(bullet);
    }

    fire() {
        if (!this.canFire()) return false;

        this.shotAnimation();
        return true;
    }
}
