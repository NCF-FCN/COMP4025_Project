// Class for handling the local player, including controls

import * as THREE from '../three_legacy'
import { PlayerData } from "shared";
import { game } from "../game";
import { disposeNode } from "../map/common";

import { PlayerGun } from './playerGun';
import { GunGlock } from './guns/glock';

export class RemotePlayer {
    data = new PlayerData({});

    create({ loadModel, parentGroup }) {
        // model is achored to eyes
        this.model = new THREE.Group();
        parentGroup.add(this.model);

        // Player model
        loadModel("models/player/scene.gltf", (model) => {
            model.scale.set(100, 100, 100);
            model.quaternion.setFromEuler(new THREE.Euler(0, Math.PI, 0, 'YXZ'));
            this.model.add(model);
        });

        // Create gun entity attached to remote player
        this.gunEntity = new PlayerGun(false);
        game.createEntity(this.gunEntity, this.model);

        this.gunEntity.switchWeaponInstant(new GunGlock(false));
    }

    destroy() {
        game.destroyEntity(this.gunEntity);

        this.model.traverse(disposeNode);
        this.model.parent.remove(this.model);
    }

    setData(data) {
        this.data = new PlayerData(data);
        this.model.playerId = data.id;
        const { position, angles } = this.data;
        this.model.position.set(...position);
        this.model.quaternion.setFromEuler(new THREE.Euler(0, angles[1], 0, 'YXZ'));
    }
    
    weaponFire() {
        this.gunEntity.remoteFire();
    }

    // Called every frame 
    update(deltaTime) {
    }
}
