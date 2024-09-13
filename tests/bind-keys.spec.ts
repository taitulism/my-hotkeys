import {JSDOM} from 'jsdom';
import {KeyboardSimulator} from 'keyboard-simulator';
import {it, beforeAll, beforeEach, afterEach, Mock, describe, expect} from 'vitest';
import {hotkey, Hotkey} from '../src';
import {spies, spyFn} from './utils';

describe('Binding Hotkeys', () => {
	let doc: Document | undefined;
	let simulate: KeyboardSimulator;
	let hk: Hotkey;
	let spy: Mock;

	beforeAll(() => {
		const dom = new JSDOM();

		doc = dom.window.document;
		simulate = new KeyboardSimulator(doc);
		spy = spyFn();
	});

	beforeEach(() => {
		hk = hotkey(doc);
	});

	afterEach(() => {
		hk.destruct();
		simulate.reset();
		spy.mockClear();
	});

	describe('.bindKey()', () => {
		it('Adds a hotkey on `keydown` event', () => {
			hk.bindKey('a', spy);
			expect(spy).not.toBeCalled();
			simulate.keyDown('a');
			expect(spy).toHaveBeenCalledTimes(1);
			simulate.keyUp('a');
			expect(spy).toHaveBeenCalledTimes(1);
		});

		it('Returns the Hotkey instance', () => {
			const instance = hk.bindKey('a', spy);

			expect(instance).toBe(hk);
		});
	});

	describe('.bindKeys()', () => {
		it('Adds multiple hotkeys on `keydown` event', () => {
			const [spy1, spy2] = spies(2);

			hk.bindKeys({
				'a': spy1,
				'b': spy2,
			});

			expect(spy1).not.toBeCalled();
			simulate.keyDown('a');
			expect(spy1).toHaveBeenCalledTimes(1);
			simulate.keyUp('a');

			expect(spy2).not.toBeCalled();
			simulate.keyDown('b');
			expect(spy2).toHaveBeenCalledTimes(1);
			simulate.keyUp('b');

			expect(spy1).toHaveBeenCalledTimes(1);
			expect(spy2).toHaveBeenCalledTimes(1);

			spy1.mockRestore();
			spy2.mockRestore();
		});

		it('Returns the Hotkey instance', () => {
			const instance = hk.bindKeys({
				'a': spy,
				'b': spy,
			});

			expect(instance).toBe(hk);
		});
	});
});
