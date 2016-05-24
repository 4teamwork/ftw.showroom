import { isNumeric, throttle, noop, uuid, isHTMLElement } from "./utils"
import Item from "./item";
import Observer from "./observer";
import Register from "./register";
import * as event from "./event";

let Handlebars = require("handlebars");
let $ = require("jquery");

module.exports = function Showroom(items = [], options) {

  options = $.extend({
    cssClass: "ftw-showroom",
    render,
    tail: noop,
    head: noop,
    fetch,
    template,
    target: "body"
  }, options);

  var reveal = {};

  let template = Handlebars.compile(`
    <div class="{{showroom.cssClass}}">
      <header class="ftw-showroom-header">
        <div class="ftw-showroom-left">
          <span class="ftw-showroom-current">{{showroom.current}}</span>
          {{#if showroom.total}}<span>/</span>{{/if}}
          <span class="ftw-showroom-total">{{showroom.total}}</span>
        </div>
        <span class="ftw-showroom-title">{{item.title}}</span>
        <div class="ftw-showroom-right">
          <a id="ftw-showroom-close" class="ftw-showroom-button"></a>
        </div>
      </header>
      <div class="ftw-showroom-content">
        {{{content}}}
      </div>
    </div>
  `);

  let element = $();

  items = Array.prototype.slice.call(items);

  let htmlElementCount = items.filter(isHTMLElement).length;
  if(htmlElementCount && htmlElementCount < items.length) {
    throw new Error("The object set is not consistend");
  }

  items = items.map(item => Item(item));
  items.map(item => $(item.element).on("click", select));

  let register = Register(items, { tail: options.tail, head: options.head });
  let target = $(options.target);
  let observer = Observer();

  let throttledNext = throttle(next, 1000, { trailing: false });

  let throttledPrev = throttle(prev, 1000, { trailing: false });

  let isOpen = false;

  function fetch(item) { return $.get(item.target); };

  function bindEvents() {
    element.on("click", "#ftw-showroom-next", throttledNext);
    element.on("click", "#ftw-showroom-prev", throttledPrev);
  };

  function render(content) {
    return $.when(content).pipe((content) => {
      return $(template({ showroom: reveal, content: content, item: register.current }));
    });
  }

  function showItem(item) {
    return $.when(options.fetch(item)).pipe(options.render).pipe((newElement) => {
      element.remove();
      element = newElement || $();
      element.show();
      isOpen = true;
      target.append(element).addClass("ftw-showroom-open");
      bindEvents();
    });
  };

  function select(event) {
    event.preventDefault();
    let item = register.items.filter(
      item => item.id === event.currentTarget.getAttribute("data-showroom-id")
    )[0];
    open(item);
  }

  function close() {
    target.removeClass("ftw-showroom-open");
    element.hide();
    observer.reset();
    isOpen = false;
  }

  function open(item) {
    if(!register.size) {
      return false;
    }
    item = item || register.items[0];
    register.set(item);
    observer.update(item);
    if(observer.hasChanged()) {
      return showItem(item);
    }
  }

  function next() {
    register.next();
    open(register.current);
  }

  function prev() {
    register.prev();
    open(register.current);
  }

  function append(nodes) {
    items = Array.prototype.slice.call(nodes);
    items = items.map(item => Item(item));
    items.map(item => $(item.element).on("click", select));
    register.append(items);
  }

  function reset(items = []) {
    close();
    items = Array.prototype.slice.call(items);
    items = items.map(item => Item(item));
    items.map(item => $(item.element).on("click", select));
    register.reset(items);
  }

  function destroy() {
    element.remove();
    register.reset();
    element = $();
    target.removeClass("ftw-showroom-open");
    register.items.forEach(item => item.destroy());
  }

  function setTotal(value) {
    if(!isNumeric(value)) {
      throw new Error(value + " is not a number");
    }
    options.total = value;
    if(isOpen) {
      observer.reset();
      return open(register.current);
    }
  }

  target.on("click", "#ftw-showroom-close", close);

  target.on("keydown", (e) => {
    event.isEscape(e, close);
    event.isArrowRight(e, throttledNext);
    event.isArrowLeft(e, throttledPrev);
  });

  reveal.open = open;
  reveal.close = close;
  reveal.next = next;
  reveal.prev = prev;
  reveal.append = append;
  reveal.reset = reset;
  reveal.destroy = destroy;
  reveal.setTotal = setTotal;

  Object.defineProperty(reveal, "cssClass", { get: () => { return options.cssClass; }});
  Object.defineProperty(reveal, "current", { get: () => { return register.pointer + 1; }});
  Object.defineProperty(reveal, "items", { get: () => { return register.items; }});
  Object.defineProperty(reveal, "element", { get: () => { return element; }});
  Object.defineProperty(reveal, "total", { get: () => { return options.total; }});

  return Object.freeze(reveal);

};
