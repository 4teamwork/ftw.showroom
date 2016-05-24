import { isNumeric, throttle, noop, uuid, isHTMLElement } from "utils"

describe("Utils", () => {

  let htmlElement = document.createElement("a");
  let plainObject = {};
  let string = "string";
  let number = 2;

  describe("isHTMLElement", () => {

    it("should recognize DOM element", () => {
      assert.isTrue(isHTMLElement(htmlElement), "htmlElement should be recognized as an htmlElement");
      assert.isFalse(isHTMLElement(plainObject), "plainObject should not be recognized as an htmlElement");
      assert.isFalse(isHTMLElement(string), "string should not be recognized as an htmlElement");
      assert.isFalse(isHTMLElement(number), "number should not be recognized as an htmlElement");
    });

  });

  describe("throttle", () => {

    let functionCalls = 0;
    let fn = throttle(function() { functionCalls += 1; });

    beforeEach(() => {
      fn.cancel();
      functionCalls = 0;
    });

    it("should should make a throttled function", () => {
      fn();
      assert.equal(functionCalls, 1, "The throttled function should have been called only once.");
    });

    it("sould have a default threshold of 250ms", (done) => {
      fn();
      setTimeout(() => {
        fn();
        assert.equal(functionCalls, 1, "The throttled function should have been called only once during 100ms.");
        done();
      }, 100);
    });

    it("sould have a default threshold of 250ms", (done) => {
      fn();
      setTimeout(() => {
        fn();
        assert.equal(functionCalls, 2, "The throttled function should have been called only twice during 500ms.");
        done();
      }, 500);
    });

  });

  describe("isNumberic", () => {

    it("should only recognize regualr numbers as a number", () => {
      assert.isFalse(isNumeric(htmlElement));
      assert.isFalse(isNumeric(plainObject));
      assert.isFalse(isNumeric(string));
      assert.isFalse(isNumeric(null));
      assert.isFalse(isNumeric(undefined));
      assert.isFalse(isNumeric([]));
      assert.isFalse(isNumeric(""));
      assert.isTrue(isNumeric(number));
    });

    it("should not recognize Infinity as a number", () => {
      assert.isFalse(isNumeric(Infinity));
    });

    it("should not recognize -Infinity as a number", () => {
      assert.isFalse(isNumeric(-Infinity));
    });

    it("should not recognize NaN as a number", () => {
      assert.isFalse(isNumeric(NaN));
    });

  });

});
