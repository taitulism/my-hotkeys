import {JSDOM} from 'jsdom';
import {KeyboardSimulator} from 'keyboard-simulator';
import {it, beforeAll, beforeEach, afterEach, Mock, describe, expect} from 'vitest';
import {hotkey, Hotkey} from '../src';
import {spyFn} from './utils';

describe('.unbindKey()', () => {
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

	it('Unbind Single Key', () => {
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

	it('unbind one key of', () => {
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

	it('Throw when key doesn\'t exsits', () => {
		const errFunc = () => {
			hk.bindKey('a', spy);
			hk.unbindKey('b');
		};

		simulate.keyPress('A');
		expect(errFunc).to.throw('No Such Hotkey');
	});
});
