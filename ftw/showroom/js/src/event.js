import { noop } from "./utils";

let $ = require("jquery");

let keycode = {
  enter: 13,
  escape: 27,
  arrowLeft: 37,
  arrowRight: 39
};

let defaultElement = $(document);
let keypress = $.Event("keypress");
let keyup = $.Event("keyup");
let keydown = $.Event("keydown");

export function isEnter(e, callback = noop) {
  if(e.keyCode === keycode.enter) {
    callback();
    return true;
  }
  return false;
}

export function hitEnter(element = defaultElement) {
  keydown.keyCode = keycode.enter;
  $(element).trigger(keydown);
}

export function isEscape(e, callback = noop) {
  if(e.keyCode === keycode.escape) {
    callback();
    return true;
  }
  return false;
}

export function hitEscape(element = defaultElement) {
  keydown.keyCode = keycode.escape;
  $(element).trigger(keydown);
}

export function isArrowLeft(e, callback = noop) {
  if(e.keyCode === keycode.arrowLeft) {
    callback();
    return true;
  }
  return false;
}

export function hitArrowLeft(element = defaultElement) {
  keydown.keyCode = keycode.arrowLeft;
  $(element).trigger(keydown);
}

export function isArrowRight(e, callback = noop) {
  if(e.keyCode === keycode.arrowRight) {
    callback();
    return true;
  }
  return false;
}

export function hitArrowRight(element = defaultElement) {
  keydown.keyCode = keycode.arrowRight;
  $(element).trigger(keydown);
}

export function click(element = defaultElement) { $(element).click(); }
