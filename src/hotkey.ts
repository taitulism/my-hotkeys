import type {ContextElement, CombinationHandlers, KeyHandler} from './types';
import {logKbEvent} from './log-keyboard-event';
import {
	unifyModifiers,
	isEventModifier,
	parseHotKey,
	isSingleChar,
	getMapKey,
} from './internals';

export function hotkey (ctxElm: ContextElement = document) {
	return new Hotkey(ctxElm).mount();
}

export class Hotkey {
	public hotkeys = new Map<string, CombinationHandlers>();
	public debugMode: boolean = false;

	constructor (public ctxElm: ContextElement = document) {}

	public bindKey (hotkey: string, handlerFn: KeyHandler) {
		const {targetKey, unifiedModifier} = parseHotKey(hotkey);

		const addHotkey = (tKey: string) => {
			if (this.hotkeys.has(tKey)) {
				const hotKeys = this.hotkeys.get(tKey) as CombinationHandlers;

				if (hotKeys[unifiedModifier]) {
					// TODO:? Currently replacing. Throw or add.
					console.log('Dup:', tKey);
				}

				hotKeys[unifiedModifier] = handlerFn;
			}
			else {
				this.hotkeys.set(tKey, {[unifiedModifier]: handlerFn});
			}
		};

		if (Array.isArray(targetKey)) {
			targetKey.forEach(addHotkey);
		}
		else {
			addHotkey(targetKey as string);
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

		const removeHotkey = (tKey: string) => {
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

		if (Array.isArray(targetKey)) {
			targetKey.forEach(removeHotkey);
		}
		else {
			removeHotkey(targetKey as string);
		}
	}

	public unbindAll () {
		this.hotkeys.clear();

		return this;
	}

	private keydownHandler = (ev: KeyboardEvent) => {
		this.debugMode && logKbEvent(ev);

		const {key: kValue} = ev;

		if (isEventModifier(kValue)) return;

		const mapKey = getMapKey(ev, this.hotkeys);

		if (!mapKey || !this.hotkeys.has(mapKey)) return;

		const unifiedModifier = unifyModifiers(ev);
		const handlers = this.hotkeys.get(mapKey) as CombinationHandlers;

		if (handlers[unifiedModifier]) {
			handlers[unifiedModifier]!(ev);
		}
		else {
			const uniMod = isSingleChar(ev) && unifiedModifier === 'S' ? '_' : unifiedModifier;
			const handler = handlers[uniMod];

			handler?.(ev);
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
	}
}
