import {KeyNames} from './key-names-map';
import {
	BgKeyValues,
	ResolvedBgKeyValues,
	BgKeySum,
	type BgKeys,
	type KeyAlias,
	type ParsedKey,
	type RealKey,
	EventBgKeyValues,
} from './types';

export function getRealKeyName (keyName: string): RealKey {
	const realName = KeyNames[keyName as KeyAlias]; // TODO: use .hasOwnProperty ?

	if (!realName) throw new Error(`KB: Unknown key "${keyName}"`);

	return realName;
}

function parseBgKeys (...bgKeys: Array<BgKeys>): ParsedKey['bgKey'] {
	const bgKeysSum = bgKeys.reduce((acc, bgKey) => acc + BgKeyValues[bgKey], 0);

	return ResolvedBgKeyValues[bgKeysSum as BgKeySum];
}

export function parseHotKey (hotkey: string): ParsedKey {
	// TODO: it looks like the uppercasing better be in the getRealName fn (also used by tests)
	const keys = hotkey.toUpperCase().split(/\s?-\s?/).map(getRealKeyName) as Array<RealKey>;
	// const len = segments.length;

	let key: ParsedKey['key'];
	let bgKey: ParsedKey['bgKey'];

	if (keys.length === 1) { // happy path
		[key] = keys;
		// bgKey = BgKey.Plain;
	}
	else {
		const [actualKey, ...bgKeys] = keys.reverse();

		key = actualKey;
		bgKey = parseBgKeys(...bgKeys as Array<BgKeys>);
	}

	return {key, bgKey};
}

export function isBgKeyDown (ev: KeyboardEvent) {
	const {ctrlKey, altKey, shiftKey, metaKey} = ev;

	return ctrlKey || altKey || shiftKey || metaKey;
}

export function getBgKey (ev: KeyboardEvent) {
	const {ctrlKey, altKey, shiftKey, metaKey} = ev;

	let bgKeysSum = 0;

	if (ctrlKey) bgKeysSum += EventBgKeyValues.ctrlKey;
	if (altKey) bgKeysSum += EventBgKeyValues.altKey;
	if (shiftKey) bgKeysSum += EventBgKeyValues.shiftKey;
	if (metaKey) bgKeysSum += EventBgKeyValues.metaKey;

	return ResolvedBgKeyValues[bgKeysSum as BgKeySum];
}
