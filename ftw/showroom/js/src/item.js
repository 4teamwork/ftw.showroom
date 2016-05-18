import { generateUUID } from "./utils";

export default function Item(element) {

  let reveal = {};
  let showroomId = generateUUID();
  let rendered = false;

  element.setAttribute("data-showroom-id", showroomId);

  reveal.element = element;
  reveal.target = element.getAttribute("data-showroom-target") || "";
  reveal.title = element.getAttribute("data-showroom-title") || "";
  reveal.id = showroomId;
  Object.defineProperty(reveal, "rendered", {
    get: () => { return rendered; },
    set: (val) => { rendered = val }
  });

  return reveal;

}
