import { html, Component } from "https://unpkg.com/htm/preact/standalone.mjs";
import CatOptions from "./cat_options.js";
const { css, injectGlobal } = emotion;

const imgClass = css`
  position: relative;
  opacity: 0;
  max-width: 450px;
  width: 100%;
  z-index: -1;
`;
export default class CatEditor extends Component {
  constructor(props) {
    super(props);
    this.containerRef = this.containerRef.bind(this);
    this.imgLoaded = this.imgLoaded.bind(this);
    this.state = {
      height: 0
    };
    this.fabricTexts = [];
    this.onDownload = this.onDownload.bind(this);
  }
  imgLoaded() {
    const image = document.getElementById("cat-img");
    if (!this.initialized) {
      this.initialized = true;
      setTimeout(
        () => injectGlobal`
        body {
          #loader-overlay{
            display:none;
          }
        }
    `,
        500
      );
      injectGlobal`
        body {
          #loader-overlay{
            opacity: 0;
          }
        }
      `;
    }
    this.setState({
      height: image.clientHeight
    });
    this.currentFabric
      .setWidth(image.clientWidth)
      .setHeight(image.clientHeight);
    if (this.currentImage) this.currentFabric.remove(this.currentImage);
    this.currentImage = new fabric.Image(image, {
      left: 0,
      top: 0,
      selectable: false
    });
    this.currentImage.scaleToWidth(image.clientWidth);
    this.currentFabric.add(this.currentImage);
    this.setTexts(this.props.catTexts);
  }
  setTexts(catTexts) {
    this.fabricTexts.map(fabricText => {
      this.currentFabric.remove(fabricText);
    });
    this.fabricTexts = catTexts.map((text, index) => {
      let fabricText = this.fabricTexts[index];
      if (!fabricText) {
        fabricText = new fabric.Text(text, {
          fontSize: 40,
          fontFamily: "IM Fell DW Pica",
          top: Math.min(40 + 50 * index, this.currentFabric.height - 40),
          left: this.currentFabric.width / 2,
          stroke: "#000000",
          strokeWidth: 8,
          fill: "#ffffff",
          textAlign: "center",
          paintFirst: "stroke",
          objecttype: "text",
          lockRotation: true,
          lockScalingFlip: true,
          originX: "center",
          originY: "center",
          centeredScaling: true
        });
      }
      fabricText.text = text;
      this.handlePosition(fabricText);
      this.handleScale(fabricText);
      this.currentFabric.add(fabricText);
      return fabricText;
    });
  }
  handlePosition(text) {
    const width = text.width * text.scaleX;
    let positionAdjusted = false;
    if (text.left - width / 2 <= 0) {
      text.left = width / 2;
      positionAdjusted = true;
    }
    if (text.left + width / 2 >= this.currentFabric.width) {
      text.left = this.currentFabric.width - width / 2;
      positionAdjusted = true;
    }
    const height = text.height * text.scaleY;
    if (text.top - height / 2 <= 0) {
      text.top = height / 2;
      positionAdjusted = true;
    }
    if (text.top + height / 2 >= this.currentFabric.height) {
      text.top = this.currentFabric.height - height / 2;
      positionAdjusted = true;
    }
    return positionAdjusted;
  }
  handleScale(text) {
    const targetWidth = this.currentFabric.width - 10;
    while (
      (text.width * text.scaleX > targetWidth ||
        text.left - (text.width * text.scaleX) / 2 < 10 ||
        text.left + (text.width * text.scaleX) / 2 > targetWidth) &&
      text.scaleX > 0.1
    ) {
      text.scaleX -= 0.01;
    }
    text.scaleY = text.scaleX;
    const targetHeight = this.currentFabric.height - 10;
    while (
      (text.height * text.scaleY > targetHeight ||
        text.top - (text.height * text.scaleY) / 2 < 10 ||
        text.top + (text.height * text.scaleY) / 2 > targetHeight) &&
      text.scaleY > 0.1
    ) {
      text.scaleY -= 0.01;
    }
    text.scaleX = text.scaleY;
  }
  containerRef(container) {
    if (container) {
      if (this.currentFabric) {
        this.currentFabric.clear();
      } else {
        const canvas = document.createElement("canvas");
        container.appendChild(canvas);
        this.currentFabric = new fabric.Canvas(canvas);
        this.currentFabric.on("object:moving", ({ e, target, transform }) => {
          if (this.handlePosition(target)) {
            e.preventDefault();
            return false;
          }
        });
        this.currentFabric.on("object:scaling", ({ target, transform }) => {
          this.handleScale(target);
        });
      }
    }
  }
  componentDidUpdate() {
    this.setTexts(this.props.catTexts);
  }
  componentDidMount() {
    window.addEventListener("resize", () => this.imgLoaded());
  }
  onDownload(e) {
    const a = e.target;
    a.href = this.currentFabric.toDataURL({
      format: 'jpeg'
    });
    a.download = "dank_cat_meme.jpg";
  }
  render({ selectedCat, catTexts }) {
    const containerClass = css`
      height: ${this.state.height}px;

      @media only screen and (max-width: 900px) {
        height: auto;
      }

      position: relative;
      display: flex;
      justify-content: center;
      #canvas-container {
        position: relative;
        display: grid;
        grid-template-columns: auto auto;
        grid-column-gap: 0px;
        grid-row-gap: 0px;
        align-items: start;

        box-shadow: 0 15px 30px 0 rgba(0, 0, 0, 0.11),
          0 5px 15px 0 rgba(0, 0, 0, 0.08);
        border-top-right-radius: 15px;
        border-bottom-right-radius: 15px;
        @media only screen and (max-width: 900px) {
          border-top-right-radius: 0px;
          border-bottom-left-radius: 15px;
          grid-template-columns: auto;
        }

        overflow: hidden;

        .canvas-container {
          position: absolute !important;
          top: 0px;
          left: 0px;
        }
      }
    `;
    return selectedCat > -1
      ? html`
          <div class="${containerClass} container">
            <div id="canvas-container" ref="${this.containerRef}">
              <img
                onLoad="${this.imgLoaded}"
                class="${imgClass}"
                id="cat-img"
                src="./cats/cat_${selectedCat}.jpg"
              />
              <${CatOptions} ...${{
          catTexts: catTexts,
          onDownload: this.onDownload
        }}/>
            </div>
          </div>
        `
      : null;
  }
}
