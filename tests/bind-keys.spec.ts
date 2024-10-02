import {JSDOM} from 'jsdom';
import {KeyboardSimulator} from 'keyboard-simulator';
import {it, beforeAll, beforeEach, afterEach, Mock, describe, expect} from 'vitest';
import {hotkey, Hotkey} from '../src';
import {spies, spyFn} from './utils';

describe('Binding Hotkeys', () => {
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

	describe('.bind(hotkey, handler)', () => {
		it('Adds a hotkey on `keydown` event', () => {
			hk.bind('a', spy);
			expect(spy).not.toBeCalled();
			simulate.keyDown('a');
			expect(spy).toHaveBeenCalledTimes(1);
			simulate.keyUp('a');
			expect(spy).toHaveBeenCalledTimes(1);
		});

		it('Throws on duplicate', () => {
			const failFunc = () => {
				hk.bind('1', spy);
				hk.bind('1', spy);
			};

			expect(failFunc).throw('Duplicated hotkey: "1"');
		});

		it('Throws on invalid hotkey', () => {
			const failFunc1 = () => {
				hk.bind('', spy);
			};
			const failFunc2 = () => {
				hk.bind('--', spy);
			};

			expect(failFunc1).throw('Invalid Hotkey: Empty String');
			expect(failFunc2).throw('Invalid Hotkey: "--"');
		});

		it('Throws on invalid target key', () => {
			const failFunc = () => {
				hk.bind('ctrl-', spy);
			};

			expect(failFunc).throw('Invalid Hotkey: "ctrl-"');
		});

		it('Throws on invalid modifier key', () => {
			const failFunc1 = () => {
				hk.bind('-A', spy);
			};

			const failFunc2 = () => {
				hk.bind('bla-A', spy);
			};

			expect(failFunc1).throw('Invalid Hotkey: "-A"');
			expect(failFunc2).throw('Unknown Modifier: "bla"');
		});

		it('Returns the Hotkey instance', () => {
			const instance = hk.bind('a', spy);

			expect(instance).toBe(hk);
		});
	});

	describe('.bind({hotkeys})', () => {
		it('Adds multiple hotkeys on `keydown` event', () => {
			const [spy1, spy2] = spies(2);

			hk.bind({
				'a': spy1,
				'b': spy2,
			});

			expect(spy1).not.toBeCalled();
			simulate.keyDown('a');
			expect(spy1).toHaveBeenCalledTimes(1);
			simulate.keyUp('a');

			expect(spy2).not.toBeCalled();
			simulate.keyDown('b');
			expect(spy2).toHaveBeenCalledTimes(1);
			simulate.keyUp('b');

			expect(spy1).toHaveBeenCalledTimes(1);
			expect(spy2).toHaveBeenCalledTimes(1);

			spy1.mockRestore();
			spy2.mockRestore();
		});

		it('Returns the Hotkey instance', () => {
			const instance = hk.bind({
				'a': spy,
				'b': spy,
			});

			expect(instance).toBe(hk);
		});
	});
});
