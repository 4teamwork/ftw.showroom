import { noop, uuid, isHTMLElement } from "./utils"
import Item from "./item";
import Register from "./register";
import * as event from "./event";

let Handlebars = require("handlebars");
let $ = require("jquery");

module.exports = function Showroom(items = [], options) {

  let template = Handlebars.compile(`
    <div class="{{showroom.cssClass}}">
      <header class="ftw-showroom-header">
        <div class="ftw-showroom-left">
          <span class="ftw-showroom-current">{{showroom.current}}</span>
          <span>/</span>
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

  options = $.extend({
    cssClass: "ftw-showroom",
    render: render,
    tail: noop,
    head: noop,
    fetch: fetch,
    template: template,
    target: "body"
  }, options);


  let register = Register(items, { tail: options.tail, head: options.head });
  let target = $(options.target);

  let data = { cssClass: options.cssClass };
  Object.defineProperty(data, "current", { get: () => { return register.pointer + 1; }});
  Object.defineProperty(data, "total", { get: () => { return register.size; }});

  target.on("click", "#ftw-showroom-close", close);

  target.on("keydown", (e) => {
    event.isEscape(e, close);
    event.isArrowRight(e, next);
    event.isArrowLeft(e, prev);
  });

  function fetch(item) { return $.get(item.target); };

  function bindEvents() {
    element.on("click", "#ftw-showroom-next", next);
    element.on("click", "#ftw-showroom-prev", prev);
  };

  function render(content) {
    return $.when(content).done((content) => {
      element.remove();
      element = $(template({ showroom: data, content: content, item: register.current }));
      element.show();
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
  }

  function open(item) {
    item = item || register.items[0];
    if(!item) {
      return false;
    }
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
    data: data,
    open: open,
    close: close,
    next: next,
    prev: prev
  };

  Object.defineProperty(reveal, "items", { get: () => { return register.items; }});
  Object.defineProperty(reveal, "element", { get: () => { return element; }});

  return Object.freeze(reveal);

};
