export default function Reference(element) {

  return Object.freeze({
    target: element.getAttribute("data-showroom-target-item") || ""
  });

}
