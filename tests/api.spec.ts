import {JSDOM} from 'jsdom';
import {it, beforeAll, beforeEach, afterEach, Mock, describe} from 'vitest';
import {hotkey, Hotkey} from '../src';
import {KeyboardSimulator} from './keyboard-simulator';
import {calledOnce, notCalled, spies, spyFn} from './utils';

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

		notCalled(spy);
		simulate.keyDown('A');
		calledOnce(spy);
		simulate.keyUp('A');
	});

	it('ctrl', () => {
		hk.bindKey('ctrl', spy);

		notCalled(spy);
		simulate.keyDown('Ctrl');
		notCalled(spy);
		simulate.keyUp('Ctrl');
		calledOnce(spy);
	});

	it('ctrl-a', () => {
		hk.bindKey('ctrl-a', spy);

		notCalled(spy);
		simulate.keyPress('A');
		notCalled(spy);
		simulate.keyPress('Ctrl');
		notCalled(spy);

		simulate.keyDown('Ctrl');
		notCalled(spy);
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

		notCalled(spy1, spy2, spy3);
		simulate.keyPress('A');
		simulate.keyPress('B');
		simulate.keyPress('C');
		calledOnce(spy1, spy2, spy3);
	});

	describe('Plain keys and Modifiers', () => {
		it('doesn\'t trigger A on Ctrl-A ', () => {
			const [spy1, spy2] = spies(2);

			hk.bindKeys({
				'a': spy1,
				'ctrl-a': spy2,
			});

			simulate.keyDown('Ctrl');
			simulate.keyDown('A');
			notCalled(spy1);
			calledOnce(spy2);

			simulate.keyUp('A');
			simulate.keyUp('Ctrl');
			notCalled(spy1);
			calledOnce(spy2);
		});

		it('doesn\'t trigger Ctrl on Ctrl-A ', () => {
			const [spy1, spy2] = spies(2);

			hk.bindKeys({
				'ctrl': spy1,
				'ctrl-a': spy2,
			});

			simulate.keyDown('Ctrl');
			simulate.keyDown('A');
			notCalled(spy1);
			calledOnce(spy2);

			simulate.keyUp('A');
			simulate.keyUp('Ctrl');
			notCalled(spy1);
			calledOnce(spy2);
		});
	});
}
