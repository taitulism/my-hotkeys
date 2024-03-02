import {ContextElement} from './types';

type KeyCode = string // TODO:ts all key codes
type KeyHandler = (
    isDown: boolean,
    bgKeys: Set<KeyCode>,
    ev: KeyboardEvent,
) => void

export class KeyboardLayer {
	public debugMode: boolean = false;
	public keysDown = new Set<KeyCode>();
	public events = new Map<KeyCode, Array<KeyHandler>>();

	constructor (public ctxElm: ContextElement = document) {}

	private keydownHandler = (ev: KeyboardEvent) => {
		const keyCode = ev.code;

		if (this.events.has(keyCode)) {
			const handlers = this.events.get(keyCode);

			handlers?.forEach((handler) => {
				handler(true, this.keysDown, ev);
			});
		}

		this.keysDown.add(keyCode);
	};

	private keyupHandler = (ev: KeyboardEvent) => {
		const keyCode = ev.code;

		this.keysDown.delete(keyCode);

		if (this.events.has(keyCode)) {
			const handlers = this.events.get(keyCode);

			handlers?.forEach((handler) => {
				handler(false, this.keysDown, ev);
			});
		}
	};

	public isPressed (keyCode: KeyCode) {
		return this.keysDown.has(keyCode);
	}

	public on (keyCode: KeyCode, keyHandler: KeyHandler) {
		if (this.events.has(keyCode)) {
			this.events.get(keyCode)!.push(keyHandler);
		}
		else {
			this.events.set(keyCode, [keyHandler]);
		}
	}

	public mount () {
		// TODO: prevent multi mounting
		this.ctxElm.addEventListener('keydown', this.keydownHandler as EventListener);
		this.ctxElm.addEventListener('keyup', this.keyupHandler as EventListener);

		return this;
	}

	public unmount () {
		this.ctxElm.removeEventListener('keydown', this.keyupHandler as EventListener);
		this.ctxElm.removeEventListener('keyup', this.keyupHandler as EventListener);

		return this;
	}

	public destruct () {
		this.unmount();
	}
}
