import type {ContextElement, BgKeyHandlers, KeyHandler, KeyCode} from './types';
import {
	PlainBgKeysMap,
	getPressedBgKey,
	hasPlainBgHotkey,
	isBgKey,
	isBgKeyPressed,
	isPlainBgHotkey,
	logKbEvent,
	parseHotKey,
} from './internals';

export const hotkey = function hotkey (ctxElm: ContextElement = document) {
	return new Hotkey(ctxElm);
};

class Hotkey {
	public plainHotkeys = new Map<string, KeyHandler>();
	public combinedHotkeys = new Map<string, BgKeyHandlers>();
	public debugMode: boolean = false;

	private dismissBgKeyUp: boolean = false;

	constructor (public ctxElm: ContextElement = document) {}

	public bindKey (hotkey: string, handlerFn: KeyHandler) {
		const {targetKey, unifiedBgKey} = parseHotKey(hotkey);

		if (unifiedBgKey) {
			const map = this.combinedHotkeys;

			if (map.has(targetKey)) {
				map.get(targetKey)![unifiedBgKey] = handlerFn;
			}
			else {
				map.set(targetKey, {[unifiedBgKey]: handlerFn});
			}
		}
		else {
			this.plainHotkeys.set(targetKey, handlerFn);
		}
	}

	public bindKeys (hotkeysObj: Record<string, KeyHandler>) {
		for (const [hotkey, keyHandler] of Object.entries(hotkeysObj)) {
			this.bindKey(hotkey, keyHandler);
		}
	}

	private keydownHandler = (ev: KeyboardEvent) => {
		this.debugMode && logKbEvent('🔻', ev);

		const keyCode = ev.code as KeyCode;
		const bgKeyDown = isBgKeyPressed(ev);

		if (isBgKey(ev.key)) {
			if (bgKeyDown) {
				const uniBgKey = getPressedBgKey(ev);

				this.dismissBgKeyUp = true;

				if (this.combinedHotkeys.has(ev.key)) {
					const handler = this.combinedHotkeys.get(ev.key)![uniBgKey];

					handler?.(ev);
				}
			}
		}
		else { // a, b
			if (bgKeyDown) {
				const uniBgKey = getPressedBgKey(ev);

				this.dismissBgKeyUp = true;

				if (this.combinedHotkeys.has(keyCode)) {
					const handler = this.combinedHotkeys.get(keyCode)![uniBgKey];

					handler?.(ev);
				}
			}
			else {
				const handler = this.plainHotkeys.get(keyCode);

				handler?.(ev);
			}
		}
	};

	private keyupHandler = (ev: KeyboardEvent) => {
		this.debugMode && logKbEvent('🔼', ev);

		// const keyCode = ev.code as KeyCode;

		if (!isBgKey(ev.key) || isBgKeyPressed(ev)) return;

		const handler = this.plainHotkeys.get(ev.key);

		if (handler) {
			if (this.dismissBgKeyUp) {
				this.dismissBgKeyUp = false;
			}
			else {
				handler(ev);
			}
		}
	};

	public mount () {
		this.ctxElm.addEventListener('keydown', this.keydownHandler as EventListener);
		this.ctxElm.addEventListener('keyup', this.keyupHandler as EventListener);
	}

	public unmount () {
		this.ctxElm.removeEventListener('keydown', this.keydownHandler as EventListener);
		this.ctxElm.removeEventListener('keyup', this.keyupHandler as EventListener);
	}
}
