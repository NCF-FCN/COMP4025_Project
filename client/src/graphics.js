import { game } from './game';
import { isChildOrSelfRecursive } from './helpers';
import * as THREE from './three_legacy';

class Graphics {
    shaderLoader = new THREE.FileLoader();
    raycaster = new THREE.Raycaster();

    shader(object) {
        this.shaderLoader.load('shader/vertex.glsl', (vertexShader) => {
            this.shaderLoader.load('shader/fragment.glsl', (fragmentShader) => {
                object.traverse(function (child) {
                    child.castShadow = true;

                    if (child.isMesh) {
                        child.material = new THREE.ShaderMaterial({
                            uniforms: {
                                lightSrc: { type: "v3", value: game.directionalLight.position },
                                texture: { type: "t", value: child.material.map }
                            },
                            vertexShader: vertexShader,
                            fragmentShader: fragmentShader
                        });
                    }
                });
            });
        });
    }

    raycast(from, dir) {
        this.raycaster.set(from, dir);
        const rootObjects = window.scene.children;
        return this.raycaster.intersectObjects(rootObjects, true);
    }

    raycastIgnore(from, dir, ignoredModel) {
        const allHits = this.raycast(from, dir);
        return allHits.filter(
            ({ object }) => !isChildOrSelfRecursive(object, ignoredModel)
        );
    }
}

export const graphics = new Graphics();
