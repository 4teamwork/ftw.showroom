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
    target: "body",
    displayCurrent: true,
    displayTotal: true,
    total: 0,
    offset: 0
  }, options);

  setOffset(options.offset);

  let reveal = {};

  let template = Handlebars.compile(options.template || `
    <div class="{{showroom.options.cssClass}}">
      <header class="ftw-showroom-header">
        <div class="ftw-showroom-left">
          {{#if showroom.options.displayCurrent}}
            <span class="ftw-showroom-current">{{showroom.current}}</span>
          {{/if}}
          {{#if showroom.options.displayTotal}}
            {{#if showroom.options.total}}<span>/</span>
              <span class="ftw-showroom-total">{{showroom.options.total}}</span>
            {{/if}}
          {{/if}}
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

  if(items.filter(item => item.getAttribute("data-showroom-target-item")).length) {
    throw new Error("Showroom items must not contain references");
  }

  items = items.map(item => Item(item));

  let register = Register(items, { tail: options.tail, head: options.head });
  let target = $(options.target);
  let observer = Observer();

  let throttledNext = throttle(next, 1000, { trailing: false });

  let throttledPrev = throttle(prev, 1000, { trailing: false });

  let isOpen = false;

  function checkArrows() {
    let nextButton = $("#ftw-showroom-next", element);
    let prevButton = $("#ftw-showroom-prev", element);

    current() < options.total ? nextButton.show() : nextButton.hide();
    register.hasPrev() ? prevButton.show() : prevButton.hide();
  }

  function fetch(item) { return $.get(item.target); };

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
      checkArrows();
    });
  };

  function select(event) {
    event.preventDefault();
    let item = register.items.filter(
      item => item.id === (event.currentTarget.getAttribute("data-showroom-id") || event.currentTarget.getAttribute("data-showroom-target-item"))
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
    if(!isOpen) {
      return false;
    }
    register.next();
    open(register.current);
  }

  function prev() {
    if(!isOpen) {
      return false;
    }
    register.prev();
    open(register.current);
  }

  function append(nodes) {
    items = Array.prototype.slice.call(nodes);
    items = items.map(item => Item(item));
    register.append(items);
    checkArrows();
  }

  function prepend(nodes) {
    items = Array.prototype.slice.call(nodes);
    items = items.map(item => Item(item));
    if (options.offset > 0) {
      options.offset -= items.length;
    }
    register.prepend(items);
    checkArrows();
  }

  function reset(items = [], offset = 0) {
    close();
    items = Array.prototype.slice.call(items);
    items = items.map(item => Item(item));
    setOffset(offset);
    register.reset(items);
    checkArrows();
  }

  function destroy() {
    element.remove();
    register.reset();
    element = $();
    target.removeClass("ftw-showroom-open");
    register.items.forEach(item => item.destroy());
  }

  function setOffset(value) {
    options.offset = Math.max(0, value);
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

  function current() {
    return register.pointer + 1 + options.offset;
  }

  $(document)
    .on("click", "#ftw-showroom-close", close)
    .on("keydown", (e) => {
      event.isEscape(e, close);
      event.isArrowRight(e, throttledNext);
      event.isArrowLeft(e, throttledPrev);
    })
    .on("click", ".showroom-item", select)
    .on("click", ".showroom-reference", select)
    .on("click", "#ftw-showroom-prev", throttledPrev)
    .on("click", "#ftw-showroom-next", throttledNext);

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

  Object.defineProperty(reveal, "options", { get: () => { return options; }});
  Object.defineProperty(reveal, "current", { get: () => { return current(); }});
  Object.defineProperty(reveal, "items", { get: () => { return register.items; }});
  Object.defineProperty(reveal, "element", { get: () => { return element; }});

  return Object.freeze(reveal);

};
