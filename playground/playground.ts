// import {startBenchmark} from './benchmark';
import {hotkey} from '../src';


// function keyPressHandler (ev: KeyboardEvent) {
// 	console.log('keyPress', ev);
// }

// function keyUpHandler (ev: KeyboardEvent) {
// 	console.log('keyUp', ev);
// }

// function keyDownHandler (ev: KeyboardEvent) {
// 	console.log('keyDown', ev);

// 	if (ev.code === 'KeyA' && ev.ctrlKey) {
// 		// ev.preventDefault();
// 		// ev.stopImmediatePropagation();
// 		// ev.stopPropagation();

// 		// return false;
// 	}
// }


try {
	// startBenchmark()
	console.log('hotkeys');

	// document.addEventListener('keypress', keyPressHandler);
	// document.addEventListener('keydown', keyDownHandler);
	// document.addEventListener('keyup', keyUpHandler);


	const kb = hotkey();

	kb.debugMode = true;

	kb.bindKeys({
		'a': () => console.log('*** A ***'),
		'ctrl': () => console.log('*** CTRL ***'),
		'ctrl-a': () => console.log('*** CTRL-A ***'),
		'ctrl-alt': () => console.log('*** CTRL-ALT ***'),
		// 'lctrl': () => console.log('*** CTRL L ***'),
		// 'rctrl': () => console.log('*** CTRL R ***'),
	});

	console.log(kb.plainHotkeys);
	console.log(kb.combinedHotkeys);


	kb.mount();







}
catch (err) {
	console.error('--- Error ---');
	console.error(err);
}
