import Showroom from "showroom";

export function defaultShowroom() {
  fixture.load("default_outlet.html", "default_list.html");
  let defaultItems = fixture.el.querySelectorAll(".item");

  return Showroom(defaultItems, {
    fetch: () => {
      return `
        <div id='content'>content</div>
        <button id='ftw-showroom-next'></button>
        <button id='ftw-showroom-prev'></button>
      `;
    },
    target: "#outlet",
    total: 10
  });
}

export function singleShowroom() {
  fixture.load("default_outlet.html", "default_item.html");
  let singleItem = fixture.el.querySelectorAll(".item");

  return Showroom(singleItem, {
    fetch: () => {
      return `
        <div id='content'>content</div>
        <button id='ftw-showroom-next'></button>
        <button id='ftw-showroom-prev'></button>
      `;
    },
    target: "#outlet"
  });
}
