import Showroom from "showroom";
require('babelify-es6-polyfill');
require('jasmine-ajax');
let $ = require("jquery");

let defaultItems;

function isUUID(uuid) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
}

describe("Showroom", () => {


  beforeAll(() => {
    fixture.setBase('ftw/showroom/js/test/fixtures');
  });

  beforeEach(() => {
    fixture.load("default_list.html");
    defaultItems = fixture.el.querySelectorAll(".item");
  });

  afterEach(() => { fixture.cleanup() });

  describe("Initialisation", () => {

    it("should have empty list as default items.", () => {
      var showroom = Showroom();
      assert.deepEqual(showroom.items, []);
    });

    it("should accept list of DOM elements for initialisation.", () => {
      var showroom = Showroom(defaultItems);

      assert.deepEqual(Array.from(showroom.items).map(
        item => item.element.className
      ), ["item", "item", "item", "item", "item"]);
    });

    it("should throw error when mixin DOM elements and with plain objects.", () => {
      var dirtyItems = Array.from(defaultItems);
      dirtyItems.push({});

      assert.throws(() => { Showroom(dirtyItems); }, Error, "The object set is not consistend");
    });

    it("should throw error when mixin plain object with DOM elements.", () => {
      var dirtyItems = [{}, {}, {}, {}];
      dirtyItems.push(defaultItems[0]);

      assert.throws(() => { Showroom(dirtyItems); }, Error, "The object set is not consistend");
    });

    it("sould extend items with showroom id.", () => {
      var showroom = Showroom(defaultItems);

      assert.deepEqual(
        Array.from(showroom.items).map(
          item => isUUID(item.id)
        ), [true, true, true, true, true]
      );
    });

    it("sould call select method by default on click on every item.", () => {
      var showroom = Showroom(defaultItems);

      showroom.onSelect((item) => {
        assert.oneOf(
          item.id,
          showroom.items.map(item => item.id)
        );
      });

      showroom.items.map(item => $(item.element).click());
    });

    it("sould have default data object.", () => {
      var showroom = Showroom(defaultItems);

      assert.equal(showroom.data.cssClass, "ftw-showroom");
      assert.equal(showroom.data.current, 1);
      assert.equal(showroom.data.total, 5);
    });
  });

  describe("open", () => {

    it("should attach a selected element to the target", () => {
      fixture.load("default_outlet.html");

      var showroom = Showroom(defaultItems, {
        fetch: function() { return "<div id='content'>content</div>"; },
        target: "#outlet"
      });

      showroom.open(showroom.items[1]);

      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML, "2");
      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-total").innerHTML, "5");
      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom").className, "ftw-showroom");
      assert.equal(fixture.el.querySelector("#outlet #content").innerHTML, "content");
    });

    it("should mark the target with a class when open", () => {
      fixture.load("default_outlet.html");

      var showroom = Showroom(defaultItems, {
        fetch: function() { return "<div id='content'>content</div>"; },
        target: "#outlet"
      });

      showroom.open();

      assert.equal(fixture.el.querySelector("#outlet").className, "ftw-showroom-open");
    });

    it("should attach a default element to the target", () => {
      fixture.load("default_outlet.html");

      var showroom = Showroom(defaultItems, {
        fetch: function() { return "<div id='content'>content</div>"; },
        target: "#outlet"
      });

      showroom.open();

      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML, "1");
      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-total").innerHTML, "5");
      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom").className, "ftw-showroom");
      assert.equal(fixture.el.querySelector("#outlet #content").innerHTML, "content");
    });
  });

  describe("close", () => {

    it("should hide the target element", () => {
      fixture.load("default_outlet.html");

      var showroom = Showroom(defaultItems, {
        fetch: function() { return "<div id='content'>content</div>"; },
        target: "#outlet"
      });

      showroom.open();
      assert.equal(fixture.el.querySelector(".ftw-showroom").style.display, "block");

      showroom.close();
      assert.equal(fixture.el.querySelector(".ftw-showroom").style.display, "none");

    });

    it("should the marker class", () => {
      fixture.load("default_outlet.html");

      var showroom = Showroom(defaultItems, {
        fetch: function() { return "<div id='content'>content</div>"; },
        target: "#outlet"
      });

      showroom.open();
      showroom.close();
      assert.equal(fixture.el.querySelector("#outlet").className, "");

    });

  });

});

