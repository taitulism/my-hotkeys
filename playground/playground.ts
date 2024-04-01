/* eslint-disable no-console */
import {hotkey} from '../src';

const logKey = (keyName: string) => console.log(`${' '.repeat(30)}*** ${keyName.toUpperCase()} ***`);

const kb1 = hotkey();

kb1.debugMode = true;
// kb2.debugMode = true;

kb1.bindKeys({
	'3': (ev) => {
		logKey('SXS 1');
		ev.preventDefault();
	},
	'shift-3': (ev) => {
		logKey('SXS 2');
		ev.preventDefault();
	},
});

console.log(kb1.hotkeys);
