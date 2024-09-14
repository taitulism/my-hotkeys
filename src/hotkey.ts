import type {ContextElement, CombinationHandlers, KeyHandler, UnifiedModifier} from './types';
import {logKbEvent} from './log-keyboard-event';
import {
	unifyEventModifiers,
	isEventModifier,
	parseHotKey,
	getHandlers,
	removeShift,
	implicitShift,
} from './internals';

export function hotkey (ctxElm: ContextElement = document) {
	return new Hotkey(ctxElm).mount();
}

export class Hotkey {
	public hotkeys = new Map<string, CombinationHandlers>();
	public debugMode: boolean = false;

	constructor (public ctxElm: ContextElement = document) {}

	private addHotkey = (tKey: string, unifiedModifier: UnifiedModifier, handlerFn: KeyHandler) => {
		if (this.hotkeys.has(tKey)) {
			const hotKeys = this.hotkeys.get(tKey) as CombinationHandlers;

			if (hotKeys[unifiedModifier]) {
				// TODO: The error only shows the target key. Maybe show the whole hotkey?
				throw new Error(`Duplicated hotkey: "${tKey}"`);
			}

			hotKeys[unifiedModifier] = handlerFn;
		}
		else {
			this.hotkeys.set(tKey, {[unifiedModifier]: handlerFn});
		}
	};

	private removeHotkey = (tKey: string, unifiedModifier: UnifiedModifier) => {
		if (this.hotkeys.has(tKey)) {
			const hotKeys = this.hotkeys.get(tKey) as CombinationHandlers;

			if (hotKeys[unifiedModifier]) {
				delete hotKeys[unifiedModifier];
			}
		}
		else {
			throw new Error('No Such Hotkey');
		}
	};

	public bindKey (hotkey: string, handlerFn: KeyHandler) {
		const {targetKey, unifiedModifier} = parseHotKey(hotkey);

		if (Array.isArray(targetKey)) {
			targetKey.forEach((tKey: string) => {
				this.addHotkey(tKey, unifiedModifier, handlerFn);
			});
		}
		else {
			this.addHotkey(targetKey as string, unifiedModifier, handlerFn);
		}

		return this;
	}

	public bindKeys (hotkeysObj: Partial<Record<string, KeyHandler>>) {
		const entries = Object.entries(hotkeysObj) as Array<[string, KeyHandler]>;

		for (const [hotkey, keyHandler] of entries) {
			this.bindKey(hotkey, keyHandler);
		}

		return this;
	}

	public unbindKeys (hotkeys: Array<string>) {
		hotkeys.forEach((hotkey) => {
			this.unbindKey(hotkey);
		});

		return this;
	}

	public unbindKey (hotkey: string) {
		const {targetKey, unifiedModifier} = parseHotKey(hotkey);

		if (Array.isArray(targetKey)) {
			targetKey.forEach((tKey: string) => {
				this.removeHotkey(tKey, unifiedModifier);
			});
		}
		else {
			this.removeHotkey(targetKey as string, unifiedModifier);
		}

		return this;
	}

	public unbindAll () {
		this.hotkeys.clear();

		return this;
	}

	private keydownHandler = (ev: KeyboardEvent) => {
		this.debugMode && logKbEvent(ev);

		const {key: kValue} = ev;

		if (isEventModifier(kValue)) return;

		const handlers = getHandlers(ev, this.hotkeys);

		if (!handlers) return;

		const unifiedModifier = unifyEventModifiers(ev);

		if (handlers[unifiedModifier]) {
			handlers[unifiedModifier]?.(ev);
		}
		else if (implicitShift(ev, unifiedModifier)) {
			const alternativeUnifiedModifier = removeShift(unifiedModifier);

			if (alternativeUnifiedModifier !== unifiedModifier) {
				const handler = handlers[alternativeUnifiedModifier];

				handler?.(ev);
			}
		}
	};

	public mount () {
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

		return this;
	}
}
