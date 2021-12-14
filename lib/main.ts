import lib, { version } from "./entry";

document.body.innerHTML = JSON.stringify({ lib, version });
