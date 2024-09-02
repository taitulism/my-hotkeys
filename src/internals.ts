import {Aliases, ModifierAliases, ISymbol, SymbolIDs} from './key-names-map';
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

const isCapitalLetter = (str: string) => str.length === 1 && /[A-Z]/.test(str);
const extractDigit = (evKey: string) => evKey[evKey.length - 1];

const isDigitKey = (evKey: string) =>
	evKey.startsWith('Dig') || evKey.startsWith('Num') && /\d$/.test(evKey);

const isRawModifier = (rawKey: string): rawKey is RawModifier =>
	RawModifiers.includes(rawKey as RawModifier);

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
		const modifier = rawModifierKeys[i];
		const uppercased = modifier.toUpperCase();

		if (isRawModifier(uppercased)) {
			const modifier = ModifierAliases[uppercased];

			modifiersSet.add(modifier);
		}
		// TODO: else throw
	}

	return Array.from(modifiersSet);
}

function parseTargetKey (targetKey?: string): ParsedTargetKey {
	// TODO:test Invalid input. This can only happen when hotkey.split(-) fails somehow.
	if (targetKey === undefined) throw new Error('No Target Key');

	const upperKey = targetKey.toUpperCase();
	const lowerKey = targetKey.toLowerCase();

	if (isCapitalLetter(upperKey)) return upperKey;
	if (targetKey in SymbolIDs) return SymbolIDs[targetKey as ISymbol];
	if (lowerKey in Aliases) return Aliases[lowerKey as keyof typeof Aliases];

	return targetKey;
}

export function parseHotKey (hotkey: string): ParsedHotKey {
	if (hotkey === '-') {
		// TODO:!? 'ctrl-minus' / 'ctrl--' / 'ctrl+-'
		return {
			targetKey: '-',
			unifiedModifier: '_',
		};
	}

	const allKeys = hotkey.split('-');
	const targetKey = allKeys.pop();
	const modifiers = parseModifiers(allKeys); // after pop

	return {
		targetKey: parseTargetKey(targetKey),
		unifiedModifier: unifyHotkeyModifiers(modifiers),
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

export function unifyEventModifiers (ev: KeyboardEvent): UnifiedModifier {
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
