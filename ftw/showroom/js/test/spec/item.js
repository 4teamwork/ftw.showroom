import Item from "item";

var defaultItem;
var serversideItem;

function isUUID(uuid) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
}

beforeAll(() => {
  fixture.setBase('ftw/showroom/js/test/fixtures');
  fixture.load("default_item.html", "serverside_item.html");
  defaultItem = fixture.el.querySelector(".item");
  serversideItem = fixture.el.querySelector(".serverside-item");
});

describe("Showroom Item", () => {

  it("should extend a new item with a showroom id.", () => {
    var item = Item(defaultItem);
    assert.isTrue(isUUID(item.id));
  });

  it("should overtake the id which is already set on the item as an HTML attribute.", () => {
    var item = Item(serversideItem);
    assert.equal(item.id, "10");
  });

  it("should extract showroom target.", () => {
    var item = Item(defaultItem);
    assert.equal(item.target, "http://www.google.com");
  });

  it("should extract showroom title.", () => {
    var item = Item(defaultItem);
    assert.equal(item.title, "Google");
  });

  describe("destroy", () => {

    it("should remove the showroom-id in the data attributes", () => {
      var item = Item(defaultItem);
      item.destroy();
      assert.isUndefined(item.element["showroom-id"]);
    });

  });

});
