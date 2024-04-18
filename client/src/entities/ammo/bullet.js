// Class for handling the local player, including controls
import { AnimationController } from "../../animationController";
import { game } from "../../game";
import { graphics } from "../../graphics";
import { getAncestorEntityModel, getAncestorsDisplayPath } from "../../helpers";
import { input } from "../../input";
import { disposeNode } from "../../map/common";
import * as THREE from '../../three_legacy'
import { DebugRay } from "../debugRay";

const showDebugRays = false;

export class Bullet {

    constructor(position, quaternion, isLocalPlayer, shootingPlayerModel, damage = 50, direction) {
        this.damage = damage;
        this.direction = direction;
        this.isLocalPlayer = isLocalPlayer;
        this.quaternion = quaternion;
        this.position = position;
        this.speed = 5000;
        this.lifetimeLeft = 2;
        this.shootingPlayerModel = shootingPlayerModel;

        this.forward = new THREE.Vector3(0, 0, -1);
        this.forward.applyQuaternion(this.quaternion);
    }

    create({ loadModel, parentGroup }) {
        this.model = new THREE.Group();
        this.model.entityType = "bullet";
        parentGroup.add(this.model);

        this.model.position.set(this.position.x, this.position.y, this.position.z);
        this.model.quaternion.set(this.quaternion.x, this.quaternion.y, this.quaternion.z, this.quaternion.w);

        loadModel("models/gun/bullet/scene.gltf", (model) => {
            model.scale.set(0.3, 0.3, 0.3);
            model.rotation.y = Math.PI / 2;
            this.model.add(model);
        });

        if (showDebugRays) {
            game.createEntity(new DebugRay(
                new THREE.Ray(this.worldPosition, new THREE.Vector3(0, 0, -1).applyQuaternion(this.worldQuaternion), [])
            ));
        }
    }

    get worldQuaternion() {
        var quaternion = new THREE.Quaternion();
        this.model.getWorldQuaternion(quaternion);
        return quaternion;
    }

    get worldPosition() {
        var vector = new THREE.Vector3();
        this.model.getWorldPosition(vector);
        return vector;
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

        const hits = graphics.raycastIgnore(
            this.model.position,
            this.forward,
            [this.model, this.shootingPlayerModel]
        );

        const distanceMoved = this.speed * deltaTime;

        if (hits.length) { // hit something
            const hit = hits[0]; // use first hit only
            if (hit.distance < distanceMoved * 2) { // limit detection distance
                game.destroyEntity(this);

                if (showDebugRays) {
                    game.createEntity(new DebugRay(graphics.raycaster.ray, hits));
                }

                if (this.isLocalPlayer) {
                    console.log("Bullet hit:", getAncestorsDisplayPath(hit.object));

                    const playerModel = getAncestorEntityModel(hit.object, "remotePlayer");
                    if (playerModel) {
                        console.log("Bullet hit player!", playerModel.playerId)
                        // hit player
                        game.emit('bulletHit', {
                            target: playerModel.playerId,
                            damage: this.damage,
                        });
                    } else {
                        new Audio("sound/bullet_hit_metal.mp3").play();

                        // const texture = new THREE.TextureLoader().load("models/gun/bullet/textures/bullet_hole.png");
                        // const material = new THREE.MeshBasicMaterial({ map: texture });
                        // const geometry = new THREE.PlaneGeometry(1, 1);
                        // const bulletHole = new THREE.Mesh(geometry, material);
                        // bulletHole.position.copy(hit.point);
                        // bulletHole.position.y += 1;
                        // bulletHole.lookAt(this.model.position);
                        // hit.object.parent.add(bulletHole);
                        // console.log(bulletHole.position);
                    }
                }

                return;
            }
        }

        const newPosition = this.model.position.clone().addScaledVector(this.forward, distanceMoved);
        this.model.position.set(newPosition.x, newPosition.y, newPosition.z);
    }
}
