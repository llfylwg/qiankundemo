"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = hijack;
var rawPublicPath = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;

function hijack(publicPath) {
  if (publicPath === void 0) {
    publicPath = '/';
  }

  window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = publicPath;
  return function free() {
    if (rawPublicPath === undefined) {
      delete window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
    } else {
      window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = rawPublicPath;
    }

    return function rebuild() {
      window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = publicPath;
    };
  };
}