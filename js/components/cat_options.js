import { html } from "https://unpkg.com/htm/preact/standalone.mjs";
import store from "../store.js";
const { css } = emotion;
const optionsClass = css`
  background: #80808094;
  padding: 15px;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  @media only screen and (max-width: 900px) {
    border-top-right-radius: 0px;
    border-bottom-left-radius: 15px;
  }
  align-self: stretch;
  display: flex;
  flex-direction: column;
  input,
  button {
    border: none;
    padding: 5px;
    background: #0000007d;
    color: white;
    width: 100%;
    flex: 0;
    margin-bottom: 10px;
    min-height: 28px;
  }
  button {
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
      <button class="download" onClick="${onDownload}">Receiveth image</button>
    </div>
  `;
};
