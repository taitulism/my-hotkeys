import {JSDOM} from 'jsdom';
import {KeyboardSimulator, KeyName} from 'keyboard-simulator';
import {it, beforeAll, beforeEach, afterEach, expect, describe} from 'vitest';
import {hotkeys, Hotkeys} from '../src';
import {spyFn} from './utils';

describe('Fn & Other Keys', () => {
	let doc: Document;
	let simulate: KeyboardSimulator;
	let hk: Hotkeys;

	beforeAll(() => {
		const dom = new JSDOM();

		doc = dom.window.document;
		simulate = new KeyboardSimulator(doc);
	});

	beforeEach(() => {
		hk = hotkeys(doc);
	});

	afterEach(() => {
		hk.destruct();
		simulate.reset();
	});

	it('F1-F24', () => {
		for (let i = 1; i <= 24; i++) {
			const spy = spyFn();

			hk.bind(`F${i}`, spy);
			simulate.keyDown(`F${i}` as KeyName);
			expect(spy).toHaveBeenCalledOnce();
			simulate.release();
		}
	});

	it('Other Functional Keys', () => {
		const OTHER_KEYS = [
			'Pause',
			'PrintScreen',
			'ContextMenu',
			'Escape',
			'ScrollLock',
			'NumLock',
			'CapsLock',
		] as const;

		OTHER_KEYS.forEach((key) => {
			const spy = spyFn();

			hk.bind(key, spy);

			simulate.keyDown(key);
			expect(spy).toHaveBeenCalledOnce();
			simulate.release();

			if (key.endsWith('Lock')) {
				simulate.keyPress(key); // toggle back
			}
		});
	});
});
