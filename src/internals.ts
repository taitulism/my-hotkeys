import {Aliases, ModifierAliases, Alias} from './key-names-map';
import {
	Control,
	Alt,
	Shift,
	Meta,
	ModifiersNumValues,
	UnifiedModifiersMap,
	EventModifierValues,
	Modifiers,
	RawModifiers,
	RawModifier,
	type Modifier,
	type UnifiedModifier,
	type UniModSum,
	type ParsedHotKey,
	CombinationHandlers,
	ParsedTargetKey,
} from './types';

const isLetter = (str: string) => str.length === 1 && /[a-zA-Z]/.test(str);

const isAlias = (targetKey: string): targetKey is Alias =>
	targetKey in Aliases;

const isRawModifier = (rawKey: string): rawKey is RawModifier =>
	RawModifiers.includes(rawKey as RawModifier);

function validateHotkey (hotkey: string) {
	if (!hotkey) {
		throw new Error('Invalid Hotkey: Empty String');
	}

	if (hotkey.startsWith('-') || hotkey.endsWith('-') || /--/.test(hotkey)) {
		throw new Error(`Invalid Hotkey: "${hotkey}"`);
	}
}

function unifyHotkeyModifiers (modifiers: Array<Modifier>): UnifiedModifier {
	const modifiersSum = modifiers.reduce<number>((acc, modifier) => {
		const modNumVal = ModifiersNumValues[modifier];

		return acc + modNumVal;
	}, 0) as UniModSum;

	return UnifiedModifiersMap[modifiersSum];
}

function parseModifiers (rawModifierKeys: Array<string>) {
	if (rawModifierKeys.length === 0) return [];

	const modifiersSet = new Set<Modifier>();

	for (let i = 0; i < rawModifierKeys.length; i++) {
		const rawModifier = rawModifierKeys[i].toLowerCase();

		if (isRawModifier(rawModifier)) {
			modifiersSet.add(ModifierAliases[rawModifier]);
		}
		else {
			throw new Error(`Unknown Modifier: "${rawModifier}"`);
		}
	}

	return Array.from(modifiersSet);
}

const parseTargetKey = (targetKey: string): ParsedTargetKey => {
	const lower = targetKey.toLowerCase();

	return isLetter(targetKey)
		? lower
		: isAlias(lower)
			? Aliases[lower]
			: targetKey;
};

export function parseHotKey (hotkey: string): ParsedHotKey {
	if (hotkey === '-') {
		return {
			targetKey: '-',
			unifiedModifier: '_',
		};
	}

	validateHotkey(hotkey);

	const allKeys = hotkey.split('-') as Array<string>;
	const targetKey = allKeys.pop()!;
	const modifiers = parseModifiers(allKeys); // after popping the target

	return {
		targetKey: parseTargetKey(targetKey),
		unifiedModifier: unifyHotkeyModifiers(modifiers),
		withShift: modifiers.includes(Shift),
	};
}

// ------------------------------------------------------------------------------

const isDigitKey = (keyId: string) => keyId.startsWith('Dig');
const isNumpadKey = (keyId: string) => keyId.startsWith('Num');
const isNumpadNumber = (keyId: string) => keyId.startsWith('Num') && /\d$/.test(keyId);
const isNumberKey = (keyId: string) => isDigitKey(keyId) || isNumpadNumber(keyId);
const extractDigit = (keyId: string) => keyId[keyId.length - 1];

export function isEventModifier (evKey: string): evKey is Modifier {
	return Modifiers.includes(evKey as Modifier);
}

export function getHandlers (
	ev: KeyboardEvent,
	map: Map<string, CombinationHandlers>,
): CombinationHandlers | undefined {
	const {key: rawValue, code: keyId, shiftKey} = ev;
	const value = isLetter(rawValue) ? rawValue.toLowerCase() : rawValue;

	if (map.has(value)) return map.get(value);
	if (map.has(keyId)) return map.get(keyId);

	// e.g. bind 'shift-2'. When 'shift-2' event has '@', return '2'.
	if (shiftKey && isNumberKey(keyId)) {
		const digit = extractDigit(keyId);

		if (map.has(digit)) {
			return map.get(digit)!;
		}
	}
}

export function unifyEventModifiers (ev: KeyboardEvent): UnifiedModifier {
	const {key, ctrlKey, altKey, shiftKey, metaKey} = ev;

	let modifiersSum = 0;

	if (ctrlKey && key !== Control) modifiersSum += EventModifierValues.ctrlKey;
	if (altKey && key !== Alt) modifiersSum += EventModifierValues.altKey;
	if (shiftKey && key !== Shift) modifiersSum += EventModifierValues.shiftKey;
	if (metaKey && key !== Meta) modifiersSum += EventModifierValues.metaKey;

	return UnifiedModifiersMap[modifiersSum as UniModSum];
}

const isSingleChar = (ev: KeyboardEvent) => ev.key.length === 1;

// e.g. bind '@'. When 'shift-2' event has '@' but unifiedModifier is 'S' so no match.
export const implicitShift = (ev: KeyboardEvent) =>
	ev.shiftKey && isSingleChar(ev) && !isNumpadKey(ev.code);
	// Numpad symbols are not affected by shift

export const removeShift = (uniModWithShift: UnifiedModifier): UnifiedModifier => (
	uniModWithShift.replace('S', '') || '_'
) as UnifiedModifier;



// const isShiftPressed = (unifiedModifier: UnifiedModifier) => unifiedModifier.includes('S');

// export function isModifierPressed (ev: KeyboardEvent) {
// 	const {key, ctrlKey, altKey, shiftKey, metaKey} = ev;
// 	const modifiers = Number(ctrlKey) + Number(altKey) + Number(shiftKey) + Number(metaKey);

// 	return isEventModifier(key) ? modifiers > 1 : modifiers > 0;
// }
