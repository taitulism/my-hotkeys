import type {ContextElement, CombinationHandlers, KeyHandler} from './types';
import {logKbEvent} from './log-keyboard-event';
import {
	unifyModifiers,
	isModifier,
	isModifierPressed,
	parseHotKey,
} from './internals';

export function hotkey (ctxElm: ContextElement = document) {
	return new Hotkey(ctxElm).mount();
}

export class Hotkey {
	public plainHotkeys = new Map<string, KeyHandler>();
	public combinedHotkeys = new Map<string, CombinationHandlers>();
	public debugMode: boolean = false;

	constructor (public ctxElm: ContextElement = document) {}

	public bindKey (hotkey: string, handlerFn: KeyHandler) {
		const {targetKey, unifiedModifier} = parseHotKey(hotkey);

		if (unifiedModifier) {
			const map = this.combinedHotkeys;

			if (map.has(targetKey)) {
				map.get(targetKey)![unifiedModifier] = handlerFn;
			}
			else {
				map.set(targetKey, {[unifiedModifier]: handlerFn});
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

		const {code: kId, key: kValue} = ev;
		const keyIsModifier = isModifier(kValue);

		if (keyIsModifier) return;

		// (Irrelevant in basics) TODO: might be replaced with `.isAnyKeyDown`. The counter?
		const isModPressed = isModifierPressed(ev);

		if (isModPressed) {
			const uniMod = unifyModifiers(ev);
			// TODO: has early return if isMod
			const key = keyIsModifier ? kValue : kId;

			if (this.combinedHotkeys.has(key)) {
				const handler = this.combinedHotkeys.get(key)![uniMod];

				handler?.(ev);
			}
		}
		else {
			// TODO: fix this hack (see trello card: Enter - both)
			const key = kValue === 'Enter' ? kValue : kId;
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
