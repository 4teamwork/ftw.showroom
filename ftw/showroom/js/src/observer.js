const $ = require("jquery");

export default function Observer(value) {

  let changed = false;

  function update(newValue) {
    if(value === newValue) {
      changed = false;
    } else {
      changed = true;
    }
    value = newValue;
  }

  function hasChanged() { return changed; }

  function reset() {
    changed = false;
    value = undefined;
  }

  let reveal = {
    update,
    hasChanged,
    reset
  }

  Object.defineProperty(reveal, "value", {
    get: () => { return value; }
  });

  return Object.freeze(reveal);

}
