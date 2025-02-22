import {JSDOM} from 'jsdom';
import {KeyboardSimulator} from 'keyboard-simulator';
import {it, beforeAll, beforeEach, afterEach, Mock, describe, expect} from 'vitest';
import {hotkeys, Hotkeys} from '../src';
import {spies, spyFn} from './utils';

describe('Symbols', () => {
	let doc: Document | undefined;
	let simulate: KeyboardSimulator;
	let hk: Hotkeys;
	let spy: Mock;

	beforeAll(() => {
		const dom = new JSDOM();

		doc = dom.window.document;
		simulate = new KeyboardSimulator(doc);
		spy = spyFn();
	});

	beforeEach(() => {
		hk = hotkeys(doc);
	});

	afterEach(() => {
		hk.destruct();
		simulate.reset();
		spy.mockClear();
	});

	it('Open / Close', () => {
		const [spy1, spy2, spy3, spy4, spy5, spy6, spy7, spy8] = spies(8);

		hk.bind({
			'[': spy1,
			']': spy2,
			'{': spy3,
			'}': spy4,
			'(': spy5,
			')': spy6,
			'<': spy7,
			'>': spy8,
		});

		simulate.keyDown('BracketLeft');
		expect(spy1).toHaveBeenCalledOnce();
		simulate.release();
		simulate.keyDown('BracketRight');
		expect(spy2).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Shift', 'BracketLeft');
		expect(spy3).toHaveBeenCalledOnce();
		simulate.release();
		simulate.keyDown('Shift', 'BracketRight');
		expect(spy4).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Shift', 'Digit9');
		expect(spy5).toHaveBeenCalledOnce();
		simulate.release();
		simulate.keyDown('Shift', 'Digit0');
		expect(spy6).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Shift', 'Comma');
		expect(spy7).toHaveBeenCalledOnce();
		simulate.release();
		simulate.keyDown('Shift', 'Period');
		expect(spy8).toHaveBeenCalledOnce();
		simulate.release();
	});

	it('Punctuation & Text', () => {
		const [spy1, spy2, spy3, spy4, spy5, spy6, spy7] = spies(8);

		hk.bind({
			'.': spy1,
			',': spy2,
			'\'': spy3,
			'"': spy4,
			'`': spy5,
			';': spy6,
			':': spy7,
		});

		simulate.keyDown('Period');
		expect(spy1).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Decimal');
		expect(spy1).toHaveBeenCalledTimes(2);
		simulate.release();

		simulate.keyDown('Comma');
		expect(spy2).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('SingleQuote');
		expect(spy3).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Shift', 'SingleQuote');
		expect(spy4).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Backquote');
		expect(spy5).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Semicolon');
		expect(spy6).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Shift', 'Semicolon');
		expect(spy7).toHaveBeenCalledOnce();
		simulate.release();
	});

	it('Calculator Symbols', () => {
		const [spy1, spy2, spy3, spy4, spy5] = spies(5);

		hk.bind({
			'+': spy1,
			'-': spy2,
			'*': spy3,
			'/': spy4,
			'=': spy5,
		});

		simulate.keyDown('NumpadAdd');
		expect(spy1).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Shift', 'Equal');
		expect(spy1).toHaveBeenCalledTimes(2);
		simulate.release();

		simulate.keyDown('NumpadSubtract');
		expect(spy2).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Minus');
		expect(spy2).toHaveBeenCalledTimes(2);
		simulate.release();

		simulate.keyDown('NumpadMultiply');
		expect(spy3).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Shift', 'Digit8');
		expect(spy3).toHaveBeenCalledTimes(2);
		simulate.release();

		simulate.keyDown('NumpadDivide');
		expect(spy4).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Slash');
		expect(spy4).toHaveBeenCalledTimes(2);
		simulate.release();

		simulate.keyDown('Equal');
		expect(spy5).toHaveBeenCalledOnce();
		simulate.release();
	});

	it('Other Shift Symbols', () => {
		const [
			spy1, spy2, spy3, spy4, spy5, spy6,
			spy7, spy8, spy9, spy10, spy11, spy12,
		] = spies(12);

		hk.bind({
			'~': spy1,
			'!': spy2,
			'@': spy3,
			'#': spy4,
			'$': spy5,
			'%': spy6,
			'^': spy7,
			'&': spy8,
			'_': spy9,
			'|': spy10,
			'?': spy11,
			'\\': spy12,
		});

		simulate.keyDown('Shift', 'Backquote');
		expect(spy1).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Shift', 'Digit1');
		expect(spy2).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Shift', 'Digit2');
		expect(spy3).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Shift', 'Digit3');
		expect(spy4).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Shift', 'Digit4');
		expect(spy5).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Shift', 'Digit5');
		expect(spy6).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Shift', 'Digit6');
		expect(spy7).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Shift', 'Digit7');
		expect(spy8).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Shift', 'Minus');
		expect(spy9).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Shift', 'Backslash');
		expect(spy10).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Shift', 'Slash');
		expect(spy11).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Backslash');
		expect(spy12).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('IntlBackslash');
		expect(spy12).toHaveBeenCalledTimes(2);
		simulate.release();
	});
});
