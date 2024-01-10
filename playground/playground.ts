import {hotkey} from '../src';

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
	// document.addEventListener('keydown', keyDownHandler);
	// document.addEventListener('keyup', keyUpHandler);

	const kb = hotkey();

	kb.debugMode = true;

	kb.bindKeys({
		'a': () => console.log('*** A ***'),
		'ctrl': () => console.log('*** CTRL ***'),
		'ctrl-a': () => console.log('*** CTRL-A ***'),
		'ctrl-alt': () => console.log('*** CTRL-ALT ***'),
		'alt-ctrl': () => console.log('*** ALT-CTRL ***'),
		'enter': () => console.log('*** ENTER ***'),
		// 'lctrl': () => console.log('*** CTRL L ***'),
		// 'rctrl': () => console.log('*** CTRL R ***'),
	});

	console.log(kb.plainHotkeys);
	console.log(kb.combinedHotkeys);


	// kb.mount();







}
catch (err) {
	console.error('--- Error ---');
	console.error(err);
}
