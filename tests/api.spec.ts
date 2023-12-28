import {it, describe, expect, afterAll, afterEach} from 'vitest';
import {hotkeyz, Hotkeyz} from '../src';
import {spyFn} from './utils';

describe('Module Exports', () => {
	it('hotkeyz', () => {
		expect(hotkeyz).to.be.a('function');
	});

	it('Hotkeyz', () => {
		expect(hotkeyz()).to.be.an.instanceOf(Hotkeyz);
	});
});

describe('Instance', () => {
	const instance = new Hotkeyz();
	const spy = spyFn();

	afterEach(() => {
		instance.destruct();
		spy.mockRestore();
	});

	afterAll(() => {
		instance.destruct();
		spy.mockRestore();
	});

	it('.hotkeys', () => {
		expect(instance.hotkeys).to.be.a('Map');
	});

	it('.debugMode', () => {
		expect(instance.debugMode).toBe(false);
	});

	it('.bind()', () => {
		expect(instance.bind).to.be.a('function');

		const inst = instance.bind('a', spy);

		expect(inst).toBe(instance);
	});

	it('.unbind()', () => {
		expect(instance.unbind).to.be.a('function');
		instance.bind('a', spy);

		const inst = instance.unbind('a');

		expect(inst).toBe(instance);
	});

	it('.unbindAll()', () => {
		expect(instance.unbindAll).to.be.a('function');
		instance.bind({'a': spy, 'b': spy});

		const inst = instance.unbindAll();

		expect(inst).toBe(instance);
	});

	it('.mount()', () => {
		expect(instance.mount).to.be.a('function');

		const inst = instance.mount();

		expect(inst).toBe(instance);
	});

	it('.unmount()', () => {
		expect(instance.unmount).to.be.a('function');

		const inst = instance.unmount();

		expect(inst).toBe(instance);
	});

	it('.destruct()', () => {
		expect(instance.destruct).to.be.a('function');

		const inst = instance.destruct();

		expect(inst).toBe(instance);
	});
});
