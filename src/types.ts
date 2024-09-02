import {AliasValue, SymbolKeyID} from './key-names-map';

export type ContextElement = HTMLElement | Document;

export type KeyHandler = (ev: KeyboardEvent) => void

// TODO: refactor all modifier types. Too many dups.
export const Control = 'Control';
export const Alt = 'Alt';
export const Shift = 'Shift';
export const Meta = 'Meta';

export const ModifiersNumValues = {
	Control: 1,
	Alt: 2,
	Shift: 4,
	Meta: 8,
} as const;

export const EventModifierValues = {
	ctrlKey: 1,
	altKey: 2,
	shiftKey: 4,
	metaKey: 8,
} as const;

export const UnifiedModifiersMap = {
	0: '_',
	1: 'C',
	2: 'A',
	3: 'CA',
	4: 'S',
	5: 'CS',
	6: 'AS',
	7: 'CAS',
	8: 'M',
	9: 'CM',
	10: 'AM',
	11: 'CAM',
	12: 'SM',
	13: 'CSM',
	14: 'ASM',
	15: 'CASM',
} as const;

export type UniModSum = keyof typeof UnifiedModifiersMap;
export type UnifiedModifier = typeof UnifiedModifiersMap[UniModSum];

export const Modifiers = [
	'Control',
	'Shift',
	'Alt',
	'Meta',
] as const;

export type Modifier = 'Control' | 'Alt' | 'Shift' | 'Meta'
export type RawModifier = Lowercase<Modifier>

export const RawModifiers = [
	'control',
	'ctrl',
	'shift',
	'alt',
	'meta',
] as const;


export type CombinationHandlers = {
	[K in UnifiedModifier]?: KeyHandler
}

// TODO:ts To remove the string type I need to type the string
// in the hotkeys Map<string, CombinationHandlers>
export type ParsedTargetKey = Lowercase<string> | AliasValue | SymbolKeyID

export type ParsedHotKey = {
	targetKey: ParsedTargetKey
	unifiedModifier: UnifiedModifier
}
