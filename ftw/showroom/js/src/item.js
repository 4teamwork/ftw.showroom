import { generateUUID } from "./utils";

export default function Item(element) {

  let showroomId = element.getAttribute("data-showroom-id") || generateUUID();
  let rendered = false;

  element.setAttribute("data-showroom-id", showroomId);

  function destroy() { element.removeAttribute("data-showroom-id"); }

  return Object.freeze({
    id: showroomId,
    element,
    target: element.getAttribute("data-showroom-target") || "",
    title: element.getAttribute("data-showroom-title") || "",
    destroy
  });

}
