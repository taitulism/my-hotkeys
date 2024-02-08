import * as jsdom from 'jsdom';
import {it, beforeAll, afterAll} from 'vitest';
import {hotkey} from '../src';
import {KeyboardSimulator} from './keyboard-simulator';
import {calledOnce, notCalledYet, spies, spyFn} from './utils';

export function apiSpec () {
	let simulate: KeyboardSimulator;
	let doc: Document | undefined;

	beforeAll(() => {
		const dom = new jsdom.JSDOM('');

		doc = dom.window.document;
		simulate = new KeyboardSimulator(doc);
	});

	afterAll(() => {
		doc = undefined;
	});

	it('plain hotkey', () => {
		const hk = hotkey(doc);
		const spy = spyFn();

		hk.bindKey('a', spy);

		notCalledYet(spy);
		simulate.keyDown('A');
		calledOnce(spy);
		simulate.keyUp('A');

		hk.unmount();
	});

	it('ctrl hotkey', () => {
		const hk = hotkey(doc);
		const spy = spyFn();

		hk.bindKey('ctrl', spy);

		notCalledYet(spy);
		simulate.keyDown('Control');
		notCalledYet(spy);
		simulate.keyUp('Control');
		calledOnce(spy);

		hk.unmount();
	});

	it('ctrl-a hotkey', () => {
		const hk = hotkey(doc);
		const spy = spyFn();

		hk.bindKey('ctrl-a', spy);

		notCalledYet(spy);
		simulate.keypress('A');
		notCalledYet(spy);
		simulate.keypress('Control');
		notCalledYet(spy);

		simulate.keyDown('Control', ['ctrlKey']); // TODO: set 'ctrlKey' automatic
		notCalledYet(spy);
		simulate.keyDown('A', ['ctrlKey']); // TODO: set 'ctrlKey' automatic when 'Control' is down
		calledOnce(spy);
		simulate.keyUp('A', ['ctrlKey']);
		simulate.keyUp('Control');

		hk.unmount();
	});

	it('multi obj', () => {
		const hk = hotkey(doc);
		const [spy1, spy2, spy3] = spies(3);

		hk.bindKeys({
			'a': spy1,
			'b': spy2,
			'c': spy3,
		});

		notCalledYet(spy1, spy2, spy3);
		simulate.keypress('A');
		simulate.keypress('B');
		simulate.keypress('C');
		calledOnce(spy1, spy2, spy3);

		hk.unmount();
	});
}
