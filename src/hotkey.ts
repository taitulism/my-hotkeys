import type {ContextElement, CombinationHandlers, KeyHandler, ParsedHotKey} from './types';
import {logKbEvent} from './log-keyboard-event';
import {ISymbol, SymbolIDs} from './key-names-map';
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

	private addHotkey = (parsedHotKey: ParsedHotKey, handlerFn: KeyHandler,
	) => {
		const {targetKey, unifiedModifier, withShift} = parsedHotKey;

		if (this.hotkeys.has(targetKey)) {
			const hotKeys = this.hotkeys.get(targetKey) as CombinationHandlers;

			if (hotKeys[unifiedModifier]) {
				// TODO: The error only shows the target key. Maybe show the whole hotkey?
				throw new Error(`Duplicated hotkey: "${targetKey}"`);
			}

			hotKeys[unifiedModifier] = handlerFn;
		}
		else {
			this.hotkeys.set(targetKey, {[unifiedModifier]: handlerFn});
		}

		if (withShift && targetKey in SymbolIDs) {
			const keyID = SymbolIDs[targetKey as ISymbol];

			this.addHotkey({targetKey: keyID, unifiedModifier}, handlerFn);
		}
	};

	private removeHotkey = (parsedHotKey: ParsedHotKey) => {
		const {targetKey, unifiedModifier, withShift} = parsedHotKey;

		if (this.hotkeys.has(targetKey)) {
			const hotKeys = this.hotkeys.get(targetKey) as CombinationHandlers;

			if (hotKeys[unifiedModifier]) {
				delete hotKeys[unifiedModifier];
			}

			if (withShift && targetKey in SymbolIDs) {
				const keyID = SymbolIDs[targetKey as ISymbol];

				this.removeHotkey({targetKey: keyID, unifiedModifier});
			}
		}
		else {
			throw new Error('No Such Hotkey');
		}
	};

	public bindKey (hotkey: string, handlerFn: KeyHandler) {
		const parsedHotKey = parseHotKey(hotkey);

		this.addHotkey(parsedHotKey, handlerFn);

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

		if (isEventModifier(kValue)) return;

		const handlers = getHandlers(ev, this.hotkeys);

		if (!handlers) return;

		const unifiedModifier = unifyEventModifiers(ev);

		if (handlers[unifiedModifier]) {
			handlers[unifiedModifier]?.(ev);
		}
		else if (implicitShift(ev, unifiedModifier)) {
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
