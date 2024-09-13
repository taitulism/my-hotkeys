import {JSDOM} from 'jsdom';
import {KeyboardSimulator} from 'keyboard-simulator';
import {it, beforeAll, beforeEach, afterEach, expect, Mock, describe} from 'vitest';
import {hotkey, Hotkey} from '../src';
import {spyFn} from './utils';

describe('Arrows & Navigation', () => {
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

	it('Arrows', () => {
		hk.bindKeys({
			'ArrowUp': spy,
			'ArrowDown': spy,
			'ArrowLeft': spy,
			'ArrowRight': spy,
		});

		simulate.keyPress('ArrowUp');
		expect(spy).toHaveBeenCalledTimes(1);

		simulate.keyPress('ArrowDown');
		expect(spy).toHaveBeenCalledTimes(2);

		simulate.keyPress('ArrowLeft');
		expect(spy).toHaveBeenCalledTimes(3);

		simulate.keyPress('ArrowRight');
		expect(spy).toHaveBeenCalledTimes(4);

		simulate.keyPress('NumLock');

		simulate.keyPress('Np2'); // Down
		expect(spy).toHaveBeenCalledTimes(5);

		simulate.keyPress('Np4'); // Left
		expect(spy).toHaveBeenCalledTimes(6);

		simulate.keyPress('Np6'); // Right
		expect(spy).toHaveBeenCalledTimes(7);

		simulate.keyPress('Np8'); // Up
		expect(spy).toHaveBeenCalledTimes(8);
	});

	it('Arrows Aliases (+ case insensitive)', () => {
		hk.bindKeys({
			'Up': spy,
			'down': spy,
			'LEFT': spy,
			'RighT': spy,
		});

		simulate.keyPress('ArrowUp');
		expect(spy).toHaveBeenCalledTimes(1);

		simulate.keyPress('ArrowDown');
		expect(spy).toHaveBeenCalledTimes(2);

		simulate.keyPress('ArrowLeft');
		expect(spy).toHaveBeenCalledTimes(3);

		simulate.keyPress('ArrowRight');
		expect(spy).toHaveBeenCalledTimes(4);
	});

	it('PageUp & PageDown', () => {
		hk.bindKeys({
			'PageUp': spy,
			'PageDown': spy,
		});

		simulate.keyPress('PageUp');
		expect(spy).toHaveBeenCalledTimes(1);
		simulate.keyPress('PageDown');
		expect(spy).toHaveBeenCalledTimes(2);
	});

	it('Home & End', () => {
		hk.bindKeys({
			'Home': spy,
			'End': spy,
		});

		simulate.keyPress('Home');
		expect(spy).toHaveBeenCalledTimes(1);
		simulate.keyPress('End');
		expect(spy).toHaveBeenCalledTimes(2);
	});
});