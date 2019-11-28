"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = hijack;

var _importHtmlEntry = require("import-html-entry");

var _singleSpa = require("single-spa");

/**
 * @author Kuitos
 * @since 2019-10-21
 */
var rawHtmlAppendChild = HTMLHeadElement.prototype.appendChild;
var SCRIPT_TAG_NAME = 'SCRIPT';
var LINK_TAG_NAME = 'LINK';
var STYLE_TAG_NAME = 'STYLE';

function hijack(appName, proxy, bootstrapping) {
  if (bootstrapping === void 0) {
    bootstrapping = false;
  }

  var dynamicStyleSheets = [];

  HTMLHeadElement.prototype.appendChild = function appendChild(newChild) {
    var element = newChild;

    if (element.tagName) {
      switch (element.tagName) {
        case LINK_TAG_NAME:
        case STYLE_TAG_NAME:
          {
            var stylesheetElement = newChild; // check if the currently specified application is active
            // While we switch page from qiankun app to a normal react routing page, the normal one may load stylesheet dynamically while page rendering,
            // but the url change listener must to wait until the current call stack is flushed.
            // This scenario may cause we record the stylesheet from react routing page dynamic injection,
            // and remove them after the url change triggered and qiankun app is unmouting
            // see https://github.com/ReactTraining/history/blob/master/modules/createHashHistory.js#L222-L230

            var activated = (0, _singleSpa.checkActivityFunctions)(window.location).some(function (name) {
              return name === appName;
            }); // only hijack dynamic style injection when app activated

            if (activated) {
              dynamicStyleSheets.push(stylesheetElement);
            }

            break;
          }

        case SCRIPT_TAG_NAME:
          {
            var _a = element,
                src = _a.src,
                text = _a.text;

            if (src) {
              (0, _importHtmlEntry.execScripts)(null, [src], proxy);
              element = document.createComment("dynamic script " + src + " replaced by qiankun");
            } else {
              (0, _importHtmlEntry.execScripts)(null, ["<script>" + text + "</script>"], proxy);
              element = document.createComment('dynamic inline script replaced by qiankun');
            }

            break;
          }

        default:
          break;
      }
    }

    return rawHtmlAppendChild.call(this, element);
  };

  return function free() {
    HTMLHeadElement.prototype.appendChild = rawHtmlAppendChild;
    dynamicStyleSheets.forEach(function (stylesheet) {
      // the dynamic injected stylesheet may had been removed by itself while unmounting
      if (document.head.contains(stylesheet)) {
        document.head.removeChild(stylesheet);
      }
    });
    return function rebuild() {
      dynamicStyleSheets.forEach(function (stylesheet) {
        return document.head.appendChild(stylesheet);
      });

      if (!bootstrapping) {
        // for gc
        dynamicStyleSheets = [];
      }
    };
  };
}