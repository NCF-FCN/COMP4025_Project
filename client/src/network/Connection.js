// Handles websocket connection
import { setConnectedStatus } from "../ui/networkConnect";
import { io } from "socket.io-client";

export class Connection {

    constructor(game, url) {
        this.game = game;
        this.id = null;

        url = 'ws://' + url;
        console.log("[WebSocket] Connecting to", url);
        this.socket = io(url);

        setConnectedStatus(false, true, "Connecting...");

        this.socket.on("connect", () => {
            if (!this.game) return;
            setConnectedStatus(true, false, "Connected.");
            console.log("[WebSocket]", "Connected.");
            this.game.onConnectionConnected(this.socket);
        });

        this.socket.on("connect_failed", (e) => {
            if (!this.game) return;
            setConnectedStatus(false, false, "Error!");
            console.log("[WebSocket]", "Connection error:", e);
        });

        this.socket.on("disconnect", () => {
            if (!this.game) return;
            setConnectedStatus(false, false, "Disconnected.");
            console.log("[WebSocket]", "Disconnected.");
            this.game.onConnectionDisconnected();
        });

        this.socket.on("handshake", (data) => {
            if (!this.game) return;
            console.log("[WebSocket]", "Handshake:", data);
            this.id = data.id;
        });

        this.game.onConnectionCreated(this.socket);
    }

    dispose() {
        this.socket.close();
        this.game = null;
    }
}