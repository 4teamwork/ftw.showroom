import Regsiter from "register";

let items;

describe("Register", () => {

  beforeEach(() => {
    items = [1, 2, 3, 4, 5];
  });

  describe("Initialisation", () => {

    it("sould store the default items", () => {
      let register = Regsiter(items);

      assert.deepEqual(register.items, items);
    });

    it("should have default item set to the first", () => {
      let register = Regsiter(items);

      assert.equal(register.current, 1);
    });

    it("should return undefined if no default items are defined", () => {
      let register = Regsiter();

      assert.equal(register.current, undefined);
    });

    it("should return the correct size of the default items", () => {
      let register = Regsiter(items);

      assert.equal(register.size, 5);
    });

    it("should return 0 for the size of an empty register", () => {
      let register = Regsiter();

      assert.equal(register.size, 0);
    });

  });

  describe("append", () => {

    it("should extend the default items with the new set of items", () => {
      let register = Regsiter(items);
      register.append([6, 7, 8, 9, 10]);

      assert.deepEqual(register.items, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    it("should update the size", () => {
      let register = Regsiter(items);
      register.append([6, 7, 8, 9, 10]);

      assert.equal(register.size, 10);
    });

    it("should not touch the pointer", () => {
      let register = Regsiter(items);
      register.append([6, 7, 8, 9, 10]);

      assert.equal(register.pointer, 0);
      assert.equal(register.current, 1);
    });

  });

  describe("prepend", () => {

    it("should extend the default items with the new set of items", () => {
      let register = Regsiter(items);
      register.prepend([6, 7, 8, 9, 10]);

      assert.deepEqual(register.items, [6, 7, 8, 9, 10, 1, 2, 3, 4, 5]);
    });

    it("should update the size", () => {
      let register = Regsiter(items);
      register.prepend([6, 7, 8, 9, 10]);

      assert.equal(register.size, 10);
    });

    it("should update pointer", () => {
      let register = Regsiter(items);
      register.prepend([6, 7, 8, 9, 10]);

      assert.equal(register.pointer, 5);
      assert.equal(register.current, 1);
    });

  });

  describe("next", () => {

    it("should increase the pointer by 1", () => {
      let register = Regsiter(items);
      register.next();

      assert.equal(register.current, 2);
    });

    it("should increase the pointer by 2 when calling twice", () => {
      let register = Regsiter(items);
      register.next();
      register.next();

      assert.equal(register.current, 3);
    });

    it("should keep the pointer to the last item when overflowing the items list", () => {
      let register = Regsiter([1, 2]);
      register.next();
      register.next();
      register.next();
      register.next();

      assert.equal(register.current, 2);
    });

  });

  describe("prev", () => {

    it("should decrease the pointer by 1", () => {
      let register = Regsiter(items);
      register.next();
      register.next();
      register.prev();

      assert.equal(register.current, 2);
    });

    it("should decrease the pointer by 2 when calling twice", () => {
      let register = Regsiter(items);
      register.next();
      register.next();
      register.prev();
      register.prev();

      assert.equal(register.current, 1);
    });

    it("should keep the pointer to the first item when overflowing the items list", () => {
      let register = Regsiter([1, 2]);
      register.prev();
      register.prev();
      register.prev();

      assert.equal(register.current, 1);
    });

  });

  describe("register overflow", () => {

    it("should call head when reaching the first item", (done) => {
      let register = Regsiter([1, 2], { head: done });
      register.next();
      register.prev();
    });

    it("sould call tail and head only once when reaching the first or last item", () => {
      let headCalls = 0;
      let tailCalls = 0;

      let register = Regsiter([1, 2], {
        head: () => {
          headCalls += 1;
        },
        tail: () => {
          tailCalls += 1;
        }
      });

      register.next();
      register.next();
      register.next();
      register.next();
      register.prev();
      register.next();
      register.prev();
      register.prev();
      register.next();
      register.prev();
      register.prev();
      register.prev();

      assert.equal(headCalls, 3, "There should be 3 head calls.");
      assert.equal(tailCalls, 3, "There should be 3 tail calls.");

    });

    it("sould call tail again when the item set has been extended", () => {
      let tailCalls = 0;

      let register = Regsiter([1, 2], {
        tail: () => {
          tailCalls += 1;
        }
      });

      register.next();
      register.next();
      register.append([3, 4]);
      register.next();
      register.next();

      assert.equal(tailCalls, 2, "There should be 2 tail calls.");

    });

    it("sould call head again when the item set has been extended", () => {
      let headCalls = 0;

      let register = Regsiter([1, 2], {
        head: () => {
          headCalls += 1;
        }
      });

      register.next();
      register.prev();
      register.prepend([3, 4]);
      register.prev();
      register.prev();

      assert.equal(headCalls, 2, "There should be 2 head calls.");

    });

  });

  describe("set", () => {

    it("should throw an error when the item could not be found", () => {
      let register = Regsiter([]);
      assert.throws(() => { register.set(items[2]); }, Error, "Item was not found");
    });

    it("should update the pointer to the set item", () => {
      let register = Regsiter(items);
      register.set(items[2]);

      assert.equal(register.pointer, 2);
    });

    it("should call head function when set to the first item", (done) => {
      let register = Regsiter(items, { head: done });
      register.set(items[3]);
      register.set(items[0]);
    });

    it("should call tail function when set to the last item", (done) => {
      let register = Regsiter(items, { tail: done });
      register.set(items[items.length - 1]);
    });

  });

  describe("hasNext", () => {

    it("should be false on an empty register", () => {
      assert.isFalse(Regsiter().hasNext(), "An empty register should not have next items.");
    });

    it("should be false an a register with one item", () => {
      assert.isFalse(Regsiter([1]).hasNext(), "A register with one item should not have next items.");
    });

    it("should be true an a register with more than one item", () => {
      assert.isTrue(Regsiter([1, 2]).hasNext(), "A register with more than one item should have next items.");
    });

  });

  describe("hasPrev", () => {

    it("should be false on an empty register", () => {
      assert.isFalse(Regsiter().hasPrev(), "An empty register should not have previous items.");
    });

    it("should be false an a register with one item", () => {
      assert.isFalse(Regsiter([1]).hasPrev(), "A register with one item should not have previous items.");
    });

    it("should be false an a register with more than one item initially", () => {
      assert.isFalse(Regsiter([1, 2]).hasPrev(), "A register with more than one item should have previous items initially.");
    });

    it("should be true an a register with more than one item with pointer not set to the first item", () => {
      let register = Regsiter([1, 2]);
      register.next();
      assert.isTrue(register.hasPrev(), "A register with more than one item should have previous items when the pointer is not set to the first item.");
    });

  });

  describe("reset", () => {

    it("should clear the item with no arguments", () => {
      let register = Regsiter([1, 2, 3]);
      register.reset();
      assert.deepEqual(register.items, []);
    });

    it("should reset the pointer to 0", () => {
      let register = Regsiter([1, 2, 3]);
      register.set(register.items[1]);
      register.reset();
      assert.deepEqual(register.pointer, 0);
    });

    it("should reset the items with the given items as arguments", () => {
      let register = Regsiter([1, 2, 3]);
      register.reset([5, 6, 7]);
      assert.deepEqual(register.items, [5, 6, 7]);
    });

  });

});
