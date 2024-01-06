import type {BgKeyShortName, ContextElement, KeyBindings, KeyHandler, RealKey} from './types';
import {getBgKey, isBgKeyDown, parseHotKey} from './internals';

export const hotkey = function hotkey (ctxElm: ContextElement = document) {
	return new Hotkey(ctxElm);
};

// TODO: obj as const
function hasPlainBgKeypress (bgKey: BgKeyShortName, map: Map<string, KeyHandler>) {
	return (
		bgKey === 'C' && map.has('ControlLeft') ||
		bgKey === 'S' && map.has('ShiftLeft') ||
		bgKey === 'A' && map.has('AltLeft') ||
		bgKey === 'CS' && map.has('ControlLeft') && map.has('ShiftLeft') ||
		bgKey === 'CA' && map.has('ControlLeft') && map.has('AltLeft') ||
		bgKey === 'AS' && map.has('AltLeft') && map.has('ShiftLeft') ||
		bgKey === 'CAS' && map.has('ControlLeft') && map.has('AltLeft') && map.has('ShiftLeft')
	);
}

function isBgKey (keyName: RealKey) {
	return (
		keyName === 'ControlLeft' ||
		keyName === 'ShiftLeft' ||
		keyName === 'AltLeft'
	);
}

class Hotkey {
	public plainKeyBindingsMap = new Map<string, KeyHandler>();
	public keyBindingsMap = new Map<string, KeyBindings>();
	public debugMode: boolean = false;
	public didUseBgKey: boolean = false;

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
			const bgKey = getBgKey(ev);

			if (this.keyBindingsMap.has(keyName)) {
				const handler = this.keyBindingsMap.get(keyName)![bgKey];

				handler?.(ev);
			}

			if (hasPlainBgKeypress(bgKey, this.plainKeyBindingsMap)) {
				this.didUseBgKey = true;
			}
		}
		else {
			const handler = this.plainKeyBindingsMap.get(keyName);

			if (handler) {
				if (isBgKey(keyName as RealKey) && this.didUseBgKey) {
					this.didUseBgKey = false;
				}
				else {
					handler(ev);
				}
			}
		}
	};

	public mountKeyupHook () {
		this.ctxElm.addEventListener('keyup', this.keyupHandler as EventListener);
	}

	public unmountKeyupHook () {
		this.ctxElm.removeEventListener('keyup', this.keyupHandler as EventListener);
	}
}
