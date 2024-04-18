// index.js is the entrypoint file for webpack
import * as THREE from './three_legacy';
import { setupNetworkUI } from './ui/networkConnect';
import { game } from './game';
import { setupSidebarUI } from './ui/sidebar';

setupNetworkUI();
setupSidebarUI();

// use global (window) variables for now.
window.scene = window.camera = window.controls = window.loadedModel = window.totalModel = undefined;
window.aspect = window.innerWidth / window.innerHeight;
window.renderer = new THREE.WebGLRenderer();

game.prepareWorld();