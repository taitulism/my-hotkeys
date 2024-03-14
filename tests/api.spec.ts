import {JSDOM} from 'jsdom';
import {KeyboardSimulator} from 'keyboard-simulator';
import {it, beforeAll, beforeEach, afterEach, Mock, describe} from 'vitest';
import {hotkey, Hotkey} from '../src';
import {calledOnce, calledTwice, notCalled, spies, spyFn} from './utils';

describe('API', () => {
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
		simulate.keyUp('A', 'Ctrl');
	});

	it('multi obj', () => {
		const [spy1, spy2, spy3] = spies(3);

		hk.bindKeys({
			'a': spy1,
			'b': spy2,
			'c': spy3,
		});

		notCalled(spy1, spy2, spy3);
		simulate.keyPress('A', 'B', 'C');
		calledOnce(spy1, spy2, spy3);
	});

	describe('Plain keys and Modifiers', () => {
		it('Doesn\'t trigger A on Ctrl-A', () => {
			const [spy1, spy2] = spies(2);

			hk.bindKeys({
				'a': spy1,
				'ctrl-a': spy2,
			});

			simulate.keyDown('Ctrl', 'A');
			calledOnce(spy2);
			simulate.releaseAll();
			calledOnce(spy2);

			notCalled(spy1);
		});

		it.skip('Doesn\'t trigger Ctrl-B on Ctrl-A-B', () => {
			const [spy1, spy2] = spies(2);

			hk.bindKeys({
				'ctrl-a': spy1,
				'ctrl-b': spy2,
			});

			simulate.keyDown('Ctrl', 'A', 'B');
			simulate.releaseAll();
			calledOnce(spy1);
			notCalled(spy2);
		});
	});

	describe('Modifiers', () => {
		it('Can be used as BG keys', () => {
			const [spy1, spy2, spy3, spy4] = spies(4);

			hk.bindKeys({
				'ctrl-a': spy1,
				'alt-a': spy2,
				'shift-a': spy3,
				'meta-a': spy4,
			});

			simulate.keyDown('Ctrl', 'A');
			calledOnce(spy1);
			simulate.releaseAll();

			simulate.keyDown('Alt', 'A');
			calledOnce(spy2);
			simulate.releaseAll();

			simulate.keyDown('Shift', 'A');
			calledOnce(spy3);
			simulate.releaseAll();

			simulate.keyDown('Meta', 'A');
			calledOnce(spy4);
			simulate.releaseAll();

			calledOnce(spy1, spy2, spy3, spy4);
		});

		it('Can be used with other modifiers as BG keys', () => {
			const [spy1, spy2, spy3, spy4, spy5, spy6] = spies(6);

			hk.bindKeys({
				'ctrl-alt-a': spy1,
				'ctrl-shift-a': spy2,
				'ctrl-meta-a': spy3,
				'alt-shift-a': spy4,
				'alt-meta-a': spy5,
				'shift-meta-a': spy6,
			});

			simulate.keyDown('Ctrl', 'Alt', 'A');
			calledOnce(spy1);
			simulate.releaseAll();

			simulate.keyDown('Ctrl', 'Shift', 'A');
			calledOnce(spy2);
			simulate.releaseAll();

			simulate.keyDown('Ctrl', 'Meta', 'A');
			calledOnce(spy3);
			simulate.releaseAll();

			simulate.keyDown('Alt', 'Shift', 'A');
			calledOnce(spy4);
			simulate.releaseAll();

			simulate.keyDown('Alt', 'Meta', 'A');
			calledOnce(spy5);
			simulate.releaseAll();

			simulate.keyDown('Shift', 'Meta', 'A');
			calledOnce(spy6);
			simulate.releaseAll();

			calledOnce(spy1, spy2, spy3, spy4, spy5, spy6);
		});

		it('Order doesn\'t matter when multiple BG keys', () => {
			hk.bindKey('ctrl-alt-a', spy);

			simulate.keyDown('Ctrl', 'Alt', 'A');
			calledOnce(spy);
			simulate.releaseAll();

			simulate.keyDown('Alt', 'Ctrl', 'A');
			calledTwice(spy);
			simulate.releaseAll();

			calledTwice(spy);
		});

		it('Can be used with all other modifiers as BG keys', () => {
			const [spy1, spy2, spy3, spy4, spy5] = spies(5);

			hk.bindKeys({
				'ctrl-alt-shift-a': spy1,
				'ctrl-alt-meta-a': spy2,
				'ctrl-shift-meta-a': spy3,
				'alt-shift-meta-a': spy4,
				'ctrl-alt-shift-meta-a': spy5,
			});

			simulate.keyDown('Ctrl', 'Alt', 'Shift', 'A');
			calledOnce(spy1);
			simulate.releaseAll();

			simulate.keyDown('Ctrl', 'Alt', 'Meta', 'A');
			calledOnce(spy2);
			simulate.releaseAll();

			simulate.keyDown('Ctrl', 'Shift', 'Meta', 'A');
			calledOnce(spy3);
			simulate.releaseAll();

			simulate.keyDown('Alt', 'Shift', 'Meta', 'A');
			calledOnce(spy4);
			simulate.releaseAll();

			simulate.keyDown('Ctrl', 'Alt', 'Shift', 'Meta', 'A');
			calledOnce(spy5);
			simulate.releaseAll();
		});

		it('Release order doesn\'t matter', () => {
			const [spy1, spy2] = spies(2);

			hk.bindKeys({
				'ctrl-alt-shift-a': spy1,
				'a': spy2,
			});

			simulate.keyDown('Ctrl', 'Alt', 'Shift', 'A');
			calledOnce(spy1);
			simulate.keyUp('Alt', 'Shift', 'A', 'Ctrl');
			calledOnce(spy1);
			notCalled(spy2);
		});
	});
});
