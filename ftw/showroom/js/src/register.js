import { noop } from "./utils";
import Oberserver from "./observer";
var $ = require("jquery");

export default function Register(items = [], options) {

  options = $.extend({
    head: noop,
    tail: noop
  }, options)

  let pointer = 0;

  let reveal = {};

  let oberserver = Oberserver(pointer);

  function append(pushItems = []) {
    items = $.merge(items, pushItems);
  }

  function prepend(pushItems = []) {
    pointer += pushItems.length;
    items = $.merge(pushItems, items);
  }

  function checkPointer() {
    oberserver.update(pointer);
    if(oberserver.hasChanged()) {
      if (pointer === 0) {
        options.head(reveal.current);
      }
      if (pointer === reveal.size - 1) {
        options.tail(reveal.current);
      }
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

  function reset(resetItems = []) {
    items = resetItems;
    pointer = 0;
  }

  function hasNext() { return pointer < items.length - 1; }

  function hasPrev() { return pointer > 0; }

  Object.defineProperty(reveal, "current", { get: () => { return items[pointer]; }});
  Object.defineProperty(reveal, "size", { get: () => { return items.length; }});
  Object.defineProperty(reveal, "items", { get: () => { return items; }});
  Object.defineProperty(reveal, "pointer", { get: () => { return pointer; }});
  reveal.hasNext = hasNext;
  reveal.hasPrev = hasPrev;
  reveal.next = next;
  reveal.prev = prev;
  reveal.prepend = prepend
  reveal.append = append;
  reveal.set = set;
  reveal.reset = reset;

  return Object.freeze(reveal);

}
