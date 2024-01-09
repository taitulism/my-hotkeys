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
	public didUseBgKey: boolean = false;

	constructor (public ctxElm: ContextElement = document) {}

	public bindKey (hotkey: string, handlerFn: KeyHandler) {
		if (isPlainBgHotkey(hotkey)) {
			const HOTKEY = hotkey.toUpperCase() as keyof typeof PlainBgKeysMap;

			this.plainHotkeys.set(PlainBgKeysMap[HOTKEY][0], handlerFn);
			this.plainHotkeys.set(PlainBgKeysMap[HOTKEY][1], handlerFn);

			return;
		}

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

		// TODO: will need to change this when the hotkey is 2 bg keys (e.g. "ctrl-alt")
		if (isBgKey(ev.key)) return;

		if (isBgKeyPressed(ev)) {
			const uniBgKey = getPressedBgKey(ev);

			if (this.combinedHotkeys.has(keyCode)) {
				const handler = this.combinedHotkeys.get(keyCode)![uniBgKey];

				handler?.(ev);
			}

			if (hasPlainBgHotkey(uniBgKey, this.plainHotkeys)) {
				this.didUseBgKey = true;
			}
		}
		else {
			const handler = this.plainHotkeys.get(keyCode);

			handler?.(ev);
		}
	};

	private keyupHandler = (ev: KeyboardEvent) => {
		this.debugMode && logKbEvent('🔼', ev);

		const keyCode = ev.code as KeyCode;

		if (!isBgKey(ev.key)) return;

		const handler = this.plainHotkeys.get(keyCode);

		if (handler) {
			if (this.didUseBgKey) {
				this.didUseBgKey = false;
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
