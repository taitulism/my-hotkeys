import {JSDOM} from 'jsdom';
import {KeyboardSimulator} from 'keyboard-simulator';
import {it, beforeAll, beforeEach, afterEach, Mock, describe, expect} from 'vitest';
import {hotkey, Hotkey} from '../src';
import {spies, spyFn} from './utils';

describe('Smoke Detection', () => {
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

	it('plain hotkey', () => {
		hk.bindKey('a', spy);

		expect(spy).not.toBeCalled();
		simulate.keyDown('A');
		expect(spy).toHaveBeenCalledTimes(1);
		simulate.keyUp('A');
	});

	it('ctrl-a', () => {
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

	it('multi obj', () => {
		const [spy1, spy2, spy3] = spies(3);

		hk.bindKeys({
			'a': spy1,
			'b': spy2,
			'c': spy3,
		});

		expect(spy1).not.toBeCalled();
		expect(spy2).not.toBeCalled();
		expect(spy3).not.toBeCalled();
		simulate.keyPress('A', 'B', 'C');
		expect(spy1).toHaveBeenCalledTimes(1);
		expect(spy2).toHaveBeenCalledTimes(1);
		expect(spy3).toHaveBeenCalledTimes(1);
	});

	it('Throws on duplicate', () => {
		const failFunc = () => {
			hk.bindKey('A', spy);
			hk.bindKey('a', spy);
		};

		expect(failFunc).throw('Duplicated hotkey: "a"');
	});

	describe('Plain keys and Modifiers', () => {
		it('Doesn\'t trigger A on Ctrl-A', () => {
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

		it.skip('Doesn\'t trigger Ctrl-B on Ctrl-A-B', () => {
			const [spy1, spy2] = spies(2);

			hk.bindKeys({
				'ctrl-a': spy1,
				'ctrl-b': spy2,
			});

			simulate.keyDown('Ctrl', 'A', 'B');
			simulate.releaseAll();
			expect(spy1).toHaveBeenCalledTimes(1);
			expect(spy2).not.toBeCalled();
		});
	});

	describe('Modifiers', () => {
		it('Are used as background keys in combinations', () => {
			const [spy1, spy2, spy3, spy4] = spies(4);

			hk.bindKeys({
				'ctrl-a': spy1,
				'alt-a': spy2,
				'shift-a': spy3,
				'meta-a': spy4,
			});

			simulate.keyDown('Ctrl', 'A');
			expect(spy1).toHaveBeenCalledTimes(1);
			simulate.releaseAll();

			simulate.keyDown('Alt', 'A');
			expect(spy2).toHaveBeenCalledTimes(1);
			simulate.releaseAll();

			simulate.keyDown('Shift', 'A');
			expect(spy3).toHaveBeenCalledTimes(1);
			simulate.releaseAll();

			simulate.keyDown('Meta', 'A');
			expect(spy4).toHaveBeenCalledTimes(1);
			simulate.releaseAll();

			expect(spy1).toHaveBeenCalledTimes(1);
			expect(spy2).toHaveBeenCalledTimes(1);
			expect(spy3).toHaveBeenCalledTimes(1);
			expect(spy4).toHaveBeenCalledTimes(1);
		});

		it('Can be used with other modifiers as background keys', () => {
			const [spy1, spy2, spy3, spy4, spy5, spy6] = spies(6);

			hk.bindKeys({
				'ctrl-alt-a': spy1,
				'ctrl-shift-a': spy2,
				'ctrl-meta-a': spy3,
				'alt-shift-a': spy4,
				'alt-meta-a': spy5,
				'shift-meta-a': spy6,
			});

			simulate.keyDown('Ctrl', 'Alt', 'A');
			expect(spy1).toHaveBeenCalledTimes(1);
			simulate.releaseAll();

			simulate.keyDown('Ctrl', 'Shift', 'A');
			expect(spy2).toHaveBeenCalledTimes(1);
			simulate.releaseAll();

			simulate.keyDown('Ctrl', 'Meta', 'A');
			expect(spy3).toHaveBeenCalledTimes(1);
			simulate.releaseAll();

			simulate.keyDown('Alt', 'Shift', 'A');
			expect(spy4).toHaveBeenCalledTimes(1);
			simulate.releaseAll();

			simulate.keyDown('Alt', 'Meta', 'A');
			expect(spy5).toHaveBeenCalledTimes(1);
			simulate.releaseAll();

			simulate.keyDown('Shift', 'Meta', 'A');
			expect(spy6).toHaveBeenCalledTimes(1);
			simulate.releaseAll();

			expect(spy1).toHaveBeenCalledTimes(1);
			expect(spy2).toHaveBeenCalledTimes(1);
			expect(spy3).toHaveBeenCalledTimes(1);
			expect(spy4).toHaveBeenCalledTimes(1);
			expect(spy5).toHaveBeenCalledTimes(1);
			expect(spy6).toHaveBeenCalledTimes(1);
		});

		it('Order doesn\'t matter when multiple background keys', () => {
			hk.bindKey('ctrl-alt-a', spy);

			simulate.keyDown('Ctrl', 'Alt', 'A');
			expect(spy).toHaveBeenCalledTimes(1);
			simulate.releaseAll();

			simulate.keyDown('Alt', 'Ctrl', 'A');
			expect(spy).toHaveBeenCalledTimes(2);
			simulate.releaseAll();

			expect(spy).toHaveBeenCalledTimes(2);
		});

		it('Can be used with all other modifiers as background keys', () => {
			const [spy1, spy2, spy3, spy4, spy5] = spies(5);

			hk.bindKeys({
				'ctrl-alt-shift-a': spy1,
				'ctrl-alt-meta-a': spy2,
				'ctrl-shift-meta-a': spy3,
				'alt-shift-meta-a': spy4,
				'ctrl-alt-shift-meta-a': spy5,
			});

			simulate.keyDown('Ctrl', 'Alt', 'Shift', 'A');
			expect(spy1).toHaveBeenCalledTimes(1);
			simulate.releaseAll();

			simulate.keyDown('Ctrl', 'Alt', 'Meta', 'A');
			expect(spy2).toHaveBeenCalledTimes(1);
			simulate.releaseAll();

			simulate.keyDown('Ctrl', 'Shift', 'Meta', 'A');
			expect(spy3).toHaveBeenCalledTimes(1);
			simulate.releaseAll();

			simulate.keyDown('Alt', 'Shift', 'Meta', 'A');
			expect(spy4).toHaveBeenCalledTimes(1);
			simulate.releaseAll();

			simulate.keyDown('Ctrl', 'Alt', 'Shift', 'Meta', 'A');
			expect(spy5).toHaveBeenCalledTimes(1);
			simulate.releaseAll();
		});

		it('Release order doesn\'t matter', () => {
			const [spy1, spy2] = spies(2);

			hk.bindKeys({
				'ctrl-alt-shift-a': spy1,
				'a': spy2,
			});

			simulate.keyDown('Ctrl', 'Alt', 'Shift', 'A');
			expect(spy1).toHaveBeenCalledTimes(1);
			simulate.keyUp('Alt', 'Shift', 'A', 'Ctrl');
			expect(spy1).toHaveBeenCalledTimes(1);
			expect(spy2).not.toBeCalled();
		});
	});
});
