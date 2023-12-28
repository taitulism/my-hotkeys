import {Modifier} from './types';

export type LetterHotkeys =
	| 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h'
	| 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p'
	| 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x'
	| 'y' | 'z'

export type DigitHotkeys = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'

export type SymbolKeys =
	| '[' | ']' | ';' | '\''
	| '\\' | ',' | '.' | '/'
	| '`'

export type FnHotkeys =
	| 'F1' | 'F2' | 'F3' | 'F4' | 'F5' | 'F6' | 'F7' | 'F8' | 'F9'
	| 'F10' | 'F11' | 'F12' | 'F13' | 'F14' | 'F15' | 'F16' | 'F17'
	| 'F18' | 'F19' | 'F20' | 'F21' | 'F22' | 'F23' | 'F24'

export type OtherHotkeys =
	| 'Pause' | 'PrintScreen' | 'ScrollLock' | 'NumLock'
	| 'CapsLock' | 'ContextMenu' | 'Escape'

export type AllHotkeys =
	| LetterHotkeys
	| DigitHotkeys
	| SymbolKeys
	| FnHotkeys
	| OtherHotkeys

type OneModifier = Modifier
type TwoModifiers = `${OneModifier}-${OneModifier}`
type ThreeModifiers = `${TwoModifiers}-${OneModifier}`
type FourModifiers = `${ThreeModifiers}-${OneModifier}`


// type CtrlModifiers = 'ctrl' | 'control'
// type C = Uppercase<CtrlModifiers> | Capitalize<CtrlModifiers>
type C = 'ctrl' | 'CTRL' | 'Ctrl' | 'control' | 'CONTROL' | 'Control'
type A = 'alt' | 'ALT' | 'Alt'
type S = 'shift' | 'SHIFT' | 'Shift'
type M = 'meta' | 'META' | 'Meta'

export type Modifiers =
	| `${C}`
	| `${A}`
	| `${S}`
	| `${M}`
	| `${C}-${A}`
	| `${A}-${C}`
	| `${C}-${S}`
	| `${S}-${C}`
	| `${C}-${M}`
	| `${M}-${C}`
	| `${A}-${S}`
	| `${S}-${A}`
	| `${A}-${M}`
	| `${M}-${A}`
	| `${S}-${M}`
	| `${M}-${S}`
	| `${C}-${A}-${S}`
	| `${C}-${S}-${A}`
	| `${C}-${A}-${M}`
	| `${C}-${M}-${A}`
	| `${C}-${S}-${M}`
	| `${C}-${M}-${S}`
	| `${A}-${C}-${S}`
	| `${A}-${S}-${C}`
	| `${A}-${C}-${M}`
	| `${A}-${M}-${C}`
	| `${A}-${S}-${M}`
	| `${A}-${M}-${S}`
	| `${S}-${C}-${A}`
	| `${S}-${A}-${C}`
	| `${S}-${C}-${M}`
	| `${S}-${M}-${C}`
	| `${S}-${C}-${M}`
	| `${S}-${A}-${M}`
	| `${S}-${M}-${A}`
	| `${M}-${C}-${A}`
	| `${M}-${A}-${C}`
	| `${M}-${C}-${S}`
	| `${M}-${S}-${C}`
	| `${M}-${A}-${S}`
	| `${M}-${S}-${A}`
;


type LowerCasedModifiers =
	| 'ctrl'
	| 'alt'
	| 'shift'
	| 'meta'

	| 'ctrl-alt'
	| 'alt-ctrl'
	| 'ctrl-shift'
	| 'shift-ctrl'
	| 'ctrl-meta'
	| 'meta-ctrl'
	| 'alt-shift'
	| 'shift-alt'
	| 'alt-meta'
	| 'meta-alt'
	| 'shift-meta'
	| 'meta-shift'

	| 'ctrl-alt-shift'
	| 'ctrl-shift-alt'
	| 'ctrl-alt-meta'
	| 'ctrl-meta-alt'
	| 'ctrl-shift-meta'
	| 'ctrl-meta-shift'
	| 'alt-ctrl-shift'
	| 'alt-shift-ctrl'
	| 'alt-ctrl-meta'
	| 'alt-meta-ctrl'
	| 'alt-shift-meta'
	| 'alt-meta-shift'
	| 'shift-ctrl-alt'
	| 'shift-alt-ctrl'
	| 'shift-ctrl-meta'
	| 'shift-meta-ctrl'
	| 'shift-alt-meta'
	| 'shift-meta-alt'
	| 'meta-ctrl-alt'
	| 'meta-alt-ctrl'
	| 'meta-ctrl-shift'
	| 'meta-shift-ctrl'
	| 'meta-alt-shift'
	| 'meta-shift-alt'

	| 'ctrl-alt-shift-meta'
	| 'ctrl-alt-meta-shift'
	| 'ctrl-shift-alt-meta'
	| 'ctrl-shift-meta-alt'
	| 'ctrl-meta-alt-shift'
	| 'ctrl-meta-shift-alt'
	| 'alt-ctrl-shift-meta'
	| 'alt-ctrl-meta-shift'
	| 'alt-shift-ctrl-meta'
	| 'alt-shift-meta-ctrl'
	| 'alt-meta-ctrl-shift'
	| 'alt-meta-shift-ctrl'
	| 'shift-ctrl-alt-meta'
	| 'shift-ctrl-meta-alt'
	| 'shift-alt-ctrl-meta'
	| 'shift-alt-meta-ctrl'
	| 'shift-meta-ctrl-alt'
	| 'shift-meta-alt-ctrl'
	| 'meta-ctrl-alt-shift'
	| 'meta-ctrl-shift-alt'
	| 'meta-alt-ctrl-shift'
	| 'meta-alt-shift-ctrl'
	| 'meta-shift-ctrl-alt'
	| 'meta-shift-alt-ctrl'
;

type UpperCasedModifiers =
	| 'CTRL'
	| 'ALT'
	| 'SHIFT'
	| 'META'

	| 'CTRL-ALT'
	| 'ALT-CTRL'
	| 'CTRL-SHIFT'
	| 'SHIFT-CTRL'
	| 'CTRL-META'
	| 'META-CTRL'
	| 'ALT-SHIFT'
	| 'SHIFT-ALT'
	| 'ALT-META'
	| 'META-ALT'
	| 'SHIFT-META'
	| 'META-SHIFT'

	| 'CTRL-ALT-SHIFT'
	| 'CTRL-SHIFT-ALT'
	| 'CTRL-ALT-META'
	| 'CTRL-META-ALT'
	| 'CTRL-SHIFT-META'
	| 'CTRL-META-SHIFT'
	| 'ALT-CTRL-SHIFT'
	| 'ALT-SHIFT-CTRL'
	| 'ALT-CTRL-META'
	| 'ALT-META-CTRL'
	| 'ALT-SHIFT-META'
	| 'ALT-META-SHIFT'
	| 'SHIFT-CTRL-ALT'
	| 'SHIFT-ALT-CTRL'
	| 'SHIFT-CTRL-META'
	| 'SHIFT-META-CTRL'
	| 'SHIFT-ALT-META'
	| 'SHIFT-META-ALT'
	| 'META-CTRL-ALT'
	| 'META-ALT-CTRL'
	| 'META-CTRL-SHIFT'
	| 'META-SHIFT-CTRL'
	| 'META-ALT-SHIFT'
	| 'META-SHIFT-ALT'

	| 'CTRL-ALT-SHIFT-META'
	| 'CTRL-ALT-META-SHIFT'
	| 'CTRL-SHIFT-ALT-META'
	| 'CTRL-SHIFT-META-ALT'
	| 'CTRL-META-ALT-SHIFT'
	| 'CTRL-META-SHIFT-ALT'
	| 'ALT-CTRL-SHIFT-META'
	| 'ALT-CTRL-META-SHIFT'
	| 'ALT-SHIFT-CTRL-META'
	| 'ALT-SHIFT-META-CTRL'
	| 'ALT-META-CTRL-SHIFT'
	| 'ALT-META-SHIFT-CTRL'
	| 'SHIFT-CTRL-ALT-META'
	| 'SHIFT-CTRL-META-ALT'
	| 'SHIFT-ALT-CTRL-META'
	| 'SHIFT-ALT-META-CTRL'
	| 'SHIFT-META-CTRL-ALT'
	| 'SHIFT-META-ALT-CTRL'
	| 'META-CTRL-ALT-SHIFT'
	| 'META-CTRL-SHIFT-ALT'
	| 'META-ALT-CTRL-SHIFT'
	| 'META-ALT-SHIFT-CTRL'
	| 'META-SHIFT-CTRL-ALT'
	| 'META-SHIFT-ALT-CTRL'
;

type CapitalizedModifiers =
	| 'Ctrl'
	| 'Alt'
	| 'Shift'
	| 'Meta'

	| 'Ctrl-Alt'
	| 'Alt-Ctrl'
	| 'Ctrl-Shift'
	| 'Shift-Ctrl'
	| 'Ctrl-Meta'
	| 'Meta-Ctrl'
	| 'Alt-Shift'
	| 'Shift-Alt'
	| 'Alt-Meta'
	| 'Meta-Alt'
	| 'Shift-Meta'
	| 'Meta-Shift'

	| 'Ctrl-Alt-Shift'
	| 'Ctrl-Shift-Alt'
	| 'Ctrl-Alt-Meta'
	| 'Ctrl-Meta-Alt'
	| 'Ctrl-Shift-Meta'
	| 'Ctrl-Meta-Shift'
	| 'Alt-Ctrl-Shift'
	| 'Alt-Shift-Ctrl'
	| 'Alt-Ctrl-Meta'
	| 'Alt-Meta-Ctrl'
	| 'Alt-Shift-Meta'
	| 'Alt-Meta-Shift'
	| 'Shift-Ctrl-Alt'
	| 'Shift-Alt-Ctrl'
	| 'Shift-Ctrl-Meta'
	| 'Shift-Meta-Ctrl'
	| 'Shift-Alt-Meta'
	| 'Shift-Meta-Alt'
	| 'Meta-Ctrl-Alt'
	| 'Meta-Alt-Ctrl'
	| 'Meta-Ctrl-Shift'
	| 'Meta-Shift-Ctrl'
	| 'Meta-Alt-Shift'
	| 'Meta-Shift-Alt'

	| 'Ctrl-Alt-Shift-Meta'
	| 'Ctrl-Alt-Meta-Shift'
	| 'Ctrl-Shift-Alt-Meta'
	| 'Ctrl-Shift-Meta-Alt'
	| 'Ctrl-Meta-Alt-Shift'
	| 'Ctrl-Meta-Shift-Alt'
	| 'Alt-Ctrl-Shift-Meta'
	| 'Alt-Ctrl-Meta-Shift'
	| 'Alt-Shift-Ctrl-Meta'
	| 'Alt-Shift-Meta-Ctrl'
	| 'Alt-Meta-Ctrl-Shift'
	| 'Alt-Meta-Shift-Ctrl'
	| 'Shift-Ctrl-Alt-Meta'
	| 'Shift-Ctrl-Meta-Alt'
	| 'Shift-Alt-Ctrl-Meta'
	| 'Shift-Alt-Meta-Ctrl'
	| 'Shift-Meta-Ctrl-Alt'
	| 'Shift-Meta-Alt-Ctrl'
	| 'Meta-Ctrl-Alt-Shift'
	| 'Meta-Ctrl-Shift-Alt'
	| 'Meta-Alt-Ctrl-Shift'
	| 'Meta-Alt-Shift-Ctrl'
	| 'Meta-Shift-Ctrl-Alt'
	| 'Meta-Shift-Alt-Ctrl'
;

export type IHotkey1 =
	| AllHotkeys
	| `${OneModifier}-${AllHotkeys}`
	| `${TwoModifiers}-${AllHotkeys}`
	| `${ThreeModifiers}-${AllHotkeys}`
	| `${FourModifiers}-${AllHotkeys}`

export type IHotkey2 =
	| AllHotkeys
	| `${LowerCasedModifiers}-${AllHotkeys}`
	| `${UpperCasedModifiers}-${AllHotkeys}`
	| `${CapitalizedModifiers}-${AllHotkeys}`

export type IHotkey =
	| AllHotkeys
	| `${LowerCasedModifiers}-${AllHotkeys}`
	| `${UpperCasedModifiers}-${AllHotkeys}`
	| `${CapitalizedModifiers}-${AllHotkeys}`



// TRY:
// ----
// export const hk1: IHotkey = 'CTRL-a';

// export const hkObj: Record<IHotkey, 1> = {
// 	'a': 1,
// 	'b': 1,
// 	'c': 1,
// };

// type A = 'a'|'b'|'c';
// type B = Record<A, number>

// export const b: Partial<B> = {
// 	'a': 1,
// };
