var axios =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Promise = __webpack_require__(7).Promise;
	var buildUrl = __webpack_require__(2);
	var defaults = __webpack_require__(3);
	var forEach = __webpack_require__(4);
	var merge = __webpack_require__(5);
	var transformData = __webpack_require__(6);
	
	var axios = module.exports = function axios(options) {
	  options = merge({
	    method: 'get',
	    transformRequest: defaults.transformRequest,
	    transformResponse: defaults.transformResponse
	  }, options);
	
	  // Don't allow overriding defaults.withCredentials
	  options.withCredentials = options.withCredentials || defaults.withCredentials;
	
	  var promise = new Promise(function (resolve, reject) {
	    // Create the request
	    var request = new(XMLHttpRequest || ActiveXObject)('Microsoft.XMLHTTP');
	    var data = transformData(
	      options.data,
	      options.headers,
	      options.transformRequest
	    );
	
	    // Open the request
	    request.open(options.method, buildUrl(options.url, options.params), true);
	
	    // Listen for ready state
	    request.onreadystatechange = function () {
	      if (request && request.readyState === 4) {
	        // Prepare the response
	        var response = {
	          data: transformData(
	            request.responseText,
	            options.headers,
	            options.transformResponse
	          ),
	          status: request.status,
	          headers: headers,
	          config: options
	        };
	
	        // Resolve or reject the Promise based on the status
	        if (request.status >= 200 && request.status < 300) {
	          resolve(response);
	        } else {
	          reject(response);
	        }
	
	        // Clean up request
	        request = null;
	      }
	    };
	
	    // Merge headers and add to request
	    var headers = merge(
	      defaults.headers.common,
	      defaults.headers[options.method] || {},
	      options.headers || {}
	    );
	
	    forEach(headers, function (val, key) {
	      // Remove Content-Type if data is undefined
	      if (typeof data === 'undefined' && key.toLowerCase() === 'content-type') {
	        delete headers[key];
	      }
	      // Otherwise add header to the request
	      else {
	        request.setRequestHeader(key, val);
	      }
	    });
	
	    // Add withCredentials to request if needed
	    if (options.withCredentials) {
	      request.withCredentials = true;
	    }
	
	    // Add responseType to request if needed
	    if (options.responseType) {
	      try {
	        request.responseType = options.responseType;
	      } catch (e) {
	        if (request.responseType !== 'json') {
	          throw e;
	        }
	      }
	    }
	
	    // Send the request
	    request.send(data);
	  });
	
	  // Provide alias for success
	  promise.success = function success(fn) {
	    promise.then(function(response) {
	      fn(response);
	    });
	    return promise;
	  };
	
	  // Provide alias for error
	  promise.error = function error(fn) {
	    promise.then(null, function(response) {
	      fn(response);
	    });
	    return promise;
	  };
	
	  return promise;
	};
	
	// Expose defaults
	axios.defaults = defaults;
	
	// Provide aliases for supported request methods
	createShortMethods('delete', 'get', 'head');
	createShortMethodsWithData('post', 'put', 'patch');
	
	function createShortMethods() {
	  forEach(arguments, function (method) {
	    axios[method] = function (url, options) {
	      return axios(merge(options || {}, {
	        method: method,
	        url: url
	      }));
	    };
	  });
	}
	
	function createShortMethodsWithData() {
	  forEach(arguments, function (method) {
	    axios[method] = function (url, data, options) {
	      return axios(merge(options || {}, {
	        method: method,
	        url: url,
	        data: data
	      }));
	    };
	  });
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var forEach = __webpack_require__(4);
	
	function encode(val) {
	  return encodeURIComponent(val).
	    replace(/%40/gi, '@').
	    replace(/%3A/gi, ':').
	    replace(/%24/g, '$').
	    replace(/%2C/gi, ',').
	    replace(/%20/g, '+');
	}
	
	module.exports = function buildUrl(url, params) {
	  if (!params) {
	    return url;
	  }
	
	  var parts = [];
	
	  forEach(params, function (val, key) {
	    if (val === null || typeof val === 'undefined') {
	      return;
	    }
	    if (Object.prototype.toString.call(val) !== '[object Array]') {
	      val = [val];
	    }
	
	    forEach(val, function (v) {
	      if (Object.prototype.toString.call(v) === '[object Date]') {
	        v = v.toISOString();
	      }
	      else if (typeof v === 'object') {
	        v = JSON.stringify(v);
	      }
	      parts.push(encode(key) + '=' + encode(v));
	    });
	  });
	
	  if (parts.length > 0) {
	    url += (url.indexOf('?') === -1 ? '?' : '&') + parts.join('&');
	  }
	
	  return url;
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var merge = __webpack_require__(5);
	
	var toString = Object.prototype.toString;
	var JSON_START = /^\s*(\[|\{[^\{])/;
	var JSON_END = /[\}\]]\s*$/;
	var PROTECTION_PREFIX = /^\)\]\}',?\n/;
	var CONTENT_TYPE_APPLICATION_JSON = {
	  'Content-Type': 'application/json;charset=utf-8'
	};
	
	module.exports = {
	  transformRequest: [function (data) {
	    return data !== null && typeof data === 'object' &&
	          toString.call(data) !== '[object File]' &&
	          toString.call(data) !== '[object Blob]' ?
	            JSON.stringify(data) : null;
	  }],
	
	  transformResponse: [function (data) {
	    if (typeof data === 'string') {
	      data = data.replace(PROTECTION_PREFIX, '');
	      if (JSON_START.test(data) && JSON_END.test(data)) {
	        data = JSON.parse(data);
	      }
	    }
	    return data;
	  }],
	
	  headers: {
	    common: {
	      'Accept': 'application/json, text/plain, */*'
	    },
	    patch: merge(CONTENT_TYPE_APPLICATION_JSON),
	    post: merge(CONTENT_TYPE_APPLICATION_JSON),
	    put: merge(CONTENT_TYPE_APPLICATION_JSON)
	  },
	
	  xsrfCookiName: 'XSRF-TOKEN',
	  xsrfHeaderName: 'X-XSRF-TOKEN'
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Iterate over an Array or an Object invoking a function for each item.
	 *
	 * If `obj` is an Array or arguments callback will be called passing
	 * the value, index, and complete array for each item.
	 *
	 * If 'obj' is an Object callback will be called passing
	 * the value, key, and complete object for each property.
	 *
	 * @param {Object|Array} obj The object to iterate
	 * @param {Function} fn The callback to invoke for each item
	 */
	module.exports = function forEach(obj, fn) {
	  if (typeof obj !== 'object') {
	    return;
	  }
	
	  // Iterate over array values
	  if (obj.constructor === Array || typeof obj.callee === 'function') {
	    for (var i=0, l=obj.length; i<l; i++) {
	      fn.call(null, obj[i], i, obj);
	    }
	  }
	  // Iterate over object keys
	  else {
	    for (var key in obj) {
	      if (obj.hasOwnProperty(key)) {
	        fn.call(null, obj[key], key, obj);
	      }
	    }
	  }
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var forEach = __webpack_require__(4);
	
	/**
	 * Accepts varargs expecting each argument to be an object, then
	 * immutably merges the properties of each object and returns result.
	 *
	 * When multiple objects contain the same key the later object in
	 * the arguments list will take precedence.
	 *
	 * Example:
	 *
	 * ```js
	 * var result = merge({foo: 123}, {foo: 456});
	 * console.log(result.foo); // outputs 456
	 * ```
	 *
	 * @param {Object} obj1 Object to merge
	 * @returns {Object} Result of all merge properties
	 */
	module.exports = function merge(obj1/*, obj2, obj3, ...*/) {
	  var result = {};
	  forEach(arguments, function (obj) {
	    forEach(obj, function (val, key) {
	      result[key] = val;
	    });
	  });
	  return result;
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var forEach = __webpack_require__(4);
	
	/**
	 * Transform the data for a request or a response
	 *
	 * @param {Object|String} data The data to be transformed
	 * @param {Array} headers The headers for the request or response
	 * @param {Array|Function} fns A single function or Array of functions
	 * @returns {*} The resulting transformed data
	 */
	module.exports = function transformData(data, headers, fns) {
	  if (typeof fns === 'function') {
	    return fns(data, headers);
	  }
	
	  forEach(fns, function (fn) {
	    data = fn(data, headers);
	  });
	
	  return data;
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Promise = __webpack_require__(8).Promise;
	var polyfill = __webpack_require__(9).polyfill;
	exports.Promise = Promise;
	exports.polyfill = polyfill;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var config = __webpack_require__(10).config;
	var configure = __webpack_require__(10).configure;
	var objectOrFunction = __webpack_require__(11).objectOrFunction;
	var isFunction = __webpack_require__(11).isFunction;
	var now = __webpack_require__(11).now;
	var all = __webpack_require__(12).all;
	var race = __webpack_require__(13).race;
	var staticResolve = __webpack_require__(14).resolve;
	var staticReject = __webpack_require__(15).reject;
	var asap = __webpack_require__(16).asap;
	
	var counter = 0;
	
	config.async = asap; // default async is asap;
	
	function Promise(resolver) {
	  if (!isFunction(resolver)) {
	    throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
	  }
	
	  if (!(this instanceof Promise)) {
	    throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
	  }
	
	  this._subscribers = [];
	
	  invokeResolver(resolver, this);
	}
	
	function invokeResolver(resolver, promise) {
	  function resolvePromise(value) {
	    resolve(promise, value);
	  }
	
	  function rejectPromise(reason) {
	    reject(promise, reason);
	  }
	
	  try {
	    resolver(resolvePromise, rejectPromise);
	  } catch(e) {
	    rejectPromise(e);
	  }
	}
	
	function invokeCallback(settled, promise, callback, detail) {
	  var hasCallback = isFunction(callback),
	      value, error, succeeded, failed;
	
	  if (hasCallback) {
	    try {
	      value = callback(detail);
	      succeeded = true;
	    } catch(e) {
	      failed = true;
	      error = e;
	    }
	  } else {
	    value = detail;
	    succeeded = true;
	  }
	
	  if (handleThenable(promise, value)) {
	    return;
	  } else if (hasCallback && succeeded) {
	    resolve(promise, value);
	  } else if (failed) {
	    reject(promise, error);
	  } else if (settled === FULFILLED) {
	    resolve(promise, value);
	  } else if (settled === REJECTED) {
	    reject(promise, value);
	  }
	}
	
	var PENDING   = void 0;
	var SEALED    = 0;
	var FULFILLED = 1;
	var REJECTED  = 2;
	
	function subscribe(parent, child, onFulfillment, onRejection) {
	  var subscribers = parent._subscribers;
	  var length = subscribers.length;
	
	  subscribers[length] = child;
	  subscribers[length + FULFILLED] = onFulfillment;
	  subscribers[length + REJECTED]  = onRejection;
	}
	
	function publish(promise, settled) {
	  var child, callback, subscribers = promise._subscribers, detail = promise._detail;
	
	  for (var i = 0; i < subscribers.length; i += 3) {
	    child = subscribers[i];
	    callback = subscribers[i + settled];
	
	    invokeCallback(settled, child, callback, detail);
	  }
	
	  promise._subscribers = null;
	}
	
	Promise.prototype = {
	  constructor: Promise,
	
	  _state: undefined,
	  _detail: undefined,
	  _subscribers: undefined,
	
	  then: function(onFulfillment, onRejection) {
	    var promise = this;
	
	    var thenPromise = new this.constructor(function() {});
	
	    if (this._state) {
	      var callbacks = arguments;
	      config.async(function invokePromiseCallback() {
	        invokeCallback(promise._state, thenPromise, callbacks[promise._state - 1], promise._detail);
	      });
	    } else {
	      subscribe(this, thenPromise, onFulfillment, onRejection);
	    }
	
	    return thenPromise;
	  },
	
	  'catch': function(onRejection) {
	    return this.then(null, onRejection);
	  }
	};
	
	Promise.all = all;
	Promise.race = race;
	Promise.resolve = staticResolve;
	Promise.reject = staticReject;
	
	function handleThenable(promise, value) {
	  var then = null,
	  resolved;
	
	  try {
	    if (promise === value) {
	      throw new TypeError("A promises callback cannot return that same promise.");
	    }
	
	    if (objectOrFunction(value)) {
	      then = value.then;
	
	      if (isFunction(then)) {
	        then.call(value, function(val) {
	          if (resolved) { return true; }
	          resolved = true;
	
	          if (value !== val) {
	            resolve(promise, val);
	          } else {
	            fulfill(promise, val);
	          }
	        }, function(val) {
	          if (resolved) { return true; }
	          resolved = true;
	
	          reject(promise, val);
	        });
	
	        return true;
	      }
	    }
	  } catch (error) {
	    if (resolved) { return true; }
	    reject(promise, error);
	    return true;
	  }
	
	  return false;
	}
	
	function resolve(promise, value) {
	  if (promise === value) {
	    fulfill(promise, value);
	  } else if (!handleThenable(promise, value)) {
	    fulfill(promise, value);
	  }
	}
	
	function fulfill(promise, value) {
	  if (promise._state !== PENDING) { return; }
	  promise._state = SEALED;
	  promise._detail = value;
	
	  config.async(publishFulfillment, promise);
	}
	
	function reject(promise, reason) {
	  if (promise._state !== PENDING) { return; }
	  promise._state = SEALED;
	  promise._detail = reason;
	
	  config.async(publishRejection, promise);
	}
	
	function publishFulfillment(promise) {
	  publish(promise, promise._state = FULFILLED);
	}
	
	function publishRejection(promise) {
	  publish(promise, promise._state = REJECTED);
	}
	
	exports.Promise = Promise;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";
	/*global self*/
	var RSVPPromise = __webpack_require__(8).Promise;
	var isFunction = __webpack_require__(11).isFunction;
	
	function polyfill() {
	  var local;
	
	  if (typeof global !== 'undefined') {
	    local = global;
	  } else if (typeof window !== 'undefined' && window.document) {
	    local = window;
	  } else {
	    local = self;
	  }
	
	  var es6PromiseSupport = 
	    "Promise" in local &&
	    // Some of these methods are missing from
	    // Firefox/Chrome experimental implementations
	    "resolve" in local.Promise &&
	    "reject" in local.Promise &&
	    "all" in local.Promise &&
	    "race" in local.Promise &&
	    // Older version of the spec had a resolver object
	    // as the arg rather than a function
	    (function() {
	      var resolve;
	      new local.Promise(function(r) { resolve = r; });
	      return isFunction(resolve);
	    }());
	
	  if (!es6PromiseSupport) {
	    local.Promise = RSVPPromise;
	  }
	}
	
	exports.polyfill = polyfill;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var config = {
	  instrument: false
	};
	
	function configure(name, value) {
	  if (arguments.length === 2) {
	    config[name] = value;
	  } else {
	    return config[name];
	  }
	}
	
	exports.config = config;
	exports.configure = configure;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function objectOrFunction(x) {
	  return isFunction(x) || (typeof x === "object" && x !== null);
	}
	
	function isFunction(x) {
	  return typeof x === "function";
	}
	
	function isArray(x) {
	  return Object.prototype.toString.call(x) === "[object Array]";
	}
	
	// Date.now is not available in browsers < IE9
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now#Compatibility
	var now = Date.now || function() { return new Date().getTime(); };
	
	
	exports.objectOrFunction = objectOrFunction;
	exports.isFunction = isFunction;
	exports.isArray = isArray;
	exports.now = now;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/* global toString */
	
	var isArray = __webpack_require__(11).isArray;
	var isFunction = __webpack_require__(11).isFunction;
	
	/**
	  Returns a promise that is fulfilled when all the given promises have been
	  fulfilled, or rejected if any of them become rejected. The return promise
	  is fulfilled with an array that gives all the values in the order they were
	  passed in the `promises` array argument.
	
	  Example:
	
	  ```javascript
	  var promise1 = RSVP.resolve(1);
	  var promise2 = RSVP.resolve(2);
	  var promise3 = RSVP.resolve(3);
	  var promises = [ promise1, promise2, promise3 ];
	
	  RSVP.all(promises).then(function(array){
	    // The array here would be [ 1, 2, 3 ];
	  });
	  ```
	
	  If any of the `promises` given to `RSVP.all` are rejected, the first promise
	  that is rejected will be given as an argument to the returned promises's
	  rejection handler. For example:
	
	  Example:
	
	  ```javascript
	  var promise1 = RSVP.resolve(1);
	  var promise2 = RSVP.reject(new Error("2"));
	  var promise3 = RSVP.reject(new Error("3"));
	  var promises = [ promise1, promise2, promise3 ];
	
	  RSVP.all(promises).then(function(array){
	    // Code here never runs because there are rejected promises!
	  }, function(error) {
	    // error.message === "2"
	  });
	  ```
	
	  @method all
	  @for RSVP
	  @param {Array} promises
	  @param {String} label
	  @return {Promise} promise that is fulfilled when all `promises` have been
	  fulfilled, or rejected if any of them become rejected.
	*/
	function all(promises) {
	  /*jshint validthis:true */
	  var Promise = this;
	
	  if (!isArray(promises)) {
	    throw new TypeError('You must pass an array to all.');
	  }
	
	  return new Promise(function(resolve, reject) {
	    var results = [], remaining = promises.length,
	    promise;
	
	    if (remaining === 0) {
	      resolve([]);
	    }
	
	    function resolver(index) {
	      return function(value) {
	        resolveAll(index, value);
	      };
	    }
	
	    function resolveAll(index, value) {
	      results[index] = value;
	      if (--remaining === 0) {
	        resolve(results);
	      }
	    }
	
	    for (var i = 0; i < promises.length; i++) {
	      promise = promises[i];
	
	      if (promise && isFunction(promise.then)) {
	        promise.then(resolver(i), reject);
	      } else {
	        resolveAll(i, promise);
	      }
	    }
	  });
	}
	
	exports.all = all;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/* global toString */
	var isArray = __webpack_require__(11).isArray;
	
	/**
	  `RSVP.race` allows you to watch a series of promises and act as soon as the
	  first promise given to the `promises` argument fulfills or rejects.
	
	  Example:
	
	  ```javascript
	  var promise1 = new RSVP.Promise(function(resolve, reject){
	    setTimeout(function(){
	      resolve("promise 1");
	    }, 200);
	  });
	
	  var promise2 = new RSVP.Promise(function(resolve, reject){
	    setTimeout(function(){
	      resolve("promise 2");
	    }, 100);
	  });
	
	  RSVP.race([promise1, promise2]).then(function(result){
	    // result === "promise 2" because it was resolved before promise1
	    // was resolved.
	  });
	  ```
	
	  `RSVP.race` is deterministic in that only the state of the first completed
	  promise matters. For example, even if other promises given to the `promises`
	  array argument are resolved, but the first completed promise has become
	  rejected before the other promises became fulfilled, the returned promise
	  will become rejected:
	
	  ```javascript
	  var promise1 = new RSVP.Promise(function(resolve, reject){
	    setTimeout(function(){
	      resolve("promise 1");
	    }, 200);
	  });
	
	  var promise2 = new RSVP.Promise(function(resolve, reject){
	    setTimeout(function(){
	      reject(new Error("promise 2"));
	    }, 100);
	  });
	
	  RSVP.race([promise1, promise2]).then(function(result){
	    // Code here never runs because there are rejected promises!
	  }, function(reason){
	    // reason.message === "promise2" because promise 2 became rejected before
	    // promise 1 became fulfilled
	  });
	  ```
	
	  @method race
	  @for RSVP
	  @param {Array} promises array of promises to observe
	  @param {String} label optional string for describing the promise returned.
	  Useful for tooling.
	  @return {Promise} a promise that becomes fulfilled with the value the first
	  completed promises is resolved with if the first completed promise was
	  fulfilled, or rejected with the reason that the first completed promise
	  was rejected with.
	*/
	function race(promises) {
	  /*jshint validthis:true */
	  var Promise = this;
	
	  if (!isArray(promises)) {
	    throw new TypeError('You must pass an array to race.');
	  }
	  return new Promise(function(resolve, reject) {
	    var results = [], promise;
	
	    for (var i = 0; i < promises.length; i++) {
	      promise = promises[i];
	
	      if (promise && typeof promise.then === 'function') {
	        promise.then(resolve, reject);
	      } else {
	        resolve(promise);
	      }
	    }
	  });
	}
	
	exports.race = race;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function resolve(value) {
	  /*jshint validthis:true */
	  if (value && typeof value === 'object' && value.constructor === this) {
	    return value;
	  }
	
	  var Promise = this;
	
	  return new Promise(function(resolve) {
	    resolve(value);
	  });
	}
	
	exports.resolve = resolve;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/**
	  `RSVP.reject` returns a promise that will become rejected with the passed
	  `reason`. `RSVP.reject` is essentially shorthand for the following:
	
	  ```javascript
	  var promise = new RSVP.Promise(function(resolve, reject){
	    reject(new Error('WHOOPS'));
	  });
	
	  promise.then(function(value){
	    // Code here doesn't run because the promise is rejected!
	  }, function(reason){
	    // reason.message === 'WHOOPS'
	  });
	  ```
	
	  Instead of writing the above, your code now simply becomes the following:
	
	  ```javascript
	  var promise = RSVP.reject(new Error('WHOOPS'));
	
	  promise.then(function(value){
	    // Code here doesn't run because the promise is rejected!
	  }, function(reason){
	    // reason.message === 'WHOOPS'
	  });
	  ```
	
	  @method reject
	  @for RSVP
	  @param {Any} reason value that the returned promise will be rejected with.
	  @param {String} label optional string for identifying the returned promise.
	  Useful for tooling.
	  @return {Promise} a promise that will become rejected with the given
	  `reason`.
	*/
	function reject(reason) {
	  /*jshint validthis:true */
	  var Promise = this;
	
	  return new Promise(function (resolve, reject) {
	    reject(reason);
	  });
	}
	
	exports.reject = reject;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {"use strict";
	var browserGlobal = (typeof window !== 'undefined') ? window : {};
	var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
	var local = (typeof global !== 'undefined') ? global : (this === undefined? window:this);
	
	// node
	function useNextTick() {
	  return function() {
	    process.nextTick(flush);
	  };
	}
	
	function useMutationObserver() {
	  var iterations = 0;
	  var observer = new BrowserMutationObserver(flush);
	  var node = document.createTextNode('');
	  observer.observe(node, { characterData: true });
	
	  return function() {
	    node.data = (iterations = ++iterations % 2);
	  };
	}
	
	function useSetTimeout() {
	  return function() {
	    local.setTimeout(flush, 1);
	  };
	}
	
	var queue = [];
	function flush() {
	  for (var i = 0; i < queue.length; i++) {
	    var tuple = queue[i];
	    var callback = tuple[0], arg = tuple[1];
	    callback(arg);
	  }
	  queue = [];
	}
	
	var scheduleFlush;
	
	// Decide what async method to use to triggering processing of queued callbacks:
	if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
	  scheduleFlush = useNextTick();
	} else if (BrowserMutationObserver) {
	  scheduleFlush = useMutationObserver();
	} else {
	  scheduleFlush = useSetTimeout();
	}
	
	function asap(callback, arg) {
	  var length = queue.push([callback, arg]);
	  if (length === 1) {
	    // If length is 1, that means that we need to schedule an async flush.
	    // If additional callbacks are queued before the queue is flushed, they
	    // will be processed by this flush that we are scheduling.
	    scheduleFlush();
	  }
	}
	
	exports.asap = asap;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(17)))

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	// shim for using process in browser
	
	var process = module.exports = {};
	
	process.nextTick = (function () {
	    var canSetImmediate = typeof window !== 'undefined'
	    && window.setImmediate;
	    var canPost = typeof window !== 'undefined'
	    && window.postMessage && window.addEventListener
	    ;
	
	    if (canSetImmediate) {
	        return function (f) { return window.setImmediate(f) };
	    }
	
	    if (canPost) {
	        var queue = [];
	        window.addEventListener('message', function (ev) {
	            var source = ev.source;
	            if ((source === window || source === null) && ev.data === 'process-tick') {
	                ev.stopPropagation();
	                if (queue.length > 0) {
	                    var fn = queue.shift();
	                    fn();
	                }
	            }
	        }, true);
	
	        return function nextTick(fn) {
	            queue.push(fn);
	            window.postMessage('process-tick', '*');
	        };
	    }
	
	    return function nextTick(fn) {
	        setTimeout(fn, 0);
	    };
	})();
	
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	}
	
	// TODO(shtylman)
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};


/***/ }
/******/ ])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYmNlZmYwYTVkZGI4YWMxMTVmNGYiLCJ3ZWJwYWNrOi8vLy4vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbGliL2F4aW9zLmpzIiwid2VicGFjazovLy8uL2xpYi9idWlsZFVybC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvZGVmYXVsdHMuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL2ZvckVhY2guanMiLCJ3ZWJwYWNrOi8vLy4vbGliL21lcmdlLmpzIiwid2VicGFjazovLy8uL2xpYi90cmFuc2Zvcm1EYXRhLmpzIiwid2VicGFjazovLy8uL34vZXM2LXByb21pc2UvZGlzdC9jb21tb25qcy9tYWluLmpzIiwid2VicGFjazovLy8uL34vZXM2LXByb21pc2UvZGlzdC9jb21tb25qcy9wcm9taXNlL3Byb21pc2UuanMiLCJ3ZWJwYWNrOi8vLy4vfi9lczYtcHJvbWlzZS9kaXN0L2NvbW1vbmpzL3Byb21pc2UvcG9seWZpbGwuanMiLCJ3ZWJwYWNrOi8vLy4vfi9lczYtcHJvbWlzZS9kaXN0L2NvbW1vbmpzL3Byb21pc2UvY29uZmlnLmpzIiwid2VicGFjazovLy8uL34vZXM2LXByb21pc2UvZGlzdC9jb21tb25qcy9wcm9taXNlL3V0aWxzLmpzIiwid2VicGFjazovLy8uL34vZXM2LXByb21pc2UvZGlzdC9jb21tb25qcy9wcm9taXNlL2FsbC5qcyIsIndlYnBhY2s6Ly8vLi9+L2VzNi1wcm9taXNlL2Rpc3QvY29tbW9uanMvcHJvbWlzZS9yYWNlLmpzIiwid2VicGFjazovLy8uL34vZXM2LXByb21pc2UvZGlzdC9jb21tb25qcy9wcm9taXNlL3Jlc29sdmUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9lczYtcHJvbWlzZS9kaXN0L2NvbW1vbmpzL3Byb21pc2UvcmVqZWN0LmpzIiwid2VicGFjazovLy8uL34vZXM2LXByb21pc2UvZGlzdC9jb21tb25qcy9wcm9taXNlL2FzYXAuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNr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Q0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDRCQUEyQjtBQUMzQjtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCBiY2VmZjBhNWRkYjhhYzExNWY0ZlxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9saWIvYXhpb3MnKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vaW5kZXguanNcbiAqKiBtb2R1bGUgaWQgPSAwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgUHJvbWlzZSA9IHJlcXVpcmUoJ2VzNi1wcm9taXNlJykuUHJvbWlzZTtcbnZhciBidWlsZFVybCA9IHJlcXVpcmUoJy4vYnVpbGRVcmwnKTtcbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJy4vZGVmYXVsdHMnKTtcbnZhciBmb3JFYWNoID0gcmVxdWlyZSgnLi9mb3JFYWNoJyk7XG52YXIgbWVyZ2UgPSByZXF1aXJlKCcuL21lcmdlJyk7XG52YXIgdHJhbnNmb3JtRGF0YSA9IHJlcXVpcmUoJy4vdHJhbnNmb3JtRGF0YScpO1xuXG52YXIgYXhpb3MgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF4aW9zKG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG1lcmdlKHtcbiAgICBtZXRob2Q6ICdnZXQnLFxuICAgIHRyYW5zZm9ybVJlcXVlc3Q6IGRlZmF1bHRzLnRyYW5zZm9ybVJlcXVlc3QsXG4gICAgdHJhbnNmb3JtUmVzcG9uc2U6IGRlZmF1bHRzLnRyYW5zZm9ybVJlc3BvbnNlXG4gIH0sIG9wdGlvbnMpO1xuXG4gIC8vIERvbid0IGFsbG93IG92ZXJyaWRpbmcgZGVmYXVsdHMud2l0aENyZWRlbnRpYWxzXG4gIG9wdGlvbnMud2l0aENyZWRlbnRpYWxzID0gb3B0aW9ucy53aXRoQ3JlZGVudGlhbHMgfHwgZGVmYXVsdHMud2l0aENyZWRlbnRpYWxzO1xuXG4gIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIC8vIENyZWF0ZSB0aGUgcmVxdWVzdFxuICAgIHZhciByZXF1ZXN0ID0gbmV3KFhNTEh0dHBSZXF1ZXN0IHx8IEFjdGl2ZVhPYmplY3QpKCdNaWNyb3NvZnQuWE1MSFRUUCcpO1xuICAgIHZhciBkYXRhID0gdHJhbnNmb3JtRGF0YShcbiAgICAgIG9wdGlvbnMuZGF0YSxcbiAgICAgIG9wdGlvbnMuaGVhZGVycyxcbiAgICAgIG9wdGlvbnMudHJhbnNmb3JtUmVxdWVzdFxuICAgICk7XG5cbiAgICAvLyBPcGVuIHRoZSByZXF1ZXN0XG4gICAgcmVxdWVzdC5vcGVuKG9wdGlvbnMubWV0aG9kLCBidWlsZFVybChvcHRpb25zLnVybCwgb3B0aW9ucy5wYXJhbXMpLCB0cnVlKTtcblxuICAgIC8vIExpc3RlbiBmb3IgcmVhZHkgc3RhdGVcbiAgICByZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChyZXF1ZXN0ICYmIHJlcXVlc3QucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAvLyBQcmVwYXJlIHRoZSByZXNwb25zZVxuICAgICAgICB2YXIgcmVzcG9uc2UgPSB7XG4gICAgICAgICAgZGF0YTogdHJhbnNmb3JtRGF0YShcbiAgICAgICAgICAgIHJlcXVlc3QucmVzcG9uc2VUZXh0LFxuICAgICAgICAgICAgb3B0aW9ucy5oZWFkZXJzLFxuICAgICAgICAgICAgb3B0aW9ucy50cmFuc2Zvcm1SZXNwb25zZVxuICAgICAgICAgICksXG4gICAgICAgICAgc3RhdHVzOiByZXF1ZXN0LnN0YXR1cyxcbiAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzLFxuICAgICAgICAgIGNvbmZpZzogb3B0aW9uc1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFJlc29sdmUgb3IgcmVqZWN0IHRoZSBQcm9taXNlIGJhc2VkIG9uIHRoZSBzdGF0dXNcbiAgICAgICAgaWYgKHJlcXVlc3Quc3RhdHVzID49IDIwMCAmJiByZXF1ZXN0LnN0YXR1cyA8IDMwMCkge1xuICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlamVjdChyZXNwb25zZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBNZXJnZSBoZWFkZXJzIGFuZCBhZGQgdG8gcmVxdWVzdFxuICAgIHZhciBoZWFkZXJzID0gbWVyZ2UoXG4gICAgICBkZWZhdWx0cy5oZWFkZXJzLmNvbW1vbixcbiAgICAgIGRlZmF1bHRzLmhlYWRlcnNbb3B0aW9ucy5tZXRob2RdIHx8IHt9LFxuICAgICAgb3B0aW9ucy5oZWFkZXJzIHx8IHt9XG4gICAgKTtcblxuICAgIGZvckVhY2goaGVhZGVycywgZnVuY3Rpb24gKHZhbCwga2V5KSB7XG4gICAgICAvLyBSZW1vdmUgQ29udGVudC1UeXBlIGlmIGRhdGEgaXMgdW5kZWZpbmVkXG4gICAgICBpZiAodHlwZW9mIGRhdGEgPT09ICd1bmRlZmluZWQnICYmIGtleS50b0xvd2VyQ2FzZSgpID09PSAnY29udGVudC10eXBlJykge1xuICAgICAgICBkZWxldGUgaGVhZGVyc1trZXldO1xuICAgICAgfVxuICAgICAgLy8gT3RoZXJ3aXNlIGFkZCBoZWFkZXIgdG8gdGhlIHJlcXVlc3RcbiAgICAgIGVsc2Uge1xuICAgICAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoa2V5LCB2YWwpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gQWRkIHdpdGhDcmVkZW50aWFscyB0byByZXF1ZXN0IGlmIG5lZWRlZFxuICAgIGlmIChvcHRpb25zLndpdGhDcmVkZW50aWFscykge1xuICAgICAgcmVxdWVzdC53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIEFkZCByZXNwb25zZVR5cGUgdG8gcmVxdWVzdCBpZiBuZWVkZWRcbiAgICBpZiAob3B0aW9ucy5yZXNwb25zZVR5cGUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gb3B0aW9ucy5yZXNwb25zZVR5cGU7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChyZXF1ZXN0LnJlc3BvbnNlVHlwZSAhPT0gJ2pzb24nKSB7XG4gICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFNlbmQgdGhlIHJlcXVlc3RcbiAgICByZXF1ZXN0LnNlbmQoZGF0YSk7XG4gIH0pO1xuXG4gIC8vIFByb3ZpZGUgYWxpYXMgZm9yIHN1Y2Nlc3NcbiAgcHJvbWlzZS5zdWNjZXNzID0gZnVuY3Rpb24gc3VjY2Vzcyhmbikge1xuICAgIHByb21pc2UudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgZm4ocmVzcG9uc2UpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9O1xuXG4gIC8vIFByb3ZpZGUgYWxpYXMgZm9yIGVycm9yXG4gIHByb21pc2UuZXJyb3IgPSBmdW5jdGlvbiBlcnJvcihmbikge1xuICAgIHByb21pc2UudGhlbihudWxsLCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgZm4ocmVzcG9uc2UpO1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9O1xuXG4gIHJldHVybiBwcm9taXNlO1xufTtcblxuLy8gRXhwb3NlIGRlZmF1bHRzXG5heGlvcy5kZWZhdWx0cyA9IGRlZmF1bHRzO1xuXG4vLyBQcm92aWRlIGFsaWFzZXMgZm9yIHN1cHBvcnRlZCByZXF1ZXN0IG1ldGhvZHNcbmNyZWF0ZVNob3J0TWV0aG9kcygnZGVsZXRlJywgJ2dldCcsICdoZWFkJyk7XG5jcmVhdGVTaG9ydE1ldGhvZHNXaXRoRGF0YSgncG9zdCcsICdwdXQnLCAncGF0Y2gnKTtcblxuZnVuY3Rpb24gY3JlYXRlU2hvcnRNZXRob2RzKCkge1xuICBmb3JFYWNoKGFyZ3VtZW50cywgZnVuY3Rpb24gKG1ldGhvZCkge1xuICAgIGF4aW9zW21ldGhvZF0gPSBmdW5jdGlvbiAodXJsLCBvcHRpb25zKSB7XG4gICAgICByZXR1cm4gYXhpb3MobWVyZ2Uob3B0aW9ucyB8fCB7fSwge1xuICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgdXJsOiB1cmxcbiAgICAgIH0pKTtcbiAgICB9O1xuICB9KTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlU2hvcnRNZXRob2RzV2l0aERhdGEoKSB7XG4gIGZvckVhY2goYXJndW1lbnRzLCBmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgYXhpb3NbbWV0aG9kXSA9IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBheGlvcyhtZXJnZShvcHRpb25zIHx8IHt9LCB7XG4gICAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgZGF0YTogZGF0YVxuICAgICAgfSkpO1xuICAgIH07XG4gIH0pO1xufVxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9saWIvYXhpb3MuanNcbiAqKiBtb2R1bGUgaWQgPSAxXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbnZhciBmb3JFYWNoID0gcmVxdWlyZSgnLi9mb3JFYWNoJyk7XG5cbmZ1bmN0aW9uIGVuY29kZSh2YWwpIHtcbiAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudCh2YWwpLlxuICAgIHJlcGxhY2UoLyU0MC9naSwgJ0AnKS5cbiAgICByZXBsYWNlKC8lM0EvZ2ksICc6JykuXG4gICAgcmVwbGFjZSgvJTI0L2csICckJykuXG4gICAgcmVwbGFjZSgvJTJDL2dpLCAnLCcpLlxuICAgIHJlcGxhY2UoLyUyMC9nLCAnKycpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJ1aWxkVXJsKHVybCwgcGFyYW1zKSB7XG4gIGlmICghcGFyYW1zKSB7XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuXG4gIHZhciBwYXJ0cyA9IFtdO1xuXG4gIGZvckVhY2gocGFyYW1zLCBmdW5jdGlvbiAodmFsLCBrZXkpIHtcbiAgICBpZiAodmFsID09PSBudWxsIHx8IHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsKSAhPT0gJ1tvYmplY3QgQXJyYXldJykge1xuICAgICAgdmFsID0gW3ZhbF07XG4gICAgfVxuXG4gICAgZm9yRWFjaCh2YWwsIGZ1bmN0aW9uICh2KSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHYpID09PSAnW29iamVjdCBEYXRlXScpIHtcbiAgICAgICAgdiA9IHYudG9JU09TdHJpbmcoKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHR5cGVvZiB2ID09PSAnb2JqZWN0Jykge1xuICAgICAgICB2ID0gSlNPTi5zdHJpbmdpZnkodik7XG4gICAgICB9XG4gICAgICBwYXJ0cy5wdXNoKGVuY29kZShrZXkpICsgJz0nICsgZW5jb2RlKHYpKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgaWYgKHBhcnRzLmxlbmd0aCA+IDApIHtcbiAgICB1cmwgKz0gKHVybC5pbmRleE9mKCc/JykgPT09IC0xID8gJz8nIDogJyYnKSArIHBhcnRzLmpvaW4oJyYnKTtcbiAgfVxuXG4gIHJldHVybiB1cmw7XG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9saWIvYnVpbGRVcmwuanNcbiAqKiBtb2R1bGUgaWQgPSAyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbnZhciBtZXJnZSA9IHJlcXVpcmUoJy4vbWVyZ2UnKTtcblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbnZhciBKU09OX1NUQVJUID0gL15cXHMqKFxcW3xcXHtbXlxce10pLztcbnZhciBKU09OX0VORCA9IC9bXFx9XFxdXVxccyokLztcbnZhciBQUk9URUNUSU9OX1BSRUZJWCA9IC9eXFwpXFxdXFx9Jyw/XFxuLztcbnZhciBDT05URU5UX1RZUEVfQVBQTElDQVRJT05fSlNPTiA9IHtcbiAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTgnXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgdHJhbnNmb3JtUmVxdWVzdDogW2Z1bmN0aW9uIChkYXRhKSB7XG4gICAgcmV0dXJuIGRhdGEgIT09IG51bGwgJiYgdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnICYmXG4gICAgICAgICAgdG9TdHJpbmcuY2FsbChkYXRhKSAhPT0gJ1tvYmplY3QgRmlsZV0nICYmXG4gICAgICAgICAgdG9TdHJpbmcuY2FsbChkYXRhKSAhPT0gJ1tvYmplY3QgQmxvYl0nID9cbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KGRhdGEpIDogbnVsbDtcbiAgfV0sXG5cbiAgdHJhbnNmb3JtUmVzcG9uc2U6IFtmdW5jdGlvbiAoZGF0YSkge1xuICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGRhdGEgPSBkYXRhLnJlcGxhY2UoUFJPVEVDVElPTl9QUkVGSVgsICcnKTtcbiAgICAgIGlmIChKU09OX1NUQVJULnRlc3QoZGF0YSkgJiYgSlNPTl9FTkQudGVzdChkYXRhKSkge1xuICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1dLFxuXG4gIGhlYWRlcnM6IHtcbiAgICBjb21tb246IHtcbiAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9wbGFpbiwgKi8qJ1xuICAgIH0sXG4gICAgcGF0Y2g6IG1lcmdlKENPTlRFTlRfVFlQRV9BUFBMSUNBVElPTl9KU09OKSxcbiAgICBwb3N0OiBtZXJnZShDT05URU5UX1RZUEVfQVBQTElDQVRJT05fSlNPTiksXG4gICAgcHV0OiBtZXJnZShDT05URU5UX1RZUEVfQVBQTElDQVRJT05fSlNPTilcbiAgfSxcblxuICB4c3JmQ29va2lOYW1lOiAnWFNSRi1UT0tFTicsXG4gIHhzcmZIZWFkZXJOYW1lOiAnWC1YU1JGLVRPS0VOJ1xufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vbGliL2RlZmF1bHRzLmpzXG4gKiogbW9kdWxlIGlkID0gM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEl0ZXJhdGUgb3ZlciBhbiBBcnJheSBvciBhbiBPYmplY3QgaW52b2tpbmcgYSBmdW5jdGlvbiBmb3IgZWFjaCBpdGVtLlxuICpcbiAqIElmIGBvYmpgIGlzIGFuIEFycmF5IG9yIGFyZ3VtZW50cyBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBwYXNzaW5nXG4gKiB0aGUgdmFsdWUsIGluZGV4LCBhbmQgY29tcGxldGUgYXJyYXkgZm9yIGVhY2ggaXRlbS5cbiAqXG4gKiBJZiAnb2JqJyBpcyBhbiBPYmplY3QgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgcGFzc2luZ1xuICogdGhlIHZhbHVlLCBrZXksIGFuZCBjb21wbGV0ZSBvYmplY3QgZm9yIGVhY2ggcHJvcGVydHkuXG4gKlxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IG9iaiBUaGUgb2JqZWN0IHRvIGl0ZXJhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBjYWxsYmFjayB0byBpbnZva2UgZm9yIGVhY2ggaXRlbVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZvckVhY2gob2JqLCBmbikge1xuICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBJdGVyYXRlIG92ZXIgYXJyYXkgdmFsdWVzXG4gIGlmIChvYmouY29uc3RydWN0b3IgPT09IEFycmF5IHx8IHR5cGVvZiBvYmouY2FsbGVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgZm9yICh2YXIgaT0wLCBsPW9iai5sZW5ndGg7IGk8bDsgaSsrKSB7XG4gICAgICBmbi5jYWxsKG51bGwsIG9ialtpXSwgaSwgb2JqKTtcbiAgICB9XG4gIH1cbiAgLy8gSXRlcmF0ZSBvdmVyIG9iamVjdCBrZXlzXG4gIGVsc2Uge1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBmbi5jYWxsKG51bGwsIG9ialtrZXldLCBrZXksIG9iaik7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9saWIvZm9yRWFjaC5qc1xuICoqIG1vZHVsZSBpZCA9IDRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBmb3JFYWNoID0gcmVxdWlyZSgnLi9mb3JFYWNoJyk7XG5cbi8qKlxuICogQWNjZXB0cyB2YXJhcmdzIGV4cGVjdGluZyBlYWNoIGFyZ3VtZW50IHRvIGJlIGFuIG9iamVjdCwgdGhlblxuICogaW1tdXRhYmx5IG1lcmdlcyB0aGUgcHJvcGVydGllcyBvZiBlYWNoIG9iamVjdCBhbmQgcmV0dXJucyByZXN1bHQuXG4gKlxuICogV2hlbiBtdWx0aXBsZSBvYmplY3RzIGNvbnRhaW4gdGhlIHNhbWUga2V5IHRoZSBsYXRlciBvYmplY3QgaW5cbiAqIHRoZSBhcmd1bWVudHMgbGlzdCB3aWxsIHRha2UgcHJlY2VkZW5jZS5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqIGBgYGpzXG4gKiB2YXIgcmVzdWx0ID0gbWVyZ2Uoe2ZvbzogMTIzfSwge2ZvbzogNDU2fSk7XG4gKiBjb25zb2xlLmxvZyhyZXN1bHQuZm9vKTsgLy8gb3V0cHV0cyA0NTZcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmoxIE9iamVjdCB0byBtZXJnZVxuICogQHJldHVybnMge09iamVjdH0gUmVzdWx0IG9mIGFsbCBtZXJnZSBwcm9wZXJ0aWVzXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbWVyZ2Uob2JqMS8qLCBvYmoyLCBvYmozLCAuLi4qLykge1xuICB2YXIgcmVzdWx0ID0ge307XG4gIGZvckVhY2goYXJndW1lbnRzLCBmdW5jdGlvbiAob2JqKSB7XG4gICAgZm9yRWFjaChvYmosIGZ1bmN0aW9uICh2YWwsIGtleSkge1xuICAgICAgcmVzdWx0W2tleV0gPSB2YWw7XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vbGliL21lcmdlLmpzXG4gKiogbW9kdWxlIGlkID0gNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZm9yRWFjaCA9IHJlcXVpcmUoJy4vZm9yRWFjaCcpO1xuXG4vKipcbiAqIFRyYW5zZm9ybSB0aGUgZGF0YSBmb3IgYSByZXF1ZXN0IG9yIGEgcmVzcG9uc2VcbiAqXG4gKiBAcGFyYW0ge09iamVjdHxTdHJpbmd9IGRhdGEgVGhlIGRhdGEgdG8gYmUgdHJhbnNmb3JtZWRcbiAqIEBwYXJhbSB7QXJyYXl9IGhlYWRlcnMgVGhlIGhlYWRlcnMgZm9yIHRoZSByZXF1ZXN0IG9yIHJlc3BvbnNlXG4gKiBAcGFyYW0ge0FycmF5fEZ1bmN0aW9ufSBmbnMgQSBzaW5nbGUgZnVuY3Rpb24gb3IgQXJyYXkgb2YgZnVuY3Rpb25zXG4gKiBAcmV0dXJucyB7Kn0gVGhlIHJlc3VsdGluZyB0cmFuc2Zvcm1lZCBkYXRhXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdHJhbnNmb3JtRGF0YShkYXRhLCBoZWFkZXJzLCBmbnMpIHtcbiAgaWYgKHR5cGVvZiBmbnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gZm5zKGRhdGEsIGhlYWRlcnMpO1xuICB9XG5cbiAgZm9yRWFjaChmbnMsIGZ1bmN0aW9uIChmbikge1xuICAgIGRhdGEgPSBmbihkYXRhLCBoZWFkZXJzKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGRhdGE7XG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9saWIvdHJhbnNmb3JtRGF0YS5qc1xuICoqIG1vZHVsZSBpZCA9IDZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIlwidXNlIHN0cmljdFwiO1xudmFyIFByb21pc2UgPSByZXF1aXJlKFwiLi9wcm9taXNlL3Byb21pc2VcIikuUHJvbWlzZTtcbnZhciBwb2x5ZmlsbCA9IHJlcXVpcmUoXCIuL3Byb21pc2UvcG9seWZpbGxcIikucG9seWZpbGw7XG5leHBvcnRzLlByb21pc2UgPSBQcm9taXNlO1xuZXhwb3J0cy5wb2x5ZmlsbCA9IHBvbHlmaWxsO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2VzNi1wcm9taXNlL2Rpc3QvY29tbW9uanMvbWFpbi5qc1xuICoqIG1vZHVsZSBpZCA9IDdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIlwidXNlIHN0cmljdFwiO1xudmFyIGNvbmZpZyA9IHJlcXVpcmUoXCIuL2NvbmZpZ1wiKS5jb25maWc7XG52YXIgY29uZmlndXJlID0gcmVxdWlyZShcIi4vY29uZmlnXCIpLmNvbmZpZ3VyZTtcbnZhciBvYmplY3RPckZ1bmN0aW9uID0gcmVxdWlyZShcIi4vdXRpbHNcIikub2JqZWN0T3JGdW5jdGlvbjtcbnZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZShcIi4vdXRpbHNcIikuaXNGdW5jdGlvbjtcbnZhciBub3cgPSByZXF1aXJlKFwiLi91dGlsc1wiKS5ub3c7XG52YXIgYWxsID0gcmVxdWlyZShcIi4vYWxsXCIpLmFsbDtcbnZhciByYWNlID0gcmVxdWlyZShcIi4vcmFjZVwiKS5yYWNlO1xudmFyIHN0YXRpY1Jlc29sdmUgPSByZXF1aXJlKFwiLi9yZXNvbHZlXCIpLnJlc29sdmU7XG52YXIgc3RhdGljUmVqZWN0ID0gcmVxdWlyZShcIi4vcmVqZWN0XCIpLnJlamVjdDtcbnZhciBhc2FwID0gcmVxdWlyZShcIi4vYXNhcFwiKS5hc2FwO1xuXG52YXIgY291bnRlciA9IDA7XG5cbmNvbmZpZy5hc3luYyA9IGFzYXA7IC8vIGRlZmF1bHQgYXN5bmMgaXMgYXNhcDtcblxuZnVuY3Rpb24gUHJvbWlzZShyZXNvbHZlcikge1xuICBpZiAoIWlzRnVuY3Rpb24ocmVzb2x2ZXIpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignWW91IG11c3QgcGFzcyBhIHJlc29sdmVyIGZ1bmN0aW9uIGFzIHRoZSBmaXJzdCBhcmd1bWVudCB0byB0aGUgcHJvbWlzZSBjb25zdHJ1Y3RvcicpO1xuICB9XG5cbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFByb21pc2UpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkZhaWxlZCB0byBjb25zdHJ1Y3QgJ1Byb21pc2UnOiBQbGVhc2UgdXNlIHRoZSAnbmV3JyBvcGVyYXRvciwgdGhpcyBvYmplY3QgY29uc3RydWN0b3IgY2Fubm90IGJlIGNhbGxlZCBhcyBhIGZ1bmN0aW9uLlwiKTtcbiAgfVxuXG4gIHRoaXMuX3N1YnNjcmliZXJzID0gW107XG5cbiAgaW52b2tlUmVzb2x2ZXIocmVzb2x2ZXIsIHRoaXMpO1xufVxuXG5mdW5jdGlvbiBpbnZva2VSZXNvbHZlcihyZXNvbHZlciwgcHJvbWlzZSkge1xuICBmdW5jdGlvbiByZXNvbHZlUHJvbWlzZSh2YWx1ZSkge1xuICAgIHJlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVqZWN0UHJvbWlzZShyZWFzb24pIHtcbiAgICByZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgcmVzb2x2ZXIocmVzb2x2ZVByb21pc2UsIHJlamVjdFByb21pc2UpO1xuICB9IGNhdGNoKGUpIHtcbiAgICByZWplY3RQcm9taXNlKGUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGludm9rZUNhbGxiYWNrKHNldHRsZWQsIHByb21pc2UsIGNhbGxiYWNrLCBkZXRhaWwpIHtcbiAgdmFyIGhhc0NhbGxiYWNrID0gaXNGdW5jdGlvbihjYWxsYmFjayksXG4gICAgICB2YWx1ZSwgZXJyb3IsIHN1Y2NlZWRlZCwgZmFpbGVkO1xuXG4gIGlmIChoYXNDYWxsYmFjaykge1xuICAgIHRyeSB7XG4gICAgICB2YWx1ZSA9IGNhbGxiYWNrKGRldGFpbCk7XG4gICAgICBzdWNjZWVkZWQgPSB0cnVlO1xuICAgIH0gY2F0Y2goZSkge1xuICAgICAgZmFpbGVkID0gdHJ1ZTtcbiAgICAgIGVycm9yID0gZTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFsdWUgPSBkZXRhaWw7XG4gICAgc3VjY2VlZGVkID0gdHJ1ZTtcbiAgfVxuXG4gIGlmIChoYW5kbGVUaGVuYWJsZShwcm9taXNlLCB2YWx1ZSkpIHtcbiAgICByZXR1cm47XG4gIH0gZWxzZSBpZiAoaGFzQ2FsbGJhY2sgJiYgc3VjY2VlZGVkKSB7XG4gICAgcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gIH0gZWxzZSBpZiAoZmFpbGVkKSB7XG4gICAgcmVqZWN0KHByb21pc2UsIGVycm9yKTtcbiAgfSBlbHNlIGlmIChzZXR0bGVkID09PSBGVUxGSUxMRUQpIHtcbiAgICByZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgfSBlbHNlIGlmIChzZXR0bGVkID09PSBSRUpFQ1RFRCkge1xuICAgIHJlamVjdChwcm9taXNlLCB2YWx1ZSk7XG4gIH1cbn1cblxudmFyIFBFTkRJTkcgICA9IHZvaWQgMDtcbnZhciBTRUFMRUQgICAgPSAwO1xudmFyIEZVTEZJTExFRCA9IDE7XG52YXIgUkVKRUNURUQgID0gMjtcblxuZnVuY3Rpb24gc3Vic2NyaWJlKHBhcmVudCwgY2hpbGQsIG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKSB7XG4gIHZhciBzdWJzY3JpYmVycyA9IHBhcmVudC5fc3Vic2NyaWJlcnM7XG4gIHZhciBsZW5ndGggPSBzdWJzY3JpYmVycy5sZW5ndGg7XG5cbiAgc3Vic2NyaWJlcnNbbGVuZ3RoXSA9IGNoaWxkO1xuICBzdWJzY3JpYmVyc1tsZW5ndGggKyBGVUxGSUxMRURdID0gb25GdWxmaWxsbWVudDtcbiAgc3Vic2NyaWJlcnNbbGVuZ3RoICsgUkVKRUNURURdICA9IG9uUmVqZWN0aW9uO1xufVxuXG5mdW5jdGlvbiBwdWJsaXNoKHByb21pc2UsIHNldHRsZWQpIHtcbiAgdmFyIGNoaWxkLCBjYWxsYmFjaywgc3Vic2NyaWJlcnMgPSBwcm9taXNlLl9zdWJzY3JpYmVycywgZGV0YWlsID0gcHJvbWlzZS5fZGV0YWlsO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3Vic2NyaWJlcnMubGVuZ3RoOyBpICs9IDMpIHtcbiAgICBjaGlsZCA9IHN1YnNjcmliZXJzW2ldO1xuICAgIGNhbGxiYWNrID0gc3Vic2NyaWJlcnNbaSArIHNldHRsZWRdO1xuXG4gICAgaW52b2tlQ2FsbGJhY2soc2V0dGxlZCwgY2hpbGQsIGNhbGxiYWNrLCBkZXRhaWwpO1xuICB9XG5cbiAgcHJvbWlzZS5fc3Vic2NyaWJlcnMgPSBudWxsO1xufVxuXG5Qcm9taXNlLnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IFByb21pc2UsXG5cbiAgX3N0YXRlOiB1bmRlZmluZWQsXG4gIF9kZXRhaWw6IHVuZGVmaW5lZCxcbiAgX3N1YnNjcmliZXJzOiB1bmRlZmluZWQsXG5cbiAgdGhlbjogZnVuY3Rpb24ob25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24pIHtcbiAgICB2YXIgcHJvbWlzZSA9IHRoaXM7XG5cbiAgICB2YXIgdGhlblByb21pc2UgPSBuZXcgdGhpcy5jb25zdHJ1Y3RvcihmdW5jdGlvbigpIHt9KTtcblxuICAgIGlmICh0aGlzLl9zdGF0ZSkge1xuICAgICAgdmFyIGNhbGxiYWNrcyA9IGFyZ3VtZW50cztcbiAgICAgIGNvbmZpZy5hc3luYyhmdW5jdGlvbiBpbnZva2VQcm9taXNlQ2FsbGJhY2soKSB7XG4gICAgICAgIGludm9rZUNhbGxiYWNrKHByb21pc2UuX3N0YXRlLCB0aGVuUHJvbWlzZSwgY2FsbGJhY2tzW3Byb21pc2UuX3N0YXRlIC0gMV0sIHByb21pc2UuX2RldGFpbCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3Vic2NyaWJlKHRoaXMsIHRoZW5Qcm9taXNlLCBvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoZW5Qcm9taXNlO1xuICB9LFxuXG4gICdjYXRjaCc6IGZ1bmN0aW9uKG9uUmVqZWN0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMudGhlbihudWxsLCBvblJlamVjdGlvbik7XG4gIH1cbn07XG5cblByb21pc2UuYWxsID0gYWxsO1xuUHJvbWlzZS5yYWNlID0gcmFjZTtcblByb21pc2UucmVzb2x2ZSA9IHN0YXRpY1Jlc29sdmU7XG5Qcm9taXNlLnJlamVjdCA9IHN0YXRpY1JlamVjdDtcblxuZnVuY3Rpb24gaGFuZGxlVGhlbmFibGUocHJvbWlzZSwgdmFsdWUpIHtcbiAgdmFyIHRoZW4gPSBudWxsLFxuICByZXNvbHZlZDtcblxuICB0cnkge1xuICAgIGlmIChwcm9taXNlID09PSB2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkEgcHJvbWlzZXMgY2FsbGJhY2sgY2Fubm90IHJldHVybiB0aGF0IHNhbWUgcHJvbWlzZS5cIik7XG4gICAgfVxuXG4gICAgaWYgKG9iamVjdE9yRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICB0aGVuID0gdmFsdWUudGhlbjtcblxuICAgICAgaWYgKGlzRnVuY3Rpb24odGhlbikpIHtcbiAgICAgICAgdGhlbi5jYWxsKHZhbHVlLCBmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICBpZiAocmVzb2x2ZWQpIHsgcmV0dXJuIHRydWU7IH1cbiAgICAgICAgICByZXNvbHZlZCA9IHRydWU7XG5cbiAgICAgICAgICBpZiAodmFsdWUgIT09IHZhbCkge1xuICAgICAgICAgICAgcmVzb2x2ZShwcm9taXNlLCB2YWwpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmdWxmaWxsKHByb21pc2UsIHZhbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICBpZiAocmVzb2x2ZWQpIHsgcmV0dXJuIHRydWU7IH1cbiAgICAgICAgICByZXNvbHZlZCA9IHRydWU7XG5cbiAgICAgICAgICByZWplY3QocHJvbWlzZSwgdmFsKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGlmIChyZXNvbHZlZCkgeyByZXR1cm4gdHJ1ZTsgfVxuICAgIHJlamVjdChwcm9taXNlLCBlcnJvcik7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIHJlc29sdmUocHJvbWlzZSwgdmFsdWUpIHtcbiAgaWYgKHByb21pc2UgPT09IHZhbHVlKSB7XG4gICAgZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XG4gIH0gZWxzZSBpZiAoIWhhbmRsZVRoZW5hYmxlKHByb21pc2UsIHZhbHVlKSkge1xuICAgIGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpIHtcbiAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBQRU5ESU5HKSB7IHJldHVybjsgfVxuICBwcm9taXNlLl9zdGF0ZSA9IFNFQUxFRDtcbiAgcHJvbWlzZS5fZGV0YWlsID0gdmFsdWU7XG5cbiAgY29uZmlnLmFzeW5jKHB1Ymxpc2hGdWxmaWxsbWVudCwgcHJvbWlzZSk7XG59XG5cbmZ1bmN0aW9uIHJlamVjdChwcm9taXNlLCByZWFzb24pIHtcbiAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBQRU5ESU5HKSB7IHJldHVybjsgfVxuICBwcm9taXNlLl9zdGF0ZSA9IFNFQUxFRDtcbiAgcHJvbWlzZS5fZGV0YWlsID0gcmVhc29uO1xuXG4gIGNvbmZpZy5hc3luYyhwdWJsaXNoUmVqZWN0aW9uLCBwcm9taXNlKTtcbn1cblxuZnVuY3Rpb24gcHVibGlzaEZ1bGZpbGxtZW50KHByb21pc2UpIHtcbiAgcHVibGlzaChwcm9taXNlLCBwcm9taXNlLl9zdGF0ZSA9IEZVTEZJTExFRCk7XG59XG5cbmZ1bmN0aW9uIHB1Ymxpc2hSZWplY3Rpb24ocHJvbWlzZSkge1xuICBwdWJsaXNoKHByb21pc2UsIHByb21pc2UuX3N0YXRlID0gUkVKRUNURUQpO1xufVxuXG5leHBvcnRzLlByb21pc2UgPSBQcm9taXNlO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2VzNi1wcm9taXNlL2Rpc3QvY29tbW9uanMvcHJvbWlzZS9wcm9taXNlLmpzXG4gKiogbW9kdWxlIGlkID0gOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKmdsb2JhbCBzZWxmKi9cbnZhciBSU1ZQUHJvbWlzZSA9IHJlcXVpcmUoXCIuL3Byb21pc2VcIikuUHJvbWlzZTtcbnZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZShcIi4vdXRpbHNcIikuaXNGdW5jdGlvbjtcblxuZnVuY3Rpb24gcG9seWZpbGwoKSB7XG4gIHZhciBsb2NhbDtcblxuICBpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBsb2NhbCA9IGdsb2JhbDtcbiAgfSBlbHNlIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuZG9jdW1lbnQpIHtcbiAgICBsb2NhbCA9IHdpbmRvdztcbiAgfSBlbHNlIHtcbiAgICBsb2NhbCA9IHNlbGY7XG4gIH1cblxuICB2YXIgZXM2UHJvbWlzZVN1cHBvcnQgPSBcbiAgICBcIlByb21pc2VcIiBpbiBsb2NhbCAmJlxuICAgIC8vIFNvbWUgb2YgdGhlc2UgbWV0aG9kcyBhcmUgbWlzc2luZyBmcm9tXG4gICAgLy8gRmlyZWZveC9DaHJvbWUgZXhwZXJpbWVudGFsIGltcGxlbWVudGF0aW9uc1xuICAgIFwicmVzb2x2ZVwiIGluIGxvY2FsLlByb21pc2UgJiZcbiAgICBcInJlamVjdFwiIGluIGxvY2FsLlByb21pc2UgJiZcbiAgICBcImFsbFwiIGluIGxvY2FsLlByb21pc2UgJiZcbiAgICBcInJhY2VcIiBpbiBsb2NhbC5Qcm9taXNlICYmXG4gICAgLy8gT2xkZXIgdmVyc2lvbiBvZiB0aGUgc3BlYyBoYWQgYSByZXNvbHZlciBvYmplY3RcbiAgICAvLyBhcyB0aGUgYXJnIHJhdGhlciB0aGFuIGEgZnVuY3Rpb25cbiAgICAoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmVzb2x2ZTtcbiAgICAgIG5ldyBsb2NhbC5Qcm9taXNlKGZ1bmN0aW9uKHIpIHsgcmVzb2x2ZSA9IHI7IH0pO1xuICAgICAgcmV0dXJuIGlzRnVuY3Rpb24ocmVzb2x2ZSk7XG4gICAgfSgpKTtcblxuICBpZiAoIWVzNlByb21pc2VTdXBwb3J0KSB7XG4gICAgbG9jYWwuUHJvbWlzZSA9IFJTVlBQcm9taXNlO1xuICB9XG59XG5cbmV4cG9ydHMucG9seWZpbGwgPSBwb2x5ZmlsbDtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9lczYtcHJvbWlzZS9kaXN0L2NvbW1vbmpzL3Byb21pc2UvcG9seWZpbGwuanNcbiAqKiBtb2R1bGUgaWQgPSA5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBjb25maWcgPSB7XG4gIGluc3RydW1lbnQ6IGZhbHNlXG59O1xuXG5mdW5jdGlvbiBjb25maWd1cmUobmFtZSwgdmFsdWUpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICBjb25maWdbbmFtZV0gPSB2YWx1ZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gY29uZmlnW25hbWVdO1xuICB9XG59XG5cbmV4cG9ydHMuY29uZmlnID0gY29uZmlnO1xuZXhwb3J0cy5jb25maWd1cmUgPSBjb25maWd1cmU7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vZXM2LXByb21pc2UvZGlzdC9jb21tb25qcy9wcm9taXNlL2NvbmZpZy5qc1xuICoqIG1vZHVsZSBpZCA9IDEwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJcInVzZSBzdHJpY3RcIjtcbmZ1bmN0aW9uIG9iamVjdE9yRnVuY3Rpb24oeCkge1xuICByZXR1cm4gaXNGdW5jdGlvbih4KSB8fCAodHlwZW9mIHggPT09IFwib2JqZWN0XCIgJiYgeCAhPT0gbnVsbCk7XG59XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oeCkge1xuICByZXR1cm4gdHlwZW9mIHggPT09IFwiZnVuY3Rpb25cIjtcbn1cblxuZnVuY3Rpb24gaXNBcnJheSh4KSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeCkgPT09IFwiW29iamVjdCBBcnJheV1cIjtcbn1cblxuLy8gRGF0ZS5ub3cgaXMgbm90IGF2YWlsYWJsZSBpbiBicm93c2VycyA8IElFOVxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvRGF0ZS9ub3cjQ29tcGF0aWJpbGl0eVxudmFyIG5vdyA9IERhdGUubm93IHx8IGZ1bmN0aW9uKCkgeyByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7IH07XG5cblxuZXhwb3J0cy5vYmplY3RPckZ1bmN0aW9uID0gb2JqZWN0T3JGdW5jdGlvbjtcbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuZXhwb3J0cy5ub3cgPSBub3c7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vZXM2LXByb21pc2UvZGlzdC9jb21tb25qcy9wcm9taXNlL3V0aWxzLmpzXG4gKiogbW9kdWxlIGlkID0gMTFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIlwidXNlIHN0cmljdFwiO1xuLyogZ2xvYmFsIHRvU3RyaW5nICovXG5cbnZhciBpc0FycmF5ID0gcmVxdWlyZShcIi4vdXRpbHNcIikuaXNBcnJheTtcbnZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZShcIi4vdXRpbHNcIikuaXNGdW5jdGlvbjtcblxuLyoqXG4gIFJldHVybnMgYSBwcm9taXNlIHRoYXQgaXMgZnVsZmlsbGVkIHdoZW4gYWxsIHRoZSBnaXZlbiBwcm9taXNlcyBoYXZlIGJlZW5cbiAgZnVsZmlsbGVkLCBvciByZWplY3RlZCBpZiBhbnkgb2YgdGhlbSBiZWNvbWUgcmVqZWN0ZWQuIFRoZSByZXR1cm4gcHJvbWlzZVxuICBpcyBmdWxmaWxsZWQgd2l0aCBhbiBhcnJheSB0aGF0IGdpdmVzIGFsbCB0aGUgdmFsdWVzIGluIHRoZSBvcmRlciB0aGV5IHdlcmVcbiAgcGFzc2VkIGluIHRoZSBgcHJvbWlzZXNgIGFycmF5IGFyZ3VtZW50LlxuXG4gIEV4YW1wbGU6XG5cbiAgYGBgamF2YXNjcmlwdFxuICB2YXIgcHJvbWlzZTEgPSBSU1ZQLnJlc29sdmUoMSk7XG4gIHZhciBwcm9taXNlMiA9IFJTVlAucmVzb2x2ZSgyKTtcbiAgdmFyIHByb21pc2UzID0gUlNWUC5yZXNvbHZlKDMpO1xuICB2YXIgcHJvbWlzZXMgPSBbIHByb21pc2UxLCBwcm9taXNlMiwgcHJvbWlzZTMgXTtcblxuICBSU1ZQLmFsbChwcm9taXNlcykudGhlbihmdW5jdGlvbihhcnJheSl7XG4gICAgLy8gVGhlIGFycmF5IGhlcmUgd291bGQgYmUgWyAxLCAyLCAzIF07XG4gIH0pO1xuICBgYGBcblxuICBJZiBhbnkgb2YgdGhlIGBwcm9taXNlc2AgZ2l2ZW4gdG8gYFJTVlAuYWxsYCBhcmUgcmVqZWN0ZWQsIHRoZSBmaXJzdCBwcm9taXNlXG4gIHRoYXQgaXMgcmVqZWN0ZWQgd2lsbCBiZSBnaXZlbiBhcyBhbiBhcmd1bWVudCB0byB0aGUgcmV0dXJuZWQgcHJvbWlzZXMnc1xuICByZWplY3Rpb24gaGFuZGxlci4gRm9yIGV4YW1wbGU6XG5cbiAgRXhhbXBsZTpcblxuICBgYGBqYXZhc2NyaXB0XG4gIHZhciBwcm9taXNlMSA9IFJTVlAucmVzb2x2ZSgxKTtcbiAgdmFyIHByb21pc2UyID0gUlNWUC5yZWplY3QobmV3IEVycm9yKFwiMlwiKSk7XG4gIHZhciBwcm9taXNlMyA9IFJTVlAucmVqZWN0KG5ldyBFcnJvcihcIjNcIikpO1xuICB2YXIgcHJvbWlzZXMgPSBbIHByb21pc2UxLCBwcm9taXNlMiwgcHJvbWlzZTMgXTtcblxuICBSU1ZQLmFsbChwcm9taXNlcykudGhlbihmdW5jdGlvbihhcnJheSl7XG4gICAgLy8gQ29kZSBoZXJlIG5ldmVyIHJ1bnMgYmVjYXVzZSB0aGVyZSBhcmUgcmVqZWN0ZWQgcHJvbWlzZXMhXG4gIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgLy8gZXJyb3IubWVzc2FnZSA9PT0gXCIyXCJcbiAgfSk7XG4gIGBgYFxuXG4gIEBtZXRob2QgYWxsXG4gIEBmb3IgUlNWUFxuICBAcGFyYW0ge0FycmF5fSBwcm9taXNlc1xuICBAcGFyYW0ge1N0cmluZ30gbGFiZWxcbiAgQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSB0aGF0IGlzIGZ1bGZpbGxlZCB3aGVuIGFsbCBgcHJvbWlzZXNgIGhhdmUgYmVlblxuICBmdWxmaWxsZWQsIG9yIHJlamVjdGVkIGlmIGFueSBvZiB0aGVtIGJlY29tZSByZWplY3RlZC5cbiovXG5mdW5jdGlvbiBhbGwocHJvbWlzZXMpIHtcbiAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgdmFyIFByb21pc2UgPSB0aGlzO1xuXG4gIGlmICghaXNBcnJheShwcm9taXNlcykpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdZb3UgbXVzdCBwYXNzIGFuIGFycmF5IHRvIGFsbC4nKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgcmVzdWx0cyA9IFtdLCByZW1haW5pbmcgPSBwcm9taXNlcy5sZW5ndGgsXG4gICAgcHJvbWlzZTtcblxuICAgIGlmIChyZW1haW5pbmcgPT09IDApIHtcbiAgICAgIHJlc29sdmUoW10pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlc29sdmVyKGluZGV4KSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmVzb2x2ZUFsbChpbmRleCwgdmFsdWUpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXNvbHZlQWxsKGluZGV4LCB2YWx1ZSkge1xuICAgICAgcmVzdWx0c1tpbmRleF0gPSB2YWx1ZTtcbiAgICAgIGlmICgtLXJlbWFpbmluZyA9PT0gMCkge1xuICAgICAgICByZXNvbHZlKHJlc3VsdHMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvbWlzZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlc1tpXTtcblxuICAgICAgaWYgKHByb21pc2UgJiYgaXNGdW5jdGlvbihwcm9taXNlLnRoZW4pKSB7XG4gICAgICAgIHByb21pc2UudGhlbihyZXNvbHZlcihpKSwgcmVqZWN0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc29sdmVBbGwoaSwgcHJvbWlzZSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0cy5hbGwgPSBhbGw7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vZXM2LXByb21pc2UvZGlzdC9jb21tb25qcy9wcm9taXNlL2FsbC5qc1xuICoqIG1vZHVsZSBpZCA9IDEyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJcInVzZSBzdHJpY3RcIjtcbi8qIGdsb2JhbCB0b1N0cmluZyAqL1xudmFyIGlzQXJyYXkgPSByZXF1aXJlKFwiLi91dGlsc1wiKS5pc0FycmF5O1xuXG4vKipcbiAgYFJTVlAucmFjZWAgYWxsb3dzIHlvdSB0byB3YXRjaCBhIHNlcmllcyBvZiBwcm9taXNlcyBhbmQgYWN0IGFzIHNvb24gYXMgdGhlXG4gIGZpcnN0IHByb21pc2UgZ2l2ZW4gdG8gdGhlIGBwcm9taXNlc2AgYXJndW1lbnQgZnVsZmlsbHMgb3IgcmVqZWN0cy5cblxuICBFeGFtcGxlOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgdmFyIHByb21pc2UxID0gbmV3IFJTVlAuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJlc29sdmUoXCJwcm9taXNlIDFcIik7XG4gICAgfSwgMjAwKTtcbiAgfSk7XG5cbiAgdmFyIHByb21pc2UyID0gbmV3IFJTVlAuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJlc29sdmUoXCJwcm9taXNlIDJcIik7XG4gICAgfSwgMTAwKTtcbiAgfSk7XG5cbiAgUlNWUC5yYWNlKFtwcm9taXNlMSwgcHJvbWlzZTJdKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgLy8gcmVzdWx0ID09PSBcInByb21pc2UgMlwiIGJlY2F1c2UgaXQgd2FzIHJlc29sdmVkIGJlZm9yZSBwcm9taXNlMVxuICAgIC8vIHdhcyByZXNvbHZlZC5cbiAgfSk7XG4gIGBgYFxuXG4gIGBSU1ZQLnJhY2VgIGlzIGRldGVybWluaXN0aWMgaW4gdGhhdCBvbmx5IHRoZSBzdGF0ZSBvZiB0aGUgZmlyc3QgY29tcGxldGVkXG4gIHByb21pc2UgbWF0dGVycy4gRm9yIGV4YW1wbGUsIGV2ZW4gaWYgb3RoZXIgcHJvbWlzZXMgZ2l2ZW4gdG8gdGhlIGBwcm9taXNlc2BcbiAgYXJyYXkgYXJndW1lbnQgYXJlIHJlc29sdmVkLCBidXQgdGhlIGZpcnN0IGNvbXBsZXRlZCBwcm9taXNlIGhhcyBiZWNvbWVcbiAgcmVqZWN0ZWQgYmVmb3JlIHRoZSBvdGhlciBwcm9taXNlcyBiZWNhbWUgZnVsZmlsbGVkLCB0aGUgcmV0dXJuZWQgcHJvbWlzZVxuICB3aWxsIGJlY29tZSByZWplY3RlZDpcblxuICBgYGBqYXZhc2NyaXB0XG4gIHZhciBwcm9taXNlMSA9IG5ldyBSU1ZQLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZXNvbHZlKFwicHJvbWlzZSAxXCIpO1xuICAgIH0sIDIwMCk7XG4gIH0pO1xuXG4gIHZhciBwcm9taXNlMiA9IG5ldyBSU1ZQLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZWplY3QobmV3IEVycm9yKFwicHJvbWlzZSAyXCIpKTtcbiAgICB9LCAxMDApO1xuICB9KTtcblxuICBSU1ZQLnJhY2UoW3Byb21pc2UxLCBwcm9taXNlMl0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAvLyBDb2RlIGhlcmUgbmV2ZXIgcnVucyBiZWNhdXNlIHRoZXJlIGFyZSByZWplY3RlZCBwcm9taXNlcyFcbiAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAvLyByZWFzb24ubWVzc2FnZSA9PT0gXCJwcm9taXNlMlwiIGJlY2F1c2UgcHJvbWlzZSAyIGJlY2FtZSByZWplY3RlZCBiZWZvcmVcbiAgICAvLyBwcm9taXNlIDEgYmVjYW1lIGZ1bGZpbGxlZFxuICB9KTtcbiAgYGBgXG5cbiAgQG1ldGhvZCByYWNlXG4gIEBmb3IgUlNWUFxuICBAcGFyYW0ge0FycmF5fSBwcm9taXNlcyBhcnJheSBvZiBwcm9taXNlcyB0byBvYnNlcnZlXG4gIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCBvcHRpb25hbCBzdHJpbmcgZm9yIGRlc2NyaWJpbmcgdGhlIHByb21pc2UgcmV0dXJuZWQuXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQHJldHVybiB7UHJvbWlzZX0gYSBwcm9taXNlIHRoYXQgYmVjb21lcyBmdWxmaWxsZWQgd2l0aCB0aGUgdmFsdWUgdGhlIGZpcnN0XG4gIGNvbXBsZXRlZCBwcm9taXNlcyBpcyByZXNvbHZlZCB3aXRoIGlmIHRoZSBmaXJzdCBjb21wbGV0ZWQgcHJvbWlzZSB3YXNcbiAgZnVsZmlsbGVkLCBvciByZWplY3RlZCB3aXRoIHRoZSByZWFzb24gdGhhdCB0aGUgZmlyc3QgY29tcGxldGVkIHByb21pc2VcbiAgd2FzIHJlamVjdGVkIHdpdGguXG4qL1xuZnVuY3Rpb24gcmFjZShwcm9taXNlcykge1xuICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICB2YXIgUHJvbWlzZSA9IHRoaXM7XG5cbiAgaWYgKCFpc0FycmF5KHByb21pc2VzKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1lvdSBtdXN0IHBhc3MgYW4gYXJyYXkgdG8gcmFjZS4nKTtcbiAgfVxuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIHJlc3VsdHMgPSBbXSwgcHJvbWlzZTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvbWlzZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlc1tpXTtcblxuICAgICAgaWYgKHByb21pc2UgJiYgdHlwZW9mIHByb21pc2UudGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBwcm9taXNlLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc29sdmUocHJvbWlzZSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0cy5yYWNlID0gcmFjZTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9lczYtcHJvbWlzZS9kaXN0L2NvbW1vbmpzL3Byb21pc2UvcmFjZS5qc1xuICoqIG1vZHVsZSBpZCA9IDEzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJcInVzZSBzdHJpY3RcIjtcbmZ1bmN0aW9uIHJlc29sdmUodmFsdWUpIHtcbiAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUuY29uc3RydWN0b3IgPT09IHRoaXMpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICB2YXIgUHJvbWlzZSA9IHRoaXM7XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICByZXNvbHZlKHZhbHVlKTtcbiAgfSk7XG59XG5cbmV4cG9ydHMucmVzb2x2ZSA9IHJlc29sdmU7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vZXM2LXByb21pc2UvZGlzdC9jb21tb25qcy9wcm9taXNlL3Jlc29sdmUuanNcbiAqKiBtb2R1bGUgaWQgPSAxNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKipcbiAgYFJTVlAucmVqZWN0YCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHdpbGwgYmVjb21lIHJlamVjdGVkIHdpdGggdGhlIHBhc3NlZFxuICBgcmVhc29uYC4gYFJTVlAucmVqZWN0YCBpcyBlc3NlbnRpYWxseSBzaG9ydGhhbmQgZm9yIHRoZSBmb2xsb3dpbmc6XG5cbiAgYGBgamF2YXNjcmlwdFxuICB2YXIgcHJvbWlzZSA9IG5ldyBSU1ZQLlByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICByZWplY3QobmV3IEVycm9yKCdXSE9PUFMnKSk7XG4gIH0pO1xuXG4gIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgLy8gQ29kZSBoZXJlIGRvZXNuJ3QgcnVuIGJlY2F1c2UgdGhlIHByb21pc2UgaXMgcmVqZWN0ZWQhXG4gIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgLy8gcmVhc29uLm1lc3NhZ2UgPT09ICdXSE9PUFMnXG4gIH0pO1xuICBgYGBcblxuICBJbnN0ZWFkIG9mIHdyaXRpbmcgdGhlIGFib3ZlLCB5b3VyIGNvZGUgbm93IHNpbXBseSBiZWNvbWVzIHRoZSBmb2xsb3dpbmc6XG5cbiAgYGBgamF2YXNjcmlwdFxuICB2YXIgcHJvbWlzZSA9IFJTVlAucmVqZWN0KG5ldyBFcnJvcignV0hPT1BTJykpO1xuXG4gIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgLy8gQ29kZSBoZXJlIGRvZXNuJ3QgcnVuIGJlY2F1c2UgdGhlIHByb21pc2UgaXMgcmVqZWN0ZWQhXG4gIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgLy8gcmVhc29uLm1lc3NhZ2UgPT09ICdXSE9PUFMnXG4gIH0pO1xuICBgYGBcblxuICBAbWV0aG9kIHJlamVjdFxuICBAZm9yIFJTVlBcbiAgQHBhcmFtIHtBbnl9IHJlYXNvbiB2YWx1ZSB0aGF0IHRoZSByZXR1cm5lZCBwcm9taXNlIHdpbGwgYmUgcmVqZWN0ZWQgd2l0aC5cbiAgQHBhcmFtIHtTdHJpbmd9IGxhYmVsIG9wdGlvbmFsIHN0cmluZyBmb3IgaWRlbnRpZnlpbmcgdGhlIHJldHVybmVkIHByb21pc2UuXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQHJldHVybiB7UHJvbWlzZX0gYSBwcm9taXNlIHRoYXQgd2lsbCBiZWNvbWUgcmVqZWN0ZWQgd2l0aCB0aGUgZ2l2ZW5cbiAgYHJlYXNvbmAuXG4qL1xuZnVuY3Rpb24gcmVqZWN0KHJlYXNvbikge1xuICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICB2YXIgUHJvbWlzZSA9IHRoaXM7XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICByZWplY3QocmVhc29uKTtcbiAgfSk7XG59XG5cbmV4cG9ydHMucmVqZWN0ID0gcmVqZWN0O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2VzNi1wcm9taXNlL2Rpc3QvY29tbW9uanMvcHJvbWlzZS9yZWplY3QuanNcbiAqKiBtb2R1bGUgaWQgPSAxNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgYnJvd3Nlckdsb2JhbCA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykgPyB3aW5kb3cgOiB7fTtcbnZhciBCcm93c2VyTXV0YXRpb25PYnNlcnZlciA9IGJyb3dzZXJHbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBicm93c2VyR2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG52YXIgbG9jYWwgPSAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpID8gZ2xvYmFsIDogKHRoaXMgPT09IHVuZGVmaW5lZD8gd2luZG93OnRoaXMpO1xuXG4vLyBub2RlXG5mdW5jdGlvbiB1c2VOZXh0VGljaygpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHByb2Nlc3MubmV4dFRpY2soZmx1c2gpO1xuICB9O1xufVxuXG5mdW5jdGlvbiB1c2VNdXRhdGlvbk9ic2VydmVyKCkge1xuICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gIHZhciBvYnNlcnZlciA9IG5ldyBCcm93c2VyTXV0YXRpb25PYnNlcnZlcihmbHVzaCk7XG4gIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xuICBvYnNlcnZlci5vYnNlcnZlKG5vZGUsIHsgY2hhcmFjdGVyRGF0YTogdHJ1ZSB9KTtcblxuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgbm9kZS5kYXRhID0gKGl0ZXJhdGlvbnMgPSArK2l0ZXJhdGlvbnMgJSAyKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdXNlU2V0VGltZW91dCgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGxvY2FsLnNldFRpbWVvdXQoZmx1c2gsIDEpO1xuICB9O1xufVxuXG52YXIgcXVldWUgPSBbXTtcbmZ1bmN0aW9uIGZsdXNoKCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHF1ZXVlLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHR1cGxlID0gcXVldWVbaV07XG4gICAgdmFyIGNhbGxiYWNrID0gdHVwbGVbMF0sIGFyZyA9IHR1cGxlWzFdO1xuICAgIGNhbGxiYWNrKGFyZyk7XG4gIH1cbiAgcXVldWUgPSBbXTtcbn1cblxudmFyIHNjaGVkdWxlRmx1c2g7XG5cbi8vIERlY2lkZSB3aGF0IGFzeW5jIG1ldGhvZCB0byB1c2UgdG8gdHJpZ2dlcmluZyBwcm9jZXNzaW5nIG9mIHF1ZXVlZCBjYWxsYmFja3M6XG5pZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHt9LnRvU3RyaW5nLmNhbGwocHJvY2VzcykgPT09ICdbb2JqZWN0IHByb2Nlc3NdJykge1xuICBzY2hlZHVsZUZsdXNoID0gdXNlTmV4dFRpY2soKTtcbn0gZWxzZSBpZiAoQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIpIHtcbiAgc2NoZWR1bGVGbHVzaCA9IHVzZU11dGF0aW9uT2JzZXJ2ZXIoKTtcbn0gZWxzZSB7XG4gIHNjaGVkdWxlRmx1c2ggPSB1c2VTZXRUaW1lb3V0KCk7XG59XG5cbmZ1bmN0aW9uIGFzYXAoY2FsbGJhY2ssIGFyZykge1xuICB2YXIgbGVuZ3RoID0gcXVldWUucHVzaChbY2FsbGJhY2ssIGFyZ10pO1xuICBpZiAobGVuZ3RoID09PSAxKSB7XG4gICAgLy8gSWYgbGVuZ3RoIGlzIDEsIHRoYXQgbWVhbnMgdGhhdCB3ZSBuZWVkIHRvIHNjaGVkdWxlIGFuIGFzeW5jIGZsdXNoLlxuICAgIC8vIElmIGFkZGl0aW9uYWwgY2FsbGJhY2tzIGFyZSBxdWV1ZWQgYmVmb3JlIHRoZSBxdWV1ZSBpcyBmbHVzaGVkLCB0aGV5XG4gICAgLy8gd2lsbCBiZSBwcm9jZXNzZWQgYnkgdGhpcyBmbHVzaCB0aGF0IHdlIGFyZSBzY2hlZHVsaW5nLlxuICAgIHNjaGVkdWxlRmx1c2goKTtcbiAgfVxufVxuXG5leHBvcnRzLmFzYXAgPSBhc2FwO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2VzNi1wcm9taXNlL2Rpc3QvY29tbW9uanMvcHJvbWlzZS9hc2FwLmpzXG4gKiogbW9kdWxlIGlkID0gMTZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnByb2Nlc3MubmV4dFRpY2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYW5TZXRJbW1lZGlhdGUgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5zZXRJbW1lZGlhdGU7XG4gICAgdmFyIGNhblBvc3QgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5wb3N0TWVzc2FnZSAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lclxuICAgIDtcblxuICAgIGlmIChjYW5TZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiB3aW5kb3cuc2V0SW1tZWRpYXRlKGYpIH07XG4gICAgfVxuXG4gICAgaWYgKGNhblBvc3QpIHtcbiAgICAgICAgdmFyIHF1ZXVlID0gW107XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gZXYuc291cmNlO1xuICAgICAgICAgICAgaWYgKChzb3VyY2UgPT09IHdpbmRvdyB8fCBzb3VyY2UgPT09IG51bGwpICYmIGV2LmRhdGEgPT09ICdwcm9jZXNzLXRpY2snKSB7XG4gICAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gcXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICAgICAgcXVldWUucHVzaChmbik7XG4gICAgICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2UoJ3Byb2Nlc3MtdGljaycsICcqJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZm4sIDApO1xuICAgIH07XG59KSgpO1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn1cblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAod2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3Byb2Nlc3MvYnJvd3Nlci5qc1xuICoqIG1vZHVsZSBpZCA9IDE3XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iXSwic291cmNlUm9vdCI6IiIsImZpbGUiOiJheGlvcy5qcyJ9