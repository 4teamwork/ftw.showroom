export default function Oberserver(initialValue) {

  let value = initialValue;
  let changed = false;
  let reveal = {};

  function update(newValue) {
    if(newValue === value) {
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

  Object.defineProperty(reveal, "value", {
    get: () => { return value; }
  });

  reveal.update = update;
  reveal.hasChanged = hasChanged;
  reveal.reset = reset;

  return Object.freeze(reveal);

}
