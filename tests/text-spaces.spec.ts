import {JSDOM} from 'jsdom';
import {KeyboardSimulator} from 'keyboard-simulator';
import {it, beforeAll, beforeEach, afterEach, expect, Mock, describe} from 'vitest';
import {hotkey, Hotkey} from '../src';
import {spyFn} from './utils';

describe('Text Spaces', () => {
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

	it('Space & BackSpace', () => {
		hk.bindKeys({
			' ': spy,
			'Backspace': spy,
		});

		simulate.keyPress('Space');
		expect(spy).toHaveBeenCalledTimes(1);
		simulate.keyPress('Backspace');
		expect(spy).toHaveBeenCalledTimes(2);
	});

	it('Insert & Delete', () => {
		hk.bindKeys({
			'Insert': spy,
			'Delete': spy,
		});

		simulate.keyPress('Insert');
		expect(spy).toHaveBeenCalledTimes(1);

		simulate.keyPress('Delete');
		expect(spy).toHaveBeenCalledTimes(2);

		// TODO: NumpadDecimal --> delete
		// simulate.keyPress('NumpadDecimal');
		// expect(spy).toHaveBeenCalledTimes(3);
	});

	it('Enter', () => {
		hk.bindKey('Enter', spy);

		simulate.keyPress('Enter');
		expect(spy).toHaveBeenCalledTimes(1);

		simulate.keyPress('NumpadEnter');
		expect(spy).toHaveBeenCalledTimes(2);
	});

	it('Tab', () => {
		hk.bindKey('Tab', spy);

		simulate.keyPress('Tab');
		expect(spy).toHaveBeenCalledTimes(1);
	});
});
