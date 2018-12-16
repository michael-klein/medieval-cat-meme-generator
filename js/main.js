import { html, render } from "https://unpkg.com/htm/preact/standalone.mjs";
import { App } from "./components/app.js";
render(html`<${App} page="All" />`, document.body);
