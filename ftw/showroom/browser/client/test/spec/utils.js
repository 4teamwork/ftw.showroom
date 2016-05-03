import { noop, uuid, isHTMLElement } from "utils"

describe("Utils", () => {

  it("itHTMLElement should recongnize DOM element", () => {
    var htmlElement = document.createElement("a");
    var plainObject = {};
    var string = "string";
    var number = 2;

    assert.isTrue(isHTMLElement(htmlElement), "htmlElement sould be recongnized as an htmlElement");
    assert.isFalse(isHTMLElement(plainObject), "plainObject sould not be recongnized as an htmlElement");
    assert.isFalse(isHTMLElement(string), "string sould not be recongnized as an htmlElement");
    assert.isFalse(isHTMLElement(number), "number sould not be recongnized as an htmlElement");
  });

});
