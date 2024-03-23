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

	it('Period & Comma', () => {
		hk.bindKeys({
			'.': spy,
			',': spy,
		});

		simulate.keyPress('Period');
		expect(spy).toHaveBeenCalledTimes(1);
		simulate.keyPress('Comma');
		expect(spy).toHaveBeenCalledTimes(2);
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

	it('Math Symbols', () => {
		hk.bindKeys({
			'+': spy,
			'-': spy,
			'*': spy,
			'/': spy,
		});

		simulate.keyPress('NumpadAdd');
		expect(spy).toHaveBeenCalledTimes(1);
		simulate.keyPress('NumpadSubtract');
		expect(spy).toHaveBeenCalledTimes(2);
		simulate.keyPress('Minus');
		expect(spy).toHaveBeenCalledTimes(3);
		simulate.keyPress('NumpadMultiply');
		expect(spy).toHaveBeenCalledTimes(4);
		simulate.keyPress('NumpadDivide');
		expect(spy).toHaveBeenCalledTimes(5);
		simulate.keyPress('Slash');
		expect(spy).toHaveBeenCalledTimes(6);

		// TODO: not working
		// simulate.keyDown('Shift', 'Equal');
		// simulate.releaseAll();
		// simulate.keyDown('Shift', 'Digit8');
		// simulate.releaseAll();
	});
});
