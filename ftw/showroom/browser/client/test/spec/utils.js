import { noop, uuid, isHTMLElement } from "utils"

describe("Utils", () => {

  it("itHTMLElement should recognize DOM element", () => {
    var htmlElement = document.createElement("a");
    var plainObject = {};
    var string = "string";
    var number = 2;

    assert.isTrue(isHTMLElement(htmlElement), "htmlElement should be recognized as an htmlElement");
    assert.isFalse(isHTMLElement(plainObject), "plainObject should not be recognized as an htmlElement");
    assert.isFalse(isHTMLElement(string), "string should not be recognized as an htmlElement");
    assert.isFalse(isHTMLElement(number), "number should not be recognized as an htmlElement");
  });

});
