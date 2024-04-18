// Class for handling the local player, including controls
import { game } from "../game";
import { disposeNode } from "../map/common";
import * as THREE from '../three_legacy'

export class DebugRay {
    constructor(ray, hits, lifetime = 10) {
        this.lifetimeLeft = lifetime;
        this.ray = ray;
        this.hits = hits;
        this.length = length;
    }

    create({ loadModel, parentGroup }) {
        this.model = new THREE.Group();
        this.model.entityType = "debugRay";
        window.scene.add(this.model);

        let arrow;
        let lastPoint = this.ray.origin;
        let lastDistance = 0;
        if (this.hits) {
            for (let { point, distance } of this.hits) {
                arrow = new THREE.ArrowHelper(
                    this.ray.direction,
                    lastPoint,
                    distance - lastDistance + 0.01,
                    ~~(Math.random() * 0xffffff)
                );
                lastPoint = point;
                lastDistance = distance;
                this.model.add(arrow);
            }
        }
        arrow = new THREE.ArrowHelper(
            this.ray.direction,
            lastPoint,
            5000,
            this.hits ? 0 : 0xffffff, // black, or white if no hits array given
        );
        this.model.add(arrow);
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
    }
}
