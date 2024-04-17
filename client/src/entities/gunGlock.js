// Class for handling the local player, including controls

import { game } from "../game";
import { graphics } from "../graphics";
import { input } from "../input";
import { disposeNode } from "../map/common";

import * as THREE from '../three_legacy'
import { debugAngleSliders } from "../ui/debugSliders";

export class GunGlock {

    constructor(isViewModel) {
        this.isViewModel = isViewModel;
    }

    create({ loadModel, parentGroup }) {
        // bullet prefab
        this.bulletModel = new THREE.Group();

        // main model
        this.mainModel = new THREE.Group();
        parentGroup.add(this.mainModel);

        if (this.isViewModel) {
            this.mainModel.position.set(25, -26.54, -55.74);
        } else {
            this.mainModel.position.set(32.7, 93.25, -15.95);
        }

        this.gunModel = new THREE.Group();
        this.mainModel.add(this.gunModel);
        this.gunModel.scale.set(0.15, 0.15, 0.15);
        const gunAngles = new THREE.Euler(-0.0754, 1.69175, -0.07539);
        this.gunModel.quaternion.setFromEuler(gunAngles)

        debugAngleSliders("Gun Entity position", this.mainModel.position.toArray(), 50, (components) => {
            this.mainModel.position.set(...components);
        })
        // debugAngleSliders("Gun Entity rotation", 0, Math.PI/4, (components) => {
        //     this.model.quaternion.setFromEuler(new THREE.Euler(...components, 'YXZ'));
        // })

        // debugAngleSliders("Gun rotation", gunAngles.toArray(), Math.PI/4, (components) => {
        //     this.gunModel.quaternion.setFromEuler(new THREE.Euler(...components, 'YXZ'));
        // })

        // Player viewmodel
        if (this.isViewModel) {
            loadModel("models/player/scene.gltf", (model) => {
                model.position.set(-92.28, -52.23, 23.04);
                const playerAngles = new THREE.Euler(4.08555, 1.03902, 3.1415, 'YXZ');
                model.quaternion.setFromEuler(playerAngles);
                model.scale.set(100, 100, 100);
                // debugAngleSliders("Viewmodel rotation", playerAngles.toArray(), Math.PI/8, (components) => {
                //     model.quaternion.setFromEuler(new THREE.Euler(...components, 'YXZ'));
                // })
                // debugAngleSliders("Viewmodel position", model.position.toArray(), 5, (components) => {
                //     model.position.set(...components);
                // })
                this.mainModel.add(model);
            });
        }

        // Gun parts
        loadModel("models/gun/glock/body.glb", (model) => {
            graphics.shader(model);
            this.gunModel.add(model);
        });
        loadModel("models/gun/glock/bolt.glb", (model) => {
            graphics.shader(model);
            this.gunModel.add(model);
        });
        loadModel("models/gun/glock/trigger.glb", (model) => {
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

    // Called every frame 
    update(deltaTime) {

    }
}
