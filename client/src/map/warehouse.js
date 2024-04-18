import * as THREE from '../three_legacy'
import { GLTFLoader } from '../loaders/GLTFLoader';
import { mapPrepare } from './common';
import { game } from '../game';
import { graphics } from '../graphics';

const developmentModeLoadMinimum = false;

export function loadWarehouse() {
    //scene attribute
    scene.name = "map_warehouse";

    //wallGroup
    const wallGroup = new THREE.Group();
    window.scene.add(wallGroup);

    //smallObject1Group
    const smallObject1Group = new THREE.Group();
    smallObject1Group.name = "smallObject1Group";
    window.scene.add(smallObject1Group);

    //smallObject2Group
    const smallObject2Group = new THREE.Group();
    smallObject2Group.name = "smallObject2Group";
    window.scene.add(smallObject2Group);

    //smallObject3Group
    const smallObject3Group = new THREE.Group();
    smallObject3Group.name = "smallObject3Group";
    window.scene.add(smallObject3Group);

    const gltfLoader = new GLTFLoader();
    // floor x1 -> scene
    gltfLoader.load("models/warehouse/floor/scene.glb", function (gltf) {
        const floor = gltf.scene;
        floor.name = "floor";
        window.scene.add(floor);

        floor.scale.set(56, 1, 56);
        floor.rotation.y = Math.PI / 2;

        loadedModel++;
    }, undefined, function (error) {
        console.error(error);
        loadedModel++;
    });

    //factory1 x1 -> scene
    gltfLoader.load("models/warehouse/factory/factory1/scene.glb", function (gltf) {
        const factory1 = gltf.scene;
        graphics.shader(factory1);
        factory1.name = "factory1";
        window.scene.add(factory1);

        factory1.scale.set(200, 100, 100);
        factory1.position.set(103, 0, -2250);
        factory1.rotation.y = - Math.PI / 2;

        loadedModel++;
    }, undefined, function (error) {
        console.error(error);
        loadedModel++;
    });

    if (!developmentModeLoadMinimum) {

        //factory2 x1 -> scene
        gltfLoader.load("models/warehouse/factory/factory2/scene.glb", function (gltf) {
            const factory2 = gltf.scene;
            graphics.shader(factory2);
            window.scene.add(factory2);

            factory2.scale.set(16, 17, 17);
            factory2.position.set(-1330, 190, 180);
            factory2.rotation.y = - Math.PI / 2;

            loadedModel++;
        }, undefined, function (error) {
            console.error(error);
            loadedModel++;
        });

        //wall1 x2 -> wallGroup
        gltfLoader.load("models/warehouse/wall/wall1/scene.glb", function (gltf) {
            const positions = [
                { x: -785, z: -1610 },
                { x: -930, z: -1580 }
            ]

            gltf.scene.scale.set(8, 40, 55);

            positions.forEach((pos) => {
                let wall1 = gltf.scene.clone();
                graphics.shader(wall1);
                wallGroup.add(wall1);

                wall1.position.set(pos.x, 130, pos.z);

                if (pos.x < -800) {
                    wall1.rotation.y = Math.PI / 2;
                }
            });

            loadedModel++;
        }, undefined, function (error) {
            console.error(error);
            loadedModel++;
        });

        //wall2 x13 -> wallGroup
        gltfLoader.load("models/warehouse/wall/wall2/scene.glb", function (gltf) {
            const positions = [
                { x: 910, z: -1456 },
                { x: 910, z: -1096 },
                { x: 910, z: -732 },
                { x: 910, z: -368 },
                { x: 910, z: -4 },
                { x: 910, z: 360 },
                { x: 910, z: 724 },
                { x: 910, z: 1088 },
                { x: 910, z: 1452 },
                { x: 730, z: 1560 },
                { x: 366, z: 1560 },
                { x: -362, z: 1560 },
                { x: -726, z: 1560 }
            ]

            gltf.scene.scale.set(70, 70, 70);

            positions.forEach((pos) => {
                let wall2 = gltf.scene.clone();
                graphics.shader(wall2);
                wallGroup.add(wall2);

                wall2.position.set(pos.x, 5, pos.z);

                if (pos.z > 1500 || pos.x < -800) {
                    wall2.rotation.y = Math.PI / 2;
                }
            });

            loadedModel++;
        }, undefined, function (error) {
            console.error(error);
            loadedModel++;
        });

        //door x2 -> scene
        gltfLoader.load("models/warehouse/door/scene.glb", function (gltf) {
            const positions = [
                { x: -13, y: 95, z: 1550 },
                { x: -935, y: 95, z: -1290 }
            ]

            gltf.scene.scale.set(0.55, 0.55, 0.55);

            positions.forEach((pos) => {
                let door = gltf.scene.clone();
                graphics.shader(door);
                window.scene.add(door);

                door.position.set(pos.x, pos.y, pos.z);

                if (pos.z > 0) {
                    door.rotation.y = -Math.PI / 2;
                } else {
                    door.rotation.y = Math.PI;
                }
            });

            loadedModel++;
        }, undefined, function (error) {
            console.error(error);
            loadedModel++;
        });

        //container1 x3 -> scene
        gltfLoader.load("models/warehouse/container/container1/scene.gltf", function (gltf) {
            const positions = [
                { x: 730, z: -1220 },
                { x: -750, z: 1180 },
                { x: -50, z: 240 },
                { x: 200, z: -600 }
            ]

            gltf.scene.scale.set(105, 105, 105);

            positions.forEach((pos) => {
                let container1 = gltf.scene.clone();
                graphics.shader(container1);
                window.scene.add(container1);

                container1.position.set(pos.x, 0, pos.z);

                if(pos.x === -50){
                    container1.rotation.y = - Math.PI / 4;
                }
            });

            loadedModel++;
        }, undefined, function (error) {
            console.error(error);
            loadedModel++;
        });

        //container2 x2 -> scene
        gltfLoader.load("models/warehouse/container/container2/scene.gltf", function (gltf) {
            const positions = [
                { x: -715, z: -440 },
                { x: 700, z: 860 }
            ]

            gltf.scene.scale.set(110, 110, 110);

            positions.forEach((pos) => {
                let container2 = gltf.scene.clone();
                graphics.shader(container2);
                window.scene.add(container2);

                container2.position.set(pos.x, 0, pos.z);

                if (pos.x < 0) {
                    container2.rotation.y = -0.053;
                }

                if (pos.x > 0) {
                    container2.rotation.y = Math.PI - 0.07;
                }
            });

            loadedModel++;
        }, undefined, function (error) {
            console.error(error);
            loadedModel++;
        });

        //pallet x3 -> smallObject1Group
        gltfLoader.load("models/warehouse/pallet/scene.glb", function (gltf) {
            const positions = [
                { x: -830, y: -5, z: 0 },
                { x: -830, y: -5, z: 170 },
                { x: -810, y: 102, z: 205 }
            ]

            gltf.scene.scale.set(21, 21, 21);

            positions.forEach((pos) => {
                let pallet = gltf.scene.clone();
                graphics.shader(pallet);
                smallObject1Group.add(pallet);

                pallet.position.set(pos.x, pos.y, pos.z);

                if (pos.y > 100) {
                    pallet.rotation.x = 1.35;
                }
            });

            loadedModel++;
        }, undefined, function (error) {
            console.error(error);
            loadedModel++;
        });

        //box x4 -> smallObject1Group, smallObject2Group
        gltfLoader.load("models/warehouse/box/scene.glb", function (gltf) {
            const positions = [
                { x: -830, y: 22, z: 0 },
                { x: -830, y: 22, z: 140 },
                { x: -810, y: 115, z: 100 },
                { x: -820, y: 118, z: 487 }
            ]

            gltf.scene.scale.set(47, 47, 47);

            positions.forEach((pos) => {
                let box = gltf.scene.clone();
                graphics.shader(box);

                if (pos.z < 200) {
                    smallObject1Group.add(box);
                } else {
                    smallObject2Group.add(box);
                }

                box.position.set(pos.x, pos.y, pos.z);
                box.rotation.y = Math.PI / 2;
            });

            loadedModel++;
        }, undefined, function (error) {
            console.error(error);
            loadedModel++;
        });

        //shelves x3 -> smallObject2Group, smallObject3Group
        gltfLoader.load("models/warehouse/shelves/scene.glb", function (gltf) {
            const positions = [
                { x: -820, z: 420 },
                { x: -820, z: 705 },
                { x: 800, z: 0 }
            ]

            gltf.scene.scale.set(45, 45, 45);

            positions.forEach((pos) => {
                let shelves = gltf.scene.clone();
                graphics.shader(shelves);

                if (pos.x < 0) {
                    smallObject2Group.add(shelves);
                } else {
                    smallObject3Group.add(shelves);
                }

                shelves.position.set(pos.x, 0, pos.z);
                shelves.rotation.y = Math.PI / 2;
            });

            loadedModel++;
        }, undefined, function (error) {
            console.error(error);
            loadedModel++;
        });

        //standing_light x3 -> scene
        gltfLoader.load("models/warehouse/standing_light/scene.glb", function (gltf) {
            gltf.scene.scale.set(40, 40, 40);
            // gltf.scene.castShadow = true;

            let standing_light = gltf.scene.clone();
            graphics.shader(standing_light);
            window.scene.add(standing_light);
            standing_light.position.set(-510, 130, -70);
            standing_light.rotation.y = 0.7;

            standing_light = gltf.scene.clone();
            graphics.shader(standing_light);
            window.scene.add(standing_light);
            standing_light.position.set(510, 130, 510);
            standing_light.rotation.y = Math.PI + 0.32;

            standing_light = gltf.scene.clone();
            graphics.shader(standing_light);
            window.scene.add(standing_light);
            standing_light.position.set(640, 412, -980);
            standing_light.rotation.y = - Math.PI / 2 - 0.3;

            loadedModel++;
        }, undefined, function (error) {
            console.error(error);
            loadedModel++;
        });

        //safety_cone x2 -> scene
        gltfLoader.load("models/warehouse/safety_cone/scene.glb", function (gltf) {
            const positions = [
                { x: -200, z: -100 },
                { x: 120, z: 580 }
            ]

            gltf.scene.scale.set(30, 30, 30);

            positions.forEach((pos) => {
                let safety_cone = gltf.scene.clone();
                graphics.shader(safety_cone);
                window.scene.add(safety_cone);

                safety_cone.position.set(pos.x, 0, pos.z);
                safety_cone.rotation.y = Math.random() * Math.PI * 2;
            });

            loadedModel++;
        }, undefined, function (error) {
            console.error(error);
            loadedModel++;
        });

        //barrel x6 -> smallObject3Group
        gltfLoader.load("models/warehouse/barrel/scene.glb", function (gltf) {
            const positions = [
                { x: 820, z: -600 },
                { x: 820, z: -535 },
                { x: 755, z: -568 },
                { x: 787, y: 115, z: -567 },
                { x: 755, y: 31, z: -350 },
                { x: 800, y: 139, z: 50 }
            ]

            gltf.scene.scale.set(30, 30, 30);

            positions.forEach((pos) => {
                let barrel = gltf.scene.clone();
                graphics.shader(barrel);
                smallObject3Group.add(barrel);

                barrel.position.set(pos.x, pos.y || 17, pos.z);

                if (pos.y > 0 && pos.y < 90) {
                    barrel.rotation.z = Math.PI / 2;
                    barrel.rotation.y = Math.random() * Math.PI * 2;
                }
            });

            loadedModel++;
        }, undefined, function (error) {
            console.error(error);
            loadedModel++;
        });
    }


    //spotlight
    function spotlight(posX, posY, posZ, tarX, tarY, tarZ) {
        let spotLight = new THREE.SpotLight(0xffffff, 0.6, 0, Math.PI / 5, 0.1);
        spotLight.position.set(posX, posY, posZ);
        spotLight.target.position.set(tarX, tarY, tarZ);
        spotLight.target.updateMatrixWorld(true);
        graphics.shader(spotLight);
        scene.add(spotLight);

        spotLight = new THREE.SpotLight(0xffffff, 1, 0, Math.PI / 7, 0.3);
        spotLight.position.set(posX, posY, posZ);
        spotLight.target.position.set(tarX, tarY, tarZ);
        spotLight.target.updateMatrixWorld(true);
        graphics.shader(spotLight);
        scene.add(spotLight);
    }

    spotlight(-510, 170, -70, 0, 170, 530);
    spotlight(510, 170, 510, 200, 170, -1000);
    spotlight(640, 412, -980, 200, 412, -1100);
}