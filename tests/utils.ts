import {Mock, expect, vi} from 'vitest';

export const spyFn = () => vi.fn();

export const spies = (count: number) => {
	const array = [];

	for (let i = 0; i < count; i++) {
		array.push(vi.fn());
	}

	return array;
};

export const notCalled = (...spies: Array<Mock>) => {
	spies.forEach((spy) => {
		expect(spy.mock.calls.length).to.equal(0);
	});
};

export const calledOnce = (...spies: Array<Mock>) => {
	spies.forEach((spy) => {
		expect(spy.mock.calls.length).to.equal(1);
	});
};

