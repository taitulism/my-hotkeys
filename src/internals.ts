import {ModifierAliases, SymbolIDs, type SymbolKeyID} from './key-names-map';
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
} from './types';

const isCapitalLetter = (str: string) => str.length === 1 && /[A-Z]/.test(str);
const extractDigit = (evKey: string) => evKey[evKey.length - 1];

const isDigitKey = (evKey: string) =>
	evKey.startsWith('Dig') || evKey.startsWith('Num') && /\d$/.test(evKey);

const isRawModifier = (rawKey: string): rawKey is RawModifier =>
	RawModifiers.includes(rawKey as RawModifier);

function parseModifiers (...modifiers: Array<Modifier>): UnifiedModifier {
	const modifiersSum = modifiers.reduce<number>((acc, modifier) => {
		const modNumVal = ModifiersNumValues[modifier];

		return acc + modNumVal;
	}, 0) as UniModSum;

	return UnifiedModifiersMap[modifiersSum];
}

// TODO:! should throw: more than 1 target, unknown key
export function parseHotKey (hotkey: string): ParsedHotKey {
	if (hotkey === '-') {
		// TODO: 'ctrl-minus' / 'ctrl--' / 'ctrl+-'
		return {
			targetKey: '-',
			unifiedModifier: '_',
		};
	}

	const keys = hotkey.split(/\s?-\s?/);
	const modifiers = new Set<Modifier>();
	let targetKey: string | SymbolKeyID | undefined;

	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		const upperKey = key.toUpperCase();

		if (isRawModifier(upperKey)) {
			const modifier = ModifierAliases[upperKey];

			modifiers.add(modifier);
			continue;
		}

		if (isCapitalLetter(upperKey)) {
			targetKey = upperKey;
		}
		else if (key in SymbolIDs) {
			targetKey = SymbolIDs[key as keyof typeof SymbolIDs];
		}
		else {
			targetKey = key;
		}
	}

	// TODO:! +test
	if (typeof targetKey === 'undefined') throw new Error('No Target Key');

	return {
		targetKey,
		unifiedModifier: parseModifiers(...Array.from(modifiers)),
	};
}

export function getMapKey (ev: KeyboardEvent, map: Map<string, CombinationHandlers>) {
	const {key: kValue, code: kId} = ev;

	if (map.has(kValue)) return kValue;
	if (map.has(kId)) return kId;

	const upperKeyValue = kValue.toUpperCase();

	if (isCapitalLetter(upperKeyValue)) return upperKeyValue;
	if (isDigitKey(kId)) return extractDigit(kId);

	return;
}

export const isSingleChar = (ev: KeyboardEvent) => {
	const {key: kValue, code: kId} = ev;

	return kValue.length === 1 && !kId.startsWith('Num'); // Numpad_
};

export function unifyModifiers (ev: KeyboardEvent): UnifiedModifier {
	const {key, ctrlKey, altKey, shiftKey, metaKey} = ev;

	let modifiersSum = 0;

	if (ctrlKey && key !== Control) modifiersSum += EventModifierValues.ctrlKey;
	if (altKey && key !== Alt) modifiersSum += EventModifierValues.altKey;
	if (shiftKey && key !== Shift) modifiersSum += EventModifierValues.shiftKey;
	if (metaKey && key !== Meta) modifiersSum += EventModifierValues.metaKey;

	return UnifiedModifiersMap[modifiersSum as UniModSum];
}

export function isEventModifier (evKey: string): evKey is Modifier {
	return Modifiers.includes(evKey as Modifier);
}

// export function isModifierPressed (ev: KeyboardEvent) {
// 	const {key, ctrlKey, altKey, shiftKey, metaKey} = ev;
// 	const modifiers = Number(ctrlKey) + Number(altKey) + Number(shiftKey) + Number(metaKey);

// 	return isEventModifier(key) ? modifiers > 1 : modifiers > 0;
// }
