
//import * as THREE from 'three'
import * as THREE from '../three_legacy'
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GLTFLoader } from '../loaders/GLTFLoader';
import { mapPrepare } from './common';

export function loadForest() {
    mapPrepare();

    //scene attribute
    scene.name = "forest";

    //lakeGroup
    const lakeGroup = new THREE.Group();
    scene.add(lakeGroup);

    // GLTF object
    // forest x1 -> scene
    new GLTFLoader().load("models/forest/forest/scene.glb", function (gltf) {
        const forest = gltf.scene;
        shader(forest);
        scene.add(forest);

        forest.scale.set(150, 150, 150);

        loadedModel++;
    }, undefined, function (error) {
        console.error(error);
        loadedModel++;
    });

    //lake x1 -> lakeGroup
    new GLTFLoader().load("models/forest/lake/scene.glb", function (gltf) {
        const lake = gltf.scene;
        shader(lake);
        lakeGroup.add(lake);

        lake.scale.set(160, 1, 170);
        lake.position.set(400, 25, 550);

        loadedModel++;
    }, undefined, function (error) {
        console.error(error);
        loadedModel++;
    });

    //tree1 x1 -> lakeGroup
    new GLTFLoader().load("models/forest/tree/tree1/scene.glb", function (gltf) {
        const tree1 = gltf.scene;
        shader(tree1);
        lakeGroup.add(tree1);

        tree1.scale.set(0.5, 0.5, 0.5);
        tree1.position.set(380, 60, 550);
        tree1.rotation.x = -0.2;
        tree1.rotation.y = -2.7;

        loadedModel++;
    }, undefined, function (error) {
        console.error(error);
        loadedModel++;
    });

    //tree2 x11 -> scene
    new GLTFLoader().load("models/forest/tree/tree2/scene.glb", function (gltf) {
        const positions = [
            { x: -240, y: -5, z: -90 },
            { x: 50, y: 25, z: 200 },
            { x: -450, y: -7, z: -300 },
            { x: -550, y: -10, z: -800 },
            { x: 200, y: -5, z: -340 },
            { x: 270, y: 20, z: -870 },
            { x: 900, y: -10, z: -100 },
            { x: -150, y: -8, z: 800 },
            { x: -900, y: -5, z: 900 },
            { x: -1000, y: -5, z: -500 },
            { x: -900, y: -8, z: -800 },
            { x: -100, y: 20, z: -950 },
            { x: 900, y: -15, z: -950 }
        ];

        gltf.scene.scale.set(450, 450, 450);

        positions.forEach((pos) => {
            let tree2 = gltf.scene.clone();
            shader(tree2);
            scene.add(tree2);

            tree2.position.set(pos.x || 0, pos.y || 0, pos.z || 0);
            tree2.rotation.y = Math.random() * Math.PI * 2;
        });

        loadedModel++;
    }, undefined, function (error) {
        console.error(error);
        loadedModel++;
    });

    //tree3 x1 -> lakeGroup
    new GLTFLoader().load("models/forest/tree/tree3/scene.glb", function (gltf) {
        const tree3 = gltf.scene;
        shader(tree3);
        lakeGroup.add(tree3);

        tree3.scale.set(10, 10, 10);
        tree3.position.set(400, -3, 490);
        tree3.rotation.y = -0.5;
        tree3.rotation.z = -0.02;

        loadedModel++;
    }, undefined, function (error) {
        console.error(error);
        loadedModel++;
    });

    //rock x1 -> lakeGroup
    new GLTFLoader().load("models/forest/rock/rock1/scene.glb", function (gltf) {
        const rock1 = gltf.scene;
        shader(rock1);
        lakeGroup.add(rock1);

        rock1.scale.set(100, 100, 100);
        rock1.position.set(390, 1000, 540);
        rock1.rotation.y = -0.5;

        loadedModel++;
    }, undefined, function (error) {
        console.error(error);
        loadedModel++;
    });

    //rock2 x1 -> scene
    new GLTFLoader().load("models/forest/rock/rock2/scene.glb", function (gltf) {
        const rock2 = gltf.scene;
        shader(rock2);
        scene.add(rock2);

        rock2.scale.set(100, 100, 100);
        rock2.position.set(-700, 0, 600);
        rock2.rotation.y = 3;

        loadedModel++;
    }, undefined, function (error) {
        console.error(error);
        loadedModel++;
    });

    //directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(100, 100, 100);
    // directionalLight.castShadow = true;
    scene.add(directionalLight);

    //shader
    function shader(object) {
        const shaderLoader = new THREE.FileLoader();

        shaderLoader.load('shader/vertex.glsl', function (vertexShader) {
            shaderLoader.load('shader/fragment.glsl', function (fragmentShader) {
                object.traverse(function (child) {
                    child.castShadow = true;

                    if (child.isMesh) {
                        child.material = new THREE.ShaderMaterial({
                            uniforms: {
                                lightSrc: { type: "v3", value: directionalLight.position },
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

    // Camera position
    // camera.position.x = 900;
    // camera.position.y = 600;
    // camera.position.z = 900;
    camera.position.y = 200;
    camera.position.z = 900;

    // render function
    const render = function () {
        requestAnimationFrame(render);
        controls.update();
        renderer.render(scene, camera);
    };

    render();
}