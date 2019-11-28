"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = hijack;

var _noop2 = _interopRequireDefault(require("lodash/noop"));

var _tslib = require("tslib");

var _utils = require("../utils");

/**
 * @author Kuitos
 * @since 2019-04-11
 */
var rawWindowInterval = window.setInterval;
var rawWindowTimeout = window.setTimeout;

function hijack() {
  var timerIds = [];
  var intervalIds = [];

  window.setInterval = function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    } // @ts-ignore


    var intervalId = rawWindowInterval.apply(void 0, (0, _tslib.__spread)(args));
    intervalIds.push(intervalId);
    return intervalId;
  };

  window.setTimeout = function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    } // @ts-ignore


    var timerId = rawWindowTimeout.apply(void 0, (0, _tslib.__spread)(args));
    timerIds.push(timerId);
    return timerId;
  };

  return function free() {
    var _this = this;

    window.setInterval = rawWindowInterval;
    window.setTimeout = rawWindowTimeout;
    timerIds.forEach(function (id) {
      return (0, _tslib.__awaiter)(_this, void 0, void 0, function () {
        return (0, _tslib.__generator)(this, function (_a) {
          switch (_a.label) {
            case 0:
              // 延迟 timeout 的清理，因为可能会有动画还没完成
              return [4
              /*yield*/
              , (0, _utils.sleep)(500)];

            case 1:
              // 延迟 timeout 的清理，因为可能会有动画还没完成
              _a.sent();

              window.clearTimeout(id);
              return [2
              /*return*/
              ];
          }
        });
      });
    });
    intervalIds.forEach(function (id) {
      window.clearInterval(id);
    });
    return _noop2.default;
  };
}