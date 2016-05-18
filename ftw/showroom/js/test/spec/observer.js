import Observer from "observer";

let observer;

describe("Observer", () => {

  beforeEach(() => {
    observer = Observer(1);
  });

  it("should store the initial value", () => {
    assert.equal(observer.value, 1);
  });

  it("should update the value", () => {
    observer.update(2);
    assert.equal(observer.value, 2);
  });

  it("should not recognize any changes intially", () => {
    assert.isFalse(observer.hasChanged(), "The observer should not have recognized any changes");
  });

  it("should not recognize any changes when updated with the same value", () => {
    observer.update(1);
    assert.isFalse(observer.hasChanged(), "The observer should not have recognized any changes");
  });

  it("should recognize changes when updating with an oher value", () => {
    observer.update(2);
    assert.isTrue(observer.hasChanged(), "The observer should have recognized changes.");
  });

  it("should reset the updated state when updating again with the same value", () => {
    observer.update(2);
    observer.update(2);
    assert.isFalse(observer.hasChanged(), "The observer should not have recognized any changes");
  });

  it("should recognize changes when updating an empty observer", () => {
    let observer = Observer();
    observer.update(1);
    assert.isTrue(observer.hasChanged(), "The observer should have recognized changes.");
  });

  it("should not recognize any changes when updating an empty observer with `undefined`", () => {
    let observer = Observer();
    observer.update(undefined);
    assert.isFalse(observer.hasChanged(), "The observer should not have recognized any changes");
  });

  it("should not recognize any changes when the observer has been reset", () => {
    let observer = Observer();
    observer.update(1);
    assert.isTrue(observer.hasChanged());
    observer.reset();
    assert.isFalse(observer.hasChanged(), "The observer should not habe any changes after a reset.");
  });

  it("should recognize changes when the observer has been reset and a new value has been set except `undefined`", () => {
    let observer = Observer();
    observer.update(1);
    assert.isTrue(observer.hasChanged());
    observer.reset();
    assert.isFalse(observer.hasChanged(), "The observer should not habe any changes after a reset.");
    observer.update(1);
    assert.isTrue(observer.hasChanged(), "The observer should have changes after a reset when a new value has been set.");
  });

});
