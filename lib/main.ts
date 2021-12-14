import lib, { version } from "./entry-browser";

document.body.innerHTML = JSON.stringify({ lib, version });
