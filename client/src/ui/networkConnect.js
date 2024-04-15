import { game } from "../game";

export function setupNetworkUI() {
    document.getElementById("connectButton").addEventListener("click", function () {
        const address = document.getElementById("websocketAddress").value.trim();
        console.log("[UI] Connecting to", address)
        game.connect(address);
    });

    document.getElementById("disconnectButton").addEventListener("click", function () {
        game.disconnect();
    });
}

export function setConnectedStatus(isConnected, isConnecting, statusText) {
    document.getElementById("connectStatus").innerText = statusText;
    document.getElementById("connectButton").disabled = isConnecting || isConnected;
    document.getElementById("disconnectButton").disabled = isConnecting || !isConnected;
}
