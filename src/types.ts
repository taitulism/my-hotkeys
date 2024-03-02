import {KeyAliases} from './key-names-map';

export type ContextElement = HTMLElement | Document;

export type KeyHandler = (ev: KeyboardEvent) => void

export const BgKeyValues = {
	Control: 1,
	ControlLeft: 1,
	ControlRight: 1,
	Alt: 2,
	AltLeft: 2,
	AltRight: 2,
	Shift: 4,
	ShiftLeft: 4,
	ShiftRight: 4,
	Meta: 8,
	MetaLeft: 8,
	MetaRight: 8,
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

// const bgKeysModifiers = {
// 	Control: 'ctrlKey',
// 	Shift: 'shiftKey',
// 	Alt: 'altKey',
// 	Meta: 'metaKey',
// } as const;

// const UnifiedPlainHotkeys = {
// 	C: ['ControlLeft'],
// 	A: ['AltLeft'],
// 	S: ['ShiftLeft'],
// 	M: ['MetaLeft', 'MetaRight'],
// 	CA: ['ControlLeft', 'AltLeft'],
// 	CS: ['ControlLeft', 'ShiftLeft'],
// 	AS: ['AltLeft', 'ShiftLeft'],
// 	CAS: ['ControlLeft', 'AltLeft', 'ShiftLeft'],
// } as const;

// export const PlainBgKeysMap = {
// 	'CTRL': ['ControlLeft', 'ControlRight'],
// 	'CONTROL': ['ControlLeft', 'ControlRight'],
// 	'ALT': ['AltLeft', 'AltRight'],
// 	'SHIFT': ['ShiftLeft', 'ShiftRight'],
// 	'META': ['MetaLeft', 'MetaRight'],
// } as const;

// const PlainBgKeys = Object.keys(PlainBgKeysMap);

// export function isPlainBgHotkey (hotkey: string) {
// 	return PlainBgKeys.includes(hotkey.toUpperCase());
// }
