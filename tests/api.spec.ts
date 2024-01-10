import * as jsdom from 'jsdom';
import {it, expect, beforeAll, afterAll, vi} from 'vitest';
import {hotkey} from '../src/index';
import {KeyboardSimulator} from './keyboard-simulator';

export function apiSpec () {
	let doc: Document | undefined;

	beforeAll(() => {
		const dom = new jsdom.JSDOM('');

		doc = dom.window.document;
	});

	afterAll(() => {
		doc = undefined;
	});

	it('plain hotkey', () => {
		const kb = hotkey(doc);
		const kbSim = new KeyboardSimulator(doc);

		kb.mount();

		const spy = vi.fn();

		kb.bindKey('a', spy);

		expect(spy.mock.calls.length).to.equal(0);

		kbSim.keyDown('A');
		expect(spy.mock.calls.length).to.equal(1);
		kbSim.keyUp('A');

		kb.unmount();
	});

	it('ctrl hotkey', () => {
		const kb = hotkey(doc);
		const kbSim = new KeyboardSimulator(doc);

		kb.mount();

		const spy = vi.fn();

		kb.bindKey('ctrl', spy);

		expect(spy.mock.calls.length).to.equal(0);
		kbSim.keyDown('Control');
		expect(spy.mock.calls.length).to.equal(0);
		kbSim.keyUp('Control');
		expect(spy.mock.calls.length).to.equal(1);

		kb.unmount();
	});

	it('ctrl-a hotkey', () => {
		const kb = hotkey(doc);
		const kbSim = new KeyboardSimulator(doc);

		kb.mount();

		const spy = vi.fn();

		kb.bindKey('ctrl-a', spy);

		expect(spy.mock.calls.length).to.equal(0);
		kbSim.keypress('A');
		expect(spy.mock.calls.length).to.equal(0);

		kbSim.keypress('Control');
		expect(spy.mock.calls.length).to.equal(0);

		kbSim.keyDown('Control', ['ctrlKey']); // TODO: set 'ctrlKey' automatic
		expect(spy.mock.calls.length).to.equal(0);
		kbSim.keyDown('A', ['ctrlKey']); // TODO: set 'ctrlKey' automatic when 'Control' is down
		expect(spy.mock.calls.length).to.equal(1);
		kbSim.keyUp('A', ['ctrlKey']);
		kbSim.keyUp('Control');

		kb.unmount();
	});

	it('multi obj', () => {
		const kb = hotkey(doc);
		const kbSim = new KeyboardSimulator(doc);

		kb.mount();

		const spy1 = vi.fn();
		const spy2 = vi.fn();
		const spy3 = vi.fn();

		kb.bindKeys({
			'a': spy1,
			'b': spy2,
			'c': spy3,
		});

		expect(spy1.mock.calls.length).to.equal(0);
		expect(spy2.mock.calls.length).to.equal(0);
		expect(spy3.mock.calls.length).to.equal(0);

		kbSim.keypress('A');
		kbSim.keypress('B');
		kbSim.keypress('C');

		expect(spy1.mock.calls.length).to.equal(1);
		expect(spy2.mock.calls.length).to.equal(1);
		expect(spy3.mock.calls.length).to.equal(1);

		kb.unmount();
	});
}


