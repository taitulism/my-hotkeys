import type {BgKeyShortName, ContextElement, BgKeyBindings, KeyHandler, RealKey} from './types';
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
	public plainHotkeys = new Map<string, KeyHandler>();
	public combinedHotkeys = new Map<string, BgKeyBindings>();
	public debugMode: boolean = false;
	public didUseBgKey: boolean = false;

	constructor (public ctxElm: ContextElement = document) {}

	public bindKey (hotkey: string, handlerFn: KeyHandler) {
		const {key, bgKey} = parseHotKey(hotkey);

		if (!bgKey) {
			this.plainHotkeys.set(key, handlerFn);
		}
		else {
			const bgKeyBindings = this.combinedHotkeys.get(key);

			if (bgKeyBindings) {
				bgKeyBindings[bgKey] = handlerFn;
			}
			else {
				this.combinedHotkeys.set(key, {[bgKey]: handlerFn});
			}
		}
	}

	public bindKeys (hotkeysObj: Record<string, KeyHandler>) {
		for (const [hotkey, keyHandler] of Object.entries(hotkeysObj)) {
			this.bindKey(hotkey, keyHandler);
		}
	}

	private keydownHandler = (ev: KeyboardEvent) => {
		this.debugMode && console.log(ev);

		const keyName = ev.code;

		// TODO: will need to change this when the hotkey is 2 bg keys (e.g. "ctrl-alt")
		if (isBgKey(keyName as RealKey)) return;

		if (isBgKeyDown(ev)) {
			const bgKey = getBgKey(ev);

			if (this.combinedHotkeys.has(keyName)) {
				const handler = this.combinedHotkeys.get(keyName)![bgKey];

				handler?.(ev);
			}

			if (hasPlainBgKeypress(bgKey, this.plainHotkeys)) {
				this.didUseBgKey = true;
			}
		}
		else {
			const handler = this.plainHotkeys.get(keyName);

			handler?.(ev);
		}
	};

	private keyupHandler = (ev: KeyboardEvent) => {
		this.debugMode && console.log(ev);

		const keyName = ev.code;

		if (isBgKey(keyName as RealKey)) {
			const handler = this.plainHotkeys.get(keyName);

			if (handler) {
				if (this.didUseBgKey) {
					this.didUseBgKey = false;
				}
				else {
					handler(ev);
				}
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
