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
	const hasModifierPressed = ctrlKey || altKey || shiftKey || metaKey;
	const symbol = type === 'keydown' ? '🔻' : '🔼';
	const head = symbol + rightPad(key, 7);

	const modifiersHead = hasModifierPressed ? '[ ' : '';
	const modifiersTail = hasModifierPressed ? ']' : '';

	/* eslint-disable-next-line */
	const modifiers = `${ctrlKey ? 'ctrl ' : ''}${altKey ? 'alt ' : ''}${shiftKey ? 'shift ' : ''}${metaKey ? 'meta ' : ''}`;
	const extras = `| id:${code} `;
	const body = rightPad(modifiersHead + modifiers + modifiersTail, 21);

	/* eslint-disable no-console */
	console.log(head, body, extras);
}
