import {JSDOM} from 'jsdom';
import {KeyboardSimulator} from 'keyboard-simulator';
import {it, beforeAll, beforeEach, afterEach, expect, Mock, describe} from 'vitest';
import {hotkeyz, Hotkeyz} from '../src';
import {spyFn} from './utils';

describe('Letters & Numbers', () => {
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

	describe('Letters are case insensitive', () => {
		it('Hotkey "a" is also triggered by `CapsLock` is on but not with `Shift`', () => {
			hk.bind('a', spy);

			simulate.keyDown('a');
			expect(spy.mock.lastCall?.[0].key).toBe('a');
			expect(spy).toHaveBeenCalledOnce();
			simulate.release();

			simulate.keyPress('CapsLock'); // On
			simulate.keyDown('a');
			expect(spy.mock.lastCall?.[0].key).toBe('A');
			expect(spy).toHaveBeenCalledTimes(2);
			simulate.release();
			simulate.keyPress('CapsLock'); // Off

			simulate.keyDown('Shift', 'a');
			expect(spy.mock.lastCall?.[0].key).toBe('A');
			expect(spy).toHaveBeenCalledTimes(2);
			simulate.release();
		});

		it('Binding "a" is the same as binding "A"', () => {
			const failFunc = () => {
				hk.bind('a', spy);
				hk.bind('A', spy);
			};

			expect(failFunc).throw('Duplicated hotkey: "A"');
		});
	});

	it('Letters', () => {
		const LETTERS = [
			'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
			'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
			'U', 'V', 'W', 'X', 'Y', 'Z',
		] as const;

		LETTERS.forEach((letter) => {
			const spy = spyFn();

			hk.bind(letter, spy);

			simulate.keyDown(letter);
			expect(spy).toHaveBeenCalledOnce();
			simulate.release();
		});
	});

	it('Numbers', () => {
		const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0] as const;

		DIGITS.forEach((digit) => {
			const spy = spyFn();

			hk.bind(String(digit), spy);

			simulate.keyDown(`Digit${digit}`);
			expect(spy).toHaveBeenCalledOnce();
			simulate.release();

			simulate.keyDown(`Numpad${digit}`);
			expect(spy).toHaveBeenCalledTimes(2);
			simulate.release();
		});
	});
});
