(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

var Apps = require('./application');

var app = new Apps();
app.run();

})));
//# sourceMappingURL=index.umd.js.map
