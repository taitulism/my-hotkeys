import {getKeyCode} from '../src/internals';
import {ContextElement} from '../src/types';

// const EventKeyAndCode = {
// 	ControlLeft: {key: 'Control', code: 'ControlLeft'},
// 	AltLeft: {key: 'Alt', code: 'AltLeft'},
// 	ShiftLeft: {key: 'Shift', code: 'ShiftLeft'},
// } as const;

const EventWithBgKey = {
	ControlLeft: 'ctrlKey',
	AltLeft: 'altKey',
	ShiftLeft: 'shiftKey',
	Meta: 'metaKey',
} as const;

export function simulateKeyPress (ctxElm: ContextElement, code: string, ...bgKeys: Array<string>) {
	let customEvent: KeyboardEventInit;

	if (bgKeys) {
		customEvent = {code};

		bgKeys.forEach((bgk) => {
			const bgKeyCode = getKeyCode(bgk) as keyof typeof EventWithBgKey;
			const evProp = EventWithBgKey[bgKeyCode];

			customEvent[evProp] = true;
		});
	}

	const ev = customEvent! ?? {code};

	const kbEvDown = new KeyboardEvent('keydown', ev);
	const kbEvUp = new KeyboardEvent('keyup', ev);

	ctxElm.dispatchEvent(kbEvDown);
	ctxElm.dispatchEvent(kbEvUp);
}
