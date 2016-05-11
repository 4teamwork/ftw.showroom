import { noop, uuid, isHTMLElement } from "./utils"
import Item from "./item";
import Register from "./register";
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

  let selectCallback = noop;

  items = Array.from(items);

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

  let element = $();

  let register = Register(items, { tail: options.tail, head: options.head });

  function onSelect(_selectCallback) { selectCallback = _selectCallback; }

  function fetch(item) { return $.get(item.target); };

  let target = $(options.target);

  target.on("click", "#ftw-showroom-close", close);

  let data = { cssClass: options.cssClass };

  Object.defineProperty(data, "current", { get: () => { return register.pointer + 1; }});
  Object.defineProperty(data, "total", { get: () => { return register.size; }});

  function render(content) {
    return $.when(content).done((content) => {
      element = $(template({ showroom: data, content: content, item: register.current }));
      element.show();
      target.append(element).addClass("ftw-showroom-open");
    });
  };

  function select(event) {
    event.preventDefault();
    let item = register.items.filter(
      item => item.id === event.currentTarget.getAttribute("data-showroom-id")
    )[0];
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

  Object.defineProperty(reveal, "items", { get: () => { return register.items; }});

  return Object.freeze(reveal);

};
