import { html } from "https://unpkg.com/htm@1.0.1/preact/standalone.mjs";
import store from "../store.js";
const { css } = emotion;
const optionsClass = css`
  background: #80808094;
  padding: 15px;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  input,
  button,
  a.download {
    border: none;
    padding: 5px;
    background: #0000007d;
    text-align: center;
    color: white;
    width: 100%;
    flex: 0;
    margin-bottom: 10px;
    min-height: 28px;
  }
  button,
  a.download {
    background: #313131;
    position: relative;
    cursor: pointer;
    &:before {
      content: "+";
      position: absolute;
      left: 10px;
    }
    &.download:before {
      content: "↡";
    }
  }
  a.translate {
    color: #690000 !important;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
  div.spacer {
    flex: auto;
  }
`;
export default ({ catTexts, onDownload }) => {
  const onInput = (target, index) => {
    store.dispatch({
      type: "UPDATE_TEXT",
      index,
      text: target.value
    });
  };
  const onClick = () => {
    store.dispatch({
      type: "ADD_TEXT"
    });
  };
  return html`
    <div class="${optionsClass}">
      ${
        catTexts.map(
          (text, index) =>
            html`
              <input
                type="text"
                value="${text}"
                onInput="${e => onInput(e.target, index)}"
              />
            `
        )
      } <button onClick="${onClick}">Addeth</button>
      <div class="spacer"></div>
      <a class="download" onClick="${onDownload}">Receiveth image</a>
      <a
        href="https://lingojam.com/EnglishtoShakespearean"
        target="_blank"
        class="translate"
        >Translateth to the ancient tongue ↣</a
      >
    </div>
  `;
};
