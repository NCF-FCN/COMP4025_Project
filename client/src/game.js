
// Global game instance
// keeps track of current loaded map, local player, and any global state

import { LocalPlayer } from "./entities/localPlayer";
import { GLTFLoader } from "./loaders/GLTFLoader";
import { ModelLoader } from "./modelLoader";
import { Connection } from "./network/Connection";
import { RemotePlayerManager } from "./remotePlayerManager";
import * as THREE from './three_legacy';


class Game {
    // todo: move three.js renderer, camera etc here
    constructor() {
        // this.map = null;
        this.connection = null;
        this.socket = null;
        this.entities = [];
        this.lastUpdate = new Date();
        this.modelLoader = new ModelLoader();
        this.remotePlayerManager = new RemotePlayerManager();

        requestAnimationFrame(() => this.updateWorld());
    }

    log(...args) {
        console.log("[GAME]", ...args);
    }

    prepareWorld() {
        this.directionalLight = new THREE.DirectionalLight(0xffffff);
        this.directionalLight.position.set(50, 100, 100);
        scene.add(this.directionalLight);

        this.localPlayer = new LocalPlayer();
        this.createEntity(this.localPlayer);
    }

    createEntity(entity, parent = undefined) {
        entity.create({
            // loader: modelLoader.loader,
            loadModel: this.modelLoader.loadModel.bind(this.modelLoader),
            parentGroup: parent ?? window.scene,
        });
        this.entities.push(entity);
    }

    destroyEntity(entity) {
        const index = this.entities.findIndex(x => x === entity);
        if (index < 0) throw new Error("Trying to delete entity which is not spawned in world!");
        this.entities.splice(index, 1);
        entity.destroy();
    }

    updateWorld() {
        const now = new Date();
        // clamp delta time to 0.5s to avoid unexpected behaviour on lags
        const deltaTime = Math.min(0.5, (now - this.lastUpdate) / 1000);

        try {
            for (let entity of this.entities) {
                entity.update(deltaTime);
            }
        } catch (e) {
            this.log("Error in update loop!", e);
            return; // stop game loop
        }

        renderer.render(scene, camera);

        this.lastUpdate = now;
        requestAnimationFrame(() => this.updateWorld());
    }

    // changeWorld(map) {
    //     // todo: move map loading here, right now warehouse is loaded only
    //     if (this.map) {
    //         this.map.unload(this);
    //     }
    //     this.map = map;
    //     this.map.load(this);
    // }

    disconnect() {
        if (this.connection) {
            this.connection.dispose();
            this.connection = null;
        }
    }

    connect(address) {
        this.disconnect();
        this.connection = new Connection(this, address);
    }

    emit(...args) {
        if (!this.socket?.connected) {
            this.log("Trying to send data while not connected!", ...args);
            return;
        }
        this.socket.emit(...args);
    }

    onConnectionCreated(socket) {
        this.socket = socket;

        socket.on("gameInfo", data => {
            this.log("Socket message gameInfo:", data);
            // todo: load map given by server
        });

        socket.on("respawn", data => {
            this.log("Socket message respawn:", data);
            this.localPlayer.respawn(data);
        });

        socket.on("playerConnected", data => {
            this.log("Socket message playerConnected:", data);
            this.remotePlayerManager.playerConnect(data);
        });

        socket.on("playerDisconnected", data => {
            this.log("Socket message playerDisconnected:", data);
            this.remotePlayerManager.playerDisconnect(data);
        });

        socket.on("playerMoved", data => {
            this.log("Socket message playerMoved:", data);
            this.remotePlayerManager.playerMove(data);
        });
    }
}

const game = new Game();

export { game };
