![Build Status](https://github.com/taitulism/hotkey/actions/workflows/node-ci.yml/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)


Hotkeyz
=======
Keyboard shorcuts.

Install
-------
```sh
$ npm install hotkeyz
```

Basic Usage
-----------

```js
import {hotkeyz} from 'hotkeyz`;
```
```js
const hk = hotkeyz();

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

API
---
* [Create an instance](#create-an-instance)
* [Binding / Unbinding Keys](#binding--unbinding-keys)
* [Mount/Unmount the event listener](#mountunmount-the-event-listener)
* [Destruction](#destruction)



### Create an instance
There are two ways to get a `Hotkeyz` instance:
1. By calling `hotkeys` creator function (lowercased "h")
2. By the `Hotkeyz` constructor (uppercased "H")

```js
import {hotkeyz} from 'hotkeyz`;

const hk = hotkeyz();
```
or:
```js
import {Hotkeyz} from 'hotkeyz`;

const hk = new Hotkeyz();
```

The difference between them is that `hotkeyz` creator function also mounts the event listener on creation when the using the constructor you need to call `.mount()` manually. See [`.mount()`](#mount) below.

Both accept an optional argument as the context element (`HTMLElement | Document`). This would be the element that listens to the keyboard events. Defaults to `document`.

> **⚠ Non-browser environments:** You might need to pass in the runtime's `document` object as the constructor argument.


### Binding / Unbinding Keys

#### .bind()
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

#### .unbind()
* `.unbind(hotkey)` - hotkey string
* `.unbind([hotkey...])` - an array of hotkey strings

Removes keyboard shortcuts. Does **not** remove the event listener.

```js
hk.unbind('a');
hk.unbind('b');

// or:

hk.unbind(['a', 'b']);
```

#### .unbindAll()
Unbinds all hotkeys. Does **not** remove the event listener.

```js
hk.bind('A', doSomething);

hk.unbindAll();

hk.bind('B', doSomethingElse);
```

### Mount/Unmount the event listener
Each `Hotkeyz` instance can only have one `keydown` keyboard event listener.

* `.mount()` - Attaches the event listener to the context element.
* `.unmount()` - Dettaches the event listener from the context element.

```js
const hk = new Hotkeyz();

hk.bind('Q', doSomething);

// user presses "Q" but nothing happens

hk.mount();

// user presses "Q" and `doSomething` is called

hk.unmount();

// user presses "Q" but nothing happens
```

Using the creator function mounts the event listener for you:
```js
const hk = hotkeyz(); //  <---- also mounts

hk.bind('Q', doSomething);

// user presses "Q" and `doSomething` is called

hk.unmount();

// user presses "Q" but nothing happens
```


### Destruction
Call `.destruct()` when its context element leaves the DOM. It will remove all of the instance's hotkeys and event listeners by calling `.unmount()` and `.unbindAll()`. 

```js
const hk = new Hotkeyz();

hk.bind('A', doSomething);
hk.mount();

// ...

hk.destruct();
```
