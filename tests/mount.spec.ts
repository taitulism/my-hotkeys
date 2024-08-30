import {JSDOM} from 'jsdom';
import {KeyboardSimulator} from 'keyboard-simulator';
import {it, beforeAll, beforeEach, afterEach, Mock, describe, expect} from 'vitest';
import {hotkey, Hotkey} from '../src';
import {spyFn} from './utils';

describe('Mounting / Unmounting', () => {
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

	describe('.mount()', () => {
		it('adds one event listener even when called multiple times', () => {
			hk.bindKey('a', spy);
			hk.mount().mount().mount();

			expect(spy).not.toBeCalled();
			simulate.keyDown('A');
			expect(spy).toHaveBeenCalledTimes(1);
			simulate.keyUp('A');
		});
	});
});
