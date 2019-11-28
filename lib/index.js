"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  registerMicroApps: true,
  start: true
};
exports.registerMicroApps = registerMicroApps;
exports.start = start;

var _isFunction2 = _interopRequireDefault(require("lodash/isFunction"));

var _tslib = require("tslib");

var _importHtmlEntry = require("import-html-entry");

var _singleSpa = require("single-spa");

var _prefetch = require("./prefetch");

var _sandbox = require("./sandbox");

var _effects = require("./effects");

Object.keys(_effects).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _effects[key];
    }
  });
});

/**
 * @author Kuitos
 * @since 2019-04-25
 */
var microApps = [];

function toArray(array) {
  return Array.isArray(array) ? array : [array];
}

function execHooksChain(hooks, app) {
  if (hooks.length) {
    return hooks.reduce(function (chain, hook) {
      return chain.then(function () {
        return hook(app);
      });
    }, Promise.resolve());
  }

  return Promise.resolve();
}

function validateSingularMode(validate, app) {
  return (0, _tslib.__awaiter)(this, void 0, void 0, function () {
    return (0, _tslib.__generator)(this, function (_a) {
      return [2
      /*return*/
      , typeof validate === 'function' ? validate(app) : !!validate];
    });
  });
}

var Deferred =
/** @class */
function () {
  function Deferred() {
    var _this = this;

    this.promise = new Promise(function (resolve, reject) {
      _this.resolve = resolve;
      _this.reject = reject;
    });
  }

  return Deferred;
}();
/*
 * with singular mode, any app will wait to load until other apps are unmouting
 * it is useful for the scenario that only one sub app shown at one time
 */


var singularMode = false;
var useJsSandbox = false;
var frameworkStartedDefer = new Deferred();

function registerMicroApps(apps, lifeCycles, opts) {
  var _this = this;

  if (lifeCycles === void 0) {
    lifeCycles = {};
  }

  if (opts === void 0) {
    opts = {};
  }

  window.__POWERED_BY_QIANKUN__ = true;
  var _a = lifeCycles.beforeUnmount,
      beforeUnmount = _a === void 0 ? [] : _a,
      _b = lifeCycles.afterUnmount,
      afterUnmount = _b === void 0 ? [] : _b,
      _c = lifeCycles.afterMount,
      afterMount = _c === void 0 ? [] : _c,
      _d = lifeCycles.beforeMount,
      beforeMount = _d === void 0 ? [] : _d,
      _e = lifeCycles.beforeLoad,
      beforeLoad = _e === void 0 ? [] : _e;
  var fetch = opts.fetch;
  microApps = (0, _tslib.__spread)(microApps, apps);
  var prevAppUnmountedDeferred;
  apps.forEach(function (app) {
    var name = app.name,
        entry = app.entry,
        render = app.render,
        activeRule = app.activeRule,
        _a = app.props,
        props = _a === void 0 ? {} : _a;
    (0, _singleSpa.registerApplication)(name, function (_a) {
      var appName = _a.name;
      return (0, _tslib.__awaiter)(_this, void 0, void 0, function () {
        var _b, appContent, execScripts, assetPublicPath, jsSandbox, mountSandbox, unmountSandbox, sandbox, _c, bootstrapApp, mount, unmount, globalVariableExports;

        var _this = this;

        return (0, _tslib.__generator)(this, function (_d) {
          switch (_d.label) {
            case 0:
              return [4
              /*yield*/
              , frameworkStartedDefer.promise];

            case 1:
              _d.sent();

              return [4
              /*yield*/
              , (0, _importHtmlEntry.importEntry)(entry, {
                fetch: fetch
              })];

            case 2:
              _b = _d.sent(), appContent = _b.template, execScripts = _b.execScripts, assetPublicPath = _b.assetPublicPath;
              return [4
              /*yield*/
              , validateSingularMode(singularMode, app)];

            case 3:
              if (!_d.sent()) return [3
              /*break*/
              , 5];
              return [4
              /*yield*/
              , prevAppUnmountedDeferred && prevAppUnmountedDeferred.promise];

            case 4:
              _d.sent();

              _d.label = 5;

            case 5:
              // 第一次加载设置应用可见区域 dom 结构
              // 确保每次应用加载前容器 dom 结构已经设置完毕
              render({
                appContent: appContent,
                loading: true
              });
              jsSandbox = window;

              mountSandbox = function mountSandbox() {
                return Promise.resolve();
              };

              unmountSandbox = function unmountSandbox() {
                return Promise.resolve();
              };

              if (useJsSandbox) {
                sandbox = (0, _sandbox.genSandbox)(appName, assetPublicPath);
                jsSandbox = sandbox.sandbox;
                mountSandbox = sandbox.mount;
                unmountSandbox = sandbox.unmount;
              }

              return [4
              /*yield*/
              , execHooksChain(toArray(beforeLoad), app)];

            case 6:
              _d.sent();

              return [4
              /*yield*/
              , execScripts(jsSandbox)];

            case 7:
              _c = _d.sent(), bootstrapApp = _c.bootstrap, mount = _c.mount, unmount = _c.unmount;

              if (!(0, _isFunction2.default)(bootstrapApp) || !(0, _isFunction2.default)(mount) || !(0, _isFunction2.default)(unmount)) {
                globalVariableExports = window[appName] || {};
                bootstrapApp = globalVariableExports.bootstrap; // eslint-disable-next-line prefer-destructuring

                mount = globalVariableExports.mount; // eslint-disable-next-line prefer-destructuring

                unmount = globalVariableExports.unmount;

                if (!(0, _isFunction2.default)(bootstrapApp) || !(0, _isFunction2.default)(mount) || !(0, _isFunction2.default)(unmount)) {
                  throw new Error("You need to export the functional lifecycles in " + appName + " entry");
                }

                if (process.env.NODE_ENV === 'development') {
                  console.warn("LifeCycles are not found from " + appName + " entry exports, fallback to get them from window['" + appName + "'] ");
                }
              }

              return [2
              /*return*/
              , {
                bootstrap: [bootstrapApp],
                mount: [function () {
                  return (0, _tslib.__awaiter)(_this, void 0, void 0, function () {
                    return (0, _tslib.__generator)(this, function (_a) {
                      switch (_a.label) {
                        case 0:
                          return [4
                          /*yield*/
                          , validateSingularMode(singularMode, app)];

                        case 1:
                          if (_a.sent() && prevAppUnmountedDeferred) {
                            return [2
                            /*return*/
                            , prevAppUnmountedDeferred.promise];
                          }

                          return [2
                          /*return*/
                          , undefined];
                      }
                    });
                  });
                }, function () {
                  return (0, _tslib.__awaiter)(_this, void 0, void 0, function () {
                    return (0, _tslib.__generator)(this, function (_a) {
                      return [2
                      /*return*/
                      , execHooksChain(toArray(beforeMount), app)];
                    });
                  });
                }, // 添加 mount hook, 确保每次应用加载前容器 dom 结构已经设置完毕
                function () {
                  return (0, _tslib.__awaiter)(_this, void 0, void 0, function () {
                    return (0, _tslib.__generator)(this, function (_a) {
                      return [2
                      /*return*/
                      , render({
                        appContent: appContent,
                        loading: true
                      })];
                    });
                  });
                }, mountSandbox, mount, // 应用 mount 完成后结束 loading
                function () {
                  return (0, _tslib.__awaiter)(_this, void 0, void 0, function () {
                    return (0, _tslib.__generator)(this, function (_a) {
                      return [2
                      /*return*/
                      , render({
                        appContent: appContent,
                        loading: false
                      })];
                    });
                  });
                }, function () {
                  return (0, _tslib.__awaiter)(_this, void 0, void 0, function () {
                    return (0, _tslib.__generator)(this, function (_a) {
                      return [2
                      /*return*/
                      , execHooksChain(toArray(afterMount), app)];
                    });
                  });
                }, // initialize the unmount defer after app mounted and resolve the defer after it unmounted
                function () {
                  return (0, _tslib.__awaiter)(_this, void 0, void 0, function () {
                    return (0, _tslib.__generator)(this, function (_a) {
                      switch (_a.label) {
                        case 0:
                          return [4
                          /*yield*/
                          , validateSingularMode(singularMode, app)];

                        case 1:
                          if (_a.sent()) {
                            prevAppUnmountedDeferred = new Deferred();
                          }

                          return [2
                          /*return*/
                          ];
                      }
                    });
                  });
                }],
                unmount: [function () {
                  return (0, _tslib.__awaiter)(_this, void 0, void 0, function () {
                    return (0, _tslib.__generator)(this, function (_a) {
                      return [2
                      /*return*/
                      , execHooksChain(toArray(beforeUnmount), app)];
                    });
                  });
                }, unmount, unmountSandbox, function () {
                  return (0, _tslib.__awaiter)(_this, void 0, void 0, function () {
                    return (0, _tslib.__generator)(this, function (_a) {
                      return [2
                      /*return*/
                      , execHooksChain(toArray(afterUnmount), app)];
                    });
                  });
                }, // remove the app content after unmount
                function () {
                  return (0, _tslib.__awaiter)(_this, void 0, void 0, function () {
                    return (0, _tslib.__generator)(this, function (_a) {
                      return [2
                      /*return*/
                      , render({
                        appContent: '',
                        loading: false
                      })];
                    });
                  });
                }, function () {
                  return (0, _tslib.__awaiter)(_this, void 0, void 0, function () {
                    return (0, _tslib.__generator)(this, function (_a) {
                      switch (_a.label) {
                        case 0:
                          return [4
                          /*yield*/
                          , validateSingularMode(singularMode, app)];

                        case 1:
                          if (_a.sent() && prevAppUnmountedDeferred) {
                            prevAppUnmountedDeferred.resolve();
                          }

                          return [2
                          /*return*/
                          ];
                      }
                    });
                  });
                }]
              }];
          }
        });
      });
    }, activeRule, props);
  });
}

function start(opts) {
  if (opts === void 0) {
    opts = {};
  }

  var _a = opts.prefetch,
      prefetch = _a === void 0 ? true : _a,
      _b = opts.jsSandbox,
      jsSandbox = _b === void 0 ? true : _b,
      _c = opts.singular,
      singular = _c === void 0 ? true : _c,
      fetch = opts.fetch;

  switch (prefetch) {
    case true:
      (0, _prefetch.prefetchAfterFirstMounted)(microApps, fetch);
      break;

    case 'all':
      (0, _prefetch.prefetchAll)(microApps, fetch);
      break;

    default:
      break;
  }

  if (jsSandbox) {
    useJsSandbox = jsSandbox;
  }

  if (singular) {
    singularMode = singular;
  }

  (0, _singleSpa.start)();
  frameworkStartedDefer.resolve();
}