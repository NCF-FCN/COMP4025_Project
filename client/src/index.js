// index.js is the entrypoint file for webpack
import * as THREE from './three_legacy';
import { loadForest } from './map/forest';
import { loadWarehouse } from './map/warehouse';
import { setupNetworkUI } from './ui/networkConnect';

setupNetworkUI();

document.getElementById("toggleSidebar").addEventListener("click", function () {
    const sidebar = document.getElementById("sidebar");
    const toggleSidebar = document.getElementById("toggleSidebar");

    if (sidebar.classList.contains("open")) {
        toggleSidebar.classList.remove("open");
        sidebar.classList.remove("open");
    } else {
        toggleSidebar.classList.add("open");
        sidebar.classList.add("open");
    }
});

// document.getElementById("toggleSidebar2").addEventListener("click", function () {
//     const sidebar = document.getElementById("sidebar2");
//     const toggleSidebar = document.getElementById("toggleSidebar2");

//     if (sidebar.classList.contains("open")) {
//         toggleSidebar.classList.remove("open");
//         sidebar.classList.remove("open");
//     } else {
//         toggleSidebar.classList.add("open");
//         sidebar.classList.add("open");
//     }
// });

window.scene = window.camera = window.controls = window.loadedModel = window.totalModel = undefined;
window.aspect = window.innerWidth / window.innerHeight;
window.renderer = new THREE.WebGLRenderer();

document.getElementById("switchMap").addEventListener("click", function () {
    //check the loading progress
    if (loadedModel < totalModel) {
        alert("Please wait for the map to load and press the button again.");
        return;
    }

    //choose which map to load and set the total model amount
    if (scene.name === "forest") {
        totalModel = 14;
        loadWarehouse();
    } else {
        totalModel = 7;
        loadForest();
    }
});

//load warehouse first
loadWarehouse();