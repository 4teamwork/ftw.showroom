import { remove as removeFromArray } from "./utils";

const $ = require("jquery");

export default function Gallery(showrooms = []) {

  if(!Array.isArray(showrooms)) {
    throw new Error("Argument: showrooms is not a list");
  }

  function register(showroom) { return showrooms.push(showroom); }

  function unregister(showroom) { return removeFromArray(showrooms, showroom); }

  function getOpenShowrooms() { return showrooms.filter(showroom => showroom.isOpen); }

  function closeOthers(current) {
    const openShowrooms = removeFromArray(getOpenShowrooms(), current);
    if(openShowrooms.length > 0) {
      openShowrooms.forEach(showroom => showroom.close());
    }
  }

  function closeOpenShowrooms() { getOpenShowrooms.forEach((showroom) => showroom.close()); }

  function items() { return showrooms; }

  let reveal = {
    register,
    unregister,
    closeOthers
  };

  Object.defineProperty(reveal, "items", { get: () => { return items(); } })

  return Object.freeze(reveal);

}
