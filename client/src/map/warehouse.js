
//import * as THREE from 'three'
import * as THREE from '../three_legacy'
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GLTFLoader } from '../loaders/GLTFLoader';
import { mapPrepare } from './common';
import { game } from '../game';
import { graphics } from '../graphics';

export function loadWarehouse() {
    mapPrepare();

    //scene attribute
    scene.name = "warehouse";

    //wallGroup
    const wallGroup = new THREE.Group();

    //smallObject1Group
    const smallObject1Group = new THREE.Group();

    //smallObject2Group
    const smallObject2Group = new THREE.Group();

    //smallObject3Group
    const smallObject3Group = new THREE.Group();

    //worldGroup
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);
    worldGroup.add(wallGroup);
    worldGroup.add(smallObject1Group);
    worldGroup.add(smallObject2Group);
    worldGroup.add(smallObject3Group);
    worldGroup.rotation.y = -Math.PI / 2;

    //gunGroup
    const gunGroup = new THREE.Group();
    scene.add(gunGroup);
    gunGroup.position.set(0, 100, 0);
    gunGroup.scale.set(0.3, 0.3, 0.3);

    // GLTF object
    let gunBolt, gunBullet, gunBody, gunTrigger;

    const gltfLoader = new GLTFLoader();
    // floor x1 -> scene
    gltfLoader.load("models/warehouse/floor/scene.glb", function (gltf) {
        const floor = gltf.scene;
        // graphics.shader(floor);
        worldGroup.add(floor);

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
        worldGroup.add(factory1);

        factory1.scale.set(200, 100, 100);
        factory1.position.set(103, 0, -2250);
        factory1.rotation.y = - Math.PI / 2;

        loadedModel++;
    }, undefined, function (error) {
        console.error(error);
        loadedModel++;
    });

    //factory2 x1 -> scene
    gltfLoader.load("models/warehouse/factory/factory2/scene.glb", function (gltf) {
        const factory2 = gltf.scene;
        graphics.shader(factory2);
        worldGroup.add(factory2);

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
            worldGroup.add(door);

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

    //container1 x2 -> scene
    gltfLoader.load("models/warehouse/container/container1/scene.gltf", function (gltf) {
        const positions = [
            { x: 730, z: -1220 },
            { x: -750, z: 1180 }
        ]

        gltf.scene.scale.set(105, 105, 105);

        positions.forEach((pos) => {
            let container1 = gltf.scene.clone();
            graphics.shader(container1);
            worldGroup.add(container1);

            container1.position.set(pos.x, 0, pos.z);
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
            worldGroup.add(container2);

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
        worldGroup.add(standing_light);
        standing_light.position.set(-510, 130, -70);
        standing_light.rotation.y = 0.7;

        standing_light = gltf.scene.clone();
        graphics.shader(standing_light);
        worldGroup.add(standing_light);
        standing_light.position.set(510, 130, 510);
        standing_light.rotation.y = Math.PI + 0.32;

        standing_light = gltf.scene.clone();
        graphics.shader(standing_light);
        worldGroup.add(standing_light);
        standing_light.position.set(640, 412, -980);
        standing_light.rotation.y = Math.PI / 2 - 0.3;

        // standing_light = gltf.scene.clone();
        // scene.add(standing_light);
        // standing_light.position.set(-190, 130, 400);

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
            scene.add(safety_cone);

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

    //load gun (pistol part)
    // gltfLoader.load("models/gun/glock/body.glb", function (gltf) {
    //     gunBody = gltf.scene;
    //     graphics.shader(gunBody);
    //     gunGroup.add(gunBody);
    // }, undefined, function (error) {
    //     console.error(error);
    // });

    // gltfLoader.load("models/gun/glock/bolt.glb", function (gltf) {
    //     gunBolt = gltf.scene;
    //     graphics.shader(gunBolt);
    //     gunGroup.add(gunBolt);
    // }, undefined, function (error) {
    //     console.error(error);
    // });

    // gltfLoader.load("models/gun/glock/trigger.glb", function (gltf) {
    //     gunTrigger = gltf.scene;
    //     graphics.shader(gunTrigger);
    //     gunGroup.add(gunTrigger);
    //     gunTrigger.position.set(-17, 112, 0);
    // }, undefined, function (error) {
    //     console.error(error);
    // });

    // gltfLoader.load("models/gun/bullet/scene.gltf", function (gltf) {
    //     gunBullet = gltf.scene;
    //     gunBullet.scale.set(0.3, 0.3, 0.3);
    //     gunBullet.position.set(0, 140, 0);
    //     gunBullet.rotation.y = Math.PI / 2;
    // }, undefined, function (error) {
    //     console.error(error);
    // });

    //camera position
    // todo: move to local player
    // camera.position.set(0, game.localPlayer.height, 100);
    // camera.rotation.y = -0.2;


    //spotlight
    function spotlight(posX, posY, posZ, tarX, tarY, tarZ) {
        let spotLight = new THREE.SpotLight(0xffffff, 0.6, 0, Math.PI / 5, 0.1);
        spotLight.position.set(posX, posY, posZ);
        spotLight.target.position.set(tarX, tarY, tarZ);
        spotLight.target.updateMatrixWorld(true);
        // spotLight.castShadow = true;
        // spotLight.shadow.camera.far = 1000;
        // spotLight.shadow.mapSize.width = 1024;
        // spotLight.shadow.mapSize.height = 1024;
        graphics.shader(spotLight);
        scene.add(spotLight);

        // var helper = new THREE.CameraHelper(spotLight.shadow.camera);
        // scene.add(helper);

        spotLight = new THREE.SpotLight(0xffffff, 1, 0, Math.PI / 7, 0.3);
        spotLight.position.set(posX, posY, posZ);
        spotLight.target.position.set(tarX, tarY, tarZ);
        spotLight.target.updateMatrixWorld(true);
        // spotLight.castShadow = true;
        // spotLight.shadow.camera.far = 1000;
        // spotLight.shadow.mapSize.width = 1024;
        // spotLight.shadow.mapSize.height = 1024;
        graphics.shader(spotLight);
        scene.add(spotLight);

        // var helper = new THREE.CameraHelper(spotLight.shadow.camera);
        // scene.add(helper);
    }

    spotlight(-510, 170, -70, 0, 170, 530);
    spotlight(510, 170, 510, 200, 170, -1000);
    spotlight(640, 412, -980, 200, 412, -1100);

    let isAnimating = false;

    function gunFire(event) {
        event.preventDefault();

        if (isAnimating) {
            return;
        }

        if (event.keyCode === 32 && !isAnimating) { // Spacebar key
            isAnimating = true;
            const gunBulletClone = gunBullet.clone();

            //gun position
            const gunGroup_fromRotationZ = gunGroup.rotation.z;
            const gunGroup_toRotationZ = 0.3;
            const gunGroup_fromPositionX = gunGroup.position.x;
            const gunGroup_toPositionX = -80;
            const gunTrigger_fromRotationZ = gunTrigger.rotation.z;
            const gunTrigger_toRotationZ = -0.3;
            const gunBolt_fromPositionX = gunBolt.position.x;
            const gunBolt_toPositionX = -20;
            const gunBullet_fromPositionX = gunBullet.position.x;
            const gunBullet_toPositionX = 1000;


            const pressTime = Date.now();
            const gunGroup_duration = 200; //0.2 sec
            const gunBolt_duration = 200; //0.2 sec
            const gunTrigger_duration = 400; //0.4 sec
            const gunBullet_duration = 200; //0.2 sec

            let r_gunGroup_now = null, r_gunBolt_now = null, r_gunTrigger_now = null;
            const r_gunGroup_duration = 300; //0.3 sec
            const r_gunBolt_duration = 400; //0.4 sec
            const r_gunTrigger_duration = 400; //0.4 sec

            const audio = new Audio("sound/9mm_sound.mp3");
            audio.play();

            // console.log("Press Time: " + pressTime);
            function animateGun() {
                const now = Date.now();
                let gunGroup_progress = (now - pressTime) / gunGroup_duration; //((Time now - Time start) / Time) It will used for animation
                let gunBolt_progress = (now - pressTime) / gunBolt_duration;
                let gunTrigger_progress = (now - pressTime) / gunTrigger_duration;
                let gunBullet_process = (now - pressTime) / gunBullet_duration;

                if (gunBullet_process >= 1) {
                    gunBullet_process = 1;
                }

                if (gunBullet_process < 1) {
                    scene.add(gunBulletClone);
                    gunBulletClone.position.x = gunBullet_fromPositionX + (gunBullet_toPositionX - gunBullet_fromPositionX) * gunBullet_process;
                } else {
                    scene.remove(gunBulletClone);
                }

                if (gunGroup_progress <= 1) {
                    gunGroup.rotation.z = gunGroup_fromRotationZ + (gunGroup_toRotationZ - gunGroup_fromRotationZ) * gunGroup_progress;
                    gunGroup.position.x = gunGroup_fromPositionX + (gunGroup_toPositionX - gunGroup_fromPositionX) * gunGroup_progress;

                    // console.log("Now: " + now + ", gunGroup_progress: " + gunGroup_progress + ", gunGroup.rotation.z: " + gunGroup.rotation.z + ", gunGroup.position.x: " + gunGroup.position.x);
                } else {
                    gunGroup.rotation.z = gunGroup_toRotationZ;  //if gunGroup_progress > 1,
                    gunGroup.position.x = gunGroup_toPositionX; //just set to 100% because setting cannot exceed setting

                    //start reverse
                    if (!r_gunGroup_now) {
                        r_gunGroup_now = Date.now();
                    }

                    const r_gunGroup_progress = (now - r_gunGroup_now) / r_gunGroup_duration;

                    if (r_gunGroup_progress <= 1) {
                        gunGroup.rotation.z = gunGroup_fromRotationZ + (gunGroup_toRotationZ - gunGroup_fromRotationZ) * (1 - r_gunGroup_progress);
                        gunGroup.position.x = gunGroup_fromPositionX + (gunGroup_toPositionX - gunGroup_fromPositionX) * (1 - r_gunGroup_progress);
                    } else {
                        gunGroup.rotation.z = gunGroup_fromRotationZ;
                        gunGroup.position.x = gunGroup_fromPositionX;
                    }

                    // console.log("Now: " + now + ", r_gunGroup_now" + r_gunGroup_now + ", r_gunGroup_progress: " + r_gunGroup_progress + ", gunGroup.rotation.z: " + gunGroup.rotation.z + ", gunGroup.position.x: " + gunGroup.position.x);
                }

                // if (gunTrigger_progress <= 1) {
                //     gunTrigger.rotation.z = gunTrigger_fromRotationZ + (gunTrigger_toRotationZ - gunTrigger_fromRotationZ) * gunTrigger_progress;
                // } else {
                //     gunTrigger.rotation.z = gunTrigger_toRotationZ;

                //     if (!r_gunTrigger_now) {
                //         r_gunTrigger_now = Date.now();
                //     }

                //     const r_gunTrigger_progress = (now - r_gunTrigger_now) / r_gunTrigger_duration;

                //     if (r_gunTrigger_progress <= 1) {
                //         gunTrigger.rotation.z = gunTrigger_fromRotationZ + (gunTrigger_toRotationZ - gunTrigger_fromRotationZ) * (1 - r_gunTrigger_progress);
                //     } else {
                //         gunTrigger.rotation.z = gunTrigger_fromRotationZ;
                //         isAnimating = false; //put this at the end of the longest part of the animation
                //     }
                // }

                if (gunBolt_progress <= 1) {
                    gunBolt.position.x = gunBolt_fromPositionX + (gunBolt_toPositionX - gunBolt_fromPositionX) * gunBolt_progress;
                } else {
                    gunBolt.position.x = gunBolt_toPositionX;

                    //start reverse
                    if (!r_gunBolt_now) {
                        r_gunBolt_now = Date.now();
                    }

                    const r_gunBolt_progress = (now - r_gunBolt_now) / r_gunBolt_duration;

                    if (r_gunBolt_progress <= 1) {
                        gunBolt.position.x = gunBolt_fromPositionX + (gunBolt_toPositionX - gunBolt_fromPositionX) * (1 - r_gunBolt_progress);
                    } else {
                        gunBolt.position.x = gunBolt_fromPositionX;
                        isAnimating = false; //put this at the end of the longest part of the animation
                    }
                }

                requestAnimationFrame(animateGun);
            }

            animateGun();
        }
    }
    document.addEventListener('keydown', gunFire);
}