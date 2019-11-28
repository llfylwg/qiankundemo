"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hijackAtMounting = hijackAtMounting;
exports.hijackAtBootstrapping = hijackAtBootstrapping;

var _noop2 = _interopRequireDefault(require("lodash/noop"));

var _dynamicHeadAppend = _interopRequireDefault(require("./dynamicHeadAppend"));

var _historyListener = _interopRequireDefault(require("./historyListener"));

var _publicPath = _interopRequireDefault(require("./publicPath"));

var _timer = _interopRequireDefault(require("./timer"));

var _windowListener = _interopRequireDefault(require("./windowListener"));

function hijackAtMounting(appName, proxy) {
  return [(0, _timer.default)(), (0, _windowListener.default)(), (0, _historyListener.default)(), (0, _dynamicHeadAppend.default)(appName, proxy)];
}

function hijackAtBootstrapping(appName, publicPath, proxy) {
  return [process.env.NODE_ENV === 'development' ? (0, _dynamicHeadAppend.default)(appName, proxy, true) : function () {
    return function () {
      return _noop2.default;
    };
  }, (0, _publicPath.default)(publicPath)];
}