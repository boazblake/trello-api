import Toolbar from "./toolbar"
import Column from "./column"

const App = (mdl) => {
  return {
    view: () =>
      m(".app", [
        m(Toolbar, { mdl }),
        m(
          ".board.container.columns col-oneline",
          mdl.cols.map((col) => m(Column, { col, mdl }))
        ),
      ]),
  }
}

export default App
