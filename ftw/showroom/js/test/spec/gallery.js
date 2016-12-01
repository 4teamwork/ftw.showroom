import Gallery from "gallery";
import Showroom from "ftw.showroom";
import * as Builder from "../helpers/builder";

beforeAll(() => {
  fixture.setBase('ftw/showroom/js/test/fixtures');
});

afterEach(function(){
  fixture.cleanup()
});

describe("Gallery", () => {

  it("should throw an exception if showroom argument is not a list", () => {
    assert.throws(() => {
      Gallery(1);
    }, Error, "Argument: showrooms is not a list");
  });

  it("should hold multiple showroom instances", () => {
    const gallery = Gallery(Builder.multipleShowroom());
    assert.equal(gallery.items.length, 2);
  });

  it("should be able to add an additional showroom instance", () => {
    const gallery = Gallery([Builder.defaultShowroom()]);
    assert.equal(gallery.items.length, 1);

    gallery.register(Builder.defaultShowroom())
    assert.equal(gallery.items.length, 2);
  });

  it("should be able to remove a showroom instance", () => {
    const showroom1 = Builder.defaultShowroom();
    const gallery = Gallery([showroom1]);
    assert.equal(gallery.items.length, 1);

    gallery.unregister(showroom1);
    assert.equal(gallery.items.length, 0);
  });

  it("should allow only one open showroom simultaneously", () => {
    const gallery = Gallery(Builder.multipleShowroom());
    const [showroom1, showroom2] = gallery.items;
    showroom1.open();
    assert.deepEqual(gallery.items.map(showroom => showroom.isOpen), [true, false]);

    showroom2.open();
    assert.deepEqual(gallery.items.map(showroom => showroom.isOpen), [false, true]);
  });

});
