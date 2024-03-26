import {JSDOM} from 'jsdom';
import {KeyboardSimulator} from 'keyboard-simulator';
import {it, beforeAll, beforeEach, afterEach, expect, Mock, describe} from 'vitest';
import {hotkey, Hotkey} from '../src';
import {spyFn} from './utils';

describe('Fn Keys', () => {
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
		spy.mockClear();
	});

	it('F1-F24', () => {
		hk.bindKeys({
			'F1': spy,
			'F12': spy,
			'F24': spy,
		});

		simulate.keyPress('F1');
		expect(spy).toHaveBeenCalledTimes(1);
		simulate.keyPress('F12');
		expect(spy).toHaveBeenCalledTimes(2);
		simulate.keyPress('F24');
		expect(spy).toHaveBeenCalledTimes(3);
	});

	it('Other Functional Keys', () => {
		hk.bindKeys({
			'Pause': spy,
			'PrintScreen': spy,
			'ScrollLock': spy,
			'NumLock': spy,
			'CapsLock': spy,
			'ContextMenu': spy,
			'Escape': spy,
		});

		simulate.keyPress('Pause');
		expect(spy).toHaveBeenCalledTimes(1);
		simulate.keyPress('PrintScreen');
		expect(spy).toHaveBeenCalledTimes(2);
		simulate.keyPress('ScrollLock');
		expect(spy).toHaveBeenCalledTimes(3);
		simulate.keyPress('NumLock');
		expect(spy).toHaveBeenCalledTimes(4);
		simulate.keyPress('CapsLock');
		expect(spy).toHaveBeenCalledTimes(5);
		simulate.keyPress('ContextMenu');
		expect(spy).toHaveBeenCalledTimes(6);
		simulate.keyPress('Escape');
		expect(spy).toHaveBeenCalledTimes(7);
	});
});
