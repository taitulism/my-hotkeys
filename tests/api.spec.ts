import * as jsdom from 'jsdom';
import {it, expect, beforeAll, afterAll} from 'vitest';
import {hotkey} from '../src/index';

export function apiSpec () {
	let doc: Document | undefined;

	beforeAll(() => {
		const dom = new jsdom.JSDOM('');

		doc = dom.window.document;
	});

	afterAll(() => {
		doc = undefined;
	});

	it('is ok', () => {
		expect(doc).to.be.ok;
		expect(hotkey).to.be.a('function');
	});
}
