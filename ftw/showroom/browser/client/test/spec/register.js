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

    let pushItems = [6, 7, 8, 9, 10];

    it("should extend the default items with the new set of items", () => {
      let register = Regsiter(items);
      register.append(pushItems);

      assert.deepEqual(register.items, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    it("should update the size", () => {
      let register = Regsiter(items);
      register.append(pushItems);

      assert.equal(register.size, 10);
    });

    it("should not touch the pointer", () => {
      let register = Regsiter(items);
      register.append(pushItems);

      assert.equal(register.current, 1);
    });

  });

  describe("next", () => {

    it("sould increase the pointer by 1", () => {
      let register = Regsiter(items);
      register.next();

      assert.equal(register.current, 2);
    });

    it("sould increase the pointer by 2 when calling twice", () => {
      let register = Regsiter(items);
      register.next();
      register.next();

      assert.equal(register.current, 3);
    });

    it("sould keep the pointer to the last item when overflowing the items list", () => {
      let register = Regsiter([1, 2]);
      register.next();
      register.next();
      register.next();
      register.next();

      assert.equal(register.current, 2);
    });

  });

  describe("prev", () => {

    it("sould decrease the pointer by 1", () => {
      let register = Regsiter(items);
      register.next();
      register.next();
      register.prev();

      assert.equal(register.current, 2);
    });

    it("sould decrease the pointer by 2 when calling twice", () => {
      let register = Regsiter(items);
      register.next();
      register.next();
      register.prev();
      register.prev();

      assert.equal(register.current, 1);
    });

    it("sould keep the pointer to the first item when overflowing the items list", () => {
      let register = Regsiter([1, 2]);
      register.prev();
      register.prev();
      register.prev();

      assert.equal(register.current, 1);
    });

  });

  describe("register overflow", () => {

    it("sould call tail immediately on a list with one element", (done) => {
      let register = Regsiter([1], { tail: done });
    });

    it("sould call head on Initialisation", (done) => {
      let register = Regsiter([], { head: done });
    });

    it("sould call head when reaching the first item", (done) => {
      var called = false;

      let register = Regsiter([1, 2],
        {
          head: () => {
            if(!called) {
              called = true;
            } else {
              done();
            }
          }
        }
      );

      register.next();
      register.prev();

    });

  });

  describe("set", () => {

    it("sould throw an error when the item could not be found", () => {
      let register = Regsiter([]);
      assert.throws(() => { register.set(items[2]); }, Error, "Item was not found");
    });

    it("sould update the pointer to the set item", () => {
      let register = Regsiter(items);
      register.set(items[2]);

      assert.equal(register.pointer, 2);
    });

    it("sould call head function when set to the first item", (done) => {
      let called = false;

      let register = Regsiter(items, { head: () => {
        if(!called) {
          called = true;
        } else {
          done();
        }
      }});
      register.set(items[0]);
    });

  });

});

