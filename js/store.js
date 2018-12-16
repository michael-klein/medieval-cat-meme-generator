const { createStore } = Redux;
const defaultText = ["Ent'r thy text...", "...to maketh a dank meme!"];
const initialState = {
  selectedCat: Math.round(Math.random() * 55),
  catTexts: Object.assign([], defaultText)
};
function store(state = initialState, action) {
  switch (action.type) {
    case "SELECT_CAT":
      return Object.assign(state, {
        selectedCat: action.selectedCat
      });
    case "RESET_TEXT":
      return Object.assign(state, {
        catTexts: Object.assign([], defaultText)
      });
    case "UPDATE_TEXT":
      state.catTexts[action.index] = action.text;
      return state;
    case "ADD_TEXT":
      state.catTexts.push("Writeth something...");
      return state;
    default:
      return state;
  }
}

export default createStore(store);
