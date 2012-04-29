

/*!
 * Core - JavaScript Utilities
 *
 * Licensed under the new BSD License.
 * Copyright 2008, Bram Stein
 * All rights reserved.
 */
Object.extend = function (obj) {
	var i = 1, key, len = arguments.length;
	for (; i < len; i += 1) {
		for (key in arguments[i]) {
			// make sure we do not override built-in functions
			if (arguments[i].hasOwnProperty(key) && (!obj[key] || obj.propertyIsEnumerable(key))) {
				obj[key] = arguments[i][key];
			}
		}
	}
	return obj;
};

Object.extend(Object, {
	isAtom: function (value) {
		return ((typeof value !== 'object' || value === null) && 
			typeof value !== 'function') || 
			Object.isBoolean(value);
	},
	isBoolean: function (value) {
		return value !== null && 
			typeof value === 'boolean';
	},
	isArray: function (value) {
		return typeof value === 'object' &&
			typeof value.length === 'number' &&
			typeof value.splice === 'function' &&
			!value.propertyIsEnumerable('length');
	},
	isObject: function (value) {
		return typeof value === 'object' &&
			!Object.isArray(value);		
	},
	isFunction: function (value) {
		return typeof value === 'function';
	},
	filter: function (obj, fun, thisObj) {
		var key, r = {}, val;
		thisObj = thisObj || obj;
		for (key in obj) {
			if (obj.hasOwnProperty(key)) {
				val = obj[key];
				if (fun.call(thisObj, val, key, obj)) {
					r[key] = val;
				}
			}
		}
		return r;
	},
	map: function (obj, fun, thisObj) {
		var key, r = {};
		thisObj = thisObj || obj;
		for (key in obj) {
			if (obj.hasOwnProperty(key)) {
				r[key] = fun.call(thisObj, obj[key], key, obj);
			}
		}
		return r;
	},
	every: function (obj, fun, thisObj) {
		var key;
		thisObj = thisObj || obj;
		for (key in obj) {
			if (obj.hasOwnProperty(key) && !fun.call(thisObj, obj[key], key, obj)) {
				return false;
			}
		}
		return true;
	},
	equals: function (a, b) {
		var ca = 0;

		// Two objects are considered equal if: they have the same amount
		// of keys; the key names are equal, and the key values are equal.
		// If every property of a is in b and is equal, and both objects are
		// of the same size we know they are equal
		return Object.every(a, function (value, key) {
			ca += 1;
			return b.hasOwnProperty(key) && ((Object.isObject(value) && Object.equals(value, b[key])) || value.equals(b[key]));
		}) && ca === Object.reduce(b, function (rv) { 
			return (rv += 1); 
		}, 0);
	}
});

/*jslint eqeqeq: false */
[Boolean, String, Date, Number, Function, RegExp].forEach(function (value) {
	Object.extend(value.prototype, {
		equals: function (v) {
			return this == v;
		}
	});
});
/*jslint eqeqeq: true */
