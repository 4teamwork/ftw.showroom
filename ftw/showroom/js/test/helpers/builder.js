import Showroom from "ftw.showroom";
const $ = require("jquery");

export function defaultShowroom(options) {
  fixture.load("default_outlet.html", "default_list.html");
  let defaultItems = fixture.el.querySelectorAll(".showroom-item");

  return Showroom(defaultItems, $.extend({
    fetch: () => {
      return `
        <div id='content'>content</div>
        <button class='ftw-showroom-next'></button>
        <button class='ftw-showroom-prev'></button>
      `;
    },
    target: "#outlet",
    total: 10
  }, options));
}

export function singleShowroom() {
  fixture.load("default_outlet.html", "default_item.html");
  let singleItem = fixture.el.querySelectorAll(".showroom-item");

  return Showroom(singleItem, {
    fetch: () => {
      return `
        <div id='content'>content</div>
        <button class='ftw-showroom-next'></button>
        <button class='ftw-showroom-prev'></button>
      `;
    },
    target: "#outlet"
  });
}

export function multipleShowroom() {
  fixture.load("default_outlet.html", "multiple_list.html");
  const group1 = fixture.el.querySelectorAll(".group1.showroom-item");
  const group2 = fixture.el.querySelectorAll(".group2.showroom-item");

  const fetch = () => {
    return `
      <div class='content'>content</div>
      <button class='ftw-showroom-next'></button>
      <button class='ftw-showroom-prev'></button>
    `;
  }

  return [
    Showroom(group1, {
      fetch,
      target: "#outlet"
    }),
    Showroom(group2, {
      fetch,
      target: "#outlet"
    })
  ]
}

export function referenceShowroom() {
  fixture.load("default_outlet.html", "reference_item.html");
  let item = fixture.el.querySelectorAll(".showroom-item");

  return Showroom(item, {
    fetch: () => {
      return `
        <div id='content'>content</div>
        <button class='ftw-showroom-next'></button>
        <button class='ftw-showroom-prev'></button>
      `;
    },
    target: "#outlet"
  });
}
