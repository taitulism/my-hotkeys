import {JSDOM} from 'jsdom';
import {it, beforeAll, beforeEach, afterEach, Mock} from 'vitest';
import {hotkey, Hotkey} from '../src';
import {KeyboardSimulator} from './keyboard-simulator';
import {calledOnce, notCalledYet, spies, spyFn} from './utils';

export function apiSpec () {
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
		spy.mockReset();
	});

	it('plain hotkey', () => {
		hk.bindKey('a', spy);

		notCalledYet(spy);
		simulate.keyDown('A');
		calledOnce(spy);
		simulate.keyUp('A');
	});

	it('ctrl', () => {
		hk.bindKey('ctrl', spy);

		notCalledYet(spy);
		simulate.keyDown('Ctrl');
		notCalledYet(spy);
		simulate.keyUp('Ctrl');
		calledOnce(spy);
	});

	it('ctrl-a', () => {
		hk.bindKey('ctrl-a', spy);

		notCalledYet(spy);
		simulate.keyPress('A');
		notCalledYet(spy);
		simulate.keyPress('Ctrl');
		notCalledYet(spy);

		simulate.keyDown('Ctrl');
		notCalledYet(spy);
		simulate.keyDown('A');
		calledOnce(spy);
		simulate.keyUp('A');
		simulate.keyUp('Ctrl');
	});

	it('multi obj', () => {
		const [spy1, spy2, spy3] = spies(3);

		hk.bindKeys({
			'a': spy1,
			'b': spy2,
			'c': spy3,
		});

		notCalledYet(spy1, spy2, spy3);
		simulate.keyPress('A');
		simulate.keyPress('B');
		simulate.keyPress('C');
		calledOnce(spy1, spy2, spy3);
	});
}
