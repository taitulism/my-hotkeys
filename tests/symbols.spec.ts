import {JSDOM} from 'jsdom';
import {KeyboardSimulator} from 'keyboard-simulator';
import {it, beforeAll, beforeEach, afterEach, Mock, describe, expect} from 'vitest';
import {hotkey, Hotkey} from '../src';
import {spyFn} from './utils';

describe('Symbols', () => {
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

	it('Square Brackets', () => {
		hk.bindKeys({
			'[': spy,
			']': spy,
		});

		simulate.keyPress('BracketLeft');
		expect(spy).toHaveBeenCalledTimes(1);
		simulate.keyPress('BracketRight');
		expect(spy).toHaveBeenCalledTimes(2);
	});

	it('Curly Braces', () => {
		hk.bindKeys({
			'{': spy,
			'}': spy,
		});

		simulate.keyDown('Shift', 'BracketLeft');
		expect(spy).toHaveBeenCalledTimes(1);
		simulate.releaseAll();
		simulate.keyDown('Shift', 'BracketRight');
		expect(spy).toHaveBeenCalledTimes(2);
		simulate.releaseAll();
	});

	it('Parentheses ', () => {
		hk.bindKeys({
			'(': spy,
			')': spy,
		});

		simulate.keyDown('Shift', 'Digit9');
		expect(spy).toHaveBeenCalledTimes(1);
		simulate.releaseAll();
		simulate.keyDown('Shift', 'Digit0');
		expect(spy).toHaveBeenCalledTimes(2);
		simulate.releaseAll();
	});

	it('Greater & Lower than', () => {
		hk.bindKeys({
			'<': spy,
			'>': spy,
		});

		simulate.keyDown('Shift', 'Comma');
		expect(spy).toHaveBeenCalledTimes(1);
		simulate.releaseAll();
		simulate.keyDown('Shift', 'Period');
		expect(spy).toHaveBeenCalledTimes(2);
		simulate.releaseAll();
	});

	it('Period & Comma', () => {
		hk.bindKeys({
			'.': spy,
			',': spy,
		});

		simulate.keyPress('Period');
		expect(spy).toHaveBeenCalledTimes(1);
		simulate.keyPress('NumpadDecimal');
		expect(spy).toHaveBeenCalledTimes(2);

		simulate.keyPress('Comma');
		expect(spy).toHaveBeenCalledTimes(3);
	});

	it('Slash & Backslash', () => {
		hk.bindKeys({
			'/': spy,
			'\\': spy,
		});

		simulate.keyPress('Slash');
		expect(spy).toHaveBeenCalledTimes(1);
		simulate.keyPress('Backslash');
		expect(spy).toHaveBeenCalledTimes(2);
	});

	it('Quotes', () => {
		hk.bindKeys({
			'\'': spy,
			'"': spy,
			'`': spy,
		});

		simulate.keyPress('SingleQuote');
		expect(spy).toHaveBeenCalledTimes(1);
		simulate.keyDown('Shift', 'Quote');
		expect(spy).toHaveBeenCalledTimes(2);
		simulate.releaseAll();
		simulate.keyPress('Backquote');
		expect(spy).toHaveBeenCalledTimes(3);
	});

	it('Colon & Semicolon', () => {
		hk.bindKeys({
			':': spy,
			';': spy,
		});

		simulate.keyPress('SemiColon');
		expect(spy).toHaveBeenCalledTimes(1);
		simulate.keyDown('Shift', 'SemiColon');
		expect(spy).toHaveBeenCalledTimes(2);
	});

	it('Question & Excalamtion Marks', () => {
		hk.bindKeys({
			'?': spy,
			'!': spy,
		});

		simulate.keyDown('Shift', 'Slash');
		expect(spy).toHaveBeenCalledTimes(1);
		simulate.releaseAll();

		simulate.keyDown('Shift', 'Digit1');
		expect(spy).toHaveBeenCalledTimes(2);
		simulate.releaseAll();
	});

	it('Math Symbols', () => {
		hk.bindKeys({
			'+': spy,
			'-': spy,
			'*': spy,
			'/': spy,
			'=': spy,
		});

		simulate.keyPress('NumpadAdd');
		expect(spy).toHaveBeenCalledTimes(1);
		simulate.keyDown('Shift', 'Equal');
		expect(spy).toHaveBeenCalledTimes(2);
		simulate.releaseAll();

		simulate.keyPress('NumpadSubtract');
		expect(spy).toHaveBeenCalledTimes(3);
		simulate.keyPress('Minus');
		expect(spy).toHaveBeenCalledTimes(4);

		simulate.keyPress('NumpadMultiply');
		expect(spy).toHaveBeenCalledTimes(5);
		simulate.keyDown('Shift', 'Digit8');
		expect(spy).toHaveBeenCalledTimes(6);
		simulate.releaseAll();

		simulate.keyPress('NumpadDivide');
		expect(spy).toHaveBeenCalledTimes(7);
		simulate.keyPress('Slash');
		expect(spy).toHaveBeenCalledTimes(8);

		simulate.keyPress('Equal');
		expect(spy).toHaveBeenCalledTimes(9);
	});

	it('Other Shift Symbols', () => {
		hk.bindKeys({
			'~': spy,
			'@': spy,
			'#': spy,
			'$': spy,
			'%': spy,
			'^': spy,
			'&': spy,
			'_': spy,
			'|': spy,
		});

		simulate.keyDown('Shift', 'Backquote');
		expect(spy).toHaveBeenCalledTimes(1);
		simulate.releaseAll();

		simulate.keyDown('Shift', 'Digit2');
		expect(spy).toHaveBeenCalledTimes(2);
		simulate.releaseAll();

		simulate.keyDown('Shift', 'Digit3');
		expect(spy).toHaveBeenCalledTimes(3);
		simulate.releaseAll();

		simulate.keyDown('Shift', 'Digit4');
		expect(spy).toHaveBeenCalledTimes(4);
		simulate.releaseAll();

		simulate.keyDown('Shift', 'Digit5');
		expect(spy).toHaveBeenCalledTimes(5);
		simulate.releaseAll();

		simulate.keyDown('Shift', 'Digit6');
		expect(spy).toHaveBeenCalledTimes(6);
		simulate.releaseAll();

		simulate.keyDown('Shift', 'Digit7');
		expect(spy).toHaveBeenCalledTimes(7);
		simulate.releaseAll();

		simulate.keyDown('Shift', 'Minus');
		expect(spy).toHaveBeenCalledTimes(8);
		simulate.releaseAll();

		simulate.keyDown('Shift', 'Backslash');
		expect(spy).toHaveBeenCalledTimes(9);
		simulate.releaseAll();
	});
});
