import {JSDOM} from 'jsdom';
import {it, beforeAll, beforeEach, afterEach, Mock, describe, expect} from 'vitest';
import {hotkey, Hotkey} from '../src';
import {KeyboardSimulator} from './keyboard-simulator';
import {calledOnce, calledTwice, notCalled, spies, spyFn} from './utils';

describe('hotkey', () => {
	it('is ok', () => {
		expect(hotkey).to.be.ok;
	});

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
	
		it.skip('ctrl', () => {
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
	
				simulate.hold('Ctrl', 'A');
				calledOnce(spy2);
				simulate.release();
				calledOnce(spy2);
	
				notCalled(spy1);
			});
	
			it.skip('Doesn\'t trigger Ctrl on Ctrl-A', () => {
				const [spy1, spy2] = spies(2);
	
				hk.bindKeys({
					'ctrl': spy1,
					'ctrl-a': spy2,
				});
	
				simulate.hold('Ctrl', 'A');
				calledOnce(spy2);
				simulate.release();
				calledOnce(spy2);
	
				notCalled(spy1);
			});
	
			it.skip('Doesn\'t trigger Ctrl nor A on Ctrl-A', () => {
				const [spy1, spy2, spy3] = spies(3);
	
				hk.bindKeys({
					'a': spy1,
					'ctrl': spy2,
					'ctrl-a': spy3,
				});
	
				simulate.hold('Ctrl', 'A');
				calledOnce(spy3);
				simulate.release();
				calledOnce(spy3);
	
				notCalled(spy1, spy2);
			});
	
			it.skip('Doesn\'t trigger B on A-B', () => {
				const [spy1, spy2] = spies(2);
	
				hk.bindKeys({
					'a': spy1,
					'b': spy2,
				});
	
				simulate.hold('A', 'B');
				simulate.release();
				calledOnce(spy1);
				notCalled(spy2);
			});
	
			it.skip('Doesn\'t trigger Ctrl-B on Ctrl-A-B', () => {
				const [spy1, spy2] = spies(2);
	
				hk.bindKeys({
					'ctrl-a': spy1,
					'ctrl-b': spy2,
				});
	
				simulate.hold('Ctrl', 'A', 'B');
				simulate.release();
				calledOnce(spy1);
				notCalled(spy2);
			});
		});
	
		describe('Modifiers', () => {
			it.skip('Can be used as target keys ("keyup")', () => {
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
	
				simulate.hold('Ctrl', 'A');
				calledOnce(spy1);
				simulate.release();
	
				simulate.hold('Alt', 'A');
				calledOnce(spy2);
				simulate.release();
	
				simulate.hold('Shift', 'A');
				calledOnce(spy3);
				simulate.release();
	
				simulate.hold('Meta', 'A');
				calledOnce(spy4);
				simulate.release();
	
				calledOnce(spy1, spy2, spy3, spy4);
			});
	
			it.skip('Don\'t get triggered when used as a BG key', () => {
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
	
				simulate.hold('Ctrl', 'A');
				simulate.release();
	
				simulate.hold('Alt', 'A');
				simulate.release();
	
				simulate.hold('Shift', 'A');
				simulate.release();
	
				simulate.hold('Meta', 'A');
				simulate.release();
	
				notCalled(spy1, spy2, spy3, spy4);
				expect(spy.mock.calls.length).to.equal(4);
			});
	
			it.skip('Can be used as target keys with other BG modifiers', () => {
				const [spy1, spy2, spy3] = spies(3);
	
				hk.bindKeys({
					'ctrl': spy1,
					'alt': spy2,
					'ctrl-alt': spy3,
				});
	
				simulate.hold('Ctrl', 'Alt');
				calledOnce(spy3);
				simulate.release();
				notCalled(spy1, spy2);
				calledOnce(spy3);
			});
	
			it.skip('Order matters when used as a target key with other BG modifiers', () => {
				const [spy1, spy2] = spies(2);
	
				hk.bindKeys({
					'ctrl-alt': spy1,
					'alt-ctrl': spy2,
				});
	
				// ctrl-alt
				simulate.hold('Ctrl', 'Alt');
				calledOnce(spy1);
				simulate.release();
				calledOnce(spy1);
				notCalled(spy2);
	
				spy1.mockReset();
				spy2.mockReset();
	
				// alt-ctrl
				simulate.hold('Alt', 'Ctrl');
				calledOnce(spy2);
				simulate.release();
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
	
				simulate.hold('Ctrl', 'Alt', 'A');
				calledOnce(spy1);
				simulate.release();
	
				simulate.hold('Ctrl', 'Shift', 'A');
				calledOnce(spy2);
				simulate.release();
	
				simulate.hold('Ctrl', 'Meta', 'A');
				calledOnce(spy3);
				simulate.release();
	
				simulate.hold('Alt', 'Shift', 'A');
				calledOnce(spy4);
				simulate.release();
	
				simulate.hold('Alt', 'Meta', 'A');
				calledOnce(spy5);
				simulate.release();
	
				simulate.hold('Shift', 'Meta', 'A');
				calledOnce(spy6);
				simulate.release();
	
				calledOnce(spy1, spy2, spy3, spy4, spy5, spy6);
			});
	
			it('Order doesn\'t matter when multiple BG keys', () => {
				hk.bindKey('ctrl-alt-a', spy);
	
				simulate.hold('Ctrl', 'Alt', 'A');
				calledOnce(spy);
				simulate.release();
	
				simulate.hold('Alt', 'Ctrl', 'A');
				calledTwice(spy);
				simulate.release();
	
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
	
				simulate.hold('Ctrl', 'Alt', 'Shift', 'A');
				calledOnce(spy1);
				simulate.release();
	
				simulate.hold('Ctrl', 'Alt', 'Meta', 'A');
				calledOnce(spy2);
				simulate.release();
	
				simulate.hold('Ctrl', 'Shift', 'Meta', 'A');
				calledOnce(spy3);
				simulate.release();
	
				simulate.hold('Alt', 'Shift', 'Meta', 'A');
				calledOnce(spy4);
				simulate.release();
	
				simulate.hold('Ctrl', 'Alt', 'Shift', 'Meta', 'A');
				calledOnce(spy5);
				simulate.release();
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
	
		describe.skip('ev.repeat', () => {
			it('holding a key down doesn\'t mess up other key bindings', () => {
				const [spy1, spy2] = spies(2);
	
				hk.bindKeys({
					'ctrl': spy1,
					'ctrl-a': spy2,
				});
	
				simulate.hold('Ctrl', 'A');
				simulate.holdRepeat('A', 5);
				simulate.release();
	
				simulate.keyPress('Ctrl');
				calledOnce(spy1);
			});
		});
	});
});
