import {KeyAliases} from './key-names-map';
import {
	Control,
	Alt,
	Shift,
	Meta,
	ModifiersNumValues,
	UnifiedModifiersMap,
	EventModifierValues,
	Modifiers,
	type UnifiedModifier,
	type UniModSum,
	type Modifier,
	type KeyAlias,
	type ParsedHotKey,
	type KeyCode,
} from './types';

export function isModifier (evKey: Modifier | string): evKey is Modifier {
	return Modifiers.includes(evKey as Modifier);
}

// TODO: rename. it's no longer just keyCodes
export function getKeyCode (keyAlias: string): KeyCode {
	const keyCode = KeyAliases[keyAlias.toUpperCase() as KeyAlias]; // TODO: use .hasOwnProperty ?

	if (!keyCode) throw new Error(`KB: Unknown key "${keyAlias}"`);

	return keyCode;
}

function parseModifiers (...modifiers: Array<Modifier>): UnifiedModifier {
	const modifiersSum = modifiers.reduce<number>((acc, modifier) => {
		const modNumVal = ModifiersNumValues[modifier];

		return acc + modNumVal;
	}, 0) as UniModSum;

	return UnifiedModifiersMap[modifiersSum];
}

export function parseHotKey (hotkey: string): ParsedHotKey {
	const [targetKey, ...modifiers] = hotkey
		.split(/\s?-\s?/)
		.map(getKeyCode)
		.reverse() as Array<KeyCode>;

	return {
		targetKey,
		unifiedModifier: parseModifiers(...modifiers as Array<Modifier>),
	};
}

export function isModifierPressed (ev: KeyboardEvent) {
	const {key, ctrlKey, altKey, shiftKey, metaKey} = ev;
	const modifiers = Number(ctrlKey) + Number(altKey) + Number(shiftKey) + Number(metaKey);

	return isModifier(key) ? modifiers > 1 : modifiers > 0;
}

export function unifyModifiers (ev: KeyboardEvent): UnifiedModifier {
	const {key, ctrlKey, altKey, shiftKey, metaKey} = ev;

	let modifiersSum = 0;

	if (ctrlKey && key !== Control) modifiersSum += EventModifierValues.ctrlKey;
	if (altKey && key !== Alt) modifiersSum += EventModifierValues.altKey;
	if (shiftKey && key !== Shift) modifiersSum += EventModifierValues.shiftKey;
	if (metaKey && key !== Meta) modifiersSum += EventModifierValues.metaKey;

	return UnifiedModifiersMap[modifiersSum as UniModSum];
}
