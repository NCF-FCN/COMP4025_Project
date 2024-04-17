// Class for handling the local player, including controls
import { AnimationController } from "../../animationController";
import { game } from "../../game";
import { graphics } from "../../graphics";
import { input } from "../../input";
import { disposeNode } from "../../map/common";
import * as THREE from '../../three_legacy'

export class Bullet {
    constructor(quaternion, direction, isLocalPlayer) {
        this.quaternion = quaternion;
        this.direction = direction;
        this.isLocalPlayer = isLocalPlayer;
        this.speed = 5000;
        this.lifetimeLeft = 2;

        this.forward = new THREE.Vector3(0, 0, -1);
        this.forward.applyQuaternion(this.quaternion);
    }

    create({ loadModel, parentGroup }) {
        this.model = new THREE.Group();
        parentGroup.add(this.model);

        this.model.quaternion.set(this.quaternion.x, this.quaternion.y, this.quaternion.z, this.quaternion.w);

        loadModel("models/gun/bullet/scene.gltf", (model) => {
            model.scale.set(0.3, 0.3, 0.3);
            model.rotation.y = Math.PI / 2;
            this.model.add(model);
        });
    }

    destroy() {
        this.model.traverse(disposeNode);
        this.model.parent.remove(this.model);
    }

    // Called every frame 
    update(deltaTime) {
        this.lifetimeLeft -= deltaTime;
        if (this.lifetimeLeft < 0) {
            game.destroyEntity(this);
            return;
        }
        const newPosition = this.model.position
            .clone()
            .addScaledVector(this.direction, this.speed * deltaTime);

        const hits = graphics.raycast(this.model.position, newPosition);
        if (hits.length) {
            // hit something
            console.log("Hit something", hits)
            game.destroyEntity(this);

            if (this.isLocalPlayer) {
                for (let hit of hits) {
                    let obj = hit.object;
                    while ((obj = obj.parent)) {
                        if (obj.playerId) {
                            console.log("Hit player", obj)
                            // hit player
                            game.emit('bulletHit', {
                                target: obj.playerId,
                                damage: 40
                            });
                            return;
                        }
                    }
                }
            }
            return;
        }

        this.model.position.set(newPosition.x, newPosition.y, newPosition.z);
    }
}
