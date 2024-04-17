function setBar(id, progress) {
    progress = Math.max(0, Math.min(1, progress));
    const bar = document.getElementById(id).querySelector(".progress-bar");
    bar.style.width = `${progress * 100}%`;
}

export function setHudHP(hp) {
    document.getElementById("hud-text-hp").innerText = Math.round(hp);
    setBar("hud-bar-hp", hp / 100);
}

export function setHudMP(mp) {
    document.getElementById("hud-text-mp").innerText = Math.round(mp);
    setBar("hud-bar-mp", mp / 200);
}
