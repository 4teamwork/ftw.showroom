import { generateUUID } from "./utils";

export default function Item(element) {

  var showroomId = generateUUID();

  var target = element.getAttribute("data-showroom-target") || "";
  var title = element.getAttribute("data-showroom-title") || "";

  element.setAttribute("data-showroom-id", showroomId);

  return Object.freeze({
    element: element,
    title: title,
    id: showroomId,
    target: target
  });

}
