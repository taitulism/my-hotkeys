/* eslint-disable no-console */
import {hotkey} from '../src';

const logKey = (keyName: string) => console.log(`${' '.repeat(30)}*** ${keyName.toUpperCase()} ***`);

const kb1 = hotkey();

kb1.debugMode = true;
// kb2.debugMode = true;

kb1.bindKeys({
	'shift-@': (ev) => {
		ev.preventDefault();
		logKey('SXS 1');
	},
	'@': (ev) => {
		ev.preventDefault();
		logKey('SXS 2');
	},
});

console.log(kb1.hotkeys);
