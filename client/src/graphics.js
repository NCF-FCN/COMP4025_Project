
import { game } from './game';
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

    raycast(from, to) {
        this.raycaster.set(from, to);
        return this.raycaster.intersectObjects(window.scene.children, true);
    }
}

export const graphics = new Graphics();
