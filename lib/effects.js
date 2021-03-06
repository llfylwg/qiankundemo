"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setDefaultMountApp = setDefaultMountApp;
exports.runDefaultMountEffects = runDefaultMountEffects;
exports.runAfterFirstMounted = runAfterFirstMounted;

var _singleSpa = require("single-spa");

/**
 * @author Kuitos
 * @since 2019-02-19
 */
var firstMountLogLabel = '[qiankun]: first app mounted';

if (process.env.NODE_ENV === 'development') {
  console.time(firstMountLogLabel);
}

function setDefaultMountApp(defaultAppLink) {
  window.addEventListener('single-spa:no-app-change', function () {
    var mountedApps = (0, _singleSpa.getMountedApps)();

    if (!mountedApps.length) {
      (0, _singleSpa.navigateToUrl)(defaultAppLink);
    }
  }, {
    once: true
  });
}

function runDefaultMountEffects(defaultAppLink) {
  console.warn('runDefaultMountEffects will be removed in next version, please use setDefaultMountApp instead!');
  setDefaultMountApp(defaultAppLink);
}

function runAfterFirstMounted(effect) {
  window.addEventListener('single-spa:first-mount', function () {
    if (process.env.NODE_ENV === 'development') {
      console.timeEnd(firstMountLogLabel);
    }

    effect();
  }, {
    once: true
  });
}