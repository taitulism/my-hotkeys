import {KeyAliases} from './key-names-map';
import {
	BgKeyValues,
	UnifiedBgKey,
	EventBgKeyValues,
	type BgKeySum,
	type BgKeys,
	type KeyAlias,
	type ParsedKey,
	type KeyCode,
	type KeyHandler,
} from './types';

export function getKeyCode (keyAlias: string): KeyCode {
	const keyCode = KeyAliases[keyAlias.toUpperCase() as KeyAlias]; // TODO: use .hasOwnProperty ?

	if (!keyCode) throw new Error(`KB: Unknown key "${keyAlias}"`);

	return keyCode;
}

function parseBgKeys (...bgKeys: Array<BgKeys>): ParsedKey['unifiedBgKey'] {
	const bgKeysSum = bgKeys.reduce((acc, bgKey) => acc + BgKeyValues[bgKey], 0);

	return UnifiedBgKey[bgKeysSum as BgKeySum];
}

export function parseHotKey (hotkey: string): ParsedKey {
	const keys = hotkey.split(/\s?-\s?/).map(getKeyCode) as Array<KeyCode>;
	// const len = segments.length;

	let targetKey: ParsedKey['targetKey'];
	let unifiedBgKey: ParsedKey['unifiedBgKey'];

	if (keys.length === 1) { // happy path
		[targetKey] = keys;
		// bgKey = BgKey.Plain;
	}
	else {
		const [_targetKey, ...bgKeys] = keys.reverse();

		targetKey = _targetKey;
		unifiedBgKey = parseBgKeys(...bgKeys as Array<BgKeys>);
	}

	return {targetKey, unifiedBgKey};
}

const bgKeys = [
	'Control',
	'Shift',
	'Alt',
	'Meta',
];

const bgKeysModifiers = {
	Control: 'ctrlKey',
	Shift: 'shiftKey',
	Alt: 'altKey',
	Meta: 'metaKey',
} as const;

export function isBgKeyPressed (ev: KeyboardEvent) {
	const {key, ctrlKey, altKey, shiftKey, metaKey} = ev;
	const modifiers = Number(ctrlKey) + Number(altKey) + Number(shiftKey) + Number(metaKey);

	return isBgKey(key) ? modifiers > 1 : modifiers > 0;
}

const Control = 'Control';
const Shift = 'Shift';
const Alt = 'Alt';
const Meta = 'Meta';

export function getPressedBgKey (ev: KeyboardEvent) {
	const {key, ctrlKey, altKey, shiftKey, metaKey} = ev;

	let bgKeysSum = 0;

	if (ctrlKey && key !== Control) bgKeysSum += EventBgKeyValues.ctrlKey;
	if (altKey && key !== Shift) bgKeysSum += EventBgKeyValues.altKey;
	if (shiftKey && key !== Alt) bgKeysSum += EventBgKeyValues.shiftKey;
	if (metaKey && key !== Meta) bgKeysSum += EventBgKeyValues.metaKey;

	return UnifiedBgKey[bgKeysSum as BgKeySum];
}

export function isBgKey (evKey: string) {
	return bgKeys.includes(evKey);
}

export const PlainBgKeysMap = {
	'CTRL': ['ControlLeft', 'ControlRight'],
	'CONTROL': ['ControlLeft', 'ControlRight'],
	'ALT': ['AltLeft', 'AltRight'],
	'SHIFT': ['ShiftLeft', 'ShiftRight'],
} as const;

const PlainBgKeys = Object.keys(PlainBgKeysMap);

export function isPlainBgHotkey (hotkey: string) {
	return PlainBgKeys.includes(hotkey.toUpperCase());
}

const UnifiedPlainHotkeys = {
	C: ['ControlLeft'],
	S: ['ShiftLeft'],
	A: ['AltLeft'],
	CS: ['ControlLeft', 'ShiftLeft'],
	CA: ['ControlLeft', 'AltLeft'],
	AS: ['AltLeft', 'ShiftLeft'],
	CAS: ['ControlLeft', 'AltLeft', 'ShiftLeft'],
} as const;

export function hasPlainBgHotkey (bgKey: UnifiedBgKey, map: Map<string, KeyHandler>) {
	const bgKeys = UnifiedPlainHotkeys[bgKey];
	const len = bgKey.length;

	for (let i = 0; i < len; i++) {
		const bgk = bgKeys[i];

		if (!map.has(bgk)) return false;
	}

	return true;
}

export function logKbEvent (eventType: string, ev: KeyboardEvent) {
	const {code, key, ctrlKey, altKey, shiftKey, metaKey} = ev;
	const hasBgPressed = ctrlKey || altKey || shiftKey || metaKey;
	const head = eventType + rightPad(key, 7);

	const bgkHead = hasBgPressed ? '[ ' : '';
	const bgkTail = hasBgPressed ? ']' : '';

	/* eslint-disable-next-line */
	const bgKeys = `${ctrlKey ? 'ctrl ' : ''}${altKey ? 'alt ' : ''}${shiftKey ? 'shift ' : ''}${metaKey ? 'meta ' : ''}`;
	const extras = `| id:${code} `;

	console.log(head, rightPad(bgkHead + bgKeys + bgkTail, 21), extras);
}

function rightPad (str: string, pad: number) {
	const len = str.length;
	const needCount = pad - len;

	if (needCount > 0) {
		return str + ' '.repeat(needCount);
	}

	return str;
}
