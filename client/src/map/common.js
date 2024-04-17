
//import * as THREE from 'three'
import { game } from '../game';
import * as THREE from '../three_legacy'

export function mapPrepare() {
    //clean the scene
    if (scene) {
        while (scene.children.length > 0) {
            scene.remove(scene.children[0]);
            scene.traverse(disposeNode);
            renderer.clear();
        }
    }

    // reset loadedModel
    loadedModel = 0;

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87cefa);

    // Camera
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 10000);

    // Renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.gammaOutput = true;
    document.body.appendChild(renderer.domElement);

    game.prepareWorld();
}

//free up the RAM
export function disposeNode(node) {
    if (node instanceof THREE.Mesh) {
        if (node.geometry) node.geometry.dispose();

        if (node.material) {
            // todo: check for multi material
            if (node.material.materials) {
                // if (node.material instanceof THREE.MeshFaceMaterial || node.material instanceof THREE.Material) {
                node.material.materials.forEach(function (mtrl, idx) {
                    if (mtrl.map) mtrl.map.dispose();
                    if (mtrl.lightMap) mtrl.lightMap.dispose();
                    if (mtrl.bumpMap) mtrl.bumpMap.dispose();
                    if (mtrl.normalMap) mtrl.normalMap.dispose();
                    if (mtrl.specularMap) mtrl.specularMap.dispose();
                    if (mtrl.envMap) mtrl.envMap.dispose();
                    mtrl.dispose();
                });
            } else {
                if (node.material.map) node.material.map.dispose();
                if (node.material.lightMap) node.material.lightMap.dispose();
                if (node.material.bumpMap) node.material.bumpMap.dispose();
                if (node.material.normalMap) node.material.normalMap.dispose();
                if (node.material.specularMap) node.material.specularMap.dispose();
                if (node.material.envMap) node.material.envMap.dispose();
                node.material.dispose();
            }
        }
    }
}
