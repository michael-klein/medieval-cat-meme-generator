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
            <${Header} />
            <main>
                <${CatEditor} ...${this.state}/>
                <${Gallery} />
            </main>
        </div>
    `;
  }
}
