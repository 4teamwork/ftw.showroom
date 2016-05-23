import { generateUUID } from "./utils";

export default function Item(element) {

  let reveal = {};
  let showroomId = generateUUID();
  let rendered = false;

  element.setAttribute("data-showroom-id", showroomId);

  function destroy() { element.removeAttribute("data-showroom-id"); }

  reveal.element = element;
  reveal.target = element.getAttribute("data-showroom-target") || "";
  reveal.title = element.getAttribute("data-showroom-title") || "";
  reveal.id = showroomId;

  return Object.freeze({
    id: showroomId,
    element,
    target: element.getAttribute("data-showroom-target") || "",
    title: element.getAttribute("data-showroom-title") || "",
    destroy
  });

}
