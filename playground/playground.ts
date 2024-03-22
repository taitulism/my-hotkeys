/* eslint-disable no-console */
import {hotkey} from '../src';

const logKey = (keyName: string) => console.log(`${' '.repeat(30)}*** ${keyName.toUpperCase()} ***`);

const kb1 = hotkey();
// const kb2 = hotkey(document.getElementById('super-container')!);

kb1.debugMode = true;
// kb2.debugMode = true;

kb1.bindKeys({
	// 'a': (ev) => {
	// 	logKey('a');
	// 	ev.preventDefault();
	// },
	'ctrl-A': (ev) => {
		logKey('A');
		ev.preventDefault();
	},
	'?': (ev) => {
		logKey('?');
		ev.preventDefault();
	},
	'`': (ev) => {
		logKey('backtick');
		ev.preventDefault();
	},
	// 'ctrl-a': (ev) => {
	// 	logKey('ctrl-a');
	// 	ev.preventDefault();
	// },
	// 'shift-a': (ev) => {
	// 	logKey('shift-a');
	// 	ev.preventDefault();
	// },
	// 'A': (ev) => {
	// 	logKey('A');
	// 	ev.preventDefault();
	// },
});

// console.log(kb1.plainHotkeys);
// console.log(kb1.combinedHotkeys);
console.log(kb1.hotkeys);
