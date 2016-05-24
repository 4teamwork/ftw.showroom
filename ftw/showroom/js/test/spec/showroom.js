import Showroom from "showroom";
import waitfor from "../helpers/waitfor";
import * as Builder from "../helpers/builder";
import * as event from "event";

require('babelify-es6-polyfill');

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

    it("should extend items with showroom id.", () => {
      let showroom = Showroom(defaultItems);

      assert.deepEqual(
        Array.from(showroom.items).map(
          item => isUUID(item.id)
        ), [true, true, true, true, true]
      );
    });

  });

  describe("data", () => {

    it("should have default values.", () => {
      let showroom = Showroom(defaultItems);

      assert.equal(showroom.cssClass, "ftw-showroom");
      assert.equal(showroom.current, 1);
      assert.equal(showroom.total, undefined);
    });

  });

  describe("total", () => {

    it("should be configurable", () => {
      let showroom = Builder.defaultShowroom();
      showroom.open();

      assert.equal(showroom.total, 10);
      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-total").innerHTML, "10");
    });

    it("should render no total if not defined", () => {
      fixture.load("default_outlet.html");
      let showroom = Showroom(defaultItems, {
        target: "#outlet",
        fetch: () => {
          return "<div id='content'>content</div>";
        }
      });
      showroom.open();

      assert.isUndefined(showroom.total);
      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-total").innerHTML, "");
    });

  });

  describe("setTotal", () => {
    it("should be updated after a reset", (done) => {
      let showroom = Builder.defaultShowroom();
      showroom.open().done(() => {
        assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-total").innerHTML, "10");
        showroom.setTotal(20).done(() => {
          assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-total").innerHTML, "20");
          done();
        });
      });
    });

    it("should throw an error when no numberic type has been set", () => {
      let showroom = Builder.defaultShowroom();
      assert.throw(() => { showroom.setTotal("peter"); }, Error, "peter is not a number");
    });

    it("should not open an item if no item is already opened", () => {
      let showroom = Builder.defaultShowroom();
      showroom.setTotal(20);
      assert.isNull(fixture.el.querySelector(".ftw-showroom"));
    });
  });

  describe("open", () => {

    it("should attach a selected element to the target", () => {
      let showroom = Builder.defaultShowroom();

      showroom.open(showroom.items[1]);

      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML, "2");
      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-total").innerHTML, "10");
      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom").className, "ftw-showroom");
      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom").style.display, "block");
      assert.equal(fixture.el.querySelector("#outlet #content").innerHTML, "content");
    });

    it("should mark the target with a class when open", () => {
      let showroom = Builder.defaultShowroom();

      showroom.open();

      assert.equal(fixture.el.querySelector("#outlet").className, "ftw-showroom-open");
    });

    it("should attach a default element to the target", () => {
      let showroom = Builder.defaultShowroom();

      showroom.open();

      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML, "1");
      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-total").innerHTML, "10");
      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom").className, "ftw-showroom");
      assert.equal(fixture.el.querySelector("#outlet #content").innerHTML, "content");
    });
  });

  describe("close", () => {

    it("should hide the target element", () => {
      let showroom = Builder.defaultShowroom();

      showroom.open();
      assert.equal(fixture.el.querySelector(".ftw-showroom").style.display, "block");

      showroom.close();
      assert.equal(fixture.el.querySelector(".ftw-showroom").style.display, "none");
    });

    it("should the marker class", () => {
      let showroom = Builder.defaultShowroom();

      showroom.open();
      showroom.close();

      assert.equal(fixture.el.querySelector("#outlet").className, "");
    });

    it("should be triggered when hitting ESC key", (done) => {
      let showroom = Builder.defaultShowroom();
      showroom.open();

      waitfor(() => {
        return fixture.el.querySelector(".ftw-showroom").style.display === "none";
      }, done);

      event.hitEscape(fixture.el.querySelector("#outlet"));
    });

    it("should be possible to reopen the closed item", () => {
      let showroom = Builder.defaultShowroom();
      showroom.open();
      showroom.close();
      showroom.open();
      assert.equal(fixture.el.querySelector(".ftw-showroom").style.display, "block");
    });

  });

  describe("next", () => {

    it("should render the next item", () => {
      let showroom = Builder.defaultShowroom();
      showroom.open();
      showroom.next();

      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML, "2");

      showroom.next();

      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML, "3");
    });

    it("should not render again when reaching the last item", () => {
      fixture.load("default_outlet.html");

      let renderCalls = 0;
      let showroom = Showroom(defaultItems, {
        fetch: () => { return "<div></div>" },
        render: () => { renderCalls += 1 }
      });

      showroom.open();
      showroom.next();
      showroom.next();
      showroom.next();
      showroom.next();
      showroom.next();

      assert.equal(renderCalls, 5, "Render should only be called 5 times");
    });

    it("should remove the previous item from the DOM", () => {
      let showroom = Builder.defaultShowroom();
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

    it("should stay on the current item when reaching the end", () => {
      let showroom = Builder.defaultShowroom();
      showroom.open();
      showroom.next();
      showroom.next();
      showroom.next();
      showroom.next();
      showroom.next();

      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML, "5");
    });

    it("should show the next item when hitting the next button", (done) => {
      let showroom = Builder.defaultShowroom();

      showroom.open();

      waitfor(() => {
        return fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML === "2";
      }, () => {
        assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML, "2");
        done();
      });

      event.click(fixture.el.querySelector("#ftw-showroom-next"));
    });

    it("should show the next item when hitting the right arrow key", (done) => {
      let showroom = Builder.defaultShowroom();

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
      let showroom = Builder.defaultShowroom();
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
      let showroom = Builder.defaultShowroom();
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
      let showroom = Builder.defaultShowroom();
      showroom.open();
      showroom.prev();
      showroom.prev();

      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML, "1");
    });

    it("sould show the previous item when hitting the prev button", (done) => {
      let showroom = Builder.defaultShowroom();

      showroom.open();
      showroom.next();

      waitfor(() => {
        if(fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML) {
          return fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML === "1";
        }
      }, () => {
        assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML, "1");
        done();
      });

      event.click(fixture.el.querySelector("#ftw-showroom-prev"));
    });

    it("sould show the previous item when hitting the left arrow key", () => {
      let showroom = Builder.defaultShowroom();

      showroom.open();
      showroom.next();

      waitfor(() => {
        if(fixture.el.querySelector("#outlet .ftw-showroom-current")) {
          return fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML === "1";
        }
        return false;
      }, () => {
        assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML, "1");
        done();
      });

      event.hitArrowLeft(fixture.el.querySelector("#outlet"));
    });

    it("should not render again when reaching the first item", () => {
      fixture.load("default_outlet.html");

      let renderCalls = 0;
      let showroom = Showroom(defaultItems, {
        fetch: () => { return "<div></div>" },
        render: () => { renderCalls += 1; return $("<div></div>") }
      });

      showroom.open();
      showroom.prev();
      showroom.prev();

      assert.equal(renderCalls, 1, "Render should only be called once");
    });

  });

  describe("append", () => {

    it("should extend the current item set", () => {
      fixture.load("append_list.html");
      let newItems = fixture.el.querySelectorAll(".append");
      let showroom = Builder.defaultShowroom();
      showroom.append(newItems);

      assert.deepEqual(
        showroom.items.map((item) => { return item.element.className }),
        ["item", "item", "item", "item", "item", "item append", "item append", "item append", "item append", "item append"]
      )
    });

    it("should attach the click event handler on the new items", () => {
      fixture.load("append_list.html", "default_outlet.html");
      let newItems = fixture.el.querySelectorAll(".append");

      let showroom = Showroom(defaultItems, {
        fetch: () => {
          return `
            <div id='content'>content</div>
            <button id='ftw-showroom-next'></button>
            <button id='ftw-showroom-prev'></button>
          `;
        },
        target: "#outlet",
        total: 10
      });

      showroom.append(newItems);

      showroom.open();

      waitfor(() => {
        if(fixture.el.querySelector("#outlet .ftw-showroom-current")) {
          return fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML === "6";
        }
        return false;
      }, () => {
        assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML, "6");
        done();
      });

      event.click(fixture.el.querySelector(".append"));
    });

  });

  describe("throttling", () => {
    it("should not render more than one item within 1000ms when hitting right arrow several times", (done) => {
      fixture.load("default_outlet.html");

      let renderCalls = 0;
      let showroom = Showroom(defaultItems, {
        fetch: () => { return "<div></div>" },
        render: () => { renderCalls += 1 }
      });

      event.hitArrowRight(fixture.el.querySelector("#outlet"));
      setTimeout(() => {
        event.hitArrowRight(fixture.el.querySelector("#outlet"));
        assert.equal(renderCalls, 1, "The render method should have been called only one within 1000ms");
        done();
      }, 10);

    });

    it("should not render more than one item within 1000ms when hitting next button several times", (done) => {
      fixture.load("default_outlet.html");

      let renderCalls = 0;
      let showroom = Showroom(defaultItems, {
        fetch: () => {
          return `
            <div id='content'>content</div>
            <button id='ftw-showroom-next'></button>
            <button id='ftw-showroom-prev'></button>
          `
        },
        render: () => { renderCalls += 1 }
      });

      showroom.open();

      event.click(fixture.el.querySelector("#ftw-showroom-next"));
      setTimeout(() => {
        event.click(fixture.el.querySelector("#ftw-showroom-next"));
        assert.equal(renderCalls, 1, "The render method should have been called only one within 1000ms");
        done();
      }, 10);

    });
  });

  describe("destroy", () => {

    it("should reset the element to an empty jQuery object", () => {
      let showroom = Builder.defaultShowroom();
      showroom.open();
      showroom.destroy();

      assert.isUndefined(showroom.element.html());
    });

    it("should remove the nodes from the DOM", () => {
      let showroom = Builder.defaultShowroom();
      showroom.open();
      showroom.destroy();

      assert.equal(fixture.el.querySelectorAll(".ftw-showroom").length, 0);
    });

    it("should clear the items store", () => {
      let showroom = Builder.defaultShowroom();
      showroom.destroy();

      assert.deepEqual(showroom.items, []);
    });

    it("should remove the showroom-open class on the target", () => {
      let showroom = Builder.defaultShowroom();
      showroom.open();
      showroom.destroy();

      assert.equal(fixture.el.querySelector("#outlet").className, "");
    });

    it("should remove the showroom-id data attribute in the DOM", () => {
      let showroom = Builder.defaultShowroom();
      showroom.open();
      showroom.destroy();

      assert.deepEqual(
        Array.from(fixture.el.querySelectorAll(".item")).map(item => item.dataset["showroom-id"]),
        [undefined, undefined, undefined, undefined, undefined]
      );
    });

    it("should not be possible to reopen the showroom after a destruction", () => {
      let showroom = Builder.defaultShowroom();
      showroom.open();
      showroom.destroy();
    });

  });

  describe("reset", () => {

    it("should empty the items store with no arguments", () => {
      let showroom = Builder.defaultShowroom();
      showroom.open();
      showroom.reset();

      assert.deepEqual(showroom.items, []);
    });

    it("should update the showroom with the new items", () => {
      fixture.load("append_list.html", "default_outlet.html");
      let newItems = fixture.el.querySelectorAll(".append");

      let showroom = Showroom(defaultItems, {
        fetch: () => {
          return `
            <div id='content'>content</div>
            <button id='ftw-showroom-next'></button>
            <button id='ftw-showroom-prev'></button>
          `;
        },
        target: "#outlet"
      });

      showroom.reset(newItems);

      assert.deepEqual(
        showroom.items.map((item) => { return item.element.querySelector(".title").innerHTML }),
        ["6", "7", "8", "9", "10"]
      )
    });

    it("should be possible to open a reset item", () => {
      fixture.load("append_list.html", "default_outlet.html");
      let newItems = fixture.el.querySelectorAll(".append");

      let showroom = Showroom(defaultItems, {
        fetch: () => {
          return `
            <div id='content'>content</div>
            <button id='ftw-showroom-next'></button>
            <button id='ftw-showroom-prev'></button>
          `;
        },
        target: "#outlet"
      });

      showroom.reset(newItems);

      showroom.open();

      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML, "1");
      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom").className, "ftw-showroom");
      assert.equal(fixture.el.querySelector("#outlet #content").innerHTML, "content");
    });

  });

});

