import { game } from "../game";
import { getGunList } from "../helpers";

const sidebar = document.getElementById("sidebar");

export function setupSidebarUI() {
    const template = document.getElementById("weapon-change-input-template");
    const weapons = getGunList();

    for (let weaponClass of Object.values(weapons)) {
        const clone = template.cloneNode(true);
        template.after(clone);
        clone.style.display = 'block';
        clone.innerText = weaponClass.name;
        clone.addEventListener("click", () => {
            game.localPlayer.gunEntity.switchWeapon(new weaponClass(true));
        })
    }
}

export function setSidebarVisible(showSidebar) {
    if (!showSidebar) {
        sidebar.classList.remove("open");
    } else {
        sidebar.classList.add("open");
    }
}
