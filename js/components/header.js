import { html } from "https://unpkg.com/htm/preact/standalone.mjs";
import store from "../store.js";
const { css } = emotion;
const headerClass = css`
  background: #690000;
  position: fixed;
  top: 0px;
  width: 100%;
  z-index: 1000;
  color: white;
  font-size: 2em;
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    figure {
      min-width: 50px;
      min-height: 50px;
      border-radius: 50%;
      background: url(./img/derpcat.png);
      background-size: contain;
      margin: 0;
      padding: 0%;
      flex: 0;
    }
    .title {
      flex: auto;
      text-align: center;
      padding-right: 50px;
    }
  }
`;
export default ({ catTexts, onDownload }) => {
  return html`
    <header class="${headerClass}">
      <div class="container">
        <figure alt="logo"></figure>
        <div class="title">King DerpCats most wondrous meme gen'rat'r</div>
      </div>
    </header>
  `;
};
