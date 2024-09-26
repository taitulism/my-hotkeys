export const Aliases = {
	// Arrows
	'up': 'ArrowUp',
	'down': 'ArrowDown',
	'left': 'ArrowLeft',
	'right': 'ArrowRight',

	// Symbols
	'space': ' ',
	'plus': '+',
	'minus': '-',
	'equal': '=',
	'underscore': '_',
	'quote': '\'',
	'singlequote': '\'',
	'quotes': '"',
	'doublequotes': '"',
	'backquote': '`',
	'tilde': '~',
	'backslash': '\\',
	// 'slash': '/', // Not ugly enough

	// Others
	'ins': 'Insert',
	'del': 'Delete',
	'esc': 'Escape',
	'pgup': 'PageUp',
	'pgdn': 'PageDown',
} as const;

export type Alias = keyof typeof Aliases;
export type AliasValue = typeof Aliases[Alias];
