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

/* TODO:idea
	If keyDown saves keys, keyUp (or keysUp) could be called with no
	args to release them in reverse.
	Maybe .hold & .release and keep the current ones low level.
*/

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

	// TODO:test multiple keys & return
	public keyDown (...keys: Array<TAliases>) {
		return keys.map((key) => {
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
		});
	}

	// TODO:test multiple keys & return
	public keyUp (...keys: Array<TAliases>) {
		return keys.map((key) => {
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
		});
	}

	// TODO:test & reuse this.keyUp & return
	public keyUpRev (...keys: Array<TAliases>) {
		return keys.reverse().map((key) => {
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
		});
	}

	// TODO:test multi & return
	public keyPress (...keys: Array<TAliases>) {
		return keys.map((key) => [
			this.keyDown(key),
			this.keyUp(key),
		]);
	}
}
