import {JSDOM} from 'jsdom';
import {KeyboardSimulator} from 'keyboard-simulator';
import {it, beforeAll, beforeEach, afterEach, Mock, describe, expect} from 'vitest';
import {hotkey, Hotkey} from '../src';
import {spies, spyFn} from './utils';

describe('Aliases', () => {
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
		hk.unmount();
		simulate.reset();
		spy.mockClear();
	});

	describe('Symbols Aliases', () => {
		it('Arrows Aliases (and case insensitivity)', () => {
			const [spy1, spy2, spy3, spy4] = spies(4);

			hk.bindKeys({
				'Up': spy1,
				'down': spy2,
				'LEFT': spy3,
				'RighT': spy4,
			});

			simulate.keyDown('ArrowUp');
			expect(spy1).toHaveBeenCalledOnce();
			simulate.releaseAll();

			simulate.keyDown('ArrowDown');
			expect(spy2).toHaveBeenCalledOnce();
			simulate.releaseAll();

			simulate.keyDown('ArrowLeft');
			expect(spy3).toHaveBeenCalledOnce();
			simulate.releaseAll();

			simulate.keyDown('ArrowRight');
			expect(spy4).toHaveBeenCalledOnce();
			simulate.releaseAll();
		});

		it('Symbol Aliases', () => {
			const [spy1, spy2, spy3, spy4, spy5, spy6, spy7, spy8] = spies(8);

			hk.bindKeys({
				'plus': spy1,
				'minus': spy2,
				'space': spy3,
				'tilde': spy4,
				'quote': spy5,
				'quotes': spy6,
				'backslash': spy7,
				'underscore': spy8,
			});

			simulate.keyDown('Shift', 'Equal');
			expect(spy1).toHaveBeenCalledOnce();
			simulate.releaseAll();

			simulate.keyDown('Minus');
			expect(spy2).toHaveBeenCalledOnce();
			simulate.releaseAll();

			simulate.keyDown('Space');
			expect(spy3).toHaveBeenCalledOnce();
			simulate.releaseAll();

			simulate.keyDown('Backquote');
			expect(spy4).toHaveBeenCalledOnce();
			simulate.releaseAll();

			simulate.keyDown('Quote');
			expect(spy5).toHaveBeenCalledOnce();
			simulate.releaseAll();

			simulate.keyDown('Shift', 'Quote');
			expect(spy6).toHaveBeenCalledOnce();
			simulate.releaseAll();

			simulate.keyDown('Backslash');
			expect(spy7).toHaveBeenCalledOnce();
			simulate.releaseAll();

			simulate.keyDown('Shift', 'Minus');
			expect(spy8).toHaveBeenCalledOnce();
			simulate.releaseAll();
		});

		it('Case Insensitive', () => {
			const [spy1, spy2, spy3] = spies(3);

			hk.bindKeys({
				'Plus': spy1,
				'MINUS': spy2,
				'spacE': spy3,
			});

			simulate.keyDown('Shift', 'Equal');
			expect(spy1).toHaveBeenCalledOnce();
			simulate.releaseAll();

			simulate.keyDown('Minus');
			expect(spy2).toHaveBeenCalledOnce();
			simulate.releaseAll();

			simulate.keyDown('Space');
			expect(spy3).toHaveBeenCalledOnce();
			simulate.releaseAll();
		});

		it('Other Aliases', () => {
			const [spy1, spy2, spy3, spy4, spy5] = spies(5);

			hk.bindKeys({
				'ins': spy1,
				'del': spy2,
				'esc': spy3,
				'pgup': spy4,
				'pgdn': spy5,
			});

			simulate.keyPress('NumLock'); // Off

			simulate.keyDown('Insert');
			expect(spy1).toHaveBeenCalledOnce();
			simulate.releaseAll();
			simulate.keyDown('Np0');
			// expect(spy1).toHaveBeenCalledTimes(2);
			simulate.releaseAll();

			simulate.keyDown('Delete');
			expect(spy2).toHaveBeenCalledOnce();
			simulate.releaseAll();
			simulate.keyDown('Decimal');
			// expect(spy2).toHaveBeenCalledTimes(2);
			simulate.releaseAll();

			simulate.keyDown('Esc');
			expect(spy3).toHaveBeenCalledOnce();
			simulate.releaseAll();

			simulate.keyDown('PageUp');
			expect(spy4).toHaveBeenCalledOnce();
			simulate.releaseAll();
			simulate.keyDown('Np9');
			expect(spy4).toHaveBeenCalledOnce();
			simulate.releaseAll();

			simulate.keyDown('PageDown');
			expect(spy5).toHaveBeenCalledOnce();
			simulate.releaseAll();
			simulate.keyDown('Np3');
			expect(spy5).toHaveBeenCalledOnce();
			simulate.releaseAll();
		});
	});
});
