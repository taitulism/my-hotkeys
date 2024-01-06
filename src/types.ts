import {KeyNames} from './key-names-map';

export type ContextElement = HTMLElement | Document;

export type KeyHandler = (ev: KeyboardEvent) => void

export enum BgKey {
	Plain = '_',
	Shift = 'S',
	Alt = 'A',
	Meta = 'M',
	Control = 'C',
	ControlShift = 'CS',
	ControlAlt = 'CA',
	// ControlAltShift = 'CAS',
	// AltShift = 'AS',
	// more...
}

export const BgKeyValues = {
	ControlLeft: 1,
	ControlRight: 1,
	ShiftLeft: 2,
	ShiftRight: 2,
	AltLeft: 4,
	AltRight: 4,
	Meta: 8,
} as const;

export const EventBgKeyValues = {
	ctrlKey: 1,
	shiftKey: 2,
	altKey: 4,
	metaKey: 8,
} as const;

export const ResolvedBgKeyValues = {
	1: 'C',
	2: 'S',
	4: 'A',
	// 8: 'M',

	3: 'CS',
	5: 'CA',
	6: 'AS',
	7: 'CAS',
	// 9: 'CM',
	// 10: 'SM',
	// 11: 'CSM',
	// 12: 'AM',
	// 13: 'CAM',
	// 14: 'ASM',
	// 15: 'CASM',
} as const;

export type BgKeySum = keyof typeof ResolvedBgKeyValues;
export type BgKeyShortName = typeof ResolvedBgKeyValues[BgKeySum];

export type BgKeys =
	typeof KeyNames['CTRL'] |
	typeof KeyNames['SHIFT'] |
	typeof KeyNames['ALT']

export type BgKeyBindings = {
	[K in typeof ResolvedBgKeyValues[BgKeySum]]?: KeyHandler
}

// export type KeyBindings = {
// 	[K in BgKey]?: KeyHandler
// }

export type KeyAlias = keyof typeof KeyNames

export type RealKey = typeof KeyNames[KeyAlias]

export type ParsedKey = {
	key: RealKey
	bgKey?: typeof ResolvedBgKeyValues[BgKeySum]
}
