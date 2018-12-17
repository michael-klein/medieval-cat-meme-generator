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
    this.imgLoad = this.imgLoad.bind(this);
    this.state = {
      height: 0
    };
    this.fabricTexts = [];
    this.onDownload = this.onDownload.bind(this);
  }
  imgLoad(event) {
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
          top: 40 + 50 * index,
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
        while (
          fabricText.fontSize > 0 &&
          fabricText.calcTextWidth() > this.currentFabric.width - 20
        ) {
          fabricText = new fabric.Text(text, {
            fontSize: fabricText.fontSize - 1,
            fontFamily: "IM Fell DW Pica",
            top: 40 + 50 * index,
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
      }
      fabricText.text = text;
      this.currentFabric.add(fabricText);
      return fabricText;
    });
  }
  handlePosition(text, transform) {
    const width = text.width * transform.scaleX;
    let positionAdjusted = false;
    if (text.left - width / 2 <= 0) {
      text.left = width / 2;
      positionAdjusted = true;
    }
    if (text.left + width / 2 >= this.currentFabric.width) {
      text.left = this.currentFabric.width - width / 2;
      positionAdjusted = true;
    }
    const height = text.height * transform.scaleY;
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
        this.currentFabric.on("object:scaling", ({ e, target, transform }) => {
          if (transform.action === "scaleX" || transform.action === "scale") {
            const width = target.width * target.scaleX;
            if (width > this.currentFabric.width) {
              target.scaleX = this.currentFabric.width / target.width;
            }
            if (target.scaleX < 0.2) {
              target.scaleX = 0.2;
            }
            target.scaleY = target.scaleX;
          }
          if (transform.action === "scaleY" || transform.action === "scale") {
            const height = target.height * target.scaleY;
            if (height > this.currentFabric.height) {
              target.scaleY = this.currentFabric.height / target.height;
            }
            if (target.scaleY < 0.2) {
              target.scaleY = 0.2;
            }
            target.scaleX = target.scaleY;
          }
          console.log(target);
        });
      }
    }
  }
  componentDidUpdate() {
    this.setTexts(this.props.catTexts);
  }
  onDownload(e) {
    const a = e.target;
    a.href = this.currentFabric.toDataURL();
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
