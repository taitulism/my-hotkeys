import {JSDOM} from 'jsdom';
import {KeyboardSimulator} from 'keyboard-simulator';
import {it, beforeAll, beforeEach, afterEach, expect, Mock, describe} from 'vitest';
import {hotkey, Hotkey} from '../src';
import {spyFn} from './utils';

const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0] as const;
const LETTERS = [
	'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
	'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
	'U', 'V', 'W', 'X', 'Y', 'Z',
] as const;

describe('Letters & Numbers', () => {
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

	describe('Letters are case insensitive', () => {
		it('Hotkey "a" is also triggered by pressing "A"', () => {
			hk.bindKey('a', spy);

			simulate.keyDown('a');
			expect(spy).toHaveBeenCalledTimes(1);
			simulate.keyUp('a');

			simulate.keyDown('Shift', 'a');
			expect(spy).toHaveBeenCalledTimes(2);
			simulate.releaseAll();

			simulate.keyPress('CapsLock');
			simulate.keyDown('a');
			expect(spy).toHaveBeenCalledTimes(3);
		});

		it('Binding "a" is the same as binding "A"', () => {
			const failFunc = () => {
				hk.bindKey('a', spy);
				hk.bindKey('A', spy);
			};

			expect(failFunc).throw('Duplicated hotkey: "a"');
		});
	});

	it('Letters', () => {
		LETTERS.forEach((letter, i) => {
			hk.bindKey(letter, spy);

			simulate.keyDown(letter);
			expect(spy).toHaveBeenCalledTimes(i + 1);
			simulate.releaseAll();
		});
	});

	it('Digits', () => {
		DIGITS.forEach((digit, i) => {
			hk.bindKey(String(digit), spy);

			simulate.keyDown(`Digit${digit}`);
			expect(spy).toHaveBeenCalledTimes(i + 1);
			simulate.releaseAll();
		});
	});

	it('Numpad Numbers', () => {
		DIGITS.forEach((digit, i) => {
			hk.bindKey(String(digit), spy);

			simulate.keyDown(`Numpad${digit}`);
			expect(spy).toHaveBeenCalledTimes(i + 1);
			simulate.releaseAll();
		});
	});
});
