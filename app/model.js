export const newCard = (id) => ({ id, title: "", description: "" })
export const newCol = (id) => ({ id, title: "", cards: [], isSelected: false })

const model = {
  settings: {},
  state: {
    dragging: {
      oldColId: "",
      cardId: "",
    },
  },
  cols: [],
  cards: [],
}
export default model
