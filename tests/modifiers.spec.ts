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
			hk.bindKey('ctrl-a', spy);

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

			hk.bindKeys({
				'a': spy1,
				'ctrl-a': spy2,
			});

			simulate.keyDown('Ctrl', 'A');
			expect(spy2).toHaveBeenCalledOnce();
			simulate.releaseAll();
			expect(spy2).toHaveBeenCalledOnce();
			expect(spy1).not.toBeCalled();
		});

		it('Can trigger two hotkeys with the same modifier without releasing it after the first one', () => {
			const [spy1, spy2] = spies(2);

			hk.bindKeys({
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

	it('With Letters', () => {
		const [spy1, spy2, spy3, spy4] = spies(4);

		hk.bindKeys({
			'ctrl-a': spy1,
			'alt-b': spy2,
			'shift-c': spy3,
			'meta-d': spy4,
		});

		simulate.keyDown('Ctrl', 'A');
		expect(spy1).toHaveBeenCalledOnce();
		simulate.releaseAll();

		simulate.keyDown('Alt', 'B');
		expect(spy2).toHaveBeenCalledOnce();
		simulate.releaseAll();

		simulate.keyDown('Shift', 'C');
		expect(spy3).toHaveBeenCalledOnce();
		simulate.releaseAll();

		simulate.keyDown('Meta', 'D');
		expect(spy4).toHaveBeenCalledOnce();
		simulate.releaseAll();
	});

	it('With Numbers', () => {
		const [spy1, spy2, spy3, spy4] = spies(4);

		hk.bindKeys({
			'ctrl-1': spy1,
			'alt-2': spy2,
			'shift-3': spy3,
			'meta-4': spy4,
		});

		simulate.keyDown('Ctrl', '1');
		expect(spy1).toHaveBeenCalledOnce();
		simulate.releaseAll();

		simulate.keyDown('Alt', '2');
		expect(spy2).toHaveBeenCalledOnce();
		simulate.releaseAll();

		simulate.keyDown('Shift', '3');
		expect(spy3).toHaveBeenCalledOnce();
		simulate.releaseAll();

		simulate.keyDown('Meta', '4');
		expect(spy4).toHaveBeenCalledOnce();
		simulate.releaseAll();
	});

	it('With Other keys', () => {
		const [spy1, spy2, spy3, spy4] = spies(4);

		hk.bindKeys({
			'ctrl-F1': spy1,
			'alt-.': spy2,
			'shift-Enter': spy3,
			'meta-PageUp': spy4,
		});

		simulate.keyDown('Ctrl', 'F1');
		expect(spy1).toHaveBeenCalledOnce();
		simulate.releaseAll();

		simulate.keyDown('Alt', 'Period');
		expect(spy2).toHaveBeenCalledOnce();
		simulate.releaseAll();

		simulate.keyDown('Shift', 'Enter');
		expect(spy3).toHaveBeenCalledOnce();
		simulate.releaseAll();

		simulate.keyDown('Meta', 'PageUp');
		expect(spy4).toHaveBeenCalledOnce();
		simulate.releaseAll();
	});

	it('With Aliases', () => {
		const [spy1, spy2, spy3, spy4] = spies(4);

		hk.bindKeys({
			'shift-underscore': spy1,
			'ctrl-plus': spy2,
			'alt-space': spy3,
			'meta-tilde': spy4,
		});

		simulate.keyDown('Shift', 'Minus');
		expect(spy1).toHaveBeenCalledOnce();
		simulate.releaseAll();

		simulate.keyDown('Ctrl', 'Shift', 'Equal'); // +
		expect(spy2).toHaveBeenCalledOnce();
		simulate.releaseAll();
		simulate.keyDown('Ctrl', 'NumpadAdd');
		expect(spy2).toHaveBeenCalledTimes(2);
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
			'ctrl-alt-meta-shift-f': spy6,
		});

		simulate.keyDown('Ctrl', 'Alt', 'A');
		expect(spy1).toHaveBeenCalledOnce();
		simulate.releaseAll();

		simulate.keyDown('Alt', 'Shift', 'B');
		expect(spy2).toHaveBeenCalledOnce();
		simulate.releaseAll();

		simulate.keyDown('Shift', 'Alt', 'C');
		expect(spy3).toHaveBeenCalledOnce();
		simulate.releaseAll();

		simulate.keyDown('Alt', 'Ctrl', 'D');
		expect(spy4).toHaveBeenCalledOnce();
		simulate.releaseAll();

		simulate.keyDown('Meta', 'Shift', 'Ctrl', 'E');
		expect(spy5).toHaveBeenCalledOnce();
		simulate.releaseAll();

		simulate.keyDown('Ctrl', 'Alt', 'Meta', 'Shift', 'F');
		expect(spy6).toHaveBeenCalledOnce();
		simulate.releaseAll();
	});

	it('Order doesn\'t matter', () => {
		hk.bindKeys({
			'alt-ctrl-a': spy,
		});

		simulate.keyDown('Ctrl', 'Alt', 'A');
		expect(spy).toHaveBeenCalledOnce();
		simulate.releaseAll();

		simulate.keyDown('Alt', 'Ctrl', 'A');
		expect(spy).toHaveBeenCalledTimes(2);
		simulate.releaseAll();

		const badFunc = () => {
			hk.bindKey('ctrl-alt-a', spy);
		};

		expect(badFunc).to.throw('Duplicate');
	});
});
