import Card from "./card"
import { newCard } from "./model"
import { uuid } from "./helpers"
import { propEq, without } from "ramda"
import { PinLine, PinSolid } from "@mithril-icons/clarity/cjs/index"

const drop = (mdl) => (state) => (evt) => {
  evt.preventDefault()
  if (!state.isSelected) {
    let cardId = mdl.state.dragging.cardId
    let oldColId = mdl.state.dragging.oldColId

    let oldCol = mdl.cols.filter(propEq("id", oldColId))[0]
    oldCol.cards = without([cardId], oldCol.cards)
    let newCol = mdl.cols.filter(propEq("id", state.colId))[0]

    newCol.cards.push(cardId)
    state.highlight = false

    return mdl
  }
}

const dragOver = (mdl) => (state) => (evt) => {
  // let col = mdl.cols.filter(propEq("id", state.colId))[0]
  if (state.isSelected) {
    state.highlight = false
  } else {
    state.highlight = true
  }

  evt.preventDefault()
}

const dragEnter = (mdl) => (state) => (evt) => {
  // state.highlight = true
  evt.preventDefault()
  return true
}

const dragLeave = (mdl) => (state) => (evt) => {
  state.highlight = false
  evt.preventDefault()
  return true
}

const dragEnd = (mdl) => (state) => (evt) => {
  state.highlight = false
  evt.preventDefault()
  return true
}

const Column = ({ attrs: { mdl, col } }) => {
  const state = {
    highlight: false,
    colId: col.id,
    isSelected: false,
    togglePinSection: { onclick: () => (state.isSelected = !state.isSelected) },
  }

  const addCard = (mdl) => (colId) => (id) =>
    mdl.cols.filter(propEq("id", colId)).map((col) => {
      let card = newCard(id)
      mdl.cards.push(card)
      col.cards.push(card.id)
    })

  return {
    view: ({ attrs: { col, mdl } }) =>
      m(
        ".panel.column col-4",
        {
          id: col.id,
          class: state.highlight ? "highlight-col" : "",
          ondrop: drop(mdl)(state),
          ondragover: dragOver(mdl)(state),
          ondragenter: dragEnter(mdl)(state),
          ondragend: dragEnd(mdl)(state),
          ondragleave: dragLeave(mdl)(state),
        },
        [
          m(".panel-header", [
            m(
              "button",
              { onclick: () => addCard(mdl)(col.id)(uuid()) },
              "Add Card"
            ),
            m(state.isSelected ? PinSolid : PinLine, state.togglePinSection),
            m(".panel-title", col.id),
            m(
              "input.panel-title",
              {
                oninput: (e) => (col.name = e.target.value),
                placeholder: "column title",
              },
              col.name
            ),
          ]),
          m(
            ".panel-body",
            col.cards.map((cardId) => m(Card, { colId: col.id, cardId, mdl }))
          ),
        ]
      ),
  }
}

export default Column
