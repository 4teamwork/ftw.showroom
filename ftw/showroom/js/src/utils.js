let $ = require("jquery");

export function noop() {};

export function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
  return uuid;
}

export function isHTMLElement(obj) { return obj instanceof HTMLElement; }

export function now() { return new Date().getTime(); }

// Inspired by http://underscorejs.org/#throttle
export function throttle(func = function() {}, wait = 250, options = {}) {
  let timeout;
  let result;
  let previous = 0;
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
    let executionTimestamp = now();
    if (!previous && !options.leading) previous = executionTimestamp;
    let remaining = wait - (executionTimestamp - previous);
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

  throttled.cancel = function() {
    clearTimeout(timeout);
    previous = 0;
    timeout = null;
  };

  return throttled;
};

export function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};
