import {JSDOM} from 'jsdom';
import {KeyboardSimulator} from 'keyboard-simulator';
import {it, beforeAll, beforeEach, afterEach, expect, Mock, describe} from 'vitest';
import {hotkey, Hotkey} from '../src';
import {spies, spyFn} from './utils';

describe('Modifiers', () => {
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

	describe('Expected Behavior', () => {
		it('Called on a target-key keydown with a modifier in the background', () => {
			hk.bind('ctrl-a', spy);

			simulate.keyPress('A');
			simulate.keyPress('Ctrl');

			simulate.keyDown('Ctrl');
			expect(spy).not.toBeCalled();
			simulate.keyDown('A');
			expect(spy).toHaveBeenCalledOnce();
			simulate.keyUp('A', 'Ctrl');
		});

		it('Doesn\'t trigger "A" on "Ctrl-A"', () => {
			const [spy1, spy2] = spies(2);

			hk.bind({
				'a': spy1,
				'ctrl-a': spy2,
			});

			simulate.keyDown('Ctrl', 'A');
			expect(spy2).toHaveBeenCalledOnce();
			simulate.release();
			expect(spy2).toHaveBeenCalledOnce();
			expect(spy1).not.toBeCalled();
		});

		it('Can trigger two hotkeys with the same modifier without releasing it after the first one', () => {
			const [spy1, spy2] = spies(2);

			hk.bind({
				'ctrl-a': spy1,
				'ctrl-b': spy2,
			});

			simulate.keyDown('Ctrl', 'A');
			expect(spy1).toHaveBeenCalledOnce();
			simulate.keyUp('A');
			expect(spy2).not.toBeCalled();
			simulate.keyDown('B');
			expect(spy2).toHaveBeenCalledOnce();
		});
	});

	describe('Shift', () => {
		describe('Shift + Symbols', () => {
			it('Shift + Number', () => {
				hk.bind('shift-4', spy);

				simulate.keyDown('Shift', '4');
				expect(spy).toHaveBeenCalledOnce();
				simulate.release();

				simulate.keyDown('Shift', 'Np4');
				expect(spy).toHaveBeenCalledTimes(2);
				simulate.release();
			});

			it('Shift + Number Symbol', () => {
				hk.bind('shift-*', spy);

				simulate.keyDown('Shift', '8');
				expect(spy).toHaveBeenCalledOnce();
				simulate.release();

				simulate.keyDown('Shift', 'Multiply');
				expect(spy).toHaveBeenCalledTimes(2);
				simulate.release();
			});

			it('Shift + Non-Number Symbol', () => {
				const [spy1, spy2, spy3, spy4, spy5, spy6, spy7, spy8] = spies(8);

				hk.bind({
					'shift-[': spy1,
					'shift-]': spy2,
					'shift-;': spy3,
					'shift-\'': spy4,
					'shift-\\': spy5,
					'shift-,': spy6,
					'shift-`': spy7,
					'shift-=': spy8,
				});

				simulate.keyDown('Shift', 'BracketLeft');
				expect(spy1).toHaveBeenCalledOnce();
				simulate.release();

				simulate.keyDown('Shift', 'BracketRight');
				expect(spy2).toHaveBeenCalledOnce();
				simulate.release();

				simulate.keyDown('Shift', 'Semicolon');
				expect(spy3).toHaveBeenCalledOnce();
				simulate.release();

				simulate.keyDown('Shift', 'SingleQuote');
				expect(spy4).toHaveBeenCalledOnce();
				simulate.release();

				simulate.keyDown('Shift', 'Backslash');
				expect(spy5).toHaveBeenCalledOnce();
				simulate.release();

				simulate.keyDown('Shift', 'Comma');
				expect(spy6).toHaveBeenCalledOnce();
				simulate.release();

				simulate.keyDown('Shift', 'Backtick');
				expect(spy7).toHaveBeenCalledOnce();
				simulate.release();

				simulate.keyDown('Shift', 'Equal');
				expect(spy8).toHaveBeenCalledOnce();
				simulate.release();
			});

			it('Shift + Minus', () => {
				hk.bind('shift-minus', spy);

				simulate.keyDown('Shift', 'Minus');
				expect(spy).toHaveBeenCalledOnce();
				simulate.release();

				simulate.keyDown('Shift', 'Subtract');
				expect(spy).toHaveBeenCalledTimes(2);
				simulate.release();
			});

			it('Shift + Slash', () => {
				hk.bind('shift-/', spy);

				simulate.keyDown('Shift', 'Slash');
				expect(spy).toHaveBeenCalledOnce();
				simulate.release();

				simulate.keyDown('Shift', 'Divide');
				expect(spy).toHaveBeenCalledTimes(2);
				simulate.release();
			});

			it('Shift + Period', () => {
				hk.bind('shift-.', spy);

				simulate.keyDown('Shift', 'Period');
				expect(spy).toHaveBeenCalledOnce();
				simulate.release();

				simulate.keyDown('Shift', 'Decimal');
				expect(spy).toHaveBeenCalledTimes(2);
				simulate.release();
			});
		});

		describe('Implicit Shift', () => {
			it('Implicit shift symbol', () => {
				const [spy1, spy2] = spies(2);

				hk.bind({
					'@': spy1,
					'*': spy2,
				});

				simulate.keyDown('Shift', '2');
				expect(spy1).toHaveBeenCalledOnce();
				simulate.release();

				simulate.keyDown('Shift', '8');
				expect(spy2).toHaveBeenCalledOnce();
				simulate.release();

				simulate.keyDown('NumpadMultiply');
				expect(spy2).toHaveBeenCalledTimes(2);
				simulate.release();

				simulate.keyDown('Shift', 'NumpadMultiply'); // should not trigger
				expect(spy2).toHaveBeenCalledTimes(2);
				simulate.release();
			});

			it('Priority: Explicit shift over implicit shift', () => {
				const [spy1, spy2] = spies(2);

				hk.bind({
					'shift-@': spy1, // <-- priority
					'@': spy2,
				});

				simulate.keyDown('Shift', '2');
				expect(spy1).toHaveBeenCalledOnce();
				simulate.release();
				expect(spy2).not.toHaveBeenCalled();
			});

			it('Priority: Explicit shift over implicit shift (multiple modifiers)', () => {
				const [spy1, spy2] = spies(2);

				hk.bind({
					'ctrl-shift-@': spy1, // <-- priority
					'ctrl-@': spy2,
				});

				simulate.keyDown('Ctrl', 'Shift', '2');
				expect(spy1).toHaveBeenCalledOnce();
				simulate.release();
				expect(spy2).not.toHaveBeenCalled();
			});

			it('Priority: Implicit shift over shift + lowercase character', () => {
				const [spy1, spy2] = spies(2);

				hk.bind({
					'@': spy1, // <-- priority
					'shift-2': spy2,
				});

				simulate.keyDown('Shift', '2');
				expect(spy1).toHaveBeenCalledOnce();
				simulate.release();
				expect(spy2).not.toHaveBeenCalled();
			});

			it('Priority: Implicit shift over shift + lowercase character (multiple modifiers)', () => {
				const [spy1, spy2] = spies(2);

				hk.bind({
					'ctrl-@': spy1, // <-- priority
					'ctrl-shift-2': spy2,
				});

				simulate.keyDown('Ctrl', 'Shift', '2');
				expect(spy1).toHaveBeenCalledOnce();
				simulate.release();
				expect(spy2).not.toHaveBeenCalled();
			});
		});
	});

	it('With Letters', () => {
		const [spy1, spy2, spy3, spy4] = spies(4);

		hk.bind({
			'ctrl-a': spy1,
			'alt-b': spy2,
			'shift-c': spy3,
			'meta-d': spy4,
		});

		simulate.keyDown('Ctrl', 'A');
		expect(spy1).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Alt', 'B');
		expect(spy2).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Shift', 'C');
		expect(spy3).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Meta', 'D');
		expect(spy4).toHaveBeenCalledOnce();
		simulate.release();
	});

	it('With Numbers', () => {
		const [spy1, spy2, spy3, spy4] = spies(4);

		hk.bind({
			'ctrl-1': spy1,
			'alt-2': spy2,
			'shift-3': spy3,
			'meta-4': spy4,
		});

		simulate.keyDown('Ctrl', '1');
		expect(spy1).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Alt', '2');
		expect(spy2).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Shift', '3');
		expect(spy3).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Meta', '4');
		expect(spy4).toHaveBeenCalledOnce();
		simulate.release();
	});

	it('With Other keys', () => {
		const [spy1, spy2, spy3, spy4] = spies(4);

		hk.bind({
			'ctrl-F1': spy1,
			'alt-.': spy2,
			'shift-Enter': spy3,
			'meta-PageUp': spy4,
		});

		simulate.keyDown('Ctrl', 'F1');
		expect(spy1).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Alt', 'Period');
		expect(spy2).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Shift', 'Enter');
		expect(spy3).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Meta', 'PageUp');
		expect(spy4).toHaveBeenCalledOnce();
		simulate.release();
	});

	it('With Aliases', () => {
		const [spy1, spy2, spy3, spy4, spy5, spy6] = spies(6);

		hk.bind({
			'shift-quote': spy1,
			'ctrl-plus': spy2,
			'alt-space': spy3,
			'meta-pgdn': spy4,
			'shift-tilde': spy5,
			'shift-minus': spy6,
		});

		simulate.keyDown('Shift', 'Quote');
		expect(spy1).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Ctrl', 'Shift', 'Equal'); // +
		expect(spy2).toHaveBeenCalledOnce();
		simulate.release();
		simulate.keyDown('Ctrl', 'NumpadAdd');
		expect(spy2).toHaveBeenCalledTimes(2);
		simulate.release();

		simulate.keyDown('Alt', 'Space');
		expect(spy3).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Meta', 'PageDown');
		expect(spy4).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Shift', 'Backquote');
		expect(spy5).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Shift', 'Minus');
		expect(spy6).toHaveBeenCalledOnce();
		simulate.release();
		simulate.keyDown('Shift', 'Subtract');
		expect(spy6).toHaveBeenCalledTimes(2);
		simulate.release();
	});

	it('Multiple Modifiers', () => {
		const [spy1, spy2, spy3, spy4, spy5, spy6] = spies(6);

		hk.bind({
			'ctrl-alt-a': spy1,
			'alt-shift-b': spy2,
			'shift-alt-c': spy3,
			'alt-ctrl-d': spy4,
			'meta-shift-ctrl-e': spy5,
			'ctrl-alt-meta-shift-f': spy6,
		});

		simulate.keyDown('Ctrl', 'Alt', 'A');
		expect(spy1).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Alt', 'Shift', 'B');
		expect(spy2).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Shift', 'Alt', 'C');
		expect(spy3).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Alt', 'Ctrl', 'D');
		expect(spy4).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Meta', 'Shift', 'Ctrl', 'E');
		expect(spy5).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Ctrl', 'Alt', 'Meta', 'Shift', 'F');
		expect(spy6).toHaveBeenCalledOnce();
		simulate.release();
	});

	it('Order doesn\'t matter', () => {
		hk.bind({
			'alt-ctrl-a': spy,
		});

		simulate.keyDown('Ctrl', 'Alt', 'A');
		expect(spy).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Alt', 'Ctrl', 'A');
		expect(spy).toHaveBeenCalledTimes(2);
		simulate.release();

		const badFunc = () => {
			hk.bind('ctrl-alt-a', spy);
		};

		expect(badFunc).to.throw('Duplicate');
	});
});
