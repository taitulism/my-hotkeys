import {describe, it, expect} from 'vitest';
import {apiSpec} from './api.spec';
import {hotkey} from '../src';

describe('hotkey', () => {
	it('is ok', () => {
		expect(hotkey).to.be.ok;
	});

	describe('API', apiSpec);
});
