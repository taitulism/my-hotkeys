import {JSDOM} from 'jsdom';
import {describe, it, expect, beforeAll, afterAll, vi, MockInstance, beforeEach} from 'vitest';
import {KeyboardSimulator} from '.';
import {extractLastEvent, extractTwoLastEvents} from './utils';

describe('KeyboardSimulator', () => {
	let doc: Document | undefined;
	let spy: MockInstance<[event: Event], boolean>;
	let kbSim: KeyboardSimulator;

	beforeAll(() => {
		const dom = new JSDOM('', {url: 'http://localhost'});

		doc = dom.window.document;
		spy = vi.spyOn(doc, 'dispatchEvent');
		kbSim = new KeyboardSimulator(doc);
	});

	beforeEach(() => {
		kbSim.reset();
		spy.mockReset();
	});

	afterAll(() => {
		spy.mockRestore();
	});

	it('is ok', () => {
		expect(KeyboardSimulator).to.be.a('function');
	});

	describe('instance methods', () => {
		it('.keyDown()', () => {
			expect(kbSim).toHaveProperty('keyDown');
			expect(kbSim.keyDown).to.be.a('function');
		});

		it('.keyUp()', () => {
			expect(kbSim).toHaveProperty('keyUp');
			expect(kbSim.keyUp).to.be.a('function');
		});

		it('.reset()', () => {
			expect(kbSim).toHaveProperty('reset');
			expect(kbSim.reset).to.be.a('function');
		});

		it('.hold()', () => {
			expect(kbSim).toHaveProperty('hold');
			expect(kbSim.hold).to.be.a('function');
		});

		it('.holdRepeat()', () => {
			expect(kbSim).toHaveProperty('holdRepeat');
			expect(kbSim.hold).to.be.a('function');
		});

		it('.release()', () => {
			expect(kbSim).toHaveProperty('release');
			expect(kbSim.release).to.be.a('function');
		});
	});

	describe('Dispatching', () => {
		describe('.keyDown()', () => {
			it('Dispatches "keydown" event', () => {
				expect(spy.mock.calls.length).to.equal(0);
				kbSim.keyDown('A');
				expect(spy.mock.calls.length).to.equal(1);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal('a');
				expect(ev.code).to.equal('KeyA');
				expect(ev.type).to.equal('keydown');
				expect(ev.repeat).to.equal(false);
			});
		});

		describe('.keyUp()', () => {
			it('Dispatches "keyup" event', () => {
				expect(spy.mock.calls.length).to.equal(0);
				kbSim.keyUp('A');
				expect(spy.mock.calls.length).to.equal(1);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal('a');
				expect(ev.code).to.equal('KeyA');
				expect(ev.type).to.equal('keyup');
			});
		});

		describe('.keyPress()', () => {
			it('Dispatches "keydown" & "keyup" events', () => {
				expect(spy.mock.calls.length).to.equal(0);
				kbSim.keyPress('A');
				expect(spy.mock.calls.length).to.equal(2);

				const [secondLastEv, lastEv] = extractTwoLastEvents(spy);

				expect(secondLastEv.key).to.equal('a');
				expect(secondLastEv.code).to.equal('KeyA');
				expect(secondLastEv.type).to.equal('keydown');

				expect(lastEv.key).to.equal('a');
				expect(lastEv.code).to.equal('KeyA');
				expect(lastEv.type).to.equal('keyup');

			});
		});

		describe('.holdRepeat()', () => {
			it('Dispatches "keydown" event with `repeat: true`', () => {
				expect(spy.mock.calls.length).to.equal(0);
				kbSim.holdRepeat('A', 3);
				expect(spy.mock.calls.length).to.equal(3);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal('a');
				expect(ev.code).to.equal('KeyA');
				expect(ev.type).to.equal('keydown');
				expect(ev.repeat).to.equal(true);
			});
		});

		describe('.hold()', () => {
			it('Dispatches "keydown" event', () => {
				expect(spy.mock.calls.length).to.equal(0);
				kbSim.hold('A');
				expect(spy.mock.calls.length).to.equal(1);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal('a');
				expect(ev.code).to.equal('KeyA');
				expect(ev.type).to.equal('keydown');
			});

			it('Handles multiple keys', () => {
				kbSim.hold('Ctrl', 'A');
				expect(spy.mock.calls.length).to.equal(2);

				const [secondLastEv, lastEv] = extractTwoLastEvents(spy);

				expect(secondLastEv.key).to.equal('Control');
				expect(secondLastEv.code).to.equal('ControlLeft');
				expect(secondLastEv.type).to.equal('keydown');

				expect(lastEv.key).to.equal('a');
				expect(lastEv.code).to.equal('KeyA');
				expect(lastEv.type).to.equal('keydown');
			});

			it('Accumulates sequencing calls', () => {
				kbSim.hold('Ctrl');
				kbSim.hold('A');
				kbSim.release();

				expect(spy.mock.calls.length).to.equal(4);

				const [secondLastEv, lastEv] = extractTwoLastEvents(spy);

				expect(secondLastEv.key).to.equal('a');
				expect(secondLastEv.type).to.equal('keyup');

				expect(lastEv.key).to.equal('Control');
				expect(lastEv.type).to.equal('keyup');
			});
		});

		describe('.release()', () => {
			it('Dispatches "keyup" event', () => {
				kbSim.hold('A');
				expect(spy.mock.calls.length).to.equal(1);

				kbSim.release();
				expect(spy.mock.calls.length).to.equal(2);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal('a');
				expect(ev.code).to.equal('KeyA');
				expect(ev.type).to.equal('keyup');
			});

			it('Releases all held keys in reverse order', () => {
				kbSim.hold('A', 'B', 'C');
				expect(spy.mock.calls.length).to.equal(3);

				kbSim.release();
				expect(spy.mock.calls.length).to.equal(6);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal('a');
				expect(ev.code).to.equal('KeyA');
				expect(ev.type).to.equal('keyup');
			});
		});
	});

	describe('.reset()', () => {
		it('Resets pressed modifiers', () => {
			kbSim.keyDown('Ctrl');
			kbSim.keyDown('A');

			let ev = extractLastEvent(spy);

			expect(ev.key).to.equal('a');
			expect(ev.ctrlKey).to.true; // <--

			kbSim.keyDown('A');
			ev = extractLastEvent(spy);
			expect(ev.key).to.equal('a');
			expect(ev.ctrlKey).to.true; // <--

			kbSim.reset();

			kbSim.keyDown('A');
			ev = extractLastEvent(spy);
			expect(ev.key).to.equal('a');
			expect(ev.ctrlKey).to.false; // <--

		});

		it('Resets held keys', () => {
			kbSim.hold('A', 'B', 'C');
			expect(spy.mock.calls.length).to.equal(3);
			kbSim.release();
			expect(spy.mock.calls.length).to.equal(6);

			spy.mockReset();

			kbSim.hold('A', 'B', 'C');
			expect(spy.mock.calls.length).to.equal(3);
			kbSim.reset();
			kbSim.release();
			expect(spy.mock.calls.length).to.equal(3);
		});
	});

	describe('Modifiers', () => {
		describe('Ctrl', () => {
			it('.keyDown(Ctrl)', () => {
				expect(spy.mock.calls.length).to.equal(0);
				kbSim.keyDown('Ctrl');
				expect(spy.mock.calls.length).to.equal(1);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal('Control');
				expect(ev.code).to.equal('ControlLeft');
				expect(ev.ctrlKey).to.true;
				expect(ev.altKey).to.false;
				expect(ev.shiftKey).to.false;
				expect(ev.metaKey).to.false;
			});

			it('.keyUp(Ctrl)', () => {
				expect(spy.mock.calls.length).to.equal(0);
				kbSim.keyUp('Ctrl');
				expect(spy.mock.calls.length).to.equal(1);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal('Control');
				expect(ev.code).to.equal('ControlLeft');
				expect(ev.ctrlKey).to.false;
				expect(ev.altKey).to.false;
				expect(ev.shiftKey).to.false;
				expect(ev.metaKey).to.false;
			});

			it('.keyPress(Ctrl)', () => {
				expect(spy.mock.calls.length).to.equal(0);
				kbSim.keyPress('Ctrl');
				expect(spy.mock.calls.length).to.equal(2);

				const [secondLastEv, lastEv] = extractTwoLastEvents(spy);

				expect(secondLastEv.key).to.equal('Control');
				expect(secondLastEv.code).to.equal('ControlLeft');
				expect(lastEv.key).to.equal('Control');
				expect(lastEv.code).to.equal('ControlLeft');
				expect(secondLastEv.ctrlKey).to.true;
				expect(lastEv.ctrlKey).to.false;
			});
		});

		describe('Alt', () => {
			it('.keyDown(Alt)', () => {
				expect(spy.mock.calls.length).to.equal(0);
				kbSim.keyDown('Alt');
				expect(spy.mock.calls.length).to.equal(1);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal('Alt');
				expect(ev.code).to.equal('AltLeft');
				expect(ev.ctrlKey).to.false;
				expect(ev.altKey).to.true;
				expect(ev.shiftKey).to.false;
				expect(ev.metaKey).to.false;
			});

			it('.keyUp(Alt)', () => {
				expect(spy.mock.calls.length).to.equal(0);
				kbSim.keyUp('Alt');
				expect(spy.mock.calls.length).to.equal(1);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal('Alt');
				expect(ev.code).to.equal('AltLeft');
				expect(ev.ctrlKey).to.false;
				expect(ev.altKey).to.false;
				expect(ev.shiftKey).to.false;
				expect(ev.metaKey).to.false;
			});

			it('.keyPress(Alt)', () => {
				expect(spy.mock.calls.length).to.equal(0);
				kbSim.keyPress('Alt');
				expect(spy.mock.calls.length).to.equal(2);

				const [secondLastEv, lastEv] = extractTwoLastEvents(spy);

				expect(secondLastEv.key).to.equal('Alt');
				expect(secondLastEv.code).to.equal('AltLeft');
				expect(lastEv.key).to.equal('Alt');
				expect(lastEv.code).to.equal('AltLeft');
				expect(secondLastEv.altKey).to.true;
				expect(lastEv.altKey).to.false;
			});
		});

		describe('Shift', () => {
			it('.keyDown(Shift)', () => {
				expect(spy.mock.calls.length).to.equal(0);
				kbSim.keyDown('Shift');
				expect(spy.mock.calls.length).to.equal(1);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal('Shift');
				expect(ev.code).to.equal('ShiftLeft');
				expect(ev.ctrlKey).to.false;
				expect(ev.altKey).to.false;
				expect(ev.shiftKey).to.true;
				expect(ev.metaKey).to.false;
			});

			it('.keyUp(Shift)', () => {
				expect(spy.mock.calls.length).to.equal(0);
				kbSim.keyUp('Shift');
				expect(spy.mock.calls.length).to.equal(1);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal('Shift');
				expect(ev.code).to.equal('ShiftLeft');
				expect(ev.ctrlKey).to.false;
				expect(ev.altKey).to.false;
				expect(ev.shiftKey).to.false;
				expect(ev.metaKey).to.false;
			});

			it('.keyPress(Shift)', () => {
				expect(spy.mock.calls.length).to.equal(0);
				kbSim.keyPress('Shift');
				expect(spy.mock.calls.length).to.equal(2);

				const [secondLastEv, lastEv] = extractTwoLastEvents(spy);

				expect(secondLastEv.key).to.equal('Shift');
				expect(secondLastEv.code).to.equal('ShiftLeft');
				expect(lastEv.key).to.equal('Shift');
				expect(lastEv.code).to.equal('ShiftLeft');
				expect(secondLastEv.shiftKey).to.true;
				expect(lastEv.shiftKey).to.false;
			});
		});

		describe('Meta', () => {
			it('.keyDown(Meta)', () => {
				expect(spy.mock.calls.length).to.equal(0);
				kbSim.keyDown('Meta');
				expect(spy.mock.calls.length).to.equal(1);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal('Meta');
				expect(ev.code).to.equal('MetaLeft');
				expect(ev.ctrlKey).to.false;
				expect(ev.altKey).to.false;
				expect(ev.shiftKey).to.false;
				expect(ev.metaKey).to.true;
			});

			it('.keyUp(Meta)', () => {
				expect(spy.mock.calls.length).to.equal(0);
				kbSim.keyUp('Meta');
				expect(spy.mock.calls.length).to.equal(1);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal('Meta');
				expect(ev.code).to.equal('MetaLeft');
				expect(ev.ctrlKey).to.false;
				expect(ev.altKey).to.false;
				expect(ev.shiftKey).to.false;
				expect(ev.metaKey).to.false;
			});

			it('.keyPress(Meta)', () => {
				expect(spy.mock.calls.length).to.equal(0);
				kbSim.keyPress('Meta');
				expect(spy.mock.calls.length).to.equal(2);

				const [secondLastEv, lastEv] = extractTwoLastEvents(spy);

				expect(secondLastEv.key).to.equal('Meta');
				expect(secondLastEv.code).to.equal('MetaLeft');
				expect(lastEv.key).to.equal('Meta');
				expect(lastEv.code).to.equal('MetaLeft');
				expect(secondLastEv.metaKey).to.true;
				expect(lastEv.metaKey).to.false;
			});
		});
	});

	describe('Multi Modifiers', () => {
		it('ctrl-alt-a', () => {
			kbSim.keyDown('Ctrl');

			const ev1 = extractLastEvent(spy);

			expect(ev1.ctrlKey).to.true;
			expect(ev1.altKey).to.false;
			expect(ev1.shiftKey).to.false;
			expect(ev1.metaKey).to.false;

			kbSim.keyDown('Alt');

			const ev2 = extractLastEvent(spy);

			expect(ev2.ctrlKey).to.true;
			expect(ev2.altKey).to.true;
			expect(ev2.shiftKey).to.false;
			expect(ev2.metaKey).to.false;

			kbSim.keyDown('A');

			const ev3 = extractLastEvent(spy);

			expect(ev3.ctrlKey).to.true;
			expect(ev3.altKey).to.true;
			expect(ev3.shiftKey).to.false;
			expect(ev3.metaKey).to.false;

			// --- keyup / keydown splitter

			kbSim.keyUp('A');

			const ev4 = extractLastEvent(spy);

			expect(ev4.ctrlKey).to.true;
			expect(ev4.altKey).to.true;
			expect(ev4.shiftKey).to.false;
			expect(ev4.metaKey).to.false;

			kbSim.keyUp('Alt');

			const ev5 = extractLastEvent(spy);

			expect(ev5.ctrlKey).to.true;
			expect(ev5.altKey).to.false;
			expect(ev5.shiftKey).to.false;
			expect(ev5.metaKey).to.false;

			kbSim.keyUp('Ctrl');

			const ev6 = extractLastEvent(spy);

			expect(ev6.ctrlKey).to.false;
			expect(ev6.altKey).to.false;
			expect(ev6.shiftKey).to.false;
			expect(ev6.metaKey).to.false;
		});
	});
});
