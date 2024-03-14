import {it, describe, expect} from 'vitest';
import {hotkey, Hotkey} from '../src';

describe('exports', () => {
	it('hotkey', () => {
		expect(hotkey).to.be.a('function');
	});

	it('Hotkey', () => {
		expect(Hotkey).to.be.a('function');
	});
});
