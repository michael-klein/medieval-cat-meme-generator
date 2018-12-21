import { html, render } from "https://unpkg.com/htm@1.0.1/preact/standalone.mjs";
import { App } from "./components/app.js";
render(html`<${App} page="All" />`, document.body);
