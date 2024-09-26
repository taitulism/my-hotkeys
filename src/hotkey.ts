import type {ContextElement, CombinationHandlers, KeyHandler, ParsedHotKey} from './types';
import {logKbEvent} from './log-keyboard-event';
import {ISymbol, SymbolIDs} from './symbols';
import {
	unifyEventModifiers,
	parseHotKey,
	getHandlers,
	removeShift,
	implicitShift,
	isModifier,
} from './internals';

export function hotkey (ctxElm: ContextElement = document) {
	return new Hotkey(ctxElm).mount();
}

export class Hotkey {
	public hotkeys = new Map<string, CombinationHandlers>();
	public debugMode: boolean = false;

	constructor (public ctxElm: ContextElement = document) {}

	private addHotkey = (
		parsedHotKey: ParsedHotKey,
		handlerFn: KeyHandler,
		hotkey: string,
	) => {
		const {targetKey, unifiedModifier, withShift} = parsedHotKey;

		if (this.hotkeys.has(targetKey)) {
			const handlers = this.hotkeys.get(targetKey) as CombinationHandlers;

			if (handlers[unifiedModifier]) {
				throw new Error(`Duplicated hotkey: "${hotkey}"`);
			}

			handlers[unifiedModifier] = handlerFn;
		}
		else {
			this.hotkeys.set(targetKey, {[unifiedModifier]: handlerFn});
		}

		if (withShift && targetKey in SymbolIDs) {
			const keyId = SymbolIDs[targetKey as ISymbol];

			this.addHotkey({targetKey: keyId, unifiedModifier}, handlerFn, hotkey);
		}
	};

	private removeHotkey = (parsedHotKey: ParsedHotKey) => {
		const {targetKey, unifiedModifier, withShift} = parsedHotKey;

		if (this.hotkeys.has(targetKey)) {
			const handlers = this.hotkeys.get(targetKey) as CombinationHandlers;

			if (handlers[unifiedModifier]) {
				delete handlers[unifiedModifier];

				// If empty, no handlers, remove map key
				if (Object.keys(handlers).length === 0) {
					this.hotkeys.delete(targetKey);
				}
			}

			if (withShift && targetKey in SymbolIDs) {
				const keyId = SymbolIDs[targetKey as ISymbol];

				this.removeHotkey({targetKey: keyId, unifiedModifier});
			}
		}
		else {
			throw new Error('No Such Hotkey');
		}
	};

	public bindKey (hotkey: string, handlerFn: KeyHandler) {
		const parsedHotKey = parseHotKey(hotkey);

		this.addHotkey(parsedHotKey, handlerFn, hotkey);

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
		const parsedHotKey = parseHotKey(hotkey);

		this.removeHotkey(parsedHotKey);

		return this;
	}

	public unbindAll () {
		this.hotkeys.clear();

		return this;
	}

	private keydownHandler = (ev: KeyboardEvent) => {
		this.debugMode && logKbEvent(ev);

		const {key: kValue} = ev;

		if (isModifier(kValue)) return;

		const handlers = getHandlers(ev, this.hotkeys);

		if (!handlers) return;

		const unifiedModifier = unifyEventModifiers(ev);

		if (handlers[unifiedModifier]) {
			handlers[unifiedModifier]?.(ev);
		}
		else if (implicitShift(ev)) {
			const uniModWithoutShift = removeShift(unifiedModifier);
			const handler = handlers[uniModWithoutShift];

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

		return this;
	}
}
