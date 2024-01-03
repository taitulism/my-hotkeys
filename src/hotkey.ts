import type {ContextElement, KeyBindings, KeyHandler} from './types';
import {getBgKey, isBgKeyDown, parseHotKey} from './internals';

export const hotkey = function hotkey (ctxElm: ContextElement = document) {
	return new Hotkey(ctxElm);
};

class Hotkey {
	public plainKeyBindingsMap = new Map<string, KeyHandler>();
	public keyBindingsMap = new Map<string, KeyBindings>();
	public debugMode: boolean = false;

	constructor (public ctxElm: ContextElement = document) {}

	public bindKey (hotkey: string, handlerFn: KeyHandler) {
		const {key, bgKey} = parseHotKey(hotkey);

		if (!bgKey) {
			this.plainKeyBindingsMap.set(key, handlerFn);
		}
		else {
			const keyBindingsObj = this.keyBindingsMap.get(key);

			if (keyBindingsObj) {
				keyBindingsObj[bgKey] = handlerFn;
			}
			else {
				this.keyBindingsMap.set(key, {[bgKey]: handlerFn});
			}
		}
	}

	public bindKeys (hotkeysObj: Record<string, KeyHandler>) {
		for (const [hotkey, keyHandler] of Object.entries(hotkeysObj)) {
			this.bindKey(hotkey, keyHandler);
		}
	}

	private keyupHandler = (ev: KeyboardEvent) => {
		this.debugMode && console.log(ev);

		const keyName = ev.code;

		if (isBgKeyDown(ev)) {
			if (this.keyBindingsMap.has(keyName)) {
				const bgKey = getBgKey(ev);
				const handler = this.keyBindingsMap.get(keyName)![bgKey];

				handler?.(ev);
			}
		}
		else {
			const handler = this.plainKeyBindingsMap.get(keyName);

			handler?.(ev);
		}
	};

	public mountKeyupHook () {
		this.ctxElm.addEventListener('keyup', this.keyupHandler as EventListener);
	}

	public unmountKeyupHook () {
		this.ctxElm.removeEventListener('keyup', this.keyupHandler as EventListener);
	}
}
