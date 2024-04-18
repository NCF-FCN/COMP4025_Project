// Class for handles input to the game, allows for querying pressed buttons 
import { isRespawnUIOpen } from "./ui/respawn";
import { setSidebarVisible } from "./ui/sidebar";

class Input {
	MouseButtons = {
		MouseLeft: 'MouseLeft',
		MouseRight: 'MouseRight',
	};

	Binds = {
		Run: 16, // Shift
		Jump: 32, // Space
		Forward: 87, // W
		Back: 83, // S
		Left: 65, // A
		Right: 68, // D
		Reload: 82, // R
		Fire: this.MouseButtons.MouseLeft,
		LockMouse: 76, // L
		DebugFreezePlayer: 88, // X
	};

	pressedButtons = {};

	mouseSensitivity = 0.002;
	pitch = 0;
	yaw = 0;
	mouseLocked = false;

	isDown(code) {
		return this.pressedButtons[code] ? 1 : 0;
	}

	handleKeyDown(event) {
		if (event.keyCode === this.Binds.LockMouse) {
			this.handleLockMouseToggle();
		}
		this.pressedButtons[event.keyCode] = true;
	}

	handleKeyUp(event) {
		this.pressedButtons[event.keyCode] = false;
	}

	mouseEventButtonToName(button) {
		switch (button) {
			case 0: return this.MouseButtons.MouseLeft;
			case 2: return this.MouseButtons.MouseRight;
			default: return null;
		}
	}

	handleMouseDown(event) {
		if (!this.mouseLocked) {
			if (event.target === window.renderer.domElement) {
				this.lockMouse();
			}
			return; // ignore mouse events if not locked
		};
		event.preventDefault(); // if mouse is locked, capture event
		const buttonName = this.mouseEventButtonToName(event.button);
		if (!buttonName) return;
		this.pressedButtons[buttonName] = true;
	}

	handleMouseUp(event) {
		const buttonName = this.mouseEventButtonToName(event.button);
		if (!buttonName) return;
		this.pressedButtons[buttonName] = false;
	}

	handleMouseMove(event) {
		if (this.mouseLocked) {
			const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
			const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

			// Update the player's pitch and yaw based on the mouse movement
			this.yaw -= movementX * this.mouseSensitivity;
			this.pitch -= movementY * this.mouseSensitivity;

			// Limit the pitch to prevent the player from flipping over
			this.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitch));
		}
	}

	lockMouse() {
		if (isRespawnUIOpen()) {
			return; // don't lock when respawn window is open
		}
		document.body.requestPointerLock();
	}

	unlockMouse() {
		document.exitPointerLock();
	}

	handleLockMouseToggle() {
		if (this.mouseLocked) {
			this.unlockMouse()
		} else {
			this.lockMouse();
		}
	}

	handleMousePointerLockChange() {
		this.mouseLocked = document.pointerLockElement !== null;
		setSidebarVisible(!this.mouseLocked);
	}

	handleMousePointerLockError() {
		alert("You must wait a second before focusing the game after using ESC button. Use L button instead.")
	}

	initialize() {
		document.addEventListener('keydown', this.handleKeyDown.bind(this));
		document.addEventListener('keyup', this.handleKeyUp.bind(this));
		document.addEventListener('mousedown', this.handleMouseDown.bind(this));
		document.addEventListener('mouseup', this.handleMouseUp.bind(this));
		document.addEventListener('mousemove', this.handleMouseMove.bind(this));
		document.addEventListener("pointerlockchange", this.handleMousePointerLockChange.bind(this));
		document.addEventListener("pointerlockerror", this.handleMousePointerLockError.bind(this));
	}
}

const input = new Input();
input.initialize();

export { input };
