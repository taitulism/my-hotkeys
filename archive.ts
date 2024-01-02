/*
	TODO:

	* bool arg preventDefault (changes data struct)
		bindKey('up', focusThumbs, true);

	* Support of one binding obj
		bindKey({
			key: handler,
			key2: handler2
		})

	* unbindKey

	* hold keydown - call once

	* Support of multi keys - same handler
		bindKey(['up', 'pgUp'], focusThumbs);
		bindKey(['down', 'pgDown'], focusBigPic);

	* bind context elm (document is default)

	* Keyboard namespace
		kb.bindKey()

	* higher level funcs
		kb.ctrl("A")
		kb.ctrlShift("A")
		kb.shift("A")

	* disable hotkey

*/

const PressKeys = {
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
	SPACE: 'Space',
	LEFT: 'ArrowLeft',
	RIGHT: 'ArrowRight',
	UP: 'ArrowUp',
	DOWN: 'ArrowDown',
	PGDOWN: 'PageDown',
	PGUP: 'PageUp',
	HOME: 'Home',
	END: 'End',
	ENTER: 'Enter',
	SHIFT: 'Shift',
} as const;

type CustomKey = keyof typeof PressKeys;
type RealKey = typeof PressKeys[CustomKey]
type KeyHandler = (ev: KeyboardEvent) => void
type KeyBindings = {
	plain?: KeyHandler
	ctrl?: KeyHandler
	shift?: KeyHandler
	ctrlShift?: KeyHandler
}

const keyPressBindingsMap = new Map<string, KeyBindings>();

type ParsedKey = {
	keyName: RealKey
	bgKey: keyof KeyBindings
}

function parseKeyName (keyName: CustomKey | string): RealKey {
	const realName = PressKeys[keyName.toUpperCase() as CustomKey];

	if (!realName) throw new Error(`KB: Unknown key "${keyName}"`);

	return realName;
}

function parseBgKey (bgKey1: string, bgKey2?: string): ParsedKey['bgKey'] {
	if (bgKey1 === 'ctrl' && bgKey2 === 'shift') return 'ctrlShift';
	if (bgKey1 === 'ctrl') return 'ctrl';
	if (bgKey1 === 'shift') return 'shift';

	throw new Error(`KB: Unsupported BG Key ${bgKey1}`);
}

function parseHotKey (hotkey: string): ParsedKey {
	if (hotkey.length === 1) {
		return {
			keyName: parseKeyName(hotkey),
			bgKey: 'plain',
		};
	}

	const segments = hotkey.toLowerCase().split('-');
	const len = segments.length;

	if (len !== 1 && len !== 2 && len !== 3) {
		throw new Error(`KB: Unknown key binding: "${hotkey}"`);
	}

	if (len === 1) {
		const keyName = parseKeyName(hotkey);

		return {
			keyName,
			bgKey: 'plain',
		};
	}
	else if (len === 2) {
		const [bgKey, rawKeyName] = segments;
		const keyName = parseKeyName(rawKeyName);

		return {
			keyName,
			bgKey: parseBgKey(bgKey),
		};
	}

	// len 3
	const [bgKey1, bgKey2, kName] = segments;

	return {
		keyName: parseKeyName(kName),
		bgKey: parseBgKey(bgKey1, bgKey2),
	};
}

// TODO: onKeydown/up
export function bindKey (whichKey: string, handlerFn: KeyHandler) {
	const {keyName, bgKey} = parseHotKey(whichKey);

	if (keyPressBindingsMap.has(keyName)) {
		const keyBindings = keyPressBindingsMap.get(keyName);

		if (!keyBindings) throw new Error(`KB: Expecting a key bindings object for "${keyName}"`);

		keyBindings[bgKey] = handlerFn;
	}
	else {
		// if (bindingsMap.get(keyName)[bgKey]) throw new Error('KB: Unbind existing handler first');

		keyPressBindingsMap.set(keyName, {[bgKey]: handlerFn});
	}
}

function getBgKey (ev: KeyboardEvent): keyof KeyBindings {
	const {ctrlKey, shiftKey} = ev; // TODO: , altKey, metaKey

	if (ctrlKey && shiftKey) return 'ctrlShift';
	if (ctrlKey) return 'ctrl';
	if (shiftKey) return 'shift';

	return 'plain';
}

document.addEventListener('keypress', (ev) => {
	const key = ev.code;

	if (keyPressBindingsMap.has(key)) {
		const keyBindings = keyPressBindingsMap.get(key);
		const bgKey = getBgKey(ev);

		if (!keyBindings) throw new Error(`KB: No keyBindings object for "${key}"`);

		keyBindings[bgKey]?.(ev);
	}
	else {
		// eslint-disable-next-line no-console
		console.log(`KB: keypress "${key}"`);
	}
});

document.addEventListener('keydown', (ev) => {
	const {key} = ev;

	if (keyPressBindingsMap.has(key)) {
		const keyBindings = keyPressBindingsMap.get(key);
		const bgKey = getBgKey(ev);

		if (!keyBindings) throw new Error(`KB: No keyBindings object for "${key}"`);

		// allows just "shift":
		// if (key.toLowerCase() === bgKey) {
		// 	keyBindings.plain?.(ev);
		// }
		// else {
		keyBindings[bgKey]?.(ev);
		// }
	}
	else {
		// eslint-disable-next-line no-console
		console.log(`KB: keydown "${key}"`);
	}
});




// TODO:ts BgKeys is a kind of a subset/partial of RealKey
/* function parseBgKeys2 (...bgKeys: Array<BgKeys> | Array<RealKey>): ParsedKey['bgKey'] {
	let ctrl = false;
	let alt = false;
	let shift = false;

	bgKeys.forEach((bgKey) => {
		if (bgKey === KeyNames.CTRL) ctrl = true;
		else if (bgKey === KeyNames.ALT) alt = true;
		else if (bgKey === KeyNames.SHIFT) shift = true;
		else throw new Error(`KB: Unsupported BG Key ${bgKey}`);
	});

	if (ctrl && shift) return BgKey.ControlShift;
	if (ctrl && alt) return BgKey.ControlAlt;
	if (ctrl) return BgKey.Control;
	if (alt) return BgKey.Alt;
	if (shift) return BgKey.Shift;

	return BgKey.Plain;
} */
