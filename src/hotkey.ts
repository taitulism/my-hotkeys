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
		this.dismissBgKeyUp = false;

		return this;
	}

	private keydownHandler = (ev: KeyboardEvent) => {
		this.debugMode && logKbEvent('🔻', ev);

		const keyCode = ev.code;
		const keyValue = ev.key;
		const isBgK = isBgKey(keyValue);
		const bgKeyDown = isBgKeyPressed(ev);

		if (bgKeyDown) {
			const uniBgKey = getPressedBgKey(ev);
			const mapByKey = isBgK ? keyValue : keyCode;

			this.dismissBgKeyUp = true;

			if (this.combinedHotkeys.has(mapByKey)) {
				const handler = this.combinedHotkeys.get(mapByKey)![uniBgKey];

				handler?.(ev);
			}
		}
		else if (!isBgK) {
			// TODO: fix this hack (see trello card: Enter - both)
			const mapByKey = keyValue === 'Enter' ? keyValue : keyCode;
			const handler = this.plainHotkeys.get(mapByKey);

			handler?.(ev);
		}
	};

	private keyupHandler = (ev: KeyboardEvent) => {
		this.debugMode && logKbEvent('🔼', ev);

		const keyValue = ev.key;

		if (!isBgKey(keyValue) || isBgKeyPressed(ev)) return;

		const handler = this.plainHotkeys.get(keyValue);

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
