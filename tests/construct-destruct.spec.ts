import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {KeyboardSimulator} from 'keyboard-simulator';
import {it, beforeAll, beforeEach, afterEach, Mock, describe, expect} from 'vitest';
import {Hotkey} from '../src';
import {spyFn} from './utils';

describe('Construction / Destruction', () => {
	let doc: Document;
	let simulate: KeyboardSimulator;
	let hk: Hotkey;
	let spy: Mock;

	beforeAll(() => {
		// Path from project's root:
		const HTML = readFileSync('./tests/test-html.html');
		const dom = new JSDOM(HTML);

		// TODO:test - Checking instanceof HTMLElement fails in JSDOM when not in sandbox
		globalThis.HTMLElement = dom.window.HTMLElement;
		doc = dom.window.document;
		simulate = new KeyboardSimulator(doc);
		spy = spyFn();
	});

	beforeEach(() => {
		hk = new Hotkey(doc);
	});

	afterEach(() => {
		(doc.activeElement as HTMLElement).blur();
		hk.destruct();
		simulate.reset();
		spy.mockClear();
	});

	describe('Constructor', () => {
		describe('arg 1 - Context Element', () => {
			it('Binds event listeners on the context element', () => {
				let called = false;
				let isDiv = false;

				const div = doc.getElementById('the-div')!;
				const hk1 = new Hotkey(div);

				div.focus();

				hk1.mount();
				hk1.bind('a', (ev: KeyboardEvent) => {
					called = true;
					isDiv = ev.currentTarget === div;
				});

				simulate.keyPress('a');
				expect(called).toBe(true);
				expect(isDiv).toBe(true);
				hk1.destruct();
			});

			it('Default Context Element = `document`', () => {
				let called = false;
				let isDoc = false;

				const div = doc.getElementById('the-div')!;

				div.focus();

				hk.mount();
				hk.bind('a', (ev: KeyboardEvent) => {
					called = true;
					isDoc = ev.currentTarget === doc;
				});

				simulate.keyPress('a');
				expect(called).toBe(true);
				expect(isDoc).toBe(true);
			});
		});

		describe('arg 2: ignoreFn', () => {
			describe('Default function', () => {
				it('Blocks a handler when `ev.target` is an <input> tag', () => {
					const input = doc.getElementById('the-input')!;

					input.focus();

					hk.mount();
					hk.bind('a', spy);

					simulate.keyPress('a');

					// Don't move down after `expect`.
					// If will not unmount on fail, following tests will fail for extra spy calls.
					hk.destruct();

					expect(spy).not.toBeCalled();
				});

				it('Blocks a handler when `ev.target` is an <select> tag', () => {
					const select = doc.getElementById('the-select')!;

					select.focus();

					hk.mount();
					hk.bind('a', spy);

					simulate.keyPress('a');

					// Don't move down after `expect`.
					// If will not unmount on fail, following tests will fail for extra spy calls.
					hk.destruct();

					expect(spy).not.toBeCalled();
				});

				it('Blocks a handler when `ev.target` is an <textarea> tag', () => {
					const textarea = doc.getElementById('the-textarea')!;

					textarea.focus();

					hk.mount();
					hk.bind('a', spy);

					simulate.keyPress('a');

					// Don't move down after `expect`.
					// If will not unmount on fail, following tests will fail for extra spy calls.
					hk.destruct();

					expect(spy).not.toBeCalled();
				});

				it.skip('Blocks a handler when `ev.target` is contenteditable', () => {
					/*
						Looks like JSDOM doesn't support contentEditable API
					*/
				});
			});

			it('Blocks a handler when returns `true`', () => {
				const hk1 = new Hotkey(doc, () => true);

				hk1.mount();
				hk1.bind('a', spy);

				simulate.keyPress('a');

				// Don't move down after `expect`.
				// If will not unmount on fail, following tests will fail for extra spy calls.
				hk1.destruct();

				expect(spy).not.toBeCalled();
			});

			it('Does not block a handler when returns `false`', () => {
				const hk1 = new Hotkey(doc, () => false);

				hk1.mount();
				hk1.bind('a', spy);

				simulate.keyPress('a');

				// Don't move down after `expect`.
				// If will not unmount on fail, following tests will fail for extra spy calls.
				hk1.destruct();

				expect(spy).toHaveBeenCalledOnce();
			});

			it('Accepts one argument: (ev: KeyboardEvent)', () => {
				let called = false;
				let evt: KeyboardEvent | null = null;

				const hk1 = new Hotkey(doc, (ev: KeyboardEvent) => {
					called = true;
					evt = ev;

					return true;
				});

				hk1.mount();
				hk1.bind('a', spy);

				simulate.keyPress('a');

				// Don't move down after `expect`.
				// If will not unmount on fail, following tests will fail for extra spy calls.
				hk1.destruct();

				expect(called).toBe(true);
				expect(evt).toBeInstanceOf(KeyboardEvent);
			});
		});
	});

	describe('.mount()', () => {
		it('Adds the event listener to the context element', () => {
			hk.bind('a', spy);
			expect(spy).not.toBeCalled();
			simulate.keyPress('a');
			expect(spy).not.toBeCalled();

			hk.mount();
			simulate.keyPress('a');
			expect(spy).toHaveBeenCalledOnce();
			expect(spy.mock.calls[0][0].target).toBe(doc.body);
		});

		it('Adds one event listener even when called multiple times', () => {
			hk.bind('a', spy);
			hk.mount().mount().mount();

			expect(spy).not.toBeCalled();
			simulate.keyPress('a');
			expect(spy).toHaveBeenCalledOnce();
		});
	});

	describe('.unmount()', () => {
		it('Removes the event listener from the context element', () => {
			hk.mount().bind('a', spy);
			simulate.keyPress('a');
			expect(spy).toHaveBeenCalledOnce();

			hk.unmount();
			simulate.keyPress('a');
			expect(spy).toHaveBeenCalledOnce();
		});

		it('Does not remove all hotkeys', () => {
			hk.mount().bind('a', spy);
			simulate.keyPress('a');
			expect(spy).toHaveBeenCalledOnce();

			hk.unmount();
			hk.mount();

			simulate.keyPress('a');
			expect(spy).toHaveBeenCalledTimes(2);
		});

		it('Safe to call multiple times', () => {
			const okFn = () => {
				hk.mount();
				hk.bind('a', spy);
				hk.unmount().unmount().unmount();
			};

			expect(okFn).not.to.throw();
		});
	});

	describe('.destruct()', () => {
		it('Removes the event listener from the context element', () => {
			hk.mount().bind('a', spy);
			simulate.keyPress('a');
			expect(spy).toHaveBeenCalledOnce();

			hk.destruct();
			simulate.keyPress('a');
			expect(spy).toHaveBeenCalledOnce();
		});

		it('Removes all hotkeys', () => {
			hk.mount().bind('a', spy);
			simulate.keyPress('a');
			expect(spy).toHaveBeenCalledOnce();

			hk.destruct();
			hk.mount();

			simulate.keyPress('a');
			expect(spy).toHaveBeenCalledOnce();
		});

		it('Safe to call multiple times', () => {
			const okFn = () => {
				hk.mount();
				hk.bind('a', spy);
				hk.destruct().destruct().destruct();
			};

			expect(okFn).not.to.throw();
		});
	});
});
