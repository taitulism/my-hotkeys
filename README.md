![Build Status](https://github.com/taitulism/hotkey/actions/workflows/node-ci.yml/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)


my-hotkeys
==========
Keyboard shorcuts.

Install
-------
```sh
$ npm install my-hotkeys
```

Basic Usage
-----------

```js
import {hotkeys} from 'my-hotkeys`;
```
```js
const hk = hotkeys();

// bind one:
hk.bind('a', doSomething);

// or multiple:
hk.bind({
	'a': doSomething,
	'ctrl-a': doSomethingElse,
	'ctrl-alt-3': doAnotherThing,
});

hk.unbind('a'); // removes a hotkey

hk.unmount(); // removes the instance's event listener
hk.mount(); // adds the instance's event listener

hk.destruct(); // removes all hotkeys and the event listener
```

Index
-----
* [Creating an instance](#creating-an-instance)
* [Binding / Unbinding Keys](#binding--unbinding-keys)
* [Mount/Unmount the event listener](#mountunmount-the-event-listener)
* [Hotkeys Strings](#hotkeys-strings)
* [Destruction](#destruction)


## Creating an instance
There are two ways to get a `Hotkeys` instance:
1. By calling `hotkeys` creator function (lowercased "h")
2. By the `Hotkeys` constructor (uppercased "H")

```js
import {hotkeys} from 'my-hotkeys`;

const hk = hotkeys();
```
or:
```js
import {Hotkeys} from 'my-hotkeys`;

const hk = new Hotkeys();
```

The difference between them is that `hotkeys` creator function also mounts the event listener on creation and doesn't have the ignore function argument (yet). When using the constructor you need to call `.mount()` manually (see [`.mount()`](#mount) below) and you can also set an ignore function.

Both accept an optional argument as the context element (`HTMLElement | Document`). This would be the element that listens to the keyboard events. Defaults to `document`.
```js
const hk = hotkeys(elmOrDoc);
// => internally: elmOrDoc.addEventListener()...
```

> **⚠ Non-browser environments:** You might need to pass in the runtime's `document` object as the constructor argument.

### Ignore Function
By default, the `Hotkeys` instance ignores key presses if the `event.target` element is:
* `<input>`
* `<select>`
* `<textarea>`
* `[contenteditable="true"]`

You can pass the constructor your own ignore function as the second argument. This function gets called on every `keydown` event with the `event` object. Return a truthy value to ignore the key press or a falsy value for continue executing the hotkey.

```js
const hk = new Hotkeys(document, (ev: KeyboardEvent) =>
	ev.target === mySpecialElement);
```


## Binding / Unbinding Keys

### .bind()
* `.bind(hotkey, callback)` - hotkey string, callback
* `.bind({hotkey: callback})` - an object of `{hotkey:callback}`

Adds keyboard shortcuts. Does **not** add an event listener.

```js
hk.bind('a', doSomething);
hk.bind('b', doSomethingElse);

// or:

hk.bind({
  'a': doSomething,
  'b': doSomethingElse,
});
```

Each hotkey can be bound once:
```js
hk.bind('a', doSomething);
hk.bind('a', doSomethingElse); // -> throws Error
```

Callback functions are called with the keyboard event as their only argument:
```js
function doSomething (ev: KeyboardEvent) {...}
```

### .unbind()
* `.unbind(hotkey)` - hotkey string
* `.unbind([hotkey...])` - an array of hotkey strings

Removes keyboard shortcuts. Does **not** remove the event listener.

```js
hk.unbind('a');
hk.unbind('b');

// or:

hk.unbind(['a', 'b']);
```

### .unbindAll()
Unbinds all hotkeys. Does **not** remove the event listener.

```js
hk.bind('A', doSomething);

hk.unbindAll();

hk.bind('B', doSomethingElse);
```

## Mount/Unmount the event listener
Each `Hotkeys` instance can only have one `keydown` keyboard event listener. The event listener is attached to the context element passed in construction. Defaults to `document`.

* `.mount()` - Attaches the event listener to the context element.
* `.unmount()` - Dettaches the event listener from the context element.

```js
const hk = new Hotkeys(myMenu);

hk.bind('Q', doSomething);

// user presses "Q" but nothing happens

hk.mount(); // => internally: myMenu.addEventListener()...

// user presses "Q" and `doSomething` is called

hk.unmount();

// user presses "Q" but nothing happens
```

Using the creator function mounts the event listener for you:
```js
const hk = hotkeys(); //  <---- also mounts

hk.bind('Q', doSomething);

// user presses "Q" and `doSomething` is called

hk.unmount();

// user presses "Q" but nothing happens
```


## Hotkeys Strings
Currently, `my-hotkeys` supports the classic/standard/canonical way of binding keys: there are modifier keys (`Control`, `Alt`, `Shift`, `Meta`) and all the rest ("regular" keys).

A hotkey string can be a single regular key, with or without modifiers.

Modifier keys cannot be hotkeys without a regular key, i.e. `.bind('ctrl-alt')` will not work.

You can also bind by `event.code` or by symbols like `?`.

### Delimiter
The delimiter character is `-`, not configurable (yet?). If you want to bind `-` as a hotkey - use its alias: "Minus" (e.g. `'ctrl-minus'`).

### Examples:
```js
hk.bind({
	'a': doSomething,
	'ctrl-a': doSomething,
	'ctrl-alt-a': doSomething,
	'?': showHelp, // by symbol that may require shift
})
```

Hotkeys are case insensitive:
```js
hk.bind('ctrl-a', doSomething)
// Same as:
hk.bind('Ctrl-A', doSomething)
```

But not when you bind by a key id (`event.code`): 
```js
// event.code is case sensitive
hk.bind('Numpad8', doSomething)
```

### Aliases
Some keys have aliases for better readability or just for convenience.

> Aliases are case insensitive.

### Modifier Aliases:
| Key     | Alias   |
|---------|---------|
| Control | Ctrl    |
| Meta    | Cmd     |
| Meta    | Command |

### Regular Key Aliases:
| Key        | Alias        |
|------------|--------------|
| ArrowUp    | Up           |
| ArrowDown  | Down         |
| ArrowLeft  | Left         |
| ArrowRight | Right        |
|            | Space        |
| +          | Plus         |
| -          | Minus        |
| =          | Equal        |
| _          | Underscore   |
| '          | Quote        |
| '          | Singlequote  |
| "          | Quotes       |
| "          | Doublequotes |
| `          | Backquote    |
| ~          | Tilde        |
| \\         | Backslash    |
| Insert     | Ins          |
| Delete     | Del          |
| Escape     | Esc          |
| PageUp     | PgUp         |
| PageDown   | PgDn         |


## Destruction
Call `.destruct()` when its context element leaves the DOM. It will remove all of the instance's hotkeys and event listeners by calling `.unmount()` and `.unbindAll()`. 

```js
const hk = new Hotkeys();

hk.bind('A', doSomething);
hk.mount();

// ...

hk.destruct();
```
