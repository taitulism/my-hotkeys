import {JSDOM} from 'jsdom';
import {KeyboardSimulator} from 'keyboard-simulator';
import {it, beforeAll, beforeEach, afterEach, Mock, describe, expect} from 'vitest';
import {hotkey, Hotkey} from '../src';
import {spyFn} from './utils';

describe('unbinding keys', () => {
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

	it('Throw when key doesn\'t exsits', () => {
		const errFunc = () => {
			hk.bindKey('a', spy);
			hk.unbindKey('b');
		};

		expect(errFunc).to.throw('No Such Hotkey');
	});

	describe('.unbindKey()', () => {
		it('Unbind a single key', () => {
			hk.bindKey('a', spy);

			simulate.keyDown('A');
			expect(spy).toHaveBeenCalledTimes(1);
			simulate.keyUp('A');

			simulate.keyDown('A');
			expect(spy).toHaveBeenCalledTimes(2);
			simulate.keyUp('A');

			hk.unbindKey('a');

			simulate.keyPress('A');
			expect(spy).toHaveBeenCalledTimes(2);
		});

		it('Unbind a double Key', () => {
			hk.bindKey('/', spy);

			simulate.keyDown('Slash');
			expect(spy).toHaveBeenCalledTimes(1);
			simulate.keyUp('Slash');

			simulate.keyDown('NumpadDivide');
			expect(spy).toHaveBeenCalledTimes(2);
			simulate.keyUp('NumpadDivide');

			hk.unbindKey('/');

			simulate.keyPress('Slash');
			expect(spy).toHaveBeenCalledTimes(2);
			simulate.keyPress('NumpadDivide');
			expect(spy).toHaveBeenCalledTimes(2);
		});

		it('Unbind one key of', () => {
			hk.bindKeys({
				'a': spy,
				'ctrl-a': spy,
			});

			simulate.keyDown('A');
			expect(spy).toHaveBeenCalledTimes(1);
			simulate.keyUp('A');
			simulate.keyDown('Ctrl', 'A');
			expect(spy).toHaveBeenCalledTimes(2);
			simulate.releaseAll();

			hk.unbindKey('ctrl-a');

			simulate.keyDown('A');
			expect(spy).toHaveBeenCalledTimes(3);
			simulate.keyUp('A');
			simulate.keyDown('Ctrl', 'A');
			expect(spy).toHaveBeenCalledTimes(3);
			simulate.releaseAll();
		});
	});

	describe('.unbindKeys()', () => {
		it('Unbind multiple keys', () => {
			hk.bindKeys({
				'a': spy,
				'b': spy,
				'c': spy,
			});

			simulate.keyPress('A');
			expect(spy).toHaveBeenCalledTimes(1);

			simulate.keyPress('B');
			expect(spy).toHaveBeenCalledTimes(2);

			simulate.keyPress('C');
			expect(spy).toHaveBeenCalledTimes(3);

			hk.unbindKeys(['a', 'b']);

			simulate.keyPress('A');
			expect(spy).toHaveBeenCalledTimes(3);
			simulate.keyPress('B');
			expect(spy).toHaveBeenCalledTimes(3);
			simulate.keyPress('C');
			expect(spy).toHaveBeenCalledTimes(4);
		});
	});

	describe('.unbindAll()', () => {
		it('Unbind all keys', () => {
			hk.bindKeys({
				'a': spy,
				'b': spy,
			});

			simulate.keyPress('A');
			expect(spy).toHaveBeenCalledTimes(1);

			simulate.keyPress('B');
			expect(spy).toHaveBeenCalledTimes(2);

			hk.unbindAll();

			simulate.keyPress('A');
			expect(spy).toHaveBeenCalledTimes(2);
			simulate.keyPress('B');
			expect(spy).toHaveBeenCalledTimes(2);
		});
	});
});
