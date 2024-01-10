// import {getKeyCode} from '../../src/internals';
import {ContextElement} from '../../src/types';
import {
	EventKeyAndCode,
	type EventType,
	type Modifier,
	type TAliases,
} from './types';

function createKbEvent (eventType: EventType, key: TAliases, modifiers?: Array<Modifier>) {
	const ev: KeyboardEventInit = Object.assign({
		ctrlKey: false,
		altKey: false,
		shiftKey: false,
		metaKey: false,
	}, EventKeyAndCode[key]);

	if (modifiers) {
		modifiers.forEach((mod) => {
			ev[mod] = true;
		});
	}

	return new KeyboardEvent(eventType, ev);
}

export class KeyboardSimulator {
	constructor (public ctxElm: ContextElement = document) {}

	keyDown (key: TAliases, modifiers?: Array<Modifier>) {
		const keydownEvent = createKbEvent('keydown', key, modifiers);

		this.ctxElm.dispatchEvent(keydownEvent);
	}

	keyUp (key: TAliases, modifiers?: Array<Modifier>) {
		const keydownEvent = createKbEvent('keyup', key, modifiers);

		this.ctxElm.dispatchEvent(keydownEvent);
	}

	keypress (key: TAliases, modifiers?: Array<Modifier>) {
		this.keyDown(key, modifiers);
		this.keyUp(key, modifiers);
	}
}
