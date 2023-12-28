export const SymbolIDs = {
	'[': 'BracketLeft',
	']': 'BracketRight',
	';': 'Semicolon',
	'\'': 'Quote',
	'\\': 'Backslash',
	',': 'Comma',
	'`': 'Backquote',
	'=': 'Equal',
	'-': 'Minus',  // or NumpadSubtract - but Numpad symbols don't have the shift issue
	'.': 'Period', // or NumpadDecimal
	'/': 'Slash',  // or NumpadDivide
} as const;

export type ISymbol = keyof typeof SymbolIDs;
export type SymbolKeyID = typeof SymbolIDs[ISymbol];

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
