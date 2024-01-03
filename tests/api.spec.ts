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

		kb.debugMode = true;
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
}


