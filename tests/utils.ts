import {vi} from 'vitest';

export const spyFn = () => vi.fn();

export const spies = (count: number) => {
	const array = [];

	for (let i = 0; i < count; i++) {
		array.push(vi.fn());
	}

	return array;
};
