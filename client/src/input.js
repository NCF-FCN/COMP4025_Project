// Class for handles input to the game, allows for querying pressed buttons 

class Input {
	MouseButtons = {
		MouseLeft: 'MouseLeft',
		MouseRight: 'MouseRight',
	};

	Binds = {
		Run: 16,      // Shift
		Jump: 32, 	  // Space
		Forward: 87,  // W
		Back: 83,     // S
		Left: 65,     // A
		Right: 68,    // D
		Fire: this.MouseButtons.MouseLeft,
		LockMouse: 76, // L
	};

	pressedButtons = {};

	mouseSensitivity = 0.002;
	pitch = 0;
	yaw = 0;
	mouseLocked = true;

	isDown(code) {
		return this.pressedButtons[code] ? 1 : 0;
	}

	handleKeyDown(event) {
		this.pressedButtons[event.keyCode] = true;
	}

	handleKeyUp(event) {
		this.pressedButtons[event.keyCode] = false;
	}

	mouseEventButtonToName(button) {
    switch(button) {
        case 0: return this.MouseButtons.MouseLeft;
        case 2: return this.MouseButtons.MouseRight;
        default: return null;
    }
	}

	handleMouseDown(event) {
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

	handleLockMouseToggle() {
		this.mouseLocked = !this.mouseLocked;
		if (this.mouseLocked) {
			document.body.requestPointerLock();
		} else {
			document.exitPointerLock();
		}
	}

	initialize() {
		document.addEventListener('keydown', this.handleKeyDown.bind(this));
		document.addEventListener('keyup', this.handleKeyUp.bind(this));
		document.addEventListener('mousedown', this.handleMouseDown.bind(this));
		document.addEventListener('mouseup', this.handleMouseUp.bind(this));
		document.addEventListener('mousemove', this.handleMouseMove.bind(this));
		document.addEventListener('keydown', (event) => {
			if (event.keyCode === this.Binds.LockMouse) {
				this.handleLockMouseToggle();
			}
		});
	}
}

const input = new Input();
input.initialize();

export { input };
