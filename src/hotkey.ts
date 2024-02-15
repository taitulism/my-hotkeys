import type {ContextElement, BgKeyHandlers, KeyHandler} from './types';
import {
	getPressedBgKey,
	isBgKey,
	isBgKeyPressed,
	logKbEvent,
	parseHotKey,
} from './internals';

export function hotkey (ctxElm: ContextElement = document) {
	return new Hotkey(ctxElm).mount();
}

export class Hotkey {
	public plainHotkeys = new Map<string, KeyHandler>();
	public combinedHotkeys = new Map<string, BgKeyHandlers>();
	public debugMode: boolean = false;

	private keysDownCount = 0;
	private ignoreNextEvents: boolean = false;

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
		this.plainHotkeys = new Map<string, KeyHandler>();
		this.combinedHotkeys = new Map<string, BgKeyHandlers>();
		this.ignoreNextEvents = false;

		return this;
	}

	private keydownHandler = (ev: KeyboardEvent) => {
		this.debugMode && logKbEvent(ev);

		const {code: keyCode, key: keyValue, repeat} = ev;
		const isBgK = isBgKey(keyValue);
		const bgKeyDown = isBgKeyPressed(ev); // TODO: might be replaced with `.isAnyKeyDown`. The counter?

		if (!repeat) this.keysDownCount++;

		if (bgKeyDown) {
			const uniBgKey = getPressedBgKey(ev);
			const key = isBgK ? keyValue : keyCode;

			this.ignoreNextEvents = true;

			if (this.combinedHotkeys.has(key)) {
				const handler = this.combinedHotkeys.get(key)![uniBgKey];

				handler?.(ev);
			}
		}
		else if (!isBgK) {
			// TODO: fix this hack (see trello card: Enter - both)
			const key = keyValue === 'Enter' ? keyValue : keyCode;
			const handler = this.plainHotkeys.get(key);

			handler?.(ev);
		}
	};

	private keyupHandler = (ev: KeyboardEvent) => {
		this.debugMode && logKbEvent(ev);

		const keyValue = ev.key;

		this.keysDownCount = Math.max(--this.keysDownCount, 0);

		if (this.ignoreNextEvents) {
			if (this.keysDownCount === 0) {
				this.ignoreNextEvents = false;
			}

			return;
		}

		// (isBgKeyPressed(ev) || !isBgKey(keyValue)) <-- was
		if (isBgKeyPressed(ev)) return;

		const handler = this.plainHotkeys.get(keyValue);

		handler?.(ev);
	};

	public mount () {
		// TODO: prevent multi mounting
		this.ctxElm.addEventListener('keydown', this.keydownHandler as EventListener);
		this.ctxElm.addEventListener('keyup', this.keyupHandler as EventListener);

		return this;
	}

	public unmount () {
		this.ctxElm.removeEventListener('keydown', this.keydownHandler as EventListener);
		this.ctxElm.removeEventListener('keyup', this.keyupHandler as EventListener);

		return this;
	}

	public die () {
		this.unmount();
		this.unbindAll();
	}
}
