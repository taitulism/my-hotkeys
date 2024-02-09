export const ModifiersEventKeyAndCode = {
	Ctrl: {key: 'Control', code: 'ControlLeft'},
	Alt: {key: 'Alt', code: 'AltLeft'},
	Shift: {key: 'Shift', code: 'ShiftLeft'},
	Meta: {key: 'Meta', code: 'MetaLeft'},
} as const;

export const EventKeyAndCode = {
	A: {key: 'a', code: 'KeyA'},
	B: {key: 'b', code: 'KeyB'},
	C: {key: 'c', code: 'KeyC'},
	...ModifiersEventKeyAndCode,
} as const;

export const Modifiers = {
	Ctrl: 'Ctrl',
	Alt: 'Alt',
	Shift: 'Shift',
	Meta: 'Meta',
} as const;

export const EventModifiers = {
	Ctrl: 'ctrlKey',
	Alt: 'altKey',
	Shift: 'shiftKey',
	Meta: 'metaKey',
} as const;

export type EventType = 'keydown' | 'keyup';
export type DispatchCall = [KeyboardEvent];
export type TAliases = keyof typeof EventKeyAndCode;
export type TModifier = keyof typeof Modifiers;
export type EventModifier = `${Lowercase<TModifier>}Key`;
export type IsModifierDown = `is${TModifier}Down`;
export const isModifier = (str: string): str is TModifier => str in Modifiers;
