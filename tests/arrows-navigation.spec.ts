import {JSDOM} from 'jsdom';
import {KeyboardSimulator} from 'keyboard-simulator';
import {it, beforeAll, beforeEach, afterEach, expect, describe} from 'vitest';
import {hotkey, Hotkey} from '../src';
import {spies} from './utils';

describe('Arrows & Navigation', () => {
	let doc: Document | undefined;
	let simulate: KeyboardSimulator;
	let hk: Hotkey;

	beforeAll(() => {
		const dom = new JSDOM();

		doc = dom.window.document;
		simulate = new KeyboardSimulator(doc);
	});

	beforeEach(() => {
		hk = hotkey(doc);
	});

	afterEach(() => {
		hk.destruct();
		simulate.reset();
	});

	it('Arrows', () => {
		const [spy1, spy2, spy3, spy4] = spies(4);

		hk.bindKeys({
			'ArrowUp': spy1,
			'ArrowDown': spy2,
			'ArrowLeft': spy3,
			'ArrowRight': spy4,
		});

		simulate.keyDown('ArrowUp');
		expect(spy1).toHaveBeenCalledOnce();
		simulate.releaseAll();

		simulate.keyDown('ArrowDown');
		expect(spy2).toHaveBeenCalledOnce();
		simulate.releaseAll();

		simulate.keyDown('ArrowLeft');
		expect(spy3).toHaveBeenCalledOnce();
		simulate.releaseAll();

		simulate.keyDown('ArrowRight');
		expect(spy4).toHaveBeenCalledOnce();
		simulate.releaseAll();

		simulate.keyDown('NumLock'); // Off

		simulate.keyDown('Np8'); // Up
		expect(spy1).toHaveBeenCalledTimes(2);
		simulate.releaseAll();

		simulate.keyDown('Np2'); // Down
		expect(spy2).toHaveBeenCalledTimes(2);
		simulate.releaseAll();

		simulate.keyDown('Np4'); // Left
		expect(spy3).toHaveBeenCalledTimes(2);
		simulate.releaseAll();

		simulate.keyDown('Np6'); // Right
		expect(spy4).toHaveBeenCalledTimes(2);
		simulate.releaseAll();

	});

	it('Home/End & Page-Up/Down', () => {
		const [spy1, spy2, spy3, spy4] = spies(4);

		hk.bindKeys({
			'Home': spy1,
			'End': spy2,
			'PageUp': spy3,
			'PageDown': spy4,
		});

		simulate.keyDown('Home');
		expect(spy1).toHaveBeenCalledOnce();
		simulate.releaseAll();

		simulate.keyDown('End');
		expect(spy2).toHaveBeenCalledOnce();
		simulate.releaseAll();

		simulate.keyDown('PageUp');
		expect(spy3).toHaveBeenCalledOnce();
		simulate.releaseAll();

		simulate.keyDown('PageDown');
		expect(spy4).toHaveBeenCalledOnce();
		simulate.releaseAll();

		simulate.keyPress('NumLock'); // Off

		simulate.keyDown('Np7'); // Home
		expect(spy1).toHaveBeenCalledTimes(2);
		simulate.releaseAll();

		simulate.keyDown('Np1'); // End
		expect(spy2).toHaveBeenCalledTimes(2);
		simulate.releaseAll();

		simulate.keyDown('Np9'); // PageUp
		expect(spy3).toHaveBeenCalledTimes(2);
		simulate.releaseAll();

		simulate.keyDown('Np3'); // PageDown
		expect(spy4).toHaveBeenCalledTimes(2);
		simulate.releaseAll();
	});
});
