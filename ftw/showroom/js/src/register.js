import { noop } from "./utils";
var $ = require("jquery");

export default function Register(items = [], options) {

  options = $.extend({
    head: noop,
    tail: noop
  }, options)

  let pointer = 0;

  let reveal = {};


  function append(pushItems = []) { items = $.merge(items, pushItems); }

  function checkPointer() {
    if (pointer === 0) {
      options.head(reveal.current);
    }
    if (pointer === reveal.size - 1) {
      options.tail(reveal.current);
    }
  }

  function next() {
    if(pointer < reveal.size - 1) {
      pointer += 1;
    }
    checkPointer();
  }

  function prev() {
    if(pointer > 0) {
      pointer -= 1;
    }
    checkPointer();
  }

  function set(item) {
    let index = items.indexOf(item);
    if(index === -1) {
      throw new Error("Item was not found");
    } else {
      pointer = index;
    }
    checkPointer();
  }

  Object.defineProperty(reveal, "current", { get: () => { return items[pointer]; }});
  Object.defineProperty(reveal, "size", { get: () => { return items.length; }});
  Object.defineProperty(reveal, "items", { get: () => { return items; }});
  Object.defineProperty(reveal, "pointer", { get: () => { return pointer; }});
  reveal.next = next;
  reveal.prev = prev;
  reveal.append = append;
  reveal.set = set;

  checkPointer();

  return Object.freeze(reveal);

}
