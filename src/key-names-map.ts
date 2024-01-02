/*
	TODO: It should be more about aliases.
			For example: multiple aliases for the same key)
*/

export const KeyNames = {
	F1: 'F1',   // No KeyPress // TODO: needed?
	F2: 'F2',   // No KeyPress // TODO: needed?
	F3: 'F3',   // No KeyPress // TODO: needed?
	F4: 'F4',   // No KeyPress // TODO: needed?
	F5: 'F5',   // No KeyPress // TODO: needed?
	F6: 'F6',   // No KeyPress // TODO: needed?
	F7: 'F7',   // No KeyPress // TODO: needed?
	F8: 'F8',   // No KeyPress // TODO: needed?
	F9: 'F9',   // No KeyPress // TODO: needed?
	F10: 'F10', // No KeyPress // TODO: needed?
	F11: 'F11', // No KeyPress // TODO: needed?
	F12: 'F12', // No KeyPress // TODO: needed?

	DIGIT1: 'Digit1',
	DIGIT2: 'Digit2',
	DIGIT3: 'Digit3',
	DIGIT4: 'Digit4',
	DIGIT5: 'Digit5',
	DIGIT6: 'Digit6',
	DIGIT7: 'Digit7',
	DIGIT8: 'Digit8',
	DIGIT9: 'Digit9',
	DIGIT0: 'Digit0',
	MINUS: 'Minus',
	EQUAL: 'Equal', // TODO: same key as "Plus" and one could want to bind e.g. ctrl & +

	A: 'KeyA',
	B: 'KeyB',
	C: 'KeyC',
	D: 'KeyD',
	E: 'KeyE',
	G: 'KeyG',
	H: 'KeyH',
	I: 'KeyI',
	J: 'KeyJ',
	K: 'KeyK',
	L: 'KeyL',
	M: 'KeyM',
	N: 'KeyN',
	O: 'KeyO',
	P: 'KeyP',
	Q: 'KeyQ',
	R: 'KeyR',
	S: 'KeyS',
	T: 'KeyT',
	U: 'KeyU',
	V: 'KeyV',
	W: 'KeyW',
	X: 'KeyX',
	Y: 'KeyY',
	Z: 'KeyZ',

	BACKQUOTE: 'Backquote',
	SLASH: 'Slash',
	BACKSLASH: 'Backslash',
	QUOTE: 'Quote',
	SEMICOLON: 'Semicolon',
	PERIOD: 'Period',
	COMMA: 'Comma',
	BRACKETRIGHT: 'BracketRight',
	BRACKETLEFT: 'BracketLeft',

	ENTER: 'Enter',
	SPACE: 'Space',
	BACKSPACE: 'Backspace', // No KeyPress
	ESCAPE: 'Escape',       // No KeyPress
	CAPSLOCK: 'CapsLock',   // No KeyPress
	TAB: 'Tab',             // No KeyPress. No KeyUp (unless keydown preventDefault - loose page focus)

	SHIFT: 'ShiftLeft',         // No KeyPress // TODO: right?
	CTRL: 'ControlLeft',        // No KeyPress // TODO: right?
	ALT: 'AltLeft',             // No KeyPress // TODO: right?
	META: 'MetaLeft',           // No KeyPress // TODO: right?
	CONTEXTMENU: 'ContextMenu', // No KeyPress

	PAUSE: 'Pause',       // No KeyPress
	PAGEUP: 'PageUp',     // No KeyPress
	PAGEDOWN: 'PageDown', // No KeyPress
	HOME: 'Home',         // No KeyPress
	END: 'End',           // No KeyPress
	INSERT: 'Insert',     // No KeyPress
	DELETE: 'Delete',     // No KeyPress
	UP: 'ArrowUp',        // No KeyPress
	RIGHT: 'ArrowRight',  // No KeyPress
	DOWN: 'ArrowDown',    // No KeyPress
	LEFT: 'ArrowLeft',    // No KeyPress

	/*
		With 'NumLock' off NUMPAD 0-9 and Decimal have // No KeyPress
		Also ev.code is the same but ev.key is: 1=end, 2=arrowDwn, 3=pgDwn etc.
	*/
	NUMLOCK: 'NumLock', // No KeyPress
	NUMPAD0: 'Numpad0',
	NUMPAD1: 'Numpad1',
	NUMPAD2: 'Numpad2',
	NUMPAD3: 'Numpad3',
	NUMPAD4: 'Numpad4',
	NUMPAD5: 'Numpad5',
	NUMPAD6: 'Numpad6',
	NUMPAD7: 'Numpad7',
	NUMPAD8: 'Numpad8',
	NUMPAD9: 'Numpad9',
	NUMPADDECIMAL: 'NumpadDecimal',
	NUMPADMULTIPLY: 'NumpadMultiply',
	NUMPADDIVIDE: 'NumpadDivide',
	NUMPADADD: 'NumpadAdd',
	NUMPADSUBTRACT: 'NumpadSubtract',
	NUMPADENTER: 'NumpadEnter',
} as const;
