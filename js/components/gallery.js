import { html } from "https://unpkg.com/htm@1.0.1/preact/standalone.mjs";
import store from "../store.js";
const { css } = emotion;
const galleryClass = css`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  @media only screen and (max-width: 1200px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
  @media only screen and (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
  @media only screen and (max-width: 700px) {
    grid-template-columns: 1fr;
  }
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  justify-items: stretch;
  align-items: center;
  padding-top: 10px;
  figure {
    width: 100%;
    margin: 0;
    box-sizing: border-box;
    img {
      width: 100%;
      border: 2px solid #690000;
      &:hover {
        transform: scale(1.2);
        transition: transform 200ms;
        z-index: 100;
        cursor: pointer;
      }
    }
  }
`;
export default () => {
  return html`
    <div class="${galleryClass} container">
      ${
        Array(55)
          .fill("")
          .map(
            (_, index) =>
              html`
                <figure>
                  <img
                    onClick="${
                      () => {
                        window.scroll(0, 0);
                        store.dispatch({
                          type: "SELECT_CAT",
                          selectedCat: index
                        });
                      }
                    }"
                    src="./cats/thumbs/cat_${index}.jpg"
                  />
                </figure>
              `
          )
      }
    </div>
  `;
};
