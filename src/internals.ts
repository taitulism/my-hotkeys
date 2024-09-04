import {Aliases, ModifierAliases, ISymbol, SymbolIDs, Alias} from './key-names-map';
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

const isRawModifier = (rawKey: string): rawKey is RawModifier =>
	RawModifiers.includes(rawKey as RawModifier);

function unifyHotkeyModifiers (modifiers: Array<Modifier>): UnifiedModifier {
	const modifiersSum = modifiers.reduce<number>((acc, modifier) => {
		const modNumVal = ModifiersNumValues[modifier];

		return acc + modNumVal;
	}, 0) as UniModSum;

	return UnifiedModifiersMap[modifiersSum];
}

function parseModifiers (rawModifierKeys: Array<Lowercase<string>>) {
	if (rawModifierKeys.length === 0) return [];

	const modifiersSet = new Set<Modifier>();

	for (let i = 0; i < rawModifierKeys.length; i++) {
		const rawModifier = rawModifierKeys[i];

		if (isRawModifier(rawModifier)) {
			modifiersSet.add(ModifierAliases[rawModifier]);
		}
		else {
			// TODO:test Invalid input.
			throw new Error('A non-modifier cannot be used as a modifier');
		}
	}

	return Array.from(modifiersSet);
}

function parseTargetKey (withShift: boolean, targetKey?: Lowercase<string>): ParsedTargetKey {
	// TODO:test Invalid input. This can only happen when hotkey.split(-) fails somehow.
	if (targetKey === undefined) throw new Error('No Target Key');

	if (targetKey in SymbolIDs && withShift) return SymbolIDs[targetKey as ISymbol];
	if (targetKey in Aliases) return Aliases[targetKey as Alias];

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

	const allKeys = hotkey.toLowerCase().split('-') as Array<Lowercase<string>>;
	const targetKey = allKeys.pop();
	const modifiers = parseModifiers(allKeys); // after pop

	return {
		targetKey: parseTargetKey(modifiers.includes(Shift), targetKey),
		unifiedModifier: unifyHotkeyModifiers(modifiers),
	};
}

// ------------------------------------------------------------------------------

const isDigitKey = (keyId: string) =>
	keyId.startsWith('Dig') || keyId.startsWith('Num') && /\d$/.test(keyId);

const extractDigit = (evKey: string) => evKey[evKey.length - 1];

export function isEventModifier (evKey: string): evKey is Modifier {
	return Modifiers.includes(evKey as Modifier);
}

// TODO:! return CombinationHandlers instof the map key
export function getTargetKey (ev: KeyboardEvent, map: Map<string, CombinationHandlers>) {
	const {key, code: keyId, shiftKey} = ev;
	const value = key.toLowerCase();
	// const id = code.toLowerCase();

	if (map.has(value)) return value;
	if (map.has(keyId)) return keyId;

	// e.g. bind 'shift-2'. When 'shift-2' event has '@', return '2'.
	if (shiftKey && isDigitKey(keyId)) return extractDigit(keyId);

	return key;
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

const isSingleChar = (ev: KeyboardEvent) =>
	ev.key.length === 1 && !ev.code.startsWith('Num'); // Excluede Numpad symbols

const isShiftPressed = (unifiedModifier: UnifiedModifier) =>
	unifiedModifier.includes('S');

// e.g. bind '*'. When 'shift-8' event has '*' but unifiedModifier is 'S' so no match.
export const implicitShift = (ev: KeyboardEvent, unifiedModifier: UnifiedModifier) =>
	isShiftPressed(unifiedModifier) && isSingleChar(ev);

export const removeShift = (uniModWithShift: UnifiedModifier): UnifiedModifier => (
	uniModWithShift.replace('S', '') || '_'
) as UnifiedModifier;


// export function isModifierPressed (ev: KeyboardEvent) {
// 	const {key, ctrlKey, altKey, shiftKey, metaKey} = ev;
// 	const modifiers = Number(ctrlKey) + Number(altKey) + Number(shiftKey) + Number(metaKey);

// 	return isEventModifier(key) ? modifiers > 1 : modifiers > 0;
// }
