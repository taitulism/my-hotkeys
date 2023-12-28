import {JSDOM} from 'jsdom';
import {KeyboardSimulator} from 'keyboard-simulator';
import {it, beforeAll, beforeEach, afterEach, expect, Mock, describe} from 'vitest';
import {hotkeyz, Hotkeyz} from '../src';
import {spies, spyFn} from './utils';

describe('Text Spaces', () => {
	let doc: Document | undefined;
	let simulate: KeyboardSimulator;
	let hk: Hotkeyz;
	let spy: Mock;

	beforeAll(() => {
		const dom = new JSDOM();

		doc = dom.window.document;
		simulate = new KeyboardSimulator(doc);
		spy = spyFn();
	});

	beforeEach(() => {
		hk = hotkeyz(doc);
	});

	afterEach(() => {
		hk.destruct();
		simulate.reset();
		spy.mockClear();
	});

	it('Space & BackSpace', () => {
		const [spy1, spy2] = spies(2);

		hk.bind({
			' ': spy1,
			'Backspace': spy2,
		});

		simulate.keyDown('Space');
		expect(spy1).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Backspace');
		expect(spy2).toHaveBeenCalledOnce();
		simulate.release();
	});

	it('Insert & Delete', () => {
		const [spy1, spy2] = spies(2);

		hk.bind({
			'Insert': spy1,
			'Delete': spy2,
		});

		simulate.keyDown('Insert');
		expect(spy1).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('Delete');
		expect(spy2).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyPress('NumLock'); // Off

		simulate.keyDown('Numpad0'); // = Insert
		expect(spy1).toHaveBeenCalledTimes(2);
		simulate.release();

		simulate.keyDown('NumpadDecimal'); // = Del
		expect(spy2).toHaveBeenCalledTimes(2);
		simulate.release();
	});

	it('Enter', () => {
		hk.bind('Enter', spy);

		simulate.keyDown('Enter');
		expect(spy).toHaveBeenCalledOnce();
		simulate.release();

		simulate.keyDown('NumpadEnter');
		expect(spy).toHaveBeenCalledTimes(2);
		simulate.release();
	});

	it('Tab', () => {
		hk.bind('Tab', spy);

		simulate.keyDown('Tab');
		expect(spy).toHaveBeenCalledOnce();
		simulate.release();
	});
});
