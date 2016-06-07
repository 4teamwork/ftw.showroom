import Reference from "reference";

let defaultReference;

beforeAll(() => {
  fixture.setBase('ftw/showroom/js/test/fixtures');
  fixture.load("default_reference.html");
  defaultReference = fixture.el.querySelector(".reference");
});

describe("Reference", () => {

  describe("initialisation", () => {

    it("should extract the target item", () => {
      let reference = Reference(defaultReference);

      assert.equal(reference.target, "10");
    });

  });


});
