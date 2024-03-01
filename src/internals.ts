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
} from './types';

// TODO: rename. it's no longer just keyCodes
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
	const [targetKey, ...bgKeys] = hotkey
		.split(/\s?-\s?/)
		.map(getKeyCode)
		.reverse() as Array<KeyCode>;

	return {
		targetKey,
		unifiedBgKey: parseBgKeys(...bgKeys as Array<BgKeys>),
	};
}

export function isBgKeyPressed (ev: KeyboardEvent) {
	const {key, ctrlKey, altKey, shiftKey, metaKey} = ev;
	const modifiers = Number(ctrlKey) + Number(altKey) + Number(shiftKey) + Number(metaKey);

	return isBgKey(key) ? modifiers > 1 : modifiers > 0;
}

const Control = 'Control';
const Alt = 'Alt';
const Shift = 'Shift';
const Meta = 'Meta';

export function getPressedBgKey (ev: KeyboardEvent) {
	const {key, ctrlKey, altKey, shiftKey, metaKey} = ev;

	let bgKeysSum = 0;

	if (ctrlKey && key !== Control) bgKeysSum += EventBgKeyValues.ctrlKey;
	if (altKey && key !== Alt) bgKeysSum += EventBgKeyValues.altKey;
	if (shiftKey && key !== Shift) bgKeysSum += EventBgKeyValues.shiftKey;
	if (metaKey && key !== Meta) bgKeysSum += EventBgKeyValues.metaKey;

	return UnifiedBgKey[bgKeysSum as BgKeySum];
}

const bgKeys = [
	'Control',
	'Shift',
	'Alt',
	'Meta',
];

export function isBgKey (evKey: string) {
	return bgKeys.includes(evKey);
}
