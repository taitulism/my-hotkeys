/* eslint-disable no-console */
import {hotkey} from '../src';

const logKey = (keyName: string) => console.log(`${' '.repeat(30)}*** ${keyName.toUpperCase()} ***`);

const {body} = document;
// const div = document.getElementById('super-container')!;

const kb1 = hotkey(body);
// const kb2 = hotkey(div);

// body.addEventListener('keydown', (ev: KeyboardEvent) => console.log('body'), false);
// div.addEventListener('keydown', (ev: KeyboardEvent) => console.log('div'), true);

kb1.debugMode = true;
// kb2.debugMode = true;

kb1.bind({
	'@': (ev) => {
		ev.preventDefault();
		logKey('SXS 1');
	},
	'shift-@': (ev) => {
		ev.preventDefault();
		logKey('SXS 2');
	},
});

console.log(kb1.hotkeys);

// kb2.bind({
// 	'a': (ev) => {
// 		ev.preventDefault();
// 		logKey('SXS 1');
// 	},
// 	'shift-@': (ev) => {
// 		ev.preventDefault();
// 		logKey('SXS 2');
// 	},
// });

// console.log(kb2.hotkeys);
