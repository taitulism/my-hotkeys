import * as jsdom from 'jsdom';
import {it, expect, beforeAll, afterAll, vi} from 'vitest';
import {hotkey} from '../src/index';
import {simulateKeyPress} from './utils';

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

		kb.mountKeyupHook();

		const spy = vi.fn();

		kb.bindKey('a', spy);

		expect(spy.mock.calls.length).to.equal(0);

		simulateKeyPress(doc!, 'KeyA');

		expect(spy.mock.calls.length).to.equal(1);

		kb.unmountKeyupHook();
	});

	it('ctrl hotkey', () => {
		const kb = hotkey(doc);

		kb.mountKeyupHook();

		const spy = vi.fn();

		kb.bindKey('ctrl-a', spy);

		expect(spy.mock.calls.length).to.equal(0);

		simulateKeyPress(doc!, 'KeyA');
		expect(spy.mock.calls.length).to.equal(0);

		simulateKeyPress(doc!, 'KeyA', 'ctrl');
		expect(spy.mock.calls.length).to.equal(1);

		kb.unmountKeyupHook();
	});

	it('multi obj', () => {
		const kb = hotkey(doc);

		kb.mountKeyupHook();

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

		simulateKeyPress(doc!, 'KeyA');
		simulateKeyPress(doc!, 'KeyB');
		simulateKeyPress(doc!, 'KeyC');

		expect(spy1.mock.calls.length).to.equal(1);
		expect(spy2.mock.calls.length).to.equal(1);
		expect(spy3.mock.calls.length).to.equal(1);

		kb.unmountKeyupHook();
	});
}


