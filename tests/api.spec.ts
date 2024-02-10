import {JSDOM} from 'jsdom';
import {it, beforeAll, beforeEach, afterEach, Mock, describe, expect} from 'vitest';
import {hotkey, Hotkey} from '../src';
import {KeyboardSimulator} from './keyboard-simulator';
import {calledOnce, calledTwice, notCalled, spies, spyFn} from './utils';

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

	describe('Modifiers', () => {
		it('Can be used as target keys ("keyup")', () => {
			const [spy1, spy2, spy3, spy4] = spies(4);

			hk.bindKeys({
				'ctrl': spy1,
				'alt': spy2,
				'shift': spy3,
				'meta': spy4,
			});

			notCalled(spy1);
			simulate.keyDown('Ctrl');
			notCalled(spy1);
			simulate.keyUp('Ctrl');
			calledOnce(spy1);

			notCalled(spy2);
			simulate.keyDown('Alt');
			notCalled(spy2);
			simulate.keyUp('Alt');
			calledOnce(spy2);

			notCalled(spy3);
			simulate.keyDown('Shift');
			notCalled(spy3);
			simulate.keyUp('Shift');
			calledOnce(spy3);

			notCalled(spy4);
			simulate.keyDown('Meta');
			notCalled(spy4);
			simulate.keyUp('Meta');
			calledOnce(spy4);
		});

		it('Can be used as BG keys', () => {
			const [spy1, spy2, spy3, spy4] = spies(4);

			hk.bindKeys({
				'ctrl-a': spy1,
				'alt-a': spy2,
				'shift-a': spy3,
				'meta-a': spy4,
			});

			simulate.keyDown('Ctrl');
			simulate.keyDown('A');
			calledOnce(spy1);
			simulate.keyUp('A');
			simulate.keyUp('Ctrl');

			simulate.keyDown('Alt');
			simulate.keyDown('A');
			calledOnce(spy2);
			simulate.keyUp('A');
			simulate.keyUp('Alt');

			simulate.keyDown('Shift');
			simulate.keyDown('A');
			calledOnce(spy3);
			simulate.keyUp('A');
			simulate.keyUp('Shift');

			simulate.keyDown('Meta');
			simulate.keyDown('A');
			calledOnce(spy4);
			simulate.keyUp('A');
			simulate.keyUp('Meta');

			calledOnce(spy1, spy2, spy3, spy4);
		});

		it('Don\'t get triggered when used as a BG key', () => {
			const [spy1, spy2, spy3, spy4] = spies(4);

			hk.bindKeys({
				'ctrl': spy1,
				'ctrl-a': spy,
				'alt': spy2,
				'alt-a': spy,
				'shift': spy3,
				'shift-a': spy,
				'meta': spy4,
				'meta-a': spy,
			});

			simulate.keyDown('Ctrl');
			simulate.keyPress('A');
			simulate.keyUp('Ctrl');

			simulate.keyDown('Alt');
			simulate.keyPress('A');
			simulate.keyUp('Alt');

			simulate.keyDown('Shift');
			simulate.keyPress('A');
			simulate.keyUp('Shift');

			simulate.keyDown('Meta');
			simulate.keyPress('A');
			simulate.keyUp('Meta');

			notCalled(spy1, spy2, spy3, spy4);
			expect(spy.mock.calls.length).to.equal(4);
		});

		it('Can be used as target keys with other BG modifiers', () => {
			const [spy1, spy2, spy3] = spies(3);

			hk.bindKeys({
				'ctrl': spy1,
				'alt': spy2,
				'ctrl-alt': spy3,
			});

			simulate.keyDown('Ctrl');
			simulate.keyDown('Alt');
			calledOnce(spy3);
			simulate.keyUp('Alt');
			simulate.keyUp('Ctrl');
			notCalled(spy1, spy2);
			calledOnce(spy3);
		});

		it('Order matters when used as a target key with other BG modifiers', () => {
			const [spy1, spy2] = spies(2);

			hk.bindKeys({
				'ctrl-alt': spy1,
				'alt-ctrl': spy2,
			});

			// ctrl-alt
			simulate.keyDown('Ctrl');
			simulate.keyDown('Alt');
			calledOnce(spy1);
			simulate.keyUp('Alt');
			simulate.keyUp('Ctrl');
			calledOnce(spy1);
			notCalled(spy2);

			spy1.mockReset();
			spy2.mockReset();

			// alt-ctrl
			simulate.keyDown('Alt');
			simulate.keyDown('Ctrl');
			calledOnce(spy2);
			simulate.keyUp('Ctrl');
			simulate.keyUp('Alt');
			calledOnce(spy2);
			notCalled(spy1);
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

			simulate.keyDown('Ctrl');
			simulate.keyDown('Alt');
			simulate.keyDown('A');
			calledOnce(spy1);
			simulate.keyUp('A');
			simulate.keyUp('Alt');
			simulate.keyUp('Ctrl');

			simulate.keyDown('Ctrl');
			simulate.keyDown('Shift');
			simulate.keyDown('A');
			calledOnce(spy2);
			simulate.keyUp('A');
			simulate.keyUp('Shift');
			simulate.keyUp('Ctrl');

			simulate.keyDown('Ctrl');
			simulate.keyDown('Meta');
			simulate.keyDown('A');
			calledOnce(spy3);
			simulate.keyUp('A');
			simulate.keyUp('Meta');
			simulate.keyUp('Ctrl');

			simulate.keyDown('Alt');
			simulate.keyDown('Shift');
			simulate.keyDown('A');
			calledOnce(spy4);
			simulate.keyUp('A');
			simulate.keyUp('Shift');
			simulate.keyUp('Alt');

			simulate.keyDown('Alt');
			simulate.keyDown('Meta');
			simulate.keyDown('A');
			calledOnce(spy5);
			simulate.keyUp('A');
			simulate.keyUp('Meta');
			simulate.keyUp('Alt');

			simulate.keyDown('Shift');
			simulate.keyDown('Meta');
			simulate.keyDown('A');
			calledOnce(spy6);
			simulate.keyUp('A');
			simulate.keyUp('Meta');
			simulate.keyUp('Shift');

			calledOnce(spy1, spy2, spy3, spy4, spy5, spy6);
		});

		it('Order doesn\'t matter when multiple BG keys', () => {
			hk.bindKey('ctrl-alt-a', spy);

			simulate.keyDown('Ctrl');
			simulate.keyDown('Alt');
			simulate.keyDown('A');
			calledOnce(spy);
			simulate.keyUp('A');
			simulate.keyUp('Alt');
			simulate.keyUp('Ctrl');


			simulate.keyDown('Alt');
			simulate.keyDown('Ctrl');
			simulate.keyDown('A');
			calledTwice(spy);
			simulate.keyUp('A');
			simulate.keyUp('Ctrl');
			simulate.keyUp('Alt');

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

			// ctrl-alt-shift-a
			simulate.keyDown('Ctrl');
			simulate.keyDown('Alt');
			simulate.keyDown('Shift');
			simulate.keyDown('A');
			calledOnce(spy1);
			simulate.keyUp('A');
			simulate.keyUp('Shift');
			simulate.keyUp('Alt');
			simulate.keyUp('Ctrl');

			// ctrl-alt-meta-a
			simulate.keyDown('Ctrl');
			simulate.keyDown('Alt');
			simulate.keyDown('Meta');
			simulate.keyDown('A');
			calledOnce(spy2);
			simulate.keyUp('A');
			simulate.keyUp('Meta');
			simulate.keyUp('Alt');
			simulate.keyUp('Ctrl');

			// ctrl-shift-meta-a
			simulate.keyDown('Ctrl');
			simulate.keyDown('Shift');
			simulate.keyDown('Meta');
			simulate.keyDown('A');
			calledOnce(spy3);
			simulate.keyUp('A');
			simulate.keyUp('Meta');
			simulate.keyUp('Shift');
			simulate.keyUp('Ctrl');

			// alt-shift-meta-a
			simulate.keyDown('Alt');
			simulate.keyDown('Shift');
			simulate.keyDown('Meta');
			simulate.keyDown('A');
			calledOnce(spy4);
			simulate.keyUp('A');
			simulate.keyUp('Meta');
			simulate.keyUp('Shift');
			simulate.keyUp('Alt');

			// ctrl-alt-shift-meta-a
			simulate.keyDown('Ctrl');
			simulate.keyDown('Alt');
			simulate.keyDown('Shift');
			simulate.keyDown('Meta');
			simulate.keyDown('A');
			calledOnce(spy5);
			simulate.keyUp('A');
			simulate.keyUp('Meta');
			simulate.keyUp('Shift');
			simulate.keyUp('Alt');
			simulate.keyUp('Ctrl');
		});

		it('Release order doesn\'t matter', () => {
			const [spy1, spy2, spy3] = spies(3);

			hk.bindKeys({
				'ctrl-alt-shift-a': spy1,
				'ctrl': spy2,
				'a': spy3,
			});

			simulate.keyDown('Ctrl');
			simulate.keyDown('Alt');
			simulate.keyDown('Shift');
			simulate.keyDown('A');
			calledOnce(spy1);
			simulate.keyUp('Alt');
			simulate.keyUp('Shift');
			simulate.keyUp('A');
			simulate.keyUp('Ctrl');

			calledOnce(spy1);
			notCalled(spy2, spy3);
		});
	});
}
