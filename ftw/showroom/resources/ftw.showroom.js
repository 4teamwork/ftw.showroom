(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.ftw || (g.ftw = {})).showroom = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isEnter = isEnter;
exports.hitEnter = hitEnter;
exports.isEscape = isEscape;
exports.hitEscape = hitEscape;
exports.isArrowLeft = isArrowLeft;
exports.hitArrowLeft = hitArrowLeft;
exports.isArrowRight = isArrowRight;
exports.hitArrowRight = hitArrowRight;
exports.click = click;

var _utils = require("./utils");

var $ = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

var keycode = {
  enter: 13,
  escape: 27,
  arrowLeft: 37,
  arrowRight: 39
};

var defaultElement = $(document);
var keypress = $.Event("keypress");
var keyup = $.Event("keyup");
var keydown = $.Event("keydown");

function isEnter(e) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _utils.noop;

  if (e.keyCode === keycode.enter) {
    callback();
    return true;
  }
  return false;
}

function hitEnter() {
  var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultElement;

  keydown.keyCode = keycode.enter;
  $(element).trigger(keydown);
}

function isEscape(e) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _utils.noop;

  if (e.keyCode === keycode.escape) {
    callback();
    return true;
  }
  return false;
}

function hitEscape() {
  var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultElement;

  keydown.keyCode = keycode.escape;
  $(element).trigger(keydown);
}

function isArrowLeft(e) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _utils.noop;

  if (e.keyCode === keycode.arrowLeft) {
    callback();
    return true;
  }
  return false;
}

function hitArrowLeft() {
  var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultElement;

  keydown.keyCode = keycode.arrowLeft;
  $(element).trigger(keydown);
}

function isArrowRight(e) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _utils.noop;

  if (e.keyCode === keycode.arrowRight) {
    callback();
    return true;
  }
  return false;
}

function hitArrowRight() {
  var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultElement;

  keydown.keyCode = keycode.arrowRight;
  $(element).trigger(keydown);
}

function click() {
  var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultElement;
  $(element).click();
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./utils":6}],2:[function(require,module,exports){
(function (global){
"use strict";

var _utils = require("./utils");

var _item = require("./item");

var _item2 = _interopRequireDefault(_item);

var _observer = require("./observer");

var _observer2 = _interopRequireDefault(_observer);

var _register = require("./register");

var _register2 = _interopRequireDefault(_register);

var _event = require("./event");

var event = _interopRequireWildcard(_event);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Handlebars = (typeof window !== "undefined" ? window['Handlebars'] : typeof global !== "undefined" ? global['Handlebars'] : null);
var $ = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

module.exports = function Showroom() {
  var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var options = arguments[1];


  options = $.extend({
    cssClass: "ftw-showroom",
    render: render,
    tail: _utils.noop,
    head: _utils.noop,
    fetch: fetch,
    template: template,
    target: "body",
    displayCurrent: true,
    displayTotal: true,
    total: 0,
    offset: 0
  }, options);

  setOffset(options.offset);

  var reveal = {};

  var template = Handlebars.compile(options.template || "\n    <div class=\"{{showroom.options.cssClass}}\">\n      <header class=\"ftw-showroom-header\">\n        <div class=\"ftw-showroom-left\">\n          {{#if showroom.options.displayCurrent}}\n            <span class=\"ftw-showroom-current\">{{showroom.current}}</span>\n          {{/if}}\n          {{#if showroom.options.displayTotal}}\n            {{#if showroom.options.total}}<span>/</span>\n              <span class=\"ftw-showroom-total\">{{showroom.options.total}}</span>\n            {{/if}}\n          {{/if}}\n        </div>\n        <span class=\"ftw-showroom-title\">{{item.title}}</span>\n        <div class=\"ftw-showroom-right\">\n          <a id=\"ftw-showroom-close\" class=\"ftw-showroom-button\"></a>\n        </div>\n      </header>\n      <div class=\"ftw-showroom-content\">\n        {{{content}}}\n      </div>\n    </div>\n  ");

  var element = $();

  items = Array.prototype.slice.call(items);

  var htmlElementCount = items.filter(_utils.isHTMLElement).length;
  if (htmlElementCount && htmlElementCount < items.length) {
    throw new Error("The object set is not consistend");
  }

  if (items.filter(function (item) {
    return item.getAttribute("data-showroom-target-item");
  }).length) {
    throw new Error("Showroom items must not contain references");
  }

  items = items.map(function (item) {
    return (0, _item2.default)(item);
  });

  var register = (0, _register2.default)(items, { tail: options.tail, head: options.head });
  var target = $(options.target);
  var observer = (0, _observer2.default)();

  var throttledNext = (0, _utils.throttle)(next, 1000, { trailing: false });

  var throttledPrev = (0, _utils.throttle)(prev, 1000, { trailing: false });

  var isOpen = false;

  function checkArrows() {
    var nextButton = $("#ftw-showroom-next", element);
    var prevButton = $("#ftw-showroom-prev", element);

    current() < options.total ? nextButton.show() : nextButton.hide();
    register.hasPrev() ? prevButton.show() : prevButton.hide();
  }

  function fetch(item) {
    return $.get(item.target);
  };

  function render(content) {
    return $.when(content).pipe(function (content) {
      return $(template({ showroom: reveal, content: content, item: register.current }));
    });
  }

  function showItem(item) {
    return $.when(options.fetch(item)).pipe(options.render).pipe(function (newElement) {
      element.remove();
      element = newElement || $();
      element.show();
      isOpen = true;
      target.append(element).addClass("ftw-showroom-open");
      checkArrows();
    });
  };

  function select(event) {
    event.preventDefault();
    var item = register.items.filter(function (item) {
      return item.id === (event.currentTarget.getAttribute("data-showroom-id") || event.currentTarget.getAttribute("data-showroom-target-item"));
    })[0];
    open(item);
  }

  function close() {
    target.removeClass("ftw-showroom-open");
    element.hide();
    observer.reset();
    isOpen = false;
  }

  function open(item) {
    if (!register.size) {
      return false;
    }
    item = item || register.items[0];
    register.set(item);
    observer.update(item);
    if (observer.hasChanged()) {
      return showItem(item);
    }
  }

  function next() {
    if (!isOpen) {
      return false;
    }
    register.next();
    open(register.current);
  }

  function prev() {
    if (!isOpen) {
      return false;
    }
    register.prev();
    open(register.current);
  }

  function append(nodes) {
    items = Array.prototype.slice.call(nodes);
    items = items.map(function (item) {
      return (0, _item2.default)(item);
    });
    register.append(items);
    checkArrows();
  }

  function prepend(nodes) {
    items = Array.prototype.slice.call(nodes);
    items = items.map(function (item) {
      return (0, _item2.default)(item);
    });
    if (options.offset > 0) {
      options.offset -= items.length;
    }
    register.prepend(items);
    checkArrows();
  }

  function reset() {
    var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    close();
    items = Array.prototype.slice.call(items);
    items = items.map(function (item) {
      return (0, _item2.default)(item);
    });
    setOffset(offset);
    register.reset(items);
    checkArrows();
  }

  function destroy() {
    element.remove();
    register.reset();
    element = $();
    target.removeClass("ftw-showroom-open");
    register.items.forEach(function (item) {
      return item.destroy();
    });
  }

  function setOffset(value) {
    options.offset = Math.max(0, value);
  }

  function setTotal(value) {
    if (!(0, _utils.isNumeric)(value)) {
      throw new Error(value + " is not a number");
    }
    options.total = value;
    if (isOpen) {
      observer.reset();
      return open(register.current);
    }
  }

  function current() {
    return register.pointer + 1 + options.offset;
  }

  $(document).on("click", "#ftw-showroom-close", close).on("keydown", function (e) {
    event.isEscape(e, close);
    event.isArrowRight(e, throttledNext);
    event.isArrowLeft(e, throttledPrev);
  }).on("click", ".showroom-item", select).on("click", ".showroom-reference", select).on("click", "#ftw-showroom-prev", throttledPrev).on("click", "#ftw-showroom-next", throttledNext);

  reveal.open = open;
  reveal.close = close;
  reveal.next = next;
  reveal.prev = prev;
  reveal.append = append;
  reveal.prepend = prepend;
  reveal.reset = reset;
  reveal.destroy = destroy;
  reveal.setTotal = setTotal;
  reveal.setOffset = setOffset;

  Object.defineProperty(reveal, "options", { get: function get() {
      return options;
    } });
  Object.defineProperty(reveal, "current", { get: function get() {
      return current();
    } });
  Object.defineProperty(reveal, "items", { get: function get() {
      return register.items;
    } });
  Object.defineProperty(reveal, "element", { get: function get() {
      return element;
    } });

  return Object.freeze(reveal);
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./event":1,"./item":3,"./observer":4,"./register":5,"./utils":6}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Item;

var _utils = require("./utils");

function Item(element) {

  var reveal = {};
  var showroomId = element.getAttribute("data-showroom-id") || (0, _utils.generateUUID)();

  element.setAttribute("data-showroom-id", showroomId);

  function destroy() {
    element.removeAttribute("data-showroom-id");
  }

  return Object.freeze({
    id: showroomId,
    element: element,
    target: element.getAttribute("data-showroom-target") || "",
    title: element.getAttribute("data-showroom-title") || "",
    destroy: destroy
  });
}

},{"./utils":6}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Oberserver;
function Oberserver(initialValue) {

  var value = initialValue;
  var changed = false;
  var reveal = {};

  function update(newValue) {
    if (newValue === value) {
      changed = false;
    } else {
      changed = true;
    }
    value = newValue;
  }

  function hasChanged() {
    return changed;
  }

  function reset() {
    changed = false;
    value = undefined;
  }

  Object.defineProperty(reveal, "value", {
    get: function get() {
      return value;
    }
  });

  reveal.update = update;
  reveal.hasChanged = hasChanged;
  reveal.reset = reset;

  return Object.freeze(reveal);
}

},{}],5:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Register;

var _utils = require("./utils");

var _observer = require("./observer");

var _observer2 = _interopRequireDefault(_observer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

function Register() {
  var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var options = arguments[1];


  options = $.extend({
    head: _utils.noop,
    tail: _utils.noop
  }, options);

  var pointer = 0;

  var reveal = {};

  var pointerOberserver = (0, _observer2.default)(pointer);
  var itemOberserver = (0, _observer2.default)();

  function append() {
    var pushItems = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    items = $.merge(items, pushItems);
  }

  function prepend() {
    var pushItems = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    pointer += pushItems.length;
    items = $.merge(pushItems, items);
  }

  function checkPointer() {
    pointerOberserver.update(pointer);
    if (pointerOberserver.hasChanged() || itemOberserver.hasChanged()) {
      performCalls();
    }
  }

  function performCalls() {
    if (pointer === 0) {
      options.head(reveal.current);
    }
    if (pointer === reveal.size - 1) {
      options.tail(reveal.current);
    }
  }

  function next() {
    if (hasNext()) {
      pointer += 1;
    }
    checkPointer();
  }

  function prev() {
    if (hasPrev()) {
      pointer -= 1;
    }
    checkPointer();
  }

  function set(item) {
    itemOberserver.update(item);
    var index = items.indexOf(item);
    if (index === -1) {
      throw new Error("Item was not found");
    } else {
      pointer = index;
    }
    checkPointer();
  }

  function reset() {
    var resetItems = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    items = resetItems;
    pointer = 0;
  }

  function hasNext() {
    return pointer < items.length - 1;
  }

  function hasPrev() {
    return pointer > 0;
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
  reveal.hasNext = hasNext;
  reveal.hasPrev = hasPrev;
  reveal.next = next;
  reveal.prev = prev;
  reveal.prepend = prepend;
  reveal.append = append;
  reveal.set = set;
  reveal.reset = reset;
  reveal.performCalls = performCalls;

  return Object.freeze(reveal);
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./observer":4,"./utils":6}],6:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.noop = noop;
exports.generateUUID = generateUUID;
exports.isHTMLElement = isHTMLElement;
exports.now = now;
exports.throttle = throttle;
exports.isNumeric = isNumeric;
var $ = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

function noop() {};

function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
  });
  return uuid;
}

function isHTMLElement(obj) {
  return obj instanceof HTMLElement;
}

function now() {
  return new Date().getTime();
}

// Inspired by http://underscorejs.org/#throttle
function throttle() {
  var func = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
  var wait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 250;
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var timeout = void 0;
  var result = void 0;
  var previous = 0;
  options = $.extend({
    leading: true,
    trailing: true
  }, options);

  function later() {
    previous = !options.leading ? 0 : now();
    timeout = null;
    result = func();
  };

  function throttled() {
    var executionTimestamp = now();
    if (!previous && !options.leading) previous = executionTimestamp;
    var remaining = wait - (executionTimestamp - previous);
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = executionTimestamp;
      result = func();
    } else if (!timeout && !options.trailing) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    timeout = null;
  };

  return throttled;
};

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[2])(2)
});