import {KeyAliases} from './key-names-map';

export type ContextElement = HTMLElement | Document;

export type KeyHandler = (ev: KeyboardEvent) => void

export enum BgKey {
	Plain = '_',
	Alt = 'A',
	Shift = 'S',
	Meta = 'M',
	Control = 'C',
	ControlAlt = 'CA',
	ControlShift = 'CS',
	// ControlAltShift = 'CAS',
	// AltShift = 'AS',
	// more...
}

export const BgKeyValues = {
	ControlLeft: 1,
	ControlRight: 1,
	AltLeft: 2,
	AltRight: 2,
	ShiftLeft: 4,
	ShiftRight: 4,
	Meta: 8,
} as const;

export const EventBgKeyValues = {
	ctrlKey: 1,
	altKey: 2,
	shiftKey: 4,
	metaKey: 8,
} as const;

export const UnifiedBgKey = {
	1: 'C',
	2: 'A',
	4: 'S',
	8: 'M',

	5: 'CS',
	3: 'CA',
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

export type BgKeySum = keyof typeof UnifiedBgKey;
export type UnifiedBgKey = typeof UnifiedBgKey[BgKeySum];

// TODO: + right
export type BgKeys =
	typeof KeyAliases['CTRL'] |
	typeof KeyAliases['SHIFT'] |
	typeof KeyAliases['ALT']

export type BgKeyHandlers = {
	[K in UnifiedBgKey]?: KeyHandler
}

export type KeyAlias = keyof typeof KeyAliases

export type KeyCode = typeof KeyAliases[KeyAlias]

export type ParsedKey = {
	targetKey: KeyCode
	unifiedBgKey?: UnifiedBgKey
}
