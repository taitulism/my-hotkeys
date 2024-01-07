import {KeyAliases} from './key-names-map';
import {
	BgKeySum,
	BgKeyValues,
	ResolvedBgKeyValues,
	EventBgKeyValues,
	type BgKeys,
	type KeyAlias,
	type ParsedKey,
	type KeyCode,
} from './types';

export function getKeyCode (keyAlias: string): KeyCode {
	const keyCode = KeyAliases[keyAlias.toUpperCase() as KeyAlias]; // TODO: use .hasOwnProperty ?

	if (!keyCode) throw new Error(`KB: Unknown key "${keyAlias}"`);

	return keyCode;
}

function parseBgKeys (...bgKeys: Array<BgKeys>): ParsedKey['bgKey'] {
	const bgKeysSum = bgKeys.reduce((acc, bgKey) => acc + BgKeyValues[bgKey], 0);

	return ResolvedBgKeyValues[bgKeysSum as BgKeySum];
}

export function parseHotKey (hotkey: string): ParsedKey {
	const keys = hotkey.split(/\s?-\s?/).map(getKeyCode) as Array<KeyCode>;
	// const len = segments.length;

	let key: ParsedKey['key'];
	let bgKey: ParsedKey['bgKey'];

	if (keys.length === 1) { // happy path
		[key] = keys;
		// bgKey = BgKey.Plain;
	}
	else {
		const [targetKey, ...bgKeys] = keys.reverse();

		key = targetKey;
		bgKey = parseBgKeys(...bgKeys as Array<BgKeys>);
	}

	return {key, bgKey};
}

export function isBgKeyPressed (ev: KeyboardEvent) {
	const {ctrlKey, altKey, shiftKey, metaKey} = ev;

	return ctrlKey || altKey || shiftKey || metaKey;
}

export function getPressedBgKey (ev: KeyboardEvent) {
	const {ctrlKey, altKey, shiftKey, metaKey} = ev;

	let bgKeysSum = 0;

	if (ctrlKey) bgKeysSum += EventBgKeyValues.ctrlKey;
	if (altKey) bgKeysSum += EventBgKeyValues.altKey;
	if (shiftKey) bgKeysSum += EventBgKeyValues.shiftKey;
	if (metaKey) bgKeysSum += EventBgKeyValues.metaKey;

	return ResolvedBgKeyValues[bgKeysSum as BgKeySum];
}
