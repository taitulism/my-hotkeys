import {ContextElement} from '../../src/types';
import {
	EventKeyAndCode,
	IsModifierDown,
	EventModifiers,
	isModifier,
	type EventType,
	type TAliases,
	type EventModifier,
} from './types';

const defaultEventModifiers: KeyboardEventInit = {
	ctrlKey: false,
	altKey: false,
	shiftKey: false,
	metaKey: false,
};

function keyBoardEventCreator (eventType: EventType) {
	return function createKbEvent (key: TAliases, modifiers?: Array<EventModifier>) {
		const ev: KeyboardEventInit = Object.assign({}, defaultEventModifiers, EventKeyAndCode[key]);

		if (modifiers) {
			modifiers.forEach((mod) => {
				ev[mod] = true;
			});
		}

		return new KeyboardEvent(eventType, ev);
	};
}

const createKeyDownEvent = keyBoardEventCreator('keydown');
const createKeyUpEvent = keyBoardEventCreator('keyup');

export class KeyboardSimulator {
	private isCtrlDown = false;
	private isAltDown = false;
	private isShiftDown = false;
	private isMetaDown = false;

	constructor (public ctxElm: ContextElement = document) {}

	private isModifierDown () {
		return this.isCtrlDown || this.isAltDown || this.isShiftDown || this.isMetaDown;
	}

	public reset () {
		this.isCtrlDown = false;
		this.isAltDown = false;
		this.isShiftDown = false;
		this.isMetaDown = false;
	}

	public keyDown (key: TAliases) {
		const modifiers: Array<EventModifier> = [];

		if (isModifier(key)) {
			const holdModifierDown = (`is${key}Down`) as IsModifierDown;

			this[holdModifierDown] = true;
			modifiers.push(EventModifiers[key]);
		}

		if (this.isModifierDown()) {
			if (this.isCtrlDown) modifiers.push(EventModifiers.Ctrl);
			if (this.isAltDown) modifiers.push(EventModifiers.Alt);
			if (this.isShiftDown) modifiers.push(EventModifiers.Shift);
			if (this.isMetaDown) modifiers.push(EventModifiers.Meta);
		}

		const keyDownEvent = createKeyDownEvent(key, modifiers);

		return this.ctxElm.dispatchEvent(keyDownEvent);
	}

	public keyUp (key: TAliases) {
		const modifiers: Array<EventModifier> = [];

		if (this.isModifierDown()) {
			if (isModifier(key)) {
				if (key === 'Ctrl') this.isCtrlDown = false;
				if (key === 'Alt') this.isAltDown = false;
				if (key === 'Shift') this.isShiftDown = false;
				if (key === 'Meta') this.isMetaDown = false;
			}

			if (this.isCtrlDown) modifiers.push(EventModifiers.Ctrl);
			if (this.isAltDown) modifiers.push(EventModifiers.Alt);
			if (this.isShiftDown) modifiers.push(EventModifiers.Shift);
			if (this.isMetaDown) modifiers.push(EventModifiers.Meta);
		}

		const keyUpEvent = createKeyUpEvent(key, modifiers);

		return this.ctxElm.dispatchEvent(keyUpEvent);
	}

	public keyPress (key: TAliases) {
		this.keyDown(key);
		this.keyUp(key);
	}
}
