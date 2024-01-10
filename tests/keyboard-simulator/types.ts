
export type EventType = 'keydown' | 'keyup';
export type Modifier = 'ctrlKey' | 'altKey' | 'shiftKey' | 'metaKey';

export const EventKeyAndCode = {
	A: {key: 'a', code: 'KeyA'},
	B: {key: 'b', code: 'KeyB'},
	C: {key: 'c', code: 'KeyC'},
	Control: {key: 'Control', code: 'ControlLeft'},
	Alt: {key: 'Alt', code: 'AltLeft'},
	ShiftLeft: {key: 'Shift', code: 'ShiftLeft'},
} as const;

export type TAliases = keyof typeof EventKeyAndCode;
// const TestAliases = Object.keys(EventKeyAndCode);
