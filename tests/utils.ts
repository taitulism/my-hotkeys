import {Mock, expect, vi} from 'vitest';

export const spyFn = () => vi.fn();

export const spies = (count: number) => {
	const array = [];

	for (let i = 0; i < count; i++) {
		array.push(vi.fn());
	}

	return array;
};

function calledTimes (count: number) {
	return (...spies: Array<Mock>) => {
		spies.forEach((spy) => {
			expect(spy.mock.calls.length).to.equal(count);
		});
	};
}

export const notCalled = calledTimes(0);
export const calledOnce = calledTimes(1);
export const calledTwice = calledTimes(2);
