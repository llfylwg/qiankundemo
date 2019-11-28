"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sleep = sleep;
exports.isConstructable = isConstructable;

var _tslib = require("tslib");

/**
 * @author Kuitos
 * @since 2019-05-15
 */
function sleep(ms) {
  return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
    return (0, _tslib.__generator)(this, function (_a) {
      return [2
      /*return*/
      , new Promise(function (resolve) {
        return setTimeout(resolve, ms);
      })];
    });
  });
}

function isConstructable(fn) {
  var constructableFunctionRegex = /^function\b\s[A-Z].*/;
  var classRegex = /^class\b/; // 有 prototype 并且 prototype 上有定义一系列非 constructor 属性，则可以认为是一个构造函数

  return fn.prototype && Object.getOwnPropertyNames(fn.prototype).filter(function (k) {
    return k !== 'constructor';
  }).length || constructableFunctionRegex.test(fn.toString()) || classRegex.test(fn.toString());
}