# migl-pool

Micro Game Library : Object pool

The main use of the object pool pattern in javascript is to reduce the number of garbage collection by enforcing object reuse.
Garbage collection can be quite taxing for real time application such as games and cause dropped frames (jank).
This particular implementation of the object pool doesn't have a fixed size, new instances are dynamically added to the pool when needed.

For further information, check [gameprogrammingpatterns.com](http://gameprogrammingpatterns.com/object-pool.html) and [html5rocks.com](http://www.html5rocks.com/en/tutorials/speed/static-mem-pools/))

## Features

 * Doesn't force a specific interface onto the pooled objects.
 * Lightweight and simple.

## Basic example

### Pool creation for object literals :

```js
var pool = require('migl-pool');

var literalPool = pool.create({
	allocationNumber: 5,
	firstAllocationNumber: 10,
	factory: function literalPoolFactory () {
		return {
			value: 0,
			printValue: function () {
				console.log(this.value);
			}
		};
	},
	initialize: function literalPoolInitialize (element, options) {
		element.value = options.value;
	}
});

var element = literalPool.get({ value: 2 });
element.printValue();
```

### Pool creation for classic prototype-based objects :

```js
var MyObject = function () {};

MyObject.prototype.value = null;

MyObject.prototype.printValue = function () {
	console.log(this.value);
};

var pool = require('migl-pool');

var myObjectPool = pool.create({
	allocationNumber: 5,
	firstAllocationNumber: 10,
	factory: function myObjectPoolFactory () {
		return new MyObject();
	},
	initialize: function myObjectPoolInitialize (element, options) {
		element.value = options.value;
	}
});

var element = myObjectPool.get({ value: 2 });
element.printValue();
```

### General pool usage :

```js
// where somePool is an instance of Pool

var element = somePool.get({});
somePool.free(element); // place an element back into the pool of available instances

console.log(somePool.toString()); // retrieve information about the pool, useful for debugging purpose

somePool.clear(); //remove all the object from the pool
```

## Roadmap

* Make unit tests.
* Better doc.
