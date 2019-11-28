"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prefetch = prefetch;
exports.prefetchAfterFirstMounted = prefetchAfterFirstMounted;
exports.prefetchAll = prefetchAll;

var _noop2 = _interopRequireDefault(require("lodash/noop"));

var _tslib = require("tslib");

var _importHtmlEntry = require("import-html-entry");

var _singleSpa = require("single-spa");

/**
 * @author Kuitos
 * @since 2019-02-26
 */

/**
 * 预加载静态资源，不兼容 requestIdleCallback 的浏览器不做任何动作
 * @param entry
 * @param fetch
 */
function prefetch(entry, fetch) {
  var _this = this;

  var requestIdleCallback = window.requestIdleCallback || _noop2.default;
  requestIdleCallback(function () {
    return (0, _tslib.__awaiter)(_this, void 0, void 0, function () {
      var _a, getExternalScripts, getExternalStyleSheets;

      return (0, _tslib.__generator)(this, function (_b) {
        switch (_b.label) {
          case 0:
            return [4
            /*yield*/
            , (0, _importHtmlEntry.importEntry)(entry, {
              fetch: fetch
            })];

          case 1:
            _a = _b.sent(), getExternalScripts = _a.getExternalScripts, getExternalStyleSheets = _a.getExternalStyleSheets;
            requestIdleCallback(getExternalStyleSheets);
            requestIdleCallback(getExternalScripts);
            return [2
            /*return*/
            ];
        }
      });
    });
  });
}

function prefetchAfterFirstMounted(apps, fetch) {
  window.addEventListener('single-spa:first-mount', function () {
    var mountedApps = (0, _singleSpa.getMountedApps)();
    var notMountedApps = apps.filter(function (app) {
      return mountedApps.indexOf(app.name) === -1;
    });

    if (process.env.NODE_ENV === 'development') {
      console.log("prefetch starting after " + mountedApps + " mounted...", notMountedApps);
    }

    notMountedApps.forEach(function (app) {
      return prefetch(app.entry, fetch);
    });
  }, {
    once: true
  });
}

function prefetchAll(apps, fetch) {
  window.addEventListener('single-spa:no-app-change', function () {
    if (process.env.NODE_ENV === 'development') {
      console.log('prefetch starting for all assets...', apps);
    }

    apps.forEach(function (app) {
      return prefetch(app.entry, fetch);
    });
  }, {
    once: true
  });
}