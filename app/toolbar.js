import { newCol } from "./model"
import { uuid } from "./helpers"

const Toolbar = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(".toolbar", [
        m(
          "button",
          { onclick: () => mdl.cols.push(newCol(uuid())) },
          "Add Column"
        ),
      ]),
  }
}

export default Toolbar
