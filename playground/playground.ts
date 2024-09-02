/* eslint-disable no-console */
import {hotkey} from '../src';

const logKey = (keyName: string) => console.log(`${' '.repeat(30)}*** ${keyName.toUpperCase()} ***`);

const kb1 = hotkey();

kb1.debugMode = true;
// kb2.debugMode = true;

kb1.bindKeys({
	'ctrl-shift-?': (ev) => {
		logKey('SXS 1');
		ev.preventDefault();
	},
	'ctrl-?': (ev) => {
		logKey('SXS 2');
		ev.preventDefault();
	},
	'[': (ev) => {
		ev.preventDefault();
		logKey('SXS 3');
	},
});

console.log(kb1.hotkeys);
