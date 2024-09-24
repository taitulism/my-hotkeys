import {JSDOM} from 'jsdom';
import {KeyboardSimulator} from 'keyboard-simulator';
import {it, beforeAll, beforeEach, afterEach, Mock, describe, expect} from 'vitest';
import {hotkey, Hotkey} from '../src';
import {spyFn} from './utils';

describe('Unbinding Hotkeys', () => {
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

	it('Throws when key doesn\'t exsits', () => {
		const errFunc1 = () => {
			hk.bindKey('a', spy);
			hk.unbindKey('b');
		};

		const errFunc2 = () => {
			hk.bindKey('x', spy);
			hk.unbindKeys(['y', 'z']);
		};

		expect(errFunc1).to.throw('No Such Hotkey');
		expect(errFunc2).to.throw('No Such Hotkey');
	});

	describe('.unbindKey()', () => {
		it('Unbinds a single key', () => {
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

		it('Unbinds an alias', () => {
			hk.bindKey('shift-pgdn', spy);

			simulate.keyDown('Shift', 'PageDown');
			expect(spy).toHaveBeenCalledTimes(1);
			simulate.releaseAll();

			simulate.keyDown('Shift', 'PageDown');
			expect(spy).toHaveBeenCalledTimes(2);
			simulate.releaseAll();

			hk.unbindKey('shift-pgdn');

			simulate.keyPress('Shift', 'PageDown');
			expect(spy).toHaveBeenCalledTimes(2);
		});

		it('Unbinds a dup Key (Shift + Symbol)', () => {
			hk.bindKey('shift-/', spy);

			simulate.keyDown('Shift', 'Slash');
			expect(spy).toHaveBeenCalledTimes(1);
			simulate.releaseAll();

			simulate.keyDown('Shift', 'NumpadDivide');
			expect(spy).toHaveBeenCalledTimes(2);
			simulate.releaseAll();

			hk.unbindKey('shift-/');

			simulate.keyPress('Slash');
			expect(spy).toHaveBeenCalledTimes(2);
			simulate.keyPress('NumpadDivide');
			expect(spy).toHaveBeenCalledTimes(2);
		});

		it('Unbinds one key of', () => {
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
		it('Unbinds multiple keys', () => {
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
		it('Unbinds all keys', () => {
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
