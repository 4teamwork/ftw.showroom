import Showroom from "ftw.showroom";
import waitfor from "../helpers/waitfor";
import * as Builder from "../helpers/builder";
import * as event from "event";

require('babelify-es6-polyfill');

const $ = require("jquery");
const HBS = require("handlebars");

let defaultItems;

let showroom;

function isUUID(uuid) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
}

describe("Showroom", () => {

  beforeAll(() => {
    fixture.setBase('ftw/showroom/js/test/fixtures');
  });

  beforeEach(() => {
    fixture.load("default_list.html");
    defaultItems = fixture.el.querySelectorAll(".showroom-item");
  });

  afterEach(() => {
    fixture.cleanup();
    if(showroom) { showroom.destroy(); }
  });

  describe("Initialisation", () => {

    it("should have empty list as default items.", () => {
      showroom = Showroom();
      assert.deepEqual(showroom.items, []);
    });

    it("should accept list of DOM elements for initialisation.", () => {
      showroom = Showroom(defaultItems);

      assert.deepEqual(Array.from(showroom.items).map(
        item => item.element.className
      ), ["showroom-item", "showroom-item", "showroom-item", "showroom-item", "showroom-item"]);
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

    it("should throw error when a showroom item has a reference", () => {
      fixture.load("dirty_item_list.html");

      assert.throws(() => {
        Showroom(fixture.el.querySelectorAll(".showroom-item"));
      }, Error, "Showroom items must not contain references");
    });

    it("should extend items with showroom id.", () => {
      showroom = Showroom(defaultItems);

      assert.deepEqual(
        Array.from(showroom.items).map(
          item => isUUID(item.id)
        ), [true, true, true, true, true]
      );
    });

    it("should not accept negative offset", () => {
      showroom = Showroom(defaultItems, {offset: -3});
      assert.equal(showroom.options.offset, 0);
    })

  });

  describe("options", () => {

    it("should have default values.", () => {
      showroom = Showroom(defaultItems);

      assert.equal(showroom.options.cssClass, "ftw-showroom");
      assert.equal(showroom.options.total, 0);
      assert.equal(showroom.options.offset, 0);
    });

    it("should be possible to augment the item before rendering", () => {
      showroom = Builder.defaultShowroom({
        beforeRender: function(item) { item.key = "test"; },
        template: "<div id={{item.key}}>test</div>"
      });

      showroom.open();

      assert.equal(fixture.el.querySelector("#test").textContent, "test");
    });

    it("displayOptions", () => {
      fixture.load("default_outlet.html");
      showroom = Showroom(defaultItems, {
        target: "#outlet",
        displayTotal: false,
        displayCurrent: false,
        fetch: () => {
          return "<div id='content'>content</div>";
        }
      });
      showroom.open();

      assert.isNull(fixture.el.querySelector(".ftw-showroom-total"));
      assert.isNull(fixture.el.querySelector(".ftw-showroom-current"));
    });

  });

  describe("total", () => {

    it("should be configurable", () => {
      showroom = Builder.defaultShowroom();
      showroom.open();
      assert.equal(showroom.options.total, 10);
      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-total").innerHTML, "10");
    });

    it("should render no total if not defined", () => {
      fixture.load("default_outlet.html");
      showroom = Showroom(defaultItems, {
        target: "#outlet",
        fetch: () => {
          return "<div id='content'>content</div>";
        }
      });
      showroom.open();

      assert.equal(showroom.options.total, 0);
      assert.isNull(fixture.el.querySelector("#outlet .ftw-showroom-total"));
    });

  });

  describe("setTotal", () => {
    it("should be updated after a reset", (done) => {
      showroom = Builder.defaultShowroom();
      showroom.open().done(() => {
        assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-total").innerHTML, "10");
        showroom.setTotal(20).done(() => {
          assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-total").innerHTML, "20");
          done();
        });
      });
    });

    it("should throw an error when no numberic type has been set", () => {
      showroom = Builder.defaultShowroom();
      assert.throw(() => { showroom.setTotal("peter"); }, Error, "peter is not a number");
    });

    it("should not open an item if no item is already opened", () => {
      showroom = Builder.defaultShowroom();
      showroom.setTotal(20);
      assert.isNull(fixture.el.querySelector(".ftw-showroom"));
    });
  });

  describe("open", () => {

    it("should attach a selected element to the target", () => {
      showroom = Builder.defaultShowroom();

      showroom.open(showroom.items[1]);

      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML, "2");
      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-total").innerHTML, "10");
      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom").className, "ftw-showroom");
      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom").style.display, "block");
      assert.equal(fixture.el.querySelector("#outlet #content").innerHTML, "content");
    });

    it("should mark the target with a class when open", () => {
      showroom = Builder.defaultShowroom();

      showroom.open();

      assert.equal(fixture.el.querySelector("#outlet").className, "ftw-showroom-open");
    });

    it("should attach a default element to the target", () => {
      showroom = Builder.defaultShowroom();

      showroom.open();

      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML, "1");
      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-total").innerHTML, "10");
      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom").className, "ftw-showroom");
      assert.equal(fixture.el.querySelector("#outlet #content").innerHTML, "content");
    });

    it("should execute head call when opened on first item of batch", (done) => {
      showroom = Showroom(defaultItems, {
        head: (current) => {
          done();
        },
        total: 10,
      });
      showroom.open();
    });

    it("should execute tail call when opened on last item of batch", (done) => {
      showroom = Showroom(defaultItems, {
        tail: (current) => {
          done();
        },
        total: 10,
      });
      showroom.open(showroom.items[showroom.items.length - 1]);
    });

    it("should execute tail call just once when opening the last item", () => {
      let tailCalls = 0;

      showroom = Showroom(defaultItems, {
        tail: () => {
          tailCalls += 1;
        },
        total: 10,
      });

      showroom.open(showroom.items[showroom.items.length - 1]);

      assert.equal(tailCalls, 1, "Tail should only be called once when opening the last item");
    });
  });

  describe("close", () => {

    it("should hide the target element", () => {
      showroom = Builder.defaultShowroom();

      showroom.open();
      assert.equal(fixture.el.querySelector(".ftw-showroom").style.display, "block");

      showroom.close();
      assert.equal(fixture.el.querySelector(".ftw-showroom").style.display, "none");
    });

    it("should the marker class", () => {
      showroom = Builder.defaultShowroom();

      showroom.open();
      showroom.close();

      assert.equal(fixture.el.querySelector("#outlet").className, "");
    });

    it("should be triggered when hitting ESC key", (done) => {
      showroom = Builder.defaultShowroom();
      showroom.open();

      waitfor(() => {
        return fixture.el.querySelector(".ftw-showroom").style.display === "none";
      }, done);

      event.hitEscape(fixture.el.querySelector("#outlet"));
    });

    it("should be possible to reopen the closed item", () => {
      showroom = Builder.defaultShowroom();
      showroom.open();
      showroom.close();
      showroom.open();
      assert.equal(fixture.el.querySelector(".ftw-showroom").style.display, "block");
    });

  });

  describe("next", () => {

    it("should render the next item", () => {
      showroom = Builder.defaultShowroom();
      showroom.open();
      showroom.next();

      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML, "2");

      showroom.next();

      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML, "3");
    });

    it("should not render again when reaching the last item", () => {
      fixture.load("default_outlet.html");

      let renderCalls = 0;
      showroom = Showroom(defaultItems, {
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
      showroom = Builder.defaultShowroom();
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
      showroom = Builder.defaultShowroom();
      showroom.open();
      showroom.next();
      showroom.next();
      showroom.next();
      showroom.next();
      showroom.next();

      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML, "5");
    });

    it("should show the next item when hitting the next button", (done) => {
      showroom = Builder.defaultShowroom();

      showroom.open();

      waitfor(() => {
        return fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML === "2";
      }, () => {
        assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML, "2");
        done();
      });

      event.click(fixture.el.querySelector(".ftw-showroom-next"));
    });

    it("should show the next item when hitting the right arrow key", (done) => {
      showroom = Builder.defaultShowroom();

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
      showroom = Builder.defaultShowroom();
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
      showroom = Builder.defaultShowroom();
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
      showroom = Builder.defaultShowroom();
      showroom.open();
      showroom.prev();
      showroom.prev();

      assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML, "1");
    });

    it("sould show the previous item when hitting the prev button", (done) => {
      showroom = Builder.defaultShowroom();

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

      event.click(fixture.el.querySelector(".ftw-showroom-prev"));
    });

    it("sould show the previous item when hitting the left arrow key", (done) => {
      showroom = Builder.defaultShowroom();

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
      showroom = Showroom(defaultItems, {
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
      showroom = Builder.defaultShowroom();
      showroom.append(newItems);

      assert.deepEqual(
        showroom.items.map((item) => { return item.element.className }),
        ["showroom-item", "showroom-item", "showroom-item", "showroom-item", "showroom-item", "showroom-item append", "showroom-item append", "showroom-item append", "showroom-item append", "showroom-item append"]
      )
    });

    it("should attach the click event handler on the new items", (done) => {
      fixture.load("append_list.html", "default_outlet.html");
      let newItems = fixture.el.querySelectorAll(".append");

      showroom = Showroom(defaultItems, {
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


  describe("prepend", () => {

    it("should extend the current item list at the top", () => {
      fixture.load("prepend_list.html");
      let newItems = fixture.el.querySelectorAll(".prepend");
      showroom = Builder.defaultShowroom();
      showroom.prepend(newItems);

      assert.deepEqual(
        showroom.items.map((item) => { return item.element.className }),
        [ "showroom-item prepend", "showroom-item prepend", "showroom-item prepend", "showroom-item prepend",
          "showroom-item prepend", "showroom-item", "showroom-item", "showroom-item", "showroom-item", "showroom-item"]
      )
    });

    it("should attach the click event handler on the new items", (done) => {
      fixture.load("prepend_list.html", "default_outlet.html");
      let newItems = fixture.el.querySelectorAll(".prepend");

      showroom = Showroom(defaultItems, {
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

      showroom.prepend(newItems);

      showroom.open();

      waitfor(() => {
        if(fixture.el.querySelector("#outlet .ftw-showroom-current")) {
          return fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML === "1";
        }
        return false;
      }, () => {
        assert.equal(fixture.el.querySelector("#outlet .ftw-showroom-current").innerHTML, "1");
        done();
      });

      event.click(fixture.el.querySelector(".prepend"));
    });

  });


  describe("throttling", () => {
    it("should not render more than one item within 1000ms when hitting right arrow several times", (done) => {
      fixture.load("default_outlet.html");

      let renderCalls = 0;
      showroom = Showroom(defaultItems, {
        fetch: () => { return "<div></div>" },
        render: () => { renderCalls += 1 }
      });

      showroom.open();

      event.hitArrowRight(fixture.el.querySelector("#outlet"));
      setTimeout(() => {
        event.hitArrowRight(fixture.el.querySelector("#outlet"));
        assert.equal(renderCalls, 2, "The render method should have been called only twice within 1000ms");
        done();
      }, 10);

    });

    it("should not render more than one item within 1000ms when hitting next button several times", (done) => {
      fixture.load("default_outlet.html");

      let renderCalls = 0;
      showroom = Showroom(defaultItems, {
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

      event.click(fixture.el.querySelector(".ftw-showroom-next"));
      setTimeout(() => {
        event.click(fixture.el.querySelector(".ftw-showroom-next"));
        assert.equal(renderCalls, 1, "The render method should have been called only one within 1000ms");
        done();
      }, 10);

    });
  });

  describe("destroy", () => {

    it("should reset the element to an empty jQuery object", () => {
      showroom = Builder.defaultShowroom();
      showroom.open();
      showroom.destroy();

      assert.isUndefined(showroom.element.html());
    });

    it("should remove the nodes from the DOM", () => {
      showroom = Builder.defaultShowroom();
      showroom.open();
      showroom.destroy();

      assert.equal(fixture.el.querySelectorAll(".ftw-showroom").length, 0);
    });

    it("should clear the items store", () => {
      showroom = Builder.defaultShowroom();
      showroom.destroy();

      assert.deepEqual(showroom.items, []);
    });

    it("should remove the showroom-open class on the target", () => {
      showroom = Builder.defaultShowroom();
      showroom.open();
      showroom.destroy();

      assert.equal(fixture.el.querySelector("#outlet").className, "");
    });

    it("should remove the showroom-id data attribute in the DOM", () => {
      showroom = Builder.defaultShowroom();
      showroom.open();
      showroom.destroy();

      assert.deepEqual(
        Array.from(fixture.el.querySelectorAll(".showroom-item")).map(item => item.dataset["showroom-id"]),
        [undefined, undefined, undefined, undefined, undefined]
      );
    });

    it("should not be possible to reopen the showroom after a destruction", () => {
      showroom = Builder.defaultShowroom();
      showroom.open();
      showroom.destroy();
    });

  });

  describe("reset", () => {

    it("should empty the items store with no arguments", () => {
      showroom = Builder.defaultShowroom();
      showroom.open();
      showroom.reset();

      assert.deepEqual(showroom.items, []);
    });

    it("should update the showroom with the new items", () => {
      fixture.load("append_list.html", "default_outlet.html");
      let newItems = fixture.el.querySelectorAll(".append");

      showroom = Showroom(defaultItems, {
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

      showroom = Showroom(defaultItems, {
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

    it("should reset showroom offset", () => {
      showroom = Showroom(defaultItems, {
        offset: 10,
        total: 20,
        target: "#outlet"
      });
      showroom.open();
      showroom.reset();

      assert.deepEqual(showroom.items, []);
      assert.equal(showroom.options.offset, 0);
    });

  });

  describe("arrows", () => {

    it("should not show any arrows if there is only one item in the stream", () => {

      showroom = Builder.singleShowroom();
      showroom.open();

      assert.equal(fixture.el.querySelector(".ftw-showroom-next").style.display, "none");
      assert.equal(fixture.el.querySelector(".ftw-showroom-prev").style.display, "none");

    });

    it("should not show prev arrow at the start of the stream", () => {

      showroom = Builder.defaultShowroom();
      showroom.open();

      assert.equal(fixture.el.querySelector(".ftw-showroom-next").style.display, "");
      assert.equal(fixture.el.querySelector(".ftw-showroom-prev").style.display, "none");

    });

    it("should not show next arrows at the end the stream", () => {

      showroom = Builder.defaultShowroom();
      showroom.setTotal(5);
      showroom.open(showroom.items[4]);

      assert.equal(fixture.el.querySelector(".ftw-showroom-next").style.display, "none");
      assert.equal(fixture.el.querySelector(".ftw-showroom-prev").style.display, "");
    });

    it("should show next arrow when leaving the last item", () => {

      showroom = Builder.defaultShowroom();
      showroom.open(showroom.items[4]);
      showroom.prev();

      assert.equal(fixture.el.querySelector(".ftw-showroom-next").style.display, "");
      assert.equal(fixture.el.querySelector(".ftw-showroom-prev").style.display, "");
    });

    it("should show prev arrow when leaving the first item", () => {

      showroom = Builder.defaultShowroom();
      showroom.open();
      showroom.next();

      assert.equal(fixture.el.querySelector(".ftw-showroom-next").style.display, "");
      assert.equal(fixture.el.querySelector(".ftw-showroom-prev").style.display, "");
    });

    it("should show next arrow even when the manually set total is greather than the actual batch", () => {
      showroom = Builder.defaultShowroom();
      showroom.setTotal(10);
      showroom.open(showroom.items[4]);

      assert.equal(fixture.el.querySelector(".ftw-showroom-next").style.display, "");
      assert.equal(fixture.el.querySelector(".ftw-showroom-prev").style.display, "");
    });

  });

  describe("offset", () => {

    it("should be configurable", () => {
      showroom = Showroom(defaultItems, {
        offset: 13,
      });
      showroom.open();
      assert.equal(showroom.options.offset, 13);
    });

    it("must not be negative", () => {
      showroom = Builder.defaultShowroom();

      showroom.setOffset(-77);
      assert.equal(showroom.options.offset, 0);
    });

    it("should shift the current index by value given in the options", () => {
      fixture.load("default_outlet.html");
      showroom = Showroom(defaultItems, {
        offset: 10,
        total: 20,
        target: "#outlet",
        fetch: () => { return "<div id='content'>content</div>"; }
      });
      showroom.open();

      assert.equal(fixture.el.querySelector(".ftw-showroom-current").innerHTML, "11");
    });

    it("should respect offset when calling next", () => {
      fixture.load("default_outlet.html");
      showroom = Showroom(defaultItems, {
        offset: 10,
        total: 20,
        target: "#outlet",
        fetch: () => { return "<div id='content'>content</div>"; }
      });
      showroom.open();
      showroom.next();

      assert.equal(fixture.el.querySelector(".ftw-showroom-current").innerHTML, "12");
    });

    it("should respect offset when calling prev", () => {
      fixture.load("default_outlet.html", "default_list.html");
      showroom = Showroom(defaultItems, {
        head: (current) => {
          showroom.prepend(fixture.el.querySelectorAll(".showroom-item"));
        },
        offset: 10,
        target: "#outlet",
        fetch: () => { return "<div id='content'>content</div>"; }
      });
      showroom.setTotal(20);
      showroom.open();
      showroom.prev();

      assert.equal(fixture.el.querySelector(".ftw-showroom-current").innerHTML, "10");
    });

  });

  describe("reference", () => {
    it("should respect predefined id on a showroom item", () => {
      showroom = Builder.referenceShowroom();
      showroom.open();

      assert.equal(fixture.el.querySelector(".showroom-item").dataset.showroomId, "reference-1");
      assert.deepEqual(
        Array.from(showroom.items).map(
          item => item.id
        ), ["reference-1", "reference-2"]
      );
    });

    it("should be able to open the referenced item", (done) => {
      showroom = Builder.referenceShowroom();

      waitfor(() => {
        return fixture.el.querySelector(".ftw-showroom") &&
               fixture.el.querySelector(".ftw-showroom").style.display === "block";
      }, () => {
        assert.equal(fixture.el.querySelector(".ftw-showroom-title").innerHTML, "Reference 2");
        done();
      });

      event.click(fixture.el.querySelectorAll(".showroom-reference")[1]);
    });

    it("should refresh newly added references", (done) => {
      showroom = Builder.referenceShowroom();

      // Add this additional reference to the DOM after the first initialisation
      var ref = $('<a id="additional-reference" href="#" data-showroom-target-item="reference-2" class="showroom-reference"></a>');
      fixture.el.appendChild(ref[0]);

      waitfor(() => {
        return fixture.el.querySelector(".ftw-showroom") &&
               fixture.el.querySelector(".ftw-showroom").style.display === "block";
      }, () => {
        assert.equal(fixture.el.querySelector(".ftw-showroom-title").innerHTML, "Reference 2");
        done();
      });

      event.click(fixture.el.querySelector("#additional-reference"));
    });

  });

  describe("multiple instances", () => {
    it("should contain multiple showroom elements in the document", () => {
      const [ showroom1, showroom2 ] = Builder.multipleShowroom();

      showroom1.open();
      showroom2.open();

      assert.equal(fixture.el.querySelectorAll(".ftw-showroom").length, 2, "There should be two showroom instances in the DOM");
    });

    it("should not be possible to have multiple showrooms open", () => {
      const [showroom1, showroom2] = Builder.multipleShowroom();
      showroom1.open();
      showroom2.open();

      assert.deepEqual(Array.from(fixture.el.querySelectorAll(".ftw-showroom")).map(el => el.style.display),
                      ["none", "block"]);
    });

    it("should be possible to cycle through slides using arrow keys", (done) => {
      const [showroom] = Builder.multipleShowroom();

      showroom.open();

      waitfor(() => {
        return showroom.element[0].querySelector(".ftw-showroom-current").innerHTML === "2";
      }, () => {
        assert.equal(showroom.element[0].querySelector(".ftw-showroom-current").innerHTML, "2");
        done();
      });

      event.hitArrowRight(fixture.el.querySelector("#outlet"));
    });

    it("should close the currently open showroom when pressing escape button on keyboard", (done) => {
      const [showroom1, showroom2] = Builder.multipleShowroom();

      showroom1.open();
      showroom2.open();

      assert.isFalse(showroom1.isOpen);
      assert.isTrue(showroom2.isOpen);

      waitfor(() => {
        return !showroom2.isOpen;
      }, () => {
        assert.isFalse(showroom1.isOpen);
        assert.isFalse(showroom2.isOpen);
        done();
      });

      event.hitEscape(fixture.el.querySelector("#outlet"));
    });

    it("should open the correct showroom when clicking on a showroom item", (done) => {
      const [showroom1, showroom2] = Builder.multipleShowroom();
      waitfor(() => showroom1.isOpen, () => {
        assert.isTrue(showroom1.isOpen);
        assert.isFalse(showroom2.isOpen);
        done();
      });
      event.click(fixture.el.querySelectorAll(".group1.showroom-item")[3]);
    });
  });

});
