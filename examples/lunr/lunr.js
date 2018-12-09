require("./lunr.scss");

var documents = [
  {
    name: "Algolia",
    text: "Better than search, much search smaller, and not as bright.",
    objectID: "test_1"
  },
  {
    name: "Lunr",
    text: "Like Solr, but much search, and not as bright.",
    objectID: "test_1"
  },
  {
    name: "React",
    text: "A JavaScript library for building user interfaces.",
    objectID: "test_2"
  },
  {
    name: "Lodash",
    text:
      "A modern JavaScript utility search delivering modularity, performance & extras.",
    objectID: "test_3"
  }
];

var hitTemplate = (hit, i) => `
<article id="hit${hit.objectID}" class="hit" data-algolia-objectid="${
  hit.objectID
}">
  <div class="product-picture-wrapper">
  </div>
  <div class="product-desc-wrapper">
    <div class="product-name">${hit.name}</div>
  </div>
  <button objectID="${hit.objectID}" position="${i +
  1}" class="button-click" style="background: blue;padding: 10px 12px; color: white;">click</button>
  <a data-object-id="${hit.objectID}" position="${i +
  1}" href="http://localhost:8080/product.html" class="button-click" style="background: blue;padding: 10px 12px; color: white;">VIEW ITEM</a>
  <button objectID="${
    hit.objectID
  }" class="button-convert" style="background: blue;padding: 10px 12px; color: white;">ADD TO CART</button>
</article>`;

var idx = lunr(function() {
  this.ref("name");
  this.field("text");

  documents.forEach(function(doc) {
    this.add(doc);
  }, this);
});

const q = document.querySelector("#q");

q.addEventListener("input", e => {
  // Send search event to analytics
  window.aa("search", { query: e.target.value, index: "Documents" });

  const results = idx.search(e.target.value);
  results.map((r, i) => {
    documents.forEach(o => {
      if (r.ref === o.name) {
        r = Object.assign(r, o);
      }
    });
    r.position = i + 1;
    return r;
  });

  const templates = results.map((r, i) => {
    return hitTemplate(r, i);
  });

  document.querySelector("#hits").innerHTML = templates.join("");
});

// Init search
window.aa("init", {
  apiKey: process.env.API_KEY,
  applicationID: process.env.APP_ID
});

// Analytics
document.addEventListener("click", e => {
  if (e.target.matches(".button-click")) {
    window.aa("clickedObjectIDInSearch", {
      eventName: "hit-clicked",
      index: process.env.INDEX_NAME,
      objectIDs: [e.target.getAttribute("objectid")],
      positions: [e.target.getAttribute("position")]
    });
  } else if (e.target.matches(".button-convert")) {
    window.aa("convertedObjectIDInSearch", {
      eventName: "hit-converted",
      index: process.env.INDEX_NAME,
      objectIDs: [e.target.getAttribute("objectid")]
    });
  }
});
