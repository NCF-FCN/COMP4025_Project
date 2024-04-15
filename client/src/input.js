
// Global input class
// handles input to the game, allows for querying pressed buttons 

class Input {
	MouseButtons = {
		MouseLeft: 'MouseLeft',
		MouseRight: 'MouseRight',
	};

	Binds = {
		Forward: 87,  // W
		Back: 83,     // S
		Left: 65,     // A
		Right: 68,    // D
        Fire: this.MouseButtons.MouseLeft,
	};

	pressedButtons = {};
	
	isDown(code) {
        return this.pressedButtons[code];
    }
}

const input = new Input();

document.addEventListener('keydown', function(event) {
	input.pressedButtons[event.keyCode] = true;
});

document.addEventListener('keyup', function(event) {
	input.pressedButtons[event.keyCode] = false;
});

function mouseEventButtonToName(button) {
    switch(button) {
        case 0: return input.MouseButtons.MouseLeft;
        case 2: return input.MouseButtons.MouseRight;
        default: return null;
    }
}

document.addEventListener('mousedown', function(event) {
	const buttonName = mouseEventButtonToName(event.button);
    if(!buttonName) return;
    input.pressedButtons[buttonName] = true;
});

document.addEventListener('mouseup', function(event) {
	const buttonName = mouseEventButtonToName(event.button);
    if(!buttonName) return;
    input.pressedButtons[buttonName] = false;
});

export { input };
