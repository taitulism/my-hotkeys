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
		hk.unmount();
		simulate.reset();
		spy.mockClear();
	});

	describe('Expected Behavior', () => {
		it('Called on target key down with modifier in the background', () => {
			hk.bindKey('ctrl-a', spy);

			expect(spy).not.toBeCalled();
			simulate.keyPress('A');
			expect(spy).not.toBeCalled();
			simulate.keyPress('Ctrl');
			expect(spy).not.toBeCalled();

			simulate.keyDown('Ctrl');
			expect(spy).not.toBeCalled();
			simulate.keyDown('A');
			expect(spy).toHaveBeenCalledTimes(1);
			simulate.keyUp('A', 'Ctrl');
		});

		it('Doesn\'t trigger "A" on "Ctrl-A"', () => {
			const [spy1, spy2] = spies(2);

			hk.bindKeys({
				'a': spy1,
				'ctrl-a': spy2,
			});

			simulate.keyDown('Ctrl', 'A');
			expect(spy2).toHaveBeenCalledTimes(1);
			simulate.releaseAll();
			expect(spy2).toHaveBeenCalledTimes(1);
			expect(spy1).not.toBeCalled();
		});

		it('Can trigger two hotkeys with the same modifier, without releasing it after the first one', () => {
			const [spy1, spy2] = spies(2);

			hk.bindKeys({
				'ctrl-a': spy1,
				'ctrl-b': spy2,
			});

			simulate.keyDown('Ctrl', 'A');
			expect(spy1).toHaveBeenCalledTimes(1);
			simulate.keyUp('A');
			expect(spy2).not.toBeCalled();
			simulate.keyDown('B');
			expect(spy2).toHaveBeenCalledTimes(1);
		});
	});

	it('With Letters', () => {
		const [spy1, spy2, spy3, spy4] = spies(4);

		hk.bindKeys({
			'ctrl-a': spy1,
			'alt-b': spy2,
			'shift-c': spy3,
			'meta-d': spy4,
		});

		simulate.keyDown('Ctrl', 'A');
		expect(spy1).toHaveBeenCalledTimes(1);
		simulate.releaseAll();

		simulate.keyDown('Alt', 'B');
		expect(spy2).toHaveBeenCalledTimes(1);
		simulate.releaseAll();

		simulate.keyDown('Shift', 'C');
		expect(spy3).toHaveBeenCalledTimes(1);
		simulate.releaseAll();

		simulate.keyDown('Meta', 'D');
		expect(spy4).toHaveBeenCalledTimes(1);
		simulate.releaseAll();
	});

	it('With Numbers', () => {
		hk.bindKeys({
			'ctrl-1': spy,
			'alt-2': spy,
			'shift-3': spy,
			'meta-4': spy,
		});

		simulate.keyDown('Ctrl', '1');
		expect(spy).toHaveBeenCalledTimes(1);
		simulate.releaseAll();

		simulate.keyDown('Alt', '2');
		expect(spy).toHaveBeenCalledTimes(2);
		simulate.releaseAll();

		simulate.keyDown('Shift', '3');
		expect(spy).toHaveBeenCalledTimes(3);
		simulate.releaseAll();

		simulate.keyDown('Meta', '4');
		expect(spy).toHaveBeenCalledTimes(4);
		simulate.releaseAll();
	});

	it('With Other keys', () => {
		hk.bindKeys({
			'ctrl-F1': spy,
			'alt-.': spy,
			'shift-Enter': spy,
			'meta-PageUp': spy,
		});

		simulate.keyDown('Ctrl', 'F1');
		expect(spy).toHaveBeenCalledTimes(1);
		simulate.releaseAll();

		simulate.keyDown('Alt', 'Period');
		expect(spy).toHaveBeenCalledTimes(2);
		simulate.releaseAll();

		simulate.keyDown('Shift', 'Enter');
		expect(spy).toHaveBeenCalledTimes(3);
		simulate.releaseAll();

		simulate.keyDown('Meta', 'PageUp');
		expect(spy).toHaveBeenCalledTimes(4);
		simulate.releaseAll();
	});

	it('With Aliases', () => {
		const [spy1, spy2, spy3, spy4] = spies(4);

		hk.bindKeys({
			'shift-underscore': spy1,
			'ctrl-plus': spy2, // TODO:test 1. plus = implicit shift 2. NumpadPlus
			'alt-space': spy3,
			'meta-tilde': spy4,
		});

		simulate.keyDown('Shift', 'Minus');
		expect(spy1).toHaveBeenCalledOnce();
		simulate.releaseAll();

		// simulate.keyDown('Ctrl', 'Shift', 'Equal');
		simulate.keyDown('Ctrl', 'NumpadAdd');
		expect(spy2).toHaveBeenCalledOnce();
		simulate.releaseAll();

		simulate.keyDown('Alt', 'Space');
		expect(spy3).toHaveBeenCalledOnce();
		simulate.releaseAll();

		simulate.keyDown('Meta', 'Backquote');
		expect(spy4).toHaveBeenCalledOnce();
		simulate.releaseAll();
	});

	it('Multiple Modifiers', () => {
		const [spy1, spy2, spy3, spy4, spy5, spy6] = spies(6);

		hk.bindKeys({
			'ctrl-alt-a': spy1,
			'alt-shift-b': spy2,
			'shift-alt-c': spy3,
			'alt-ctrl-d': spy4,
			'meta-shift-ctrl-e': spy5,
			'ctrl-alt-shift-meta-f': spy6,
		});

		simulate.keyDown('Ctrl', 'Alt', 'A');
		expect(spy1).toHaveBeenCalledTimes(1);
		simulate.releaseAll();

		simulate.keyDown('Alt', 'Shift', 'B');
		expect(spy2).toHaveBeenCalledTimes(1);
		simulate.releaseAll();

		simulate.keyDown('Shift', 'Alt', 'C');
		expect(spy3).toHaveBeenCalledTimes(1);
		simulate.releaseAll();

		simulate.keyDown('Alt', 'Ctrl', 'D');
		expect(spy4).toHaveBeenCalledTimes(1);
		simulate.releaseAll();

		simulate.keyDown('Meta', 'Shift', 'Ctrl', 'E');
		expect(spy5).toHaveBeenCalledTimes(1);
		simulate.releaseAll();

		simulate.keyDown('Ctrl', 'Alt', 'Shift', 'Meta', 'F');
		expect(spy6).toHaveBeenCalledTimes(1);
		simulate.releaseAll();
	});

	it('Order doesn\'t matter', () => {
		const [spy1, spy2] = spies(2);

		hk.bindKeys({
			'ctrl-alt-a': spy1,
			'alt-ctrl-b': spy2,
		});

		simulate.keyDown('Ctrl', 'Alt', 'A');
		expect(spy1).toHaveBeenCalledTimes(1);
		simulate.releaseAll();

		simulate.keyDown('Alt', 'Ctrl', 'A');
		expect(spy1).toHaveBeenCalledTimes(2);
		simulate.releaseAll();

		simulate.keyDown('Ctrl', 'Alt', 'B');
		expect(spy2).toHaveBeenCalledTimes(1);
		simulate.releaseAll();

		simulate.keyDown('Alt', 'Ctrl', 'B');
		expect(spy2).toHaveBeenCalledTimes(2);
		simulate.releaseAll();

		const badFunc = () => {
			hk.bindKey('alt-ctrl-a', spy);
		};

		expect(badFunc).to.throw('Duplicate');
	});
});
