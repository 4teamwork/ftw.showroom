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

},{"./utils":7}],2:[function(require,module,exports){
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

var _gallery = require("./gallery");

var _gallery2 = _interopRequireDefault(_gallery);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Handlebars = (typeof window !== "undefined" ? window['Handlebars'] : typeof global !== "undefined" ? global['Handlebars'] : null);
var $ = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

var gallery = (0, _gallery2.default)();

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

  var template = Handlebars.compile(options.template || "\n    <div class=\"{{showroom.options.cssClass}}\">\n      <header class=\"ftw-showroom-header\">\n        <div class=\"ftw-showroom-left\">\n          {{#if showroom.options.displayCurrent}}\n            <span class=\"ftw-showroom-current\">{{showroom.current}}</span>\n          {{/if}}\n          {{#if showroom.options.displayTotal}}\n            {{#if showroom.options.total}}<span>/</span>\n              <span class=\"ftw-showroom-total\">{{showroom.options.total}}</span>\n            {{/if}}\n          {{/if}}\n        </div>\n        <span class=\"ftw-showroom-title\">{{item.title}}</span>\n        <div class=\"ftw-showroom-right\">\n          <a class=\"ftw-showroom-button ftw-showroom-close\"></a>\n        </div>\n      </header>\n      <div class=\"ftw-showroom-content\">\n        {{{content}}}\n      </div>\n    </div>\n  ");

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
  var showroomObserver = (0, _observer2.default)("");

  var throttledNext = (0, _utils.throttle)(next, 1000, { trailing: false });

  var throttledPrev = (0, _utils.throttle)(prev, 1000, { trailing: false });

  var isOpen = false;

  function checkArrows() {
    var nextButton = $(".ftw-showroom-next", element);
    var prevButton = $(".ftw-showroom-prev", element);

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
      target.append(element).addClass("ftw-showroom-open");
      checkArrows();
    });
  };

  function select(event) {
    event.preventDefault();
    var item = register.items.filter(function (item) {
      return item.id === (event.currentTarget.getAttribute("data-showroom-id") || event.currentTarget.getAttribute("data-showroom-target-item"));
    })[0];
    if (item) {
      open(item);
    }
  }

  function close() {
    target.removeClass("ftw-showroom-open");
    element.hide();
    showroomObserver.reset();
    isOpen = false;
  }

  function open(item) {
    if (!register.size) {
      return false;
    }
    item = item || register.items[0];
    register.set(item);
    showroomObserver.update(item.id);
    if (showroomObserver.hasChanged()) {
      isOpen = true;
      gallery.closeOthers(reveal);
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
    gallery.unregister(reveal);
    isOpen = false;
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
      showroomObserver.reset();
      return open(register.current);
    }
  }

  function current() {
    return register.pointer + 1 + options.offset;
  }

  $(document).on("click", ".ftw-showroom-close", close).on("keydown", function (e) {
    event.isEscape(e, close);
    event.isArrowRight(e, throttledNext);
    event.isArrowLeft(e, throttledPrev);
  }).on("click", ".showroom-item", select).on("click", ".showroom-reference", select).on("click", ".ftw-showroom-prev", throttledPrev).on("click", ".ftw-showroom-next", throttledNext);

  var reveal = {
    open: open,
    close: close,
    next: next,
    prev: prev,
    append: append,
    prepend: prepend,
    reset: reset,
    destroy: destroy,
    setTotal: setTotal,
    setOffset: setOffset
  };

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
  Object.defineProperty(reveal, "isOpen", { get: function get() {
      return isOpen;
    } });

  gallery.register(reveal);

  return Object.freeze(reveal);
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./event":1,"./gallery":3,"./item":4,"./observer":5,"./register":6,"./utils":7}],3:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Gallery;

var _utils = require("./utils");

var $ = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

function Gallery() {
  var showrooms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];


  if (!Array.isArray(showrooms)) {
    throw new Error("Argument: showrooms is not a list");
  }

  function register(showroom) {
    return showrooms.push(showroom);
  }

  function unregister(showroom) {
    return (0, _utils.remove)(showrooms, showroom);
  }

  function getOpenShowrooms() {
    return showrooms.filter(function (showroom) {
      return showroom.isOpen;
    });
  }

  function closeOthers(current) {
    var openShowrooms = (0, _utils.remove)(getOpenShowrooms(), current);
    if (openShowrooms.length > 0) {
      openShowrooms.forEach(function (showroom) {
        return showroom.close();
      });
    }
  }

  function closeOpenShowrooms() {
    getOpenShowrooms.forEach(function (showroom) {
      return showroom.close();
    });
  }

  function items() {
    return showrooms;
  }

  var reveal = {
    register: register,
    unregister: unregister,
    closeOthers: closeOthers
  };

  Object.defineProperty(reveal, "items", { get: function get() {
      return items();
    } });

  return Object.freeze(reveal);
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./utils":7}],4:[function(require,module,exports){
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

},{"./utils":7}],5:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Observer;
var $ = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

function Observer(value) {

  var changed = false;

  function update(newValue) {
    if (value === newValue) {
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

  var reveal = {
    update: update,
    hasChanged: hasChanged,
    reset: reset
  };

  Object.defineProperty(reveal, "value", {
    get: function get() {
      return value;
    }
  });

  return Object.freeze(reveal);
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],6:[function(require,module,exports){
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
    itemOberserver.update(item.id);
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

},{"./observer":5,"./utils":7}],7:[function(require,module,exports){
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
exports.remove = remove;
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

function remove(array, element) {
  var index = array.indexOf(element);
  if (index >= 0) {
    array.splice(index, 1);
  }
  return array;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[2])(2)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJmdHcvc2hvd3Jvb20vanMvc3JjL2V2ZW50LmpzIiwiZnR3L3Nob3dyb29tL2pzL3NyYy9mdHcuc2hvd3Jvb20uanMiLCJmdHcvc2hvd3Jvb20vanMvc3JjL2dhbGxlcnkuanMiLCJmdHcvc2hvd3Jvb20vanMvc3JjL2l0ZW0uanMiLCJmdHcvc2hvd3Jvb20vanMvc3JjL29ic2VydmVyLmpzIiwiZnR3L3Nob3dyb29tL2pzL3NyYy9yZWdpc3Rlci5qcyIsImZ0dy9zaG93cm9vbS9qcy9zcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7UUNnQmdCLE8sR0FBQSxPO1FBUUEsUSxHQUFBLFE7UUFLQSxRLEdBQUEsUTtRQVFBLFMsR0FBQSxTO1FBS0EsVyxHQUFBLFc7UUFRQSxZLEdBQUEsWTtRQUtBLFksR0FBQSxZO1FBUUEsYSxHQUFBLGE7UUFLQSxLLEdBQUEsSzs7QUFwRWhCOztBQUVBLElBQUksSUFBSSxRQUFRLFFBQVIsQ0FBUjs7QUFFQSxJQUFJLFVBQVU7QUFDWixTQUFPLEVBREs7QUFFWixVQUFRLEVBRkk7QUFHWixhQUFXLEVBSEM7QUFJWixjQUFZO0FBSkEsQ0FBZDs7QUFPQSxJQUFJLGlCQUFpQixFQUFFLFFBQUYsQ0FBckI7QUFDQSxJQUFJLFdBQVcsRUFBRSxLQUFGLENBQVEsVUFBUixDQUFmO0FBQ0EsSUFBSSxRQUFRLEVBQUUsS0FBRixDQUFRLE9BQVIsQ0FBWjtBQUNBLElBQUksVUFBVSxFQUFFLEtBQUYsQ0FBUSxTQUFSLENBQWQ7O0FBRU8sU0FBUyxPQUFULENBQWlCLENBQWpCLEVBQXFDO0FBQUEsTUFBakIsUUFBaUI7O0FBQzFDLE1BQUcsRUFBRSxPQUFGLEtBQWMsUUFBUSxLQUF6QixFQUFnQztBQUM5QjtBQUNBLFdBQU8sSUFBUDtBQUNEO0FBQ0QsU0FBTyxLQUFQO0FBQ0Q7O0FBRU0sU0FBUyxRQUFULEdBQTRDO0FBQUEs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TyxNQUFQO0FBQ0Q7O0FBRUQsWUFBVSxNQUFWLEdBQW1CLFlBQVc7QUFDNUIsaUJBQWEsT0FBYjtBQUNBLGVBQVcsQ0FBWDtBQUNBLGNBQVUsSUFBVjtBQUNELEdBSkQ7O0FBTUEsU0FBTyxTQUFQO0FBQ0Q7O0FBRU0sU0FBUyxTQUFULENBQW1CLENBQW5CLEVBQXNCO0FBQzNCLFNBQU8sQ0FBQyxNQUFNLFdBQVcsQ0FBWCxDQUFOLENBQUQsSUFBeUIsU0FBUyxDQUFULENBQWhDO0FBQ0Q7O0FBRU0sU0FBUyxNQUFULENBQWdCLEtBQWhCLEVBQXVCLE9BQXZCLEVBQWdDO0FBQ3JDLE1BQU0sUUFBUSxNQUFNLE9BQU4sQ0FBYyxPQUFkLENBQWQ7QUFDQSxNQUFHLFNBQVMsQ0FBWixFQUFlO0FBQ2IsVUFBTSxNQUFOLENBQWEsS0FBYixFQUFvQixDQUFwQjtBQUNEO0FBQ0QsU0FBTyxLQUFQO0FBQ0QiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHsgbm9vcCB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmxldCAkID0gcmVxdWlyZShcImpxdWVyeVwiKTtcblxubGV0IGtleWNvZGUgPSB7XG4gIGVudGVyOiAxMyxcbiAgZXNjYXBlOiAyNyxcbiAgYXJyb3dMZWZ0OiAzNyxcbiAgYXJyb3dSaWdodDogMzlcbn07XG5cbmxldCBkZWZhdWx0RWxlbWVudCA9ICQoZG9jdW1lbnQpO1xubGV0IGtleXByZXNzID0gJC5FdmVudChcImtleXByZXNzXCIpO1xubGV0IGtleXVwID0gJC5FdmVudChcImtleXVwXCIpO1xubGV0IGtleWRvd24gPSAkLkV2ZW50KFwia2V5ZG93blwiKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzRW50ZXIoZSwgY2FsbGJhY2sgPSBub29wKSB7XG4gIGlmKGUua2V5Q29kZSA9PT0ga2V5Y29kZS5lbnRlcikge1xuICAgIGNhbGxiYWNrKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGl0RW50ZXIoZWxlbWVudCA9IGRlZmF1bHRFbGVtZW50KSB7XG4gIGtleWRvd24ua2V5Q29kZSA9IGtleWNvZGUuZW50ZXI7XG4gICQoZWxlbWVudCkudHJpZ2dlcihrZXlkb3duKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRXNjYXBlKGUsIGNhbGxiYWNrID0gbm9vcCkge1xuICBpZihlLmtleUNvZGUgPT09IGtleWNvZGUuZXNjYXBlKSB7XG4gICAgY2FsbGJhY2soKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoaXRFc2NhcGUoZWxlbWVudCA9IGRlZmF1bHRFbGVtZW50KSB7XG4gIGtleWRvd24ua2V5Q29kZSA9IGtleWNvZGUuZXNjYXBlO1xuICAkKGVsZW1lbnQpLnRyaWdnZXIoa2V5ZG93bik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Fycm93TGVmdChlLCBjYWxsYmFjayA9IG5vb3ApIHtcbiAgaWYoZS5rZXlDb2RlID09PSBrZXljb2RlLmFycm93TGVmdCkge1xuICAgIGNhbGxiYWNrKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGl0QXJyb3dMZWZ0KGVsZW1lbnQgPSBkZWZhdWx0RWxlbWVudCkge1xuICBrZXlkb3duLmtleUNvZGUgPSBrZXljb2RlLmFycm93TGVmdDtcbiAgJChlbGVtZW50KS50cmlnZ2VyKGtleWRvd24pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJvd1JpZ2h0KGUsIGNhbGxiYWNrID0gbm9vcCkge1xuICBpZihlLmtleUNvZGUgPT09IGtleWNvZGUuYXJyb3dSaWdodCkge1xuICAgIGNhbGxiYWNrKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGl0QXJyb3dSaWdodChlbGVtZW50ID0gZGVmYXVsdEVsZW1lbnQpIHtcbiAga2V5ZG93bi5rZXlDb2RlID0ga2V5Y29kZS5hcnJvd1JpZ2h0O1xuICAkKGVsZW1lbnQpLnRyaWdnZXIoa2V5ZG93bik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGljayhlbGVtZW50ID0gZGVmYXVsdEVsZW1lbnQpIHsgJChlbGVtZW50KS5jbGljaygpOyB9XG4iLCJpbXBvcnQgeyBpc051bWVyaWMsIHRocm90dGxlLCBub29wLCB1dWlkLCBpc0hUTUxFbGVtZW50IH0gZnJvbSBcIi4vdXRpbHNcIlxuaW1wb3J0IEl0ZW0gZnJvbSBcIi4vaXRlbVwiO1xuaW1wb3J0IE9ic2VydmVyIGZyb20gXCIuL29ic2VydmVyXCI7XG5pbXBvcnQgUmVnaXN0ZXIgZnJvbSBcIi4vcmVnaXN0ZXJcIjtcbmltcG9ydCAqIGFzIGV2ZW50IGZyb20gXCIuL2V2ZW50XCI7XG5pbXBvcnQgR2FsbGVyeSBmcm9tIFwiLi9nYWxsZXJ5XCI7XG5cbmNvbnN0IEhhbmRsZWJhcnMgPSByZXF1aXJlKFwiaGFuZGxlYmFyc1wiKTtcbmNvbnN0ICQgPSByZXF1aXJlKFwianF1ZXJ5XCIpO1xuXG5jb25zdCBnYWxsZXJ5ID0gR2FsbGVyeSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIFNob3dyb29tKGl0ZW1zID0gW10sIG9wdGlvbnMpIHtcblxuICBvcHRpb25zID0gJC5leHRlbmQoe1xuICAgIGNzc0NsYXNzOiBcImZ0dy1zaG93cm9vbVwiLFxuICAgIHJlbmRlcixcbiAgICB0YWlsOiBub29wLFxuICAgIGhlYWQ6IG5vb3AsXG4gICAgZmV0Y2gsXG4gICAgdGVtcGxhdGUsXG4gICAgdGFyZ2V0OiBcImJvZHlcIixcbiAgICBkaXNwbGF5Q3VycmVudDogdHJ1ZSxcbiAgICBkaXNwbGF5VG90YWw6IHRydWUsXG4gICAgdG90YWw6IDAsXG4gICAgb2Zmc2V0OiAwXG4gIH0sIG9wdGlvbnMpO1xuXG4gIHNldE9mZnNldChvcHRpb25zLm9mZnNldCk7XG5cbiAgbGV0IHRlbXBsYXRlID0gSGFuZGxlYmFycy5jb21waWxlKG9wdGlvbnMudGVtcGxhdGUgfHwgYFxuICAgIDxkaXYgY2xhc3M9XCJ7e3Nob3dyb29tLm9wdGlvbnMuY3NzQ2xhc3N9fVwiPlxuICAgICAgPGhlYWRlciBjbGFzcz1cImZ0dy1zaG93cm9vbS1oZWFkZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImZ0dy1zaG93cm9vbS1sZWZ0XCI+XG4gICAgICAgICAge3sjaWYgc2hvd3Jvb20ub3B0aW9ucy5kaXNwbGF5Q3VycmVudH19XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImZ0dy1zaG93cm9vbS1jdXJyZW50XCI+e3tzaG93cm9vbS5jdXJyZW50fX08L3NwYW4+XG4gICAgICAgICAge3svaWZ9fVxuICAgICAgICAgIHt7I2lmIHNob3dyb29tLm9wdGlvbnMuZGlzcGxheVRvdGFsfX1cbiAgICAgICAgICAgIHt7I2lmIHNob3dyb29tLm9wdGlvbnMudG90YWx9fTxzcGFuPi88L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZnR3LXNob3dyb29tLXRvdGFsXCI+e3tzaG93cm9vbS5vcHRpb25zLnRvdGFsfX08L3NwYW4+XG4gICAgICAgICAgICB7ey9pZn19XG4gICAgICAgICAge3svaWZ9fVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJmdHctc2hvd3Jvb20tdGl0bGVcIj57e2l0ZW0udGl0bGV9fTwvc3Bhbj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImZ0dy1zaG93cm9vbS1yaWdodFwiPlxuICAgICAgICAgIDxhIGNsYXNzPVwiZnR3LXNob3dyb29tLWJ1dHRvbiBmdHctc2hvd3Jvb20tY2xvc2VcIj48L2E+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9oZWFkZXI+XG4gICAgICA8ZGl2IGNsYXNzPVwiZnR3LXNob3dyb29tLWNvbnRlbnRcIj5cbiAgICAgICAge3t7Y29udGVudH19fVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIGApO1xuXG4gIGxldCBlbGVtZW50ID0gJCgpO1xuXG4gIGl0ZW1zID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoaXRlbXMpO1xuXG4gIGxldCBodG1sRWxlbWVudENvdW50ID0gaXRlbXMuZmlsdGVyKGlzSFRNTEVsZW1lbnQpLmxlbmd0aDtcbiAgaWYoaHRtbEVsZW1lbnRDb3VudCAmJiBodG1sRWxlbWVudENvdW50IDwgaXRlbXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIG9iamVjdCBzZXQgaXMgbm90IGNvbnNpc3RlbmRcIik7XG4gIH1cblxuICBpZihpdGVtcy5maWx0ZXIoaXRlbSA9PiBpdGVtLmdldEF0dHJpYnV0ZShcImRhdGEtc2hvd3Jvb20tdGFyZ2V0LWl0ZW1cIikpLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIlNob3dyb29tIGl0ZW1zIG11c3Qgbm90IGNvbnRhaW4gcmVmZXJlbmNlc1wiKTtcbiAgfVxuXG4gIGl0ZW1zID0gaXRlbXMubWFwKGl0ZW0gPT4gSXRlbShpdGVtKSk7XG5cbiAgbGV0IHJlZ2lzdGVyID0gUmVnaXN0ZXIoaXRlbXMsIHsgdGFpbDogb3B0aW9ucy50YWlsLCBoZWFkOiBvcHRpb25zLmhlYWQgfSk7XG4gIGxldCB0YXJnZXQgPSAkKG9wdGlvbnMudGFyZ2V0KTtcbiAgY29uc3Qgc2hvd3Jvb21PYnNlcnZlciA9IE9ic2VydmVyKFwiXCIpO1xuXG4gIGxldCB0aHJvdHRsZWROZXh0ID0gdGhyb3R0bGUobmV4dCwgMTAwMCwgeyB0cmFpbGluZzogZmFsc2UgfSk7XG5cbiAgbGV0IHRocm90dGxlZFByZXYgPSB0aHJvdHRsZShwcmV2LCAxMDAwLCB7IHRyYWlsaW5nOiBmYWxzZSB9KTtcblxuICBsZXQgaXNPcGVuID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gY2hlY2tBcnJvd3MoKSB7XG4gICAgbGV0IG5leHRCdXR0b24gPSAkKFwiLmZ0dy1zaG93cm9vbS1uZXh0XCIsIGVsZW1lbnQpO1xuICAgIGxldCBwcmV2QnV0dG9uID0gJChcIi5mdHctc2hvd3Jvb20tcHJldlwiLCBlbGVtZW50KTtcblxuICAgIGN1cnJlbnQoKSA8IG9wdGlvbnMudG90YWwgPyBuZXh0QnV0dG9uLnNob3coKSA6IG5leHRCdXR0b24uaGlkZSgpO1xuICAgIHJlZ2lzdGVyLmhhc1ByZXYoKSA/IHByZXZCdXR0b24uc2hvdygpIDogcHJldkJ1dHRvbi5oaWRlKCk7XG4gIH1cblxuICBmdW5jdGlvbiBmZXRjaChpdGVtKSB7IHJldHVybiAkLmdldChpdGVtLnRhcmdldCk7IH07XG5cbiAgZnVuY3Rpb24gcmVuZGVyKGNvbnRlbnQpIHtcbiAgICByZXR1cm4gJC53aGVuKGNvbnRlbnQpLnBpcGUoKGNvbnRlbnQpID0+IHtcbiAgICAgIHJldHVybiAkKHRlbXBsYXRlKHsgc2hvd3Jvb206IHJldmVhbCwgY29udGVudDogY29udGVudCwgaXRlbTogcmVnaXN0ZXIuY3VycmVudCB9KSk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBzaG93SXRlbShpdGVtKSB7XG4gICAgcmV0dXJuICQud2hlbihvcHRpb25zLmZldGNoKGl0ZW0pKS5waXBlKG9wdGlvbnMucmVuZGVyKS5waXBlKChuZXdFbGVtZW50KSA9PiB7XG4gICAgICBlbGVtZW50LnJlbW92ZSgpO1xuICAgICAgZWxlbWVudCA9IG5ld0VsZW1lbnQgfHwgJCgpO1xuICAgICAgZWxlbWVudC5zaG93KCk7XG4gICAgICB0YXJnZXQuYXBwZW5kKGVsZW1lbnQpLmFkZENsYXNzKFwiZnR3LXNob3dyb29tLW9wZW5cIik7XG4gICAgICBjaGVja0Fycm93cygpO1xuICAgIH0pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHNlbGVjdChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgbGV0IGl0ZW0gPSByZWdpc3Rlci5pdGVtcy5maWx0ZXIoXG4gICAgICBpdGVtID0+IGl0ZW0uaWQgPT09IChldmVudC5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtc2hvd3Jvb20taWRcIikgfHwgZXZlbnQuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXNob3dyb29tLXRhcmdldC1pdGVtXCIpKVxuICAgIClbMF07XG4gICAgaWYoaXRlbSkge1xuICAgICAgb3BlbihpdGVtKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICB0YXJnZXQucmVtb3ZlQ2xhc3MoXCJmdHctc2hvd3Jvb20tb3BlblwiKTtcbiAgICBlbGVtZW50LmhpZGUoKTtcbiAgICBzaG93cm9vbU9ic2VydmVyLnJlc2V0KCk7XG4gICAgaXNPcGVuID0gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiBvcGVuKGl0ZW0pIHtcbiAgICBpZighcmVnaXN0ZXIuc2l6ZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpdGVtID0gaXRlbSB8fCByZWdpc3Rlci5pdGVtc1swXTtcbiAgICByZWdpc3Rlci5zZXQoaXRlbSk7XG4gICAgc2hvd3Jvb21PYnNlcnZlci51cGRhdGUoaXRlbS5pZCk7XG4gICAgaWYoc2hvd3Jvb21PYnNlcnZlci5oYXNDaGFuZ2VkKCkpIHtcbiAgICAgIGlzT3BlbiA9IHRydWU7XG4gICAgICBnYWxsZXJ5LmNsb3NlT3RoZXJzKHJldmVhbCk7XG4gICAgICByZXR1cm4gc2hvd0l0ZW0oaXRlbSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbmV4dCgpIHtcbiAgICBpZighaXNPcGVuKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJlZ2lzdGVyLm5leHQoKTtcbiAgICBvcGVuKHJlZ2lzdGVyLmN1cnJlbnQpO1xuICB9XG5cbiAgZnVuY3Rpb24gcHJldigpIHtcbiAgICBpZighaXNPcGVuKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJlZ2lzdGVyLnByZXYoKTtcbiAgICBvcGVuKHJlZ2lzdGVyLmN1cnJlbnQpO1xuICB9XG5cbiAgZnVuY3Rpb24gYXBwZW5kKG5vZGVzKSB7XG4gICAgaXRlbXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChub2Rlcyk7XG4gICAgaXRlbXMgPSBpdGVtcy5tYXAoaXRlbSA9PiBJdGVtKGl0ZW0pKTtcbiAgICByZWdpc3Rlci5hcHBlbmQoaXRlbXMpO1xuICAgIGNoZWNrQXJyb3dzKCk7XG4gIH1cblxuICBmdW5jdGlvbiBwcmVwZW5kKG5vZGVzKSB7XG4gICAgaXRlbXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChub2Rlcyk7XG4gICAgaXRlbXMgPSBpdGVtcy5tYXAoaXRlbSA9PiBJdGVtKGl0ZW0pKTtcbiAgICBpZiAob3B0aW9ucy5vZmZzZXQgPiAwKSB7XG4gICAgICBvcHRpb25zLm9mZnNldCAtPSBpdGVtcy5sZW5ndGg7XG4gICAgfVxuICAgIHJlZ2lzdGVyLnByZXBlbmQoaXRlbXMpO1xuICAgIGNoZWNrQXJyb3dzKCk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldChpdGVtcyA9IFtdLCBvZmZzZXQgPSAwKSB7XG4gICAgY2xvc2UoKTtcbiAgICBpdGVtcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGl0ZW1zKTtcbiAgICBpdGVtcyA9IGl0ZW1zLm1hcChpdGVtID0+IEl0ZW0oaXRlbSkpO1xuICAgIHNldE9mZnNldChvZmZzZXQpO1xuICAgIHJlZ2lzdGVyLnJlc2V0KGl0ZW1zKTtcbiAgICBjaGVja0Fycm93cygpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICBlbGVtZW50LnJlbW92ZSgpO1xuICAgIHJlZ2lzdGVyLnJlc2V0KCk7XG4gICAgZWxlbWVudCA9ICQoKTtcbiAgICB0YXJnZXQucmVtb3ZlQ2xhc3MoXCJmdHctc2hvd3Jvb20tb3BlblwiKTtcbiAgICByZWdpc3Rlci5pdGVtcy5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5kZXN0cm95KCkpO1xuICAgIGdhbGxlcnkudW5yZWdpc3RlcihyZXZlYWwpO1xuICAgIGlzT3BlbiA9IGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0T2Zmc2V0KHZhbHVlKSB7XG4gICAgb3B0aW9ucy5vZmZzZXQgPSBNYXRoLm1heCgwLCB2YWx1ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRUb3RhbCh2YWx1ZSkge1xuICAgIGlmKCFpc051bWVyaWModmFsdWUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IodmFsdWUgKyBcIiBpcyBub3QgYSBudW1iZXJcIik7XG4gICAgfVxuICAgIG9wdGlvbnMudG90YWwgPSB2YWx1ZTtcbiAgICBpZihpc09wZW4pIHtcbiAgICAgIHNob3dyb29tT2JzZXJ2ZXIucmVzZXQoKTtcbiAgICAgIHJldHVybiBvcGVuKHJlZ2lzdGVyLmN1cnJlbnQpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGN1cnJlbnQoKSB7XG4gICAgcmV0dXJuIHJlZ2lzdGVyLnBvaW50ZXIgKyAxICsgb3B0aW9ucy5vZmZzZXQ7XG4gIH1cblxuICAkKGRvY3VtZW50KVxuICAgIC5vbihcImNsaWNrXCIsIFwiLmZ0dy1zaG93cm9vbS1jbG9zZVwiLCBjbG9zZSlcbiAgICAub24oXCJrZXlkb3duXCIsIChlKSA9PiB7XG4gICAgICBldmVudC5pc0VzY2FwZShlLCBjbG9zZSk7XG4gICAgICBldmVudC5pc0Fycm93UmlnaHQoZSwgdGhyb3R0bGVkTmV4dCk7XG4gICAgICBldmVudC5pc0Fycm93TGVmdChlLCB0aHJvdHRsZWRQcmV2KTtcbiAgICB9KVxuICAgIC5vbihcImNsaWNrXCIsIFwiLnNob3dyb29tLWl0ZW1cIiwgc2VsZWN0KVxuICAgIC5vbihcImNsaWNrXCIsIFwiLnNob3dyb29tLXJlZmVyZW5jZVwiLCBzZWxlY3QpXG4gICAgLm9uKFwiY2xpY2tcIiwgXCIuZnR3LXNob3dyb29tLXByZXZcIiwgdGhyb3R0bGVkUHJldilcbiAgICAub24oXCJjbGlja1wiLCBcIi5mdHctc2hvd3Jvb20tbmV4dFwiLCB0aHJvdHRsZWROZXh0KTtcblxuICBsZXQgcmV2ZWFsID0ge1xuICAgIG9wZW4sXG4gICAgY2xvc2UsXG4gICAgbmV4dCxcbiAgICBwcmV2LFxuICAgIGFwcGVuZCxcbiAgICBwcmVwZW5kLFxuICAgIHJlc2V0LFxuICAgIGRlc3Ryb3ksXG4gICAgc2V0VG90YWwsXG4gICAgc2V0T2Zmc2V0XG4gIH1cblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkocmV2ZWFsLCBcIm9wdGlvbnNcIiwgeyBnZXQ6ICgpID0+IHsgcmV0dXJuIG9wdGlvbnM7IH19KTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJldmVhbCwgXCJjdXJyZW50XCIsIHsgZ2V0OiAoKSA9PiB7IHJldHVybiBjdXJyZW50KCk7IH19KTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJldmVhbCwgXCJpdGVtc1wiLCB7IGdldDogKCkgPT4geyByZXR1cm4gcmVnaXN0ZXIuaXRlbXM7IH19KTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJldmVhbCwgXCJlbGVtZW50XCIsIHsgZ2V0OiAoKSA9PiB7IHJldHVybiBlbGVtZW50OyB9fSk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXZlYWwsIFwiaXNPcGVuXCIsIHsgZ2V0OiAoKSA9PiB7IHJldHVybiBpc09wZW47IH0gfSk7XG5cbiAgZ2FsbGVyeS5yZWdpc3RlcihyZXZlYWwpO1xuXG4gIHJldHVybiBPYmplY3QuZnJlZXplKHJldmVhbCk7XG5cbn07XG4iLCJpbXBvcnQgeyByZW1vdmUgYXMgcmVtb3ZlRnJvbUFycmF5IH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuY29uc3QgJCA9IHJlcXVpcmUoXCJqcXVlcnlcIik7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEdhbGxlcnkoc2hvd3Jvb21zID0gW10pIHtcblxuICBpZighQXJyYXkuaXNBcnJheShzaG93cm9vbXMpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQXJndW1lbnQ6IHNob3dyb29tcyBpcyBub3QgYSBsaXN0XCIpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVnaXN0ZXIoc2hvd3Jvb20pIHsgcmV0dXJuIHNob3dyb29tcy5wdXNoKHNob3dyb29tKTsgfVxuXG4gIGZ1bmN0aW9uIHVucmVnaXN0ZXIoc2hvd3Jvb20pIHsgcmV0dXJuIHJlbW92ZUZyb21BcnJheShzaG93cm9vbXMsIHNob3dyb29tKTsgfVxuXG4gIGZ1bmN0aW9uIGdldE9wZW5TaG93cm9vbXMoKSB7IHJldHVybiBzaG93cm9vbXMuZmlsdGVyKHNob3dyb29tID0+IHNob3dyb29tLmlzT3Blbik7IH1cblxuICBmdW5jdGlvbiBjbG9zZU90aGVycyhjdXJyZW50KSB7XG4gICAgY29uc3Qgb3BlblNob3dyb29tcyA9IHJlbW92ZUZyb21BcnJheShnZXRPcGVuU2hvd3Jvb21zKCksIGN1cnJlbnQpO1xuICAgIGlmKG9wZW5TaG93cm9vbXMubGVuZ3RoID4gMCkge1xuICAgICAgb3BlblNob3dyb29tcy5mb3JFYWNoKHNob3dyb29tID0+IHNob3dyb29tLmNsb3NlKCkpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb3NlT3BlblNob3dyb29tcygpIHsgZ2V0T3BlblNob3dyb29tcy5mb3JFYWNoKChzaG93cm9vbSkgPT4gc2hvd3Jvb20uY2xvc2UoKSk7IH1cblxuICBmdW5jdGlvbiBpdGVtcygpIHsgcmV0dXJuIHNob3dyb29tczsgfVxuXG4gIGxldCByZXZlYWwgPSB7XG4gICAgcmVnaXN0ZXIsXG4gICAgdW5yZWdpc3RlcixcbiAgICBjbG9zZU90aGVyc1xuICB9O1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXZlYWwsIFwiaXRlbXNcIiwgeyBnZXQ6ICgpID0+IHsgcmV0dXJuIGl0ZW1zKCk7IH0gfSlcblxuICByZXR1cm4gT2JqZWN0LmZyZWV6ZShyZXZlYWwpO1xuXG59XG4iLCJpbXBvcnQgeyBnZW5lcmF0ZVVVSUQgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJdGVtKGVsZW1lbnQpIHtcblxuICBsZXQgcmV2ZWFsID0ge307XG4gIGxldCBzaG93cm9vbUlkID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXNob3dyb29tLWlkXCIpIHx8IGdlbmVyYXRlVVVJRCgpO1xuXG4gIGVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS1zaG93cm9vbS1pZFwiLCBzaG93cm9vbUlkKTtcblxuICBmdW5jdGlvbiBkZXN0cm95KCkgeyBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShcImRhdGEtc2hvd3Jvb20taWRcIik7IH1cblxuICByZXR1cm4gT2JqZWN0LmZyZWV6ZSh7XG4gICAgaWQ6IHNob3dyb29tSWQsXG4gICAgZWxlbWVudCxcbiAgICB0YXJnZXQ6IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1zaG93cm9vbS10YXJnZXRcIikgfHwgXCJcIixcbiAgICB0aXRsZTogZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXNob3dyb29tLXRpdGxlXCIpIHx8IFwiXCIsXG4gICAgZGVzdHJveVxuICB9KTtcblxufVxuIiwiY29uc3QgJCA9IHJlcXVpcmUoXCJqcXVlcnlcIik7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE9ic2VydmVyKHZhbHVlKSB7XG5cbiAgbGV0IGNoYW5nZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiB1cGRhdGUobmV3VmFsdWUpIHtcbiAgICBpZih2YWx1ZSA9PT0gbmV3VmFsdWUpIHtcbiAgICAgIGNoYW5nZWQgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgfVxuICAgIHZhbHVlID0gbmV3VmFsdWU7XG4gIH1cblxuICBmdW5jdGlvbiBoYXNDaGFuZ2VkKCkgeyByZXR1cm4gY2hhbmdlZDsgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0KCkge1xuICAgIGNoYW5nZWQgPSBmYWxzZTtcbiAgICB2YWx1ZSA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGxldCByZXZlYWwgPSB7XG4gICAgdXBkYXRlLFxuICAgIGhhc0NoYW5nZWQsXG4gICAgcmVzZXRcbiAgfVxuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXZlYWwsIFwidmFsdWVcIiwge1xuICAgIGdldDogKCkgPT4geyByZXR1cm4gdmFsdWU7IH1cbiAgfSk7XG5cbiAgcmV0dXJuIE9iamVjdC5mcmVlemUocmV2ZWFsKTtcblxufVxuIiwiaW1wb3J0IHsgbm9vcCB9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgT2JlcnNlcnZlciBmcm9tIFwiLi9vYnNlcnZlclwiO1xudmFyICQgPSByZXF1aXJlKFwianF1ZXJ5XCIpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBSZWdpc3RlcihpdGVtcyA9IFtdLCBvcHRpb25zKSB7XG5cbiAgb3B0aW9ucyA9ICQuZXh0ZW5kKHtcbiAgICBoZWFkOiBub29wLFxuICAgIHRhaWw6IG5vb3BcbiAgfSwgb3B0aW9ucylcblxuICBsZXQgcG9pbnRlciA9IDA7XG5cbiAgbGV0IHJldmVhbCA9IHt9O1xuXG4gIGNvbnN0IHBvaW50ZXJPYmVyc2VydmVyID0gT2JlcnNlcnZlcihwb2ludGVyKTtcbiAgY29uc3QgaXRlbU9iZXJzZXJ2ZXIgPSBPYmVyc2VydmVyKCk7XG5cbiAgZnVuY3Rpb24gYXBwZW5kKHB1c2hJdGVtcyA9IFtdKSB7XG4gICAgaXRlbXMgPSAkLm1lcmdlKGl0ZW1zLCBwdXNoSXRlbXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gcHJlcGVuZChwdXNoSXRlbXMgPSBbXSkge1xuICAgIHBvaW50ZXIgKz0gcHVzaEl0ZW1zLmxlbmd0aDtcbiAgICBpdGVtcyA9ICQubWVyZ2UocHVzaEl0ZW1zLCBpdGVtcyk7XG4gIH1cblxuICBmdW5jdGlvbiBjaGVja1BvaW50ZXIoKSB7XG4gICAgcG9pbnRlck9iZXJzZXJ2ZXIudXBkYXRlKHBvaW50ZXIpO1xuICAgIGlmKHBvaW50ZXJPYmVyc2VydmVyLmhhc0NoYW5nZWQoKSB8fCBpdGVtT2JlcnNlcnZlci5oYXNDaGFuZ2VkKCkpIHtcbiAgICAgIHBlcmZvcm1DYWxscygpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBlcmZvcm1DYWxscygpIHtcbiAgICBpZiAocG9pbnRlciA9PT0gMCkge1xuICAgICAgb3B0aW9ucy5oZWFkKHJldmVhbC5jdXJyZW50KTtcbiAgICB9XG4gICAgaWYgKHBvaW50ZXIgPT09IHJldmVhbC5zaXplIC0gMSkge1xuICAgICAgb3B0aW9ucy50YWlsKHJldmVhbC5jdXJyZW50KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBuZXh0KCkge1xuICAgIGlmKGhhc05leHQoKSkge1xuICAgICAgcG9pbnRlciArPSAxO1xuICAgIH1cbiAgICBjaGVja1BvaW50ZXIoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHByZXYoKSB7XG4gICAgaWYoaGFzUHJldigpKSB7XG4gICAgICBwb2ludGVyIC09IDE7XG4gICAgfVxuICAgIGNoZWNrUG9pbnRlcigpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0KGl0ZW0pIHtcbiAgICBpdGVtT2JlcnNlcnZlci51cGRhdGUoaXRlbS5pZCk7XG4gICAgbGV0IGluZGV4ID0gaXRlbXMuaW5kZXhPZihpdGVtKTtcbiAgICBpZihpbmRleCA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkl0ZW0gd2FzIG5vdCBmb3VuZFwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcG9pbnRlciA9IGluZGV4O1xuICAgIH1cbiAgICBjaGVja1BvaW50ZXIoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0KHJlc2V0SXRlbXMgPSBbXSkge1xuICAgIGl0ZW1zID0gcmVzZXRJdGVtcztcbiAgICBwb2ludGVyID0gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhc05leHQoKSB7IHJldHVybiBwb2ludGVyIDwgaXRlbXMubGVuZ3RoIC0gMTsgfVxuXG4gIGZ1bmN0aW9uIGhhc1ByZXYoKSB7IHJldHVybiBwb2ludGVyID4gMDsgfVxuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXZlYWwsIFwiY3VycmVudFwiLCB7IGdldDogKCkgPT4geyByZXR1cm4gaXRlbXNbcG9pbnRlcl07IH19KTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJldmVhbCwgXCJzaXplXCIsIHsgZ2V0OiAoKSA9PiB7IHJldHVybiBpdGVtcy5sZW5ndGg7IH19KTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJldmVhbCwgXCJpdGVtc1wiLCB7IGdldDogKCkgPT4geyByZXR1cm4gaXRlbXM7IH19KTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJldmVhbCwgXCJwb2ludGVyXCIsIHsgZ2V0OiAoKSA9PiB7IHJldHVybiBwb2ludGVyOyB9fSk7XG4gIHJldmVhbC5oYXNOZXh0ID0gaGFzTmV4dDtcbiAgcmV2ZWFsLmhhc1ByZXYgPSBoYXNQcmV2O1xuICByZXZlYWwubmV4dCA9IG5leHQ7XG4gIHJldmVhbC5wcmV2ID0gcHJldjtcbiAgcmV2ZWFsLnByZXBlbmQgPSBwcmVwZW5kXG4gIHJldmVhbC5hcHBlbmQgPSBhcHBlbmQ7XG4gIHJldmVhbC5zZXQgPSBzZXQ7XG4gIHJldmVhbC5yZXNldCA9IHJlc2V0O1xuICByZXZlYWwucGVyZm9ybUNhbGxzID0gcGVyZm9ybUNhbGxzO1xuXG4gIHJldHVybiBPYmplY3QuZnJlZXplKHJldmVhbCk7XG5cbn1cbiIsImxldCAkID0gcmVxdWlyZShcImpxdWVyeVwiKTtcblxuZXhwb3J0IGZ1bmN0aW9uIG5vb3AoKSB7fTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlVVVJRCgpIHtcbiAgdmFyIGQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgdmFyIHV1aWQgPSAneHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4Jy5yZXBsYWNlKC9beHldL2csIGZ1bmN0aW9uKGMpIHtcbiAgICB2YXIgciA9IChkICsgTWF0aC5yYW5kb20oKSoxNiklMTYgfCAwO1xuICAgIGQgPSBNYXRoLmZsb29yKGQvMTYpO1xuICAgIHJldHVybiAoYz09J3gnID8gciA6IChyJjB4M3wweDgpKS50b1N0cmluZygxNik7XG4gIH0pO1xuICByZXR1cm4gdXVpZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzSFRNTEVsZW1lbnQob2JqKSB7IHJldHVybiBvYmogaW5zdGFuY2VvZiBIVE1MRWxlbWVudDsgfVxuXG5leHBvcnQgZnVuY3Rpb24gbm93KCkgeyByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7IH1cblxuLy8gSW5zcGlyZWQgYnkgaHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvI3Rocm90dGxlXG5leHBvcnQgZnVuY3Rpb24gdGhyb3R0bGUoZnVuYyA9IGZ1bmN0aW9uKCkge30sIHdhaXQgPSAyNTAsIG9wdGlvbnMgPSB7fSkge1xuICBsZXQgdGltZW91dDtcbiAgbGV0IHJlc3VsdDtcbiAgbGV0IHByZXZpb3VzID0gMDtcbiAgb3B0aW9ucyA9ICQuZXh0ZW5kKHtcbiAgICBsZWFkaW5nOiB0cnVlLFxuICAgIHRyYWlsaW5nOiB0cnVlXG4gIH0sIG9wdGlvbnMpO1xuXG4gIGZ1bmN0aW9uIGxhdGVyKCkge1xuICAgIHByZXZpb3VzID0gIW9wdGlvbnMubGVhZGluZyA/IDAgOiBub3coKTtcbiAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICByZXN1bHQgPSBmdW5jKCk7XG4gIH07XG5cbiAgZnVuY3Rpb24gdGhyb3R0bGVkKCkge1xuICAgIGxldCBleGVjdXRpb25UaW1lc3RhbXAgPSBub3coKTtcbiAgICBpZiAoIXByZXZpb3VzICYmICFvcHRpb25zLmxlYWRpbmcpIHByZXZpb3VzID0gZXhlY3V0aW9uVGltZXN0YW1wO1xuICAgIGxldCByZW1haW5pbmcgPSB3YWl0IC0gKGV4ZWN1dGlvblRpbWVzdGFtcCAtIHByZXZpb3VzKTtcbiAgICBpZiAocmVtYWluaW5nIDw9IDAgfHwgcmVtYWluaW5nID4gd2FpdCkge1xuICAgICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIHByZXZpb3VzID0gZXhlY3V0aW9uVGltZXN0YW1wO1xuICAgICAgcmVzdWx0ID0gZnVuYygpO1xuICAgIH0gZWxzZSBpZiAoIXRpbWVvdXQgJiYgIW9wdGlvbnMudHJhaWxpbmcpIHtcbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCByZW1haW5pbmcpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIHRocm90dGxlZC5jYW5jZWwgPSBmdW5jdGlvbigpIHtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgcHJldmlvdXMgPSAwO1xuICAgIHRpbWVvdXQgPSBudWxsO1xuICB9O1xuXG4gIHJldHVybiB0aHJvdHRsZWQ7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gaXNOdW1lcmljKG4pIHtcbiAgcmV0dXJuICFpc05hTihwYXJzZUZsb2F0KG4pKSAmJiBpc0Zpbml0ZShuKTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmUoYXJyYXksIGVsZW1lbnQpIHtcbiAgY29uc3QgaW5kZXggPSBhcnJheS5pbmRleE9mKGVsZW1lbnQpO1xuICBpZihpbmRleCA+PSAwKSB7XG4gICAgYXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG4iXX0=
