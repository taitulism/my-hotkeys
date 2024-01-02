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
	console.log('hotkeys1');

	// document.addEventListener('keypress', keyPressHandler);
	// document.addEventListener('keydown', keyDownHandler);
	// document.addEventListener('keyup', keyUpHandler);


	const hk = hotkey();

	hk.bindKey('a', (/* ev: KeyboardEvent */) => {
		console.log('WORKS! A');
	});
	hk.bindKey('ctrl-a', (/* ev: KeyboardEvent */) => {
		console.log('WORKS! CTRL-A');
	});
	hk.bindKey('ctrl', (/* ev: KeyboardEvent */) => {
		console.log('WORKS! CTRL');
	});

	console.log(hk.plainKeyBindingsMap);
	console.log(hk.keyBindingsMap);


	hk.mountKeyupHook();







}
catch (err) {
	console.error('--- Error ---');
	console.error(err);
}
