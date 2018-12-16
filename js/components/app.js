import { html, Component } from "https://unpkg.com/htm/preact/standalone.mjs";
import store from "../store.js";
import Gallery from "./gallery.js";
import Header from "./header.js";
import CatEditor from "./cat_editor.js";
emotion.injectGlobal`
    @import url('https://fonts.googleapis.com/css?family=IM+Fell+DW+Pica'); 
    body {
        background: url(./img/bg.png);
        font-family: 'IM Fell DW Pica', serif;
        padding-top:100px;
    }
    * {
        box-sizing:border-box;
    }
    .container {
        max-width: 1200px;
        width: 100%;
        padding-left: 20px;
        padding-right: 20px;
        margin: 20px auto;
    }
    #loader-overlay {
        position: fixed;
        background: #272727;
        z-index:99999;
        bottom: 0px;
        right: 0px;
        left: 0px;
        top: 0px;
        transition: opacity 0.5s;
        opacity: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        .loader {
            position: relative;
            border: 8px solid #f3f3f3; /* Light grey */
            border-top: 8px solid #3498db; /* Blue */
            border-radius: 50%;
            width: 60px;
            height: 60px;
            animation: spin 2s linear infinite;
        }
    }
      
    @keyframes spin {
        0% { transform: rotate(0deg);
            transform-origin: center; }
        100% { transform: rotate(360deg);
            transform-origin: center; }
    }
`;

export class App extends Component {
  constructor() {
    super();
    this.state = store.getState();
  }
  componentDidMount() {
    store.subscribe(_ => {
      this.setState(store.getState());
    });
  }
  render() {
    return html`
        <div>
            <div id="loader-overlay">
                <div class="loader"></div>
            </div>
            <${Header} />
            <main>
                <${CatEditor} ...${this.state}/>
                <${Gallery} />
            </main>
        </div>
    `;
  }
}
