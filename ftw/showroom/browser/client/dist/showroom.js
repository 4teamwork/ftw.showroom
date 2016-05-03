(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.showroom = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Item;

var _utils = require("./utils");

function Item(element) {

  var showroomId = (0, _utils.generateUUID)();

  var target = element.getAttribute("data-showroom-target") || "";
  var title = element.getAttribute("data-showroom-title") || "";

  element.setAttribute("data-showroom-id", showroomId);

  return Object.freeze({
    element: element,
    title: title,
    id: showroomId,
    target: target
  });
}

},{"./utils":4}],2:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Register;

var _utils = require("./utils");

var $ = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

function Register() {
  var items = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
  var options = arguments[1];


  options = $.extend({
    head: _utils.noop,
    tail: _utils.noop
  }, options);

  var pointer = 0;

  var reveal = {};

  function append() {
    var pushItems = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
    items = $.merge(items, pushItems);
  }

  function checkPointer() {
    if (pointer === 0) {
      options.head(reveal.current);
    }
    if (pointer === reveal.size - 1) {
      options.tail(reveal.current);
    }
  }

  function next() {
    if (pointer < reveal.size - 1) {
      pointer += 1;
    }
    checkPointer();
  }

  function prev() {
    if (pointer > 0) {
      pointer -= 1;
    }
    checkPointer();
  }

  function set(item) {
    var index = items.indexOf(item);
    if (index === -1) {
      throw new Error("Item was not found");
    } else {
      pointer = index;
    }
    checkPointer();
  }

  Object.defineProperty(reveal, "current", { get: function get() {
      return items[pointer];
    } });
  Object.defineProperty(reveal, "size", { get: function get() {
      return items.length;
    } });
  Object.defineProperty(reveal, "items", { get: function get() {
      return items;
    } });
  Object.defineProperty(reveal, "pointer", { get: function get() {
      return pointer;
    } });
  reveal.next = next;
  reveal.prev = prev;
  reveal.append = append;
  reveal.set = set;

  checkPointer();

  return Object.freeze(reveal);
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./utils":4}],3:[function(require,module,exports){
(function (global){
"use strict";

var _utils = require("./utils");

var _item = require("./item");

var _item2 = _interopRequireDefault(_item);

var _register = require("./register");

var _register2 = _interopRequireDefault(_register);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Handlebars = (typeof window !== "undefined" ? window['Handlebars'] : typeof global !== "undefined" ? global['Handlebars'] : null);
var $ = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

module.exports = function Showroom() {
  var items = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
  var options = arguments[1];


  var template = Handlebars.compile("\n    <div class=\"{{showroom.cssClass}}\">\n      <header class=\"ftw-showroom-header\">\n        <div class=\"ftw-showroom-left\">\n          <span class=\"ftw-showroom-current\">{{showroom.current}}</span>\n          <span>/</span>\n          <span class=\"ftw-showroom-total\">{{showroom.total}}</span>\n        </div>\n        <span class=\"ftw-showroom-title\">{{item.title}}</span>\n        <div class=\"ftw-showroom-right\">\n          <a id=\"ftw-showroom-close\" class=\"ftw-showroom-button\"></a>\n        </div>\n      </header>\n      <div class=\"ftw-showroom-content\">\n        {{{content}}}\n      </div>\n    </div>\n  ");

  var selectCallback = _utils.noop;

  items = Array.from(items);

  var htmlElementCount = items.filter(_utils.isHTMLElement).length;
  if (htmlElementCount && htmlElementCount < items.length) {
    throw new Error("The object set is not consistend");
  }

  items = items.map(function (item) {
    return (0, _item2.default)(item);
  });
  items.map(function (item) {
    $(item.element).on("click", select);
  });

  options = $.extend({
    cssClass: "ftw-showroom",
    render: render,
    tail: _utils.noop,
    head: _utils.noop,
    fetch: fetch,
    template: template,
    target: "body"
  }, options);

  var element = $();

  var register = (0, _register2.default)(items, { tail: options.tail, head: options.head });

  function onSelect(_selectCallback) {
    selectCallback = _selectCallback;
  }

  function fetch(item) {
    return $.get(item.target);
  };

  var target = $(options.target);

  target.on("click", "#ftw-showroom-close", close);

  var data = { cssClass: options.cssClass };

  Object.defineProperty(data, "current", { get: function get() {
      return register.pointer + 1;
    } });
  Object.defineProperty(data, "total", { get: function get() {
      return register.size;
    } });

  function render(content) {
    return $.when(content).done(function (content) {
      element = $(template({ showroom: data, content: content, item: register.current }));
      element.show();
      target.append(element).addClass("ftw-showroom-open");
    });
  };

  function select(event) {
    var item = register.items.filter(function (item) {
      return item.id === event.currentTarget.getAttribute("data-showroom-id");
    })[0];
    open(item);
    selectCallback(item);
  }

  function close() {
    target.removeClass("ftw-showroom-open");
    element.hide();
  }

  function open(item) {
    register.set(item || register.items[0]);
    return render(options.fetch(item));
  }

  function next() {
    register.next();
    open(register.current);
  }

  function prev() {
    register.prev();
    open(register.current);
  }

  var reveal = {
    onSelect: onSelect,
    data: data,
    open: open,
    close: close,
    next: next,
    prev: prev
  };

  Object.defineProperty(reveal, "items", { get: function get() {
      return register.items;
    } });

  return Object.freeze(reveal);
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./item":1,"./register":2,"./utils":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.noop = noop;
exports.generateUUID = generateUUID;
exports.isHTMLElement = isHTMLElement;
function noop() {};

function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
  });
  return uuid;
};

function isHTMLElement(obj) {
  return obj instanceof HTMLElement;
}

},{}]},{},[3])(3)
});