import { generateUUID } from "./utils";

export default function Item(element) {

  let showroomId = generateUUID();

  let target = element.getAttribute("data-showroom-target") || "";
  let title = element.getAttribute("data-showroom-title") || "";

  element.setAttribute("data-showroom-id", showroomId);

  return Object.freeze({
    element: element,
    title: title,
    id: showroomId,
    target: target
  });

}
