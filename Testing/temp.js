let isAnimating = false;

function onKeyDown(event) {
    event.preventDefault();

    if (event.keyCode === 32 && !isAnimating) { // Spacebar key
        isAnimating = true;

        // Require1: The gunGroup will rotate in z axis from 0 to 0.45 and its x axis position form 0 to -10 in 1 sec.
        let start = Date.now();
        let duration = 1000; // 1 sec
        let fromRotationZ = 0;
        let toRotationZ = 0.45;
        let fromPositionX = 0;
        let toPositionX = -10;

        function animateGunGroup() {
            let now = Date.now();
            let progress = (now - start) / duration;

            if (progress > 1) progress = 1;

            gunGroup.rotation.z = fromRotationZ + (toRotationZ - fromRotationZ) * progress;
            gunGroup.position.x = fromPositionX + (toPositionX - fromPositionX) * progress;

            if (progress < 1) {
                requestAnimationFrame(animateGunGroup);
            } else {
                // Require2: While Require1 is happening, the gun_bolt need to move its x position from 0 to -20 in 1.5 sec.
                start = Date.now();
                duration = 1500; // 1.5 sec
                fromPositionX = 0;
                toPositionX = -20;

                function animateGunBolt() {
                    let now = Date.now();
                    let progress = (now - start) / duration;

                    if (progress > 1) progress = 1;

                    gun9mm_head.position.x = fromPositionX + (toPositionX - fromPositionX) * progress;

                    if (progress < 1) {
                        requestAnimationFrame(animateGunBolt);
                    } else {
                        // Require4: The gun_bolt will move in x axis position from -20 to 0 in 1.5 sec after Require2 is finished.
                        start = Date.now();
                        duration = 1500; // 1.5 sec
                        fromPositionX = -20;
                        toPositionX = 0;

                        function animateGunBoltBack() {
                            let now = Date.now();
                            let progress = (now - start) / duration;

                            if (progress > 1) progress = 1;

                            gun9mm_head.position.x = fromPositionX + (toPositionX - fromPositionX) * progress;

                            if (progress < 1) {
                                requestAnimationFrame(animateGunBoltBack);
                            } else {
                                isAnimating = false;
                            }
                        }

                        animateGunBoltBack();

                        // Require3: After the gunGroup finish the rotation and the moving, it will reverse the move and rotation which means it will rotate in z axis from 0.45 to 0 and move in x axis position from -10 to 0. But the difference is this time it will use 2 sec to finish.
                        start = Date.now();
                        duration = 2000; // 2 sec
                        fromRotationZ = 0.45;
                        toRotationZ = 0;
                        fromPositionX = -10;
                        toPositionX = 0;

                        function animateGunGroupBack() {
                            let now = Date.now();
                            let progress = (now - start) / duration;

                            if (progress > 1) progress = 1;

                            gunGroup.rotation.z = fromRotationZ + (toRotationZ - fromRotationZ) * progress;
                            gunGroup.position.x = fromPositionX + (toPositionX - fromPositionX) * progress;

                            if (progress < 1) {
                                requestAnimationFrame(animateGunGroupBack);
                            }
                        }

                        animateGunGroupBack();
                    }
                }

                animateGunBolt();
            }
        }

        animateGunGroup();

        // Require5: While Require1 gunGroup z axis rotation reach 0.25, there will be a gun_bullet create at (0, -60, 0) and move in x axis position from 0 to 1000  in 1 sec.
        setTimeout(function () {
            let bullet = gun9mm_bullet.clone();
            bullet.position.set(0, -60, 0);
            scene.add(bullet);

            start = Date.now();
            duration = 1000; // 1 sec
            fromPositionX = 0;
            toPositionX = 1000;

            function animateBullet() {
                let now = Date.now();
                let progress = (now - start) / duration;

                if (progress > 1) progress = 1;

                bullet.position.x = fromPositionX + (toPositionX - fromPositionX) * progress;

                if (progress < 1) {
                    requestAnimationFrame(animateBullet);
                } else {
                    scene.remove(bullet);
                }
            }

            animateBullet();
        }, 500); // Halfway through Require1
    }
}
document.addEventListener('keydown', onKeyDown);