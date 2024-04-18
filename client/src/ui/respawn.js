import { game } from "../game";
import { getGunList as getGunDictionary } from "../helpers";
const respawnButton = document.getElementById("respawn-button");
const respawnTimerText = document.getElementById("respawn-timer");

export function setupRespawnUI(onRespawn) {
    respawnButton.addEventListener("click", () => {
        document.body.requestPointerLock();
        onRespawn();
    });
}

let respawnTime = null;
let respawnTimerInterval = null;

function updateRespawnTimer() {
    const remaining = respawnTime - new Date();
    if (remaining <= 0) {
        respawnTimerText.innerText = 'Ready';
        respawnButton.disabled = false;
        clearInterval(respawnTimerInterval);
        return;
    }

    respawnTimerText.innerText = `Wait ${(remaining / 1000).toFixed(1)}s`;
}

export function setDeadUI(isDead) {
    if (!document.body.classList.contains("death-effect") && isDead) {
        // just died
        respawnTime = +new Date() + 5000;
        respawnTimerInterval = setInterval(updateRespawnTimer, 100);
        respawnButton.disabled = true;
        if (document.pointerLockElement !== null) {
            document.exitPointerLock();
        }
    }
    document.body.classList.toggle("death-effect", isDead);
}

function setDamageEffect(enabled) {
    document.body.classList.toggle("damage-effect", enabled);
    new Audio("sound/bullet_hit_people.mp3").play();
}

let damageTimeout = null;
export function playDamageEffect() {
    setDamageEffect(true);
    clearTimeout(damageTimeout);
    damageTimeout = setTimeout(() => setDamageEffect(false), 200);
}

export function isRespawnUIOpen() {
    return document.body.classList.contains("death-effect");
}
