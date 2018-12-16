import { html, Component } from "https://unpkg.com/htm/preact/standalone.mjs";
import CatOptions from "./cat_options.js";
const { css } = emotion;

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
    this.imgLoad = this.imgLoad.bind(this);
    this.state = {
      height: 0
    };
    this.fabricTexts = [];
    this.onDownload = this.onDownload.bind(this);
  }
  imgLoad(event) {
    this.setState({
      height: event.target.clientHeight
    });
    this.currentFabric
      .setWidth(event.target.clientWidth)
      .setHeight(event.target.clientHeight);
    if (this.currentImage) this.currentFabric.remove(this.currentImage);
    this.currentImage = new fabric.Image(event.target, {
      left: 0,
      top: 0,
      selectable: false
    });
    this.currentImage.scaleToWidth(event.target.clientWidth);
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
          top: 10 + 50 * index,
          left: 10,
          stroke: "#000000",
          strokeWidth: 8,
          fill: "#ffffff",
          textAlign: "center",
          paintFirst: "stroke",
          objecttype: "text",
          lockRotation: true
        });
      }
      fabricText.text = text;
      this.currentFabric.add(fabricText);
      return fabricText;
    });
  }
  handlePosition(text, transform) {
    const width = text.width * transform.scaleX;
    let positionAdjusted = false;
    if (text.left <= 0) {
      text.left = 0;
      positionAdjusted = true;
    }
    if (text.left + width >= this.currentFabric.width) {
      text.left = this.currentFabric.width - width;
      positionAdjusted = true;
    }
    const height = text.height * transform.scaleY;
    if (text.top <= 0) {
      text.top = 0;
      positionAdjusted = true;
    }
    if (text.top + height >= this.currentFabric.height) {
      text.top = this.currentFabric.height - height;
      positionAdjusted = true;
    }
    return positionAdjusted;
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
          if (this.handlePosition(target, transform)) {
            e.preventDefault();
            return false;
          }
        });
        this.currentFabric.on("object:scaling", function() {
          console.log(arguments);
        });
      }
    }
  }
  componentDidUpdate() {
    this.setTexts(this.props.catTexts);
  }
  onDownload() {
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.href = this.currentFabric.toDataURL();
    a.download = "dank_cat_meme.jpg";
    a.click();
    document.body.removeChild(a);
  }
  render({ selectedCat, catTexts }) {
    const containerClass = css`
      height: ${this.state.height}px;

      @media only screen and (max-width: 900px) {
        height: auto;
      }

      overflow: hidden;
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

        @media only screen and (max-width: 900px) {
          grid-template-columns: auto;
        }

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
                onLoad="${this.imgLoad}"
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
