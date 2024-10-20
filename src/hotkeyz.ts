import {logKbEvent} from './log-keyboard-event';
import {ISymbol, SymbolIDs} from './symbols-and-aliases';
import type {
	ContextElement,
	CombinationHandlers,
	KeyHandler,
	ParsedHotKey,
	IgnoreFn,
} from './types';
import {
	unifyEventModifiers,
	parseHotKey,
	getHandlers,
	removeShift,
	implicitShift,
	isModifier,
} from './internals';

export function hotkeyz (ctxElm: ContextElement = document) {
	return new Hotkeyz(ctxElm).mount();
}

const ignoredInputTags = [
	'INPUT',
	'TEXTAREA',
	'SELECT',
] as const;

const defaultIgnoreFn = (ev: KeyboardEvent) => {
	const {target: elm} = ev;

	if (!elm || !(elm instanceof HTMLElement)) return false;

	const isIgnoredTag = ignoredInputTags.includes(
		elm.tagName as typeof ignoredInputTags[number]);

	return isIgnoredTag || elm.isContentEditable;
};

export class Hotkeyz {
	// TODO: make private
	public hotkeys = new Map<string, CombinationHandlers>();
	public debugMode: boolean = false;

	constructor (
		public ctxElm: ContextElement = document,
		private ignoreFn: IgnoreFn = defaultIgnoreFn,
	) {}

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

			// TODO: throw "No such Hotkey modifier" (unimod?)
		}
		else {
			// TODO: say which key + test (target key)
			throw new Error('No Such Hotkey');
		}
	};

	public bind (hotkey: string, handlerFn: KeyHandler): Hotkeyz;
	public bind (hotkey: Record<string, KeyHandler>): Hotkeyz;
	public bind (hotkey: string | Record<string, KeyHandler>, handlerFn?: KeyHandler) {
		if (typeof hotkey === 'string') {
			const parsedHotKey = parseHotKey(hotkey);

			this.addHotkey(parsedHotKey, handlerFn!, hotkey);
		}
		else {
			const entries = Object.entries(hotkey) as Array<[string, KeyHandler]>;

			for (const [hotkey, keyHandler] of entries) {
				this.bind(hotkey, keyHandler);
			}
		}

		return this;
	}

	public unbind (hotkey: string | Array<string>) {
		if (typeof hotkey === 'string') {
			const parsedHotKey = parseHotKey(hotkey);

			this.removeHotkey(parsedHotKey);
		}
		else {
			hotkey.forEach((hk) => this.unbind(hk));
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

		if (isModifier(kValue)) return;
		if (this.ignoreFn?.(ev)) return;

		const handlers = getHandlers(ev, this.hotkeys);

		if (!handlers) return;

		const unifiedModifier = unifyEventModifiers(ev);

		if (handlers[unifiedModifier]) {
			handlers[unifiedModifier]?.(ev);
		}
		else if (handlers === this.hotkeys.get(kValue) && implicitShift(ev)) {
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
