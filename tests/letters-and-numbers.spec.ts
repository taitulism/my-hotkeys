import {JSDOM} from 'jsdom';
import {KeyboardSimulator} from 'keyboard-simulator';
import {it, beforeAll, beforeEach, afterEach, expect, Mock, describe} from 'vitest';
import {hotkey, Hotkey} from '../src';
import {spyFn} from './utils';

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
		hk.unmount();
		simulate.reset();
		spy.mockClear();
	});

	it('a', () => {
		hk.bindKey('a', spy);

		simulate.keyDown('A');
		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('A', () => {
		hk.bindKey('a', spy);

		simulate.keyDown('A');
		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('Digit 1', () => {
		hk.bindKey('1', spy);

		simulate.keyDown('Digit1');
		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('Numpad 1', () => {
		hk.bindKey('1', spy);

		simulate.keyDown('Numpad1');
		expect(spy).toHaveBeenCalledTimes(1);
	});
});
