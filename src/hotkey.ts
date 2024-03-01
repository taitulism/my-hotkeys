import type {ContextElement, BgKeyHandlers, KeyHandler} from './types';
import {logKbEvent} from './log-keyboard-event';
import {
	getPressedBgKey,
	isBgKey,
	isBgKeyPressed,
	parseHotKey,
} from './internals';

export function hotkey (ctxElm: ContextElement = document) {
	return new Hotkey(ctxElm).mount();
}

export class Hotkey {
	public plainHotkeys = new Map<string, KeyHandler>();
	public combinedHotkeys = new Map<string, BgKeyHandlers>();
	public debugMode: boolean = false;

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

		return this;
	}

	public bindKeys (hotkeysObj: Record<string, KeyHandler>) {
		for (const [hotkey, keyHandler] of Object.entries(hotkeysObj)) {
			this.bindKey(hotkey, keyHandler);
		}

		return this;
	}

	public unbindAll () {
		this.plainHotkeys.clear();
		this.combinedHotkeys.clear();

		return this;
	}

	private keydownHandler = (ev: KeyboardEvent) => {
		this.debugMode && logKbEvent(ev);

		const {code: keyCode, key: keyValue} = ev;
		const isBgK = isBgKey(keyValue);

		if (isBgK) return;

		const bgKeyDown = isBgKeyPressed(ev); // TODO: might be replaced with `.isAnyKeyDown`. The counter?

		if (bgKeyDown) {
			const uniBgKey = getPressedBgKey(ev);
			const key = isBgK ? keyValue : keyCode;

			if (this.combinedHotkeys.has(key)) {
				const handler = this.combinedHotkeys.get(key)![uniBgKey];

				handler?.(ev);
			}
		}
		else {
			// TODO: fix this hack (see trello card: Enter - both)
			const key = keyValue === 'Enter' ? keyValue : keyCode;
			const handler = this.plainHotkeys.get(key);

			handler?.(ev);
		}
	};

	public mount () {
		// TODO: prevent multi mounting
		this.ctxElm.addEventListener('keydown', this.keydownHandler as EventListener);

		return this;
	}

	public unmount () {
		this.ctxElm.removeEventListener('keydown', this.keydownHandler as EventListener);

		return this;
	}

	public destruct () {
		this.unmount();
		this.unbindAll();
	}
}
