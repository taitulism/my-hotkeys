import {JSDOM} from 'jsdom';
import {KeyboardSimulator} from 'keyboard-simulator';
import {it, beforeAll, beforeEach, afterEach, expect, Mock, describe} from 'vitest';
import {hotkey, Hotkey} from '../src';
import {spyFn} from './utils';

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

	it('With Letters', () => {
		hk.bindKeys({
			'ctrl-a': spy,
			'alt-b': spy,
			'shift-c': spy,
			'meta-d': spy,
		});

		simulate.keyDown('Ctrl', 'A');
		expect(spy).toHaveBeenCalledTimes(1);
		simulate.releaseAll();

		simulate.keyDown('Alt', 'B');
		expect(spy).toHaveBeenCalledTimes(2);
		simulate.releaseAll();

		simulate.keyDown('Shift', 'C');
		expect(spy).toHaveBeenCalledTimes(3);
		simulate.releaseAll();

		simulate.keyDown('Meta', 'D');
		expect(spy).toHaveBeenCalledTimes(4);
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

	it('Multiple Modifiers', () => {
		hk.bindKeys({
			'ctrl-alt-F1': spy,
			'alt-shift-[': spy,
			'shift-meta-Enter': spy,
			'meta-ctrl-PageUp': spy,
		});

		simulate.keyDown('Ctrl', 'Alt', 'F1');
		expect(spy).toHaveBeenCalledTimes(1);
		simulate.releaseAll();

		simulate.keyDown('Alt', 'Shift', 'BracketLeft');
		expect(spy).toHaveBeenCalledTimes(2);
		simulate.releaseAll();

		simulate.keyDown('Shift', 'Meta', 'Enter');
		expect(spy).toHaveBeenCalledTimes(3);
		simulate.releaseAll();

		simulate.keyDown('Meta', 'Ctrl', 'PageUp');
		expect(spy).toHaveBeenCalledTimes(4);
		simulate.releaseAll();
	});
});
