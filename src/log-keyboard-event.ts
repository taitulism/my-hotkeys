function rightPad (str: string, pad: number) {
	const len = str.length;
	const missingCount = pad - len;

	if (missingCount > 0) {
		return str + ' '.repeat(missingCount);
	}

	return str;
}

export function logKbEvent (ev: KeyboardEvent) {
	const {type, code, key, ctrlKey, altKey, shiftKey, metaKey} = ev;
	const hasBgPressed = ctrlKey || altKey || shiftKey || metaKey;
	const symbol = type === 'keydown' ? '🔻' : '🔼';
	const head = symbol + rightPad(key, 7);

	const bgkHead = hasBgPressed ? '[ ' : '';
	const bgkTail = hasBgPressed ? ']' : '';

	/* eslint-disable-next-line */
	const bgKeys = `${ctrlKey ? 'ctrl ' : ''}${altKey ? 'alt ' : ''}${shiftKey ? 'shift ' : ''}${metaKey ? 'meta ' : ''}`;
	const extras = `| id:${code} `;
	const body = rightPad(bgkHead + bgKeys + bgkTail, 21);

	/* eslint-disable no-console */
	console.log(head, body, extras);
}
