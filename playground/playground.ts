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

	// kb.debugMode = true;

	kb.bindKeys({
		'a': () => console.log('WORKS! A'),
		'ctrl-a': () => console.log('WORKS! CTRL-A'),
		'ctrl': () => console.log('WORKS! CTRL'),
	});

	console.log(kb.plainKeyBindingsMap);
	console.log(kb.keyBindingsMap);


	kb.mountKeyupHook();







}
catch (err) {
	console.error('--- Error ---');
	console.error(err);
}
