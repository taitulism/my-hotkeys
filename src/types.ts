import type {AliasValue, SymbolKeyID} from './symbols-and-aliases';

export type ContextElement = HTMLElement | Document;
export type KeyHandler = (ev: KeyboardEvent) => void
export type IgnoreFn = (ev: KeyboardEvent) => boolean

const Control = 'Control';
const Alt = 'Alt';
const Shift = 'Shift';
const Meta = 'Meta';

export const Modifiers = {
	Control: 1,
	Alt: 2,
	Shift: 4,
	Meta: 8,
} as const;
export type Modifier = keyof typeof Modifiers

export const ModifierAliases = {
	control: Control,
	ctrl: Control,
	alt: Alt,
	shift: Shift,
	meta: Meta,
	cmd: Meta,
	command: Meta,
} as const;
export type ModifierAlias = keyof typeof ModifierAliases;

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

export type CombinationHandlers = {
	[K in UnifiedModifier]?: KeyHandler
}

// TODO:ts To remove the string type I need to type the string in the
// 		  hotkeys Map<string, CombinationHandlers>
export type ParsedTargetKey = AliasValue | SymbolKeyID | string

export type ParsedHotKey = {
	targetKey: ParsedTargetKey
	unifiedModifier: UnifiedModifier
	withShift?: boolean
}
