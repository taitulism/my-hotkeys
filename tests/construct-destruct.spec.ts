import {JSDOM} from 'jsdom';
import {KeyboardSimulator} from 'keyboard-simulator';
import {it, beforeAll, beforeEach, afterEach, Mock, describe, expect} from 'vitest';
import {Hotkey} from '../src';
import {spyFn} from './utils';

describe('Construction / Destruction', () => {
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
		hk = new Hotkey(doc);
	});

	afterEach(() => {
		hk.destruct();
		simulate.reset();
		spy.mockClear();
	});

	describe('.mount()', () => {
		it('Adds the event listener to the context element', () => {
			hk.bindKey('a', spy);
			expect(spy).not.toBeCalled();
			simulate.keyPress('a');
			expect(spy).not.toBeCalled();

			hk.mount();
			simulate.keyPress('a');
			expect(spy).toHaveBeenCalledTimes(1);
			expect(spy.mock.calls[0][0].target).toBe(doc);
		});

		it('Adds one event listener even when called multiple times', () => {
			hk.bindKey('a', spy);
			hk.mount().mount().mount();

			expect(spy).not.toBeCalled();
			simulate.keyPress('a');
			expect(spy).toHaveBeenCalledTimes(1);
		});
	});

	describe('.unmount()', () => {
		it('Removes the event listener from the context element', () => {
			hk.mount().bindKey('a', spy);
			simulate.keyPress('a');
			expect(spy).toHaveBeenCalledTimes(1);

			hk.unmount();
			simulate.keyPress('a');
			expect(spy).toHaveBeenCalledTimes(1);
		});

		it('Does not remove all hotkeys', () => {
			hk.mount().bindKey('a', spy);
			simulate.keyPress('a');
			expect(spy).toHaveBeenCalledTimes(1);

			hk.unmount();
			hk.mount();

			simulate.keyPress('a');
			expect(spy).toHaveBeenCalledTimes(2);
		});

		it('Safe to call multiple times', () => {
			const okFn = () => {
				hk.mount();
				hk.bindKey('a', spy);
				hk.unmount().unmount().unmount();
			};

			expect(okFn).not.to.throw();
		});
	});

	describe('.destruct()', () => {
		it('Removes the event listener from the context element', () => {
			hk.mount().bindKey('a', spy);
			simulate.keyPress('a');
			expect(spy).toHaveBeenCalledTimes(1);

			hk.destruct();
			simulate.keyPress('a');
			expect(spy).toHaveBeenCalledTimes(1);
		});

		it('Removes all hotkeys', () => {
			hk.mount().bindKey('a', spy);
			simulate.keyPress('a');
			expect(spy).toHaveBeenCalledTimes(1);

			hk.destruct();
			hk.mount();

			simulate.keyPress('a');
			expect(spy).toHaveBeenCalledTimes(1);
		});

		it('Safe to call multiple times', () => {
			const okFn = () => {
				hk.mount();
				hk.bindKey('a', spy);
				hk.destruct().destruct().destruct();
			};

			expect(okFn).not.to.throw();
		});
	});
});
