/* eslint-disable no-console */
import {KeyboardLayer} from '~kb-layer';
import {hotkey} from '../src';

// const logKey = (keyName: string) => console.log(`${' '.repeat(30)}*** ${keyName.toUpperCase()} ***`);


const kbl = new KeyboardLayer();

kbl.mount();

kbl.on('KeyA', (isDown, bgKeys, ev) => {
	console.log(isDown, bgKeys);
});

console.log(kbl);

/*
const kb1 = hotkey();
// const kb2 = hotkey(document.getElementById('super-container')!);

// kb1.debugMode = true;
// kb2.debugMode = true;

// 'ctrl': () => logKey(CTRL),
// 'alt': () => logKey(ALT),
// 'ctrl-alt': () => logKey(CTRL-ALT),
// 'ctrl-a': () => logKey(CTRL-A),
// 'alt-ctrl': () => logKey(ALT-CTRL),
// 'enter': () => logKey(ENTER),
// 'lctrl': () => logKey(CTRL L),
// 'rctrl': () => logKey(CTRL R),

kb1.bindKeys({
	'A': (ev) => {
		logKey('A1');
		ev.preventDefault();
		// ev.stopPropagation();
	},
	'B': (ev) => {
		logKey('B1');
	},
	'ctrl': (ev) => {
		logKey('ctrl 1');
	},
	'alt': (ev) => {
		logKey('alt 1');
		ev.preventDefault();
	},
	'ctrl-A': (ev) => {
		logKey('ctrl A');
	},
	'alt-A': (ev) => {
		logKey('alt A');
	},
	'ctrl-B': (ev) => {
		logKey('ctrl B');
	},
	// 'ctrl-shift': (ev) => {
	// 	logKey('ctrl shift');
	// 	ev.preventDefault();
	// },
	'ctrl-shift-a': (ev) => {
		logKey('ctrl shift');
		ev.preventDefault();
	},
});
*/
// kb2.bindKeys({
// 	'A': (ev) => {
// 		logKey('A2');
// 		ev.stopPropagation();
// 	},
// 	'B': (ev) => {
// 		logKey('B2');
// 		// ev.stopPropagation();
// 	},
// 	'ctrl': (ev) => {
// 		logKey('ctrl2');
// 		// ev.stopPropagation();
// 	},
// 'ctrl-a': (ev) => {
// 	logKey('ctrl-a2');
// 	// ev.preventDefault();
// },
// });

// console.log(kb1.plainHotkeys);
// console.log(kb1.combinedHotkeys);
