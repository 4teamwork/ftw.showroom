import Item from "item";

let defaultItem;

function isUUID(uuid) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
}

beforeAll(() => {
  fixture.setBase('ftw/showroom/js/test/fixtures');
  fixture.load("default_item.html");
  defaultItem = fixture.el.querySelector(".showroom-item");
});

describe("Showroom Item", () => {

  it("should extend a new item with a showroom id.", () => {
    let item = Item(defaultItem);
    assert.isTrue(isUUID(item.id));
  });

  it("should extract showroom target.", () => {
    let item = Item(defaultItem);
    assert.equal(item.target, "http://www.google.com");
  });

  it("should extract showroom title.", () => {
    let item = Item(defaultItem);
    assert.equal(item.title, "Google");
  });

  describe("destroy", () => {

    it("should remove the showroom-id in the data attributes", () => {
      let item = Item(defaultItem);
      item.destroy();
      assert.isUndefined(item.element["showroom-id"]);
    });

  });

  describe("reference", ()=> {
    it("should respect predefined id on an element", () => {
      fixture.load("reference_item.html");
      let item = Item(fixture.el.querySelector(".showroom-item"));

      assert.equal(item.id, "reference-1");
      assert.equal(fixture.el.querySelector(".showroom-item").dataset.showroomId, "reference-1");
    });
  });

});
