import {JSDOM} from 'jsdom';
import {KeyboardSimulator} from 'keyboard-simulator';
import {it, beforeAll, beforeEach, afterEach, Mock, describe, expect} from 'vitest';
import {hotkeyz, Hotkeyz} from '../src';
import {spies, spyFn} from './utils';

describe('Aliases & Key IDs', () => {
	let doc: Document | undefined;
	let simulate: KeyboardSimulator;
	let hk: Hotkeyz;
	let spy: Mock;

	beforeAll(() => {
		const dom = new JSDOM();

		doc = dom.window.document;
		simulate = new KeyboardSimulator(doc);
		spy = spyFn();
	});

	beforeEach(() => {
		hk = hotkeyz(doc);
	});

	afterEach(() => {
		hk.destruct();
		simulate.reset();
		spy.mockClear();
	});

	it('Key IDs', () => {
		const [spy1, spy2, spy3] = spies(3);

		hk.bind({
			'KeyA': spy1,
			'BracketLeft': spy2,
			'NumpadEnter': spy3,
		});

		simulate.keyDown('A');
		expect(spy1).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('BracketLeft');
		expect(spy2).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('NumpadEnter');
		expect(spy3).toHaveBeenCalledOnce();
		simulate.release();
	});

	describe('Aliases', () => {
		it('Arrows Aliases (and case insensitivity)', () => {
			const [spy1, spy2, spy3, spy4] = spies(4);

			hk.bind({
				'Up': spy1,
				'down': spy2,
				'LEFT': spy3,
				'RighT': spy4,
			});

			simulate.keyDown('ArrowUp');
			expect(spy1).toHaveBeenCalledOnce();
			simulate.release();

			simulate.keyDown('ArrowDown');
			expect(spy2).toHaveBeenCalledOnce();
			simulate.release();

			simulate.keyDown('ArrowLeft');
			expect(spy3).toHaveBeenCalledOnce();
			simulate.release();

			simulate.keyDown('ArrowRight');
			expect(spy4).toHaveBeenCalledOnce();
			simulate.release();
		});

		it('Symbol Aliases', () => {
			const [
				spy1, spy2, spy3, spy4, spy5,
				spy6, spy7, spy8, spy9, spy10,
			] = spies(10);

			hk.bind({
				'minus': spy1,
				'plus': spy2,
				'equal': spy3,
				'space': spy4,
				'tilde': spy5,
				'quote': spy6,
				'quotes': spy7,
				'backquote': spy8,
				'backslash': spy9,
				'underscore': spy10,
				// More below (different instance)
			});

			simulate.keyDown('Minus');
			expect(spy1).toHaveBeenCalledOnce();
			simulate.release();
			simulate.keyDown('Subtract');
			expect(spy1).toHaveBeenCalledTimes(2);
			simulate.release();

			simulate.keyDown('Shift', 'Equal'); // +
			expect(spy2).toHaveBeenCalledOnce();
			simulate.release();

			simulate.keyDown('Equal');
			expect(spy3).toHaveBeenCalledOnce();
			simulate.release();

			simulate.keyDown('Space');
			expect(spy4).toHaveBeenCalledOnce();
			simulate.release();

			simulate.keyDown('Shift', 'Backquote'); // ~
			expect(spy5).toHaveBeenCalledOnce();
			simulate.release();

			simulate.keyDown('Quote');
			expect(spy6).toHaveBeenCalledOnce();
			simulate.release();

			simulate.keyDown('Shift', 'Quote'); // "
			expect(spy7).toHaveBeenCalledOnce();
			simulate.release();

			simulate.keyDown('Backquote');
			expect(spy8).toHaveBeenCalledOnce();
			simulate.release();

			simulate.keyDown('Backslash');
			expect(spy9).toHaveBeenCalledOnce();
			simulate.release();

			simulate.keyDown('Shift', 'Minus'); // _
			expect(spy10).toHaveBeenCalledOnce();
			simulate.release();

			hk.destruct();

			const hk2 = hotkeyz(doc);
			const [spy21, spy22] = spies(2);

			// A different instance for duplicated aliases
			hk2.bind({
				'singlequote': spy21,
				'doublequotes': spy22,
			});

			simulate.keyDown('Quote');
			expect(spy21).toHaveBeenCalledOnce();
			simulate.release();

			simulate.keyDown('Shift', 'Quote');
			expect(spy22).toHaveBeenCalledOnce();
			simulate.release();
		});

		it('Case Insensitive', () => {
			const [spy1, spy2, spy3] = spies(3);

			hk.bind({
				'Plus': spy1,
				'MINUS': spy2,
				'spacE': spy3,
			});

			simulate.keyDown('Shift', 'Equal');
			expect(spy1).toHaveBeenCalledOnce();
			simulate.release();

			simulate.keyDown('Minus');
			expect(spy2).toHaveBeenCalledOnce();
			simulate.release();

			simulate.keyDown('Space');
			expect(spy3).toHaveBeenCalledOnce();
			simulate.release();
		});

		it('Other Aliases', () => {
			const [spy1, spy2, spy3, spy4, spy5] = spies(5);

			hk.bind({
				'ins': spy1,
				'del': spy2,
				'esc': spy3,
				'pgup': spy4,
				'pgdn': spy5,
			});

			simulate.keyPress('NumLock'); // Off

			simulate.keyDown('Insert');
			expect(spy1).toHaveBeenCalledOnce();
			simulate.release();
			simulate.keyDown('Np0');
			expect(spy1).toHaveBeenCalledTimes(2);
			simulate.release();

			simulate.keyDown('Delete');
			expect(spy2).toHaveBeenCalledOnce();
			simulate.release();
			simulate.keyDown('Decimal');
			expect(spy2).toHaveBeenCalledTimes(2);
			simulate.release();

			simulate.keyDown('Esc');
			expect(spy3).toHaveBeenCalledOnce();
			simulate.release();

			simulate.keyDown('PageUp');
			expect(spy4).toHaveBeenCalledOnce();
			simulate.release();
			simulate.keyDown('Np9');
			expect(spy4).toHaveBeenCalledTimes(2);
			simulate.release();

			simulate.keyDown('PageDown');
			expect(spy5).toHaveBeenCalledOnce();
			simulate.release();
			simulate.keyDown('Np3');
			expect(spy5).toHaveBeenCalledTimes(2);
			simulate.release();
		});
	});
});
