import Showroom from "showroom";
import waitfor from "../helpers/waitfor";
import * as event from "event";

require('babelify-es6-polyfill');

let $ = require("jquery");

let defaultItems;

function isUUID(uuid) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
}

function loadDefaultShowroom() {
  fixture.load("default_outlet.html");

  return Showroom(defaultItems, {
    fetch: () => {
      return `
        <div id='content'>content</div>
        <button id='ftw-showroom-next'></button>
        <button id='ftw-showroom-prev'></button>
      `;
    },
    target: "#outlet"
  });
}

describe("Showroom", () => {


  beforeAll(() => {
    fixture.setBase('ftw/showroom/js/test/fixtures');
  });

  beforeEach(() => {
    fixture.load("default_list.html");
    defaultItems = fixture.el.querySelectorAll(".item");
  });

  afterEach(() => {
    fixture.cleanup()
  });

  describe("Initialisation", () => {

    it("should have empty list as default items.", () => {
      let showroom = Showroom();
      assert.deepEqual(showroom.items, []);
    });

    it("should accept list of DOM elements for initialisation.", () => {
      let showroom = Showroom(defaultItems);

      assert.deepEqual(Array.from(showroom.items).map(
        item => item.element.className
      ), ["item", "item", "item", "item", "item"]);
    });

    it("should throw error when mixin DOM elements and with plain objects.", () => {
      let dirtyItems = Array.from(defaultItems);
      dirtyItems.push({});

      assert.throws(() => { Showroom(dirtyItems); }, Error, "The object set is not consistend");
    });

    it("should throw error when mixin plain object with DOM elements.", () => {
      let dirtyItems = [{}, {}, {}, {}];
      dirtyItems.push(defaultItems[0]);

      assert.throws(() => { Showroom(dirtyItems); }, Error, "The object set is not consistend");
    });

    it("sould extend items with showroom id.", () => {
      let showroom = Showroom(defaultItems);

      assert.deepEqual(
        Array.from(showroom.items).map(
          item => isUUID(item.id)
        ), [true, true, true, true, true]
      );
    });

    it("sould have default data object.", () => {
      let showroom = Showroom(defaultItems);

      assert.equal(showroom.data.cssClass, "ftw-showroom");
      assert.equal(showroom.data.current, 1);
      assert.equal(showroom.data.total, 5);
    });
  });

  describe("open", () => {

    it("should attach a selected element to the target", () => {
      let showroom = loadDefaultShowroom();

      showroom.open(showroom.items[1]);

      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML, "2");
      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-total").innerHTML, "5");
      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom").className, "ftw-showroom");
      assert.equal(fixture.el.querySelector("#outlet #content").innerHTML, "content");
    });

    it("should mark the target with a class when open", () => {
      let showroom = loadDefaultShowroom();

      showroom.open();

      assert.equal(fixture.el.querySelector("#outlet").className, "ftw-showroom-open");
    });

    it("should attach a default element to the target", () => {
      let showroom = loadDefaultShowroom();

      showroom.open();

      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML, "1");
      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-total").innerHTML, "5");
      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom").className, "ftw-showroom");
      assert.equal(fixture.el.querySelector("#outlet #content").innerHTML, "content");
    });
  });

  describe("close", () => {

    it("should hide the target element", () => {
      let showroom = loadDefaultShowroom();

      showroom.open();
      assert.equal(fixture.el.querySelector(".ftw-showroom").style.display, "block");

      showroom.close();
      assert.equal(fixture.el.querySelector(".ftw-showroom").style.display, "none");
    });

    it("should the marker class", () => {
      let showroom = loadDefaultShowroom();

      showroom.open();
      showroom.close();

      assert.equal(fixture.el.querySelector("#outlet").className, "");
    });

    it("sould be triggered when hitting ESC key", (done) => {
      let showroom = loadDefaultShowroom();
      showroom.open();

      waitfor(() => {
        return fixture.el.querySelector(".ftw-showroom").style.display === "none";
      }, done);

      event.hitEscape(fixture.el.querySelector("#outlet"));
    });

  });

  describe("next", () => {

    it("should render the next item", () => {
      let showroom = loadDefaultShowroom();
      showroom.open();
      showroom.next();

      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML, "2");

      showroom.next();

      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML, "3");
    });

    it("sould remove the previous item from the DOM", () => {
      let showroom = loadDefaultShowroom();
      showroom.open();
      showroom.next();

      assert.deepEqual(Array.from(fixture.el.querySelectorAll(".ftw-showroom")).map(
        element => element.className
      ), ["ftw-showroom"]);

      showroom.next();

      assert.deepEqual(Array.from(fixture.el.querySelectorAll(".ftw-showroom")).map(
        element => element.className
      ), ["ftw-showroom"]);
    });

    it("sould stay on the current item when reaching the end", () => {
      let showroom = loadDefaultShowroom();
      showroom.next();
      showroom.next();
      showroom.next();
      showroom.next();
      showroom.next();

      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML, "5");
    });

    it("sould show the next item when hitting the next button", (done) => {
      let showroom = loadDefaultShowroom();

      showroom.open();

      waitfor(() => {
        return fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML === "2";
      }, () => {
        assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML, "2");
        done();
      });

      event.click(fixture.el.querySelector("#ftw-showroom-next"));
    });

    it("sould show the next item when hitting the right arrow key", (done) => {
      let showroom = loadDefaultShowroom();

      showroom.open();

      waitfor(() => {
        return fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML === "2";
      }, () => {
        assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML, "2");
        done();
      });

      event.hitArrowRight(fixture.el.querySelector("#outlet"));
    });

  });

  describe("prev", () => {

    it("should render the previous item", () => {
      let showroom = loadDefaultShowroom();
      showroom.open();
      showroom.next();
      showroom.prev();

      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML, "1");

      showroom.next();
      showroom.next();
      showroom.prev();

      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML, "2");
    });

    it("sould remove the previous item from the DOM", () => {
      let showroom = loadDefaultShowroom();
      showroom.open();
      showroom.next();

      assert.deepEqual(Array.from(fixture.el.querySelectorAll(".ftw-showroom")).map(
        element => element.className
      ), ["ftw-showroom"]);

      showroom.next();

      assert.deepEqual(Array.from(fixture.el.querySelectorAll(".ftw-showroom")).map(
        element => element.className
      ), ["ftw-showroom"]);
    });

    it("sould stay on the current item when reaching the start", () => {
      let showroom = loadDefaultShowroom();
      showroom.prev();
      showroom.prev();

      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML, "1");
    });

    it("sould show the previous item when hitting the prev button", (done) => {
      let showroom = loadDefaultShowroom();

      showroom.open();
      showroom.next();

      waitfor(() => {
        return fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML === "1";
      }, () => {
        assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML, "1");
        done();
      });

      event.click(fixture.el.querySelector("#ftw-showroom-prev"));
    });

    it("sould show the previous item when hitting the left arrow key", () => {
      let showroom = loadDefaultShowroom();

      showroom.open();
      showroom.next();

      waitfor(() => {
        return fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML === "1";
      }, () => {
        assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML, "1");
        done();
      });

      event.hitArrowLeft(fixture.el.querySelector("#outlet"));
    });

  });

});

