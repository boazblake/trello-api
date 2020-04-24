(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    var val = aliases[name];
    return (val && name !== val) ? expandAlias(val) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("app.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toolbar = _interopRequireDefault(require("./toolbar"));

var _column = _interopRequireDefault(require("./column"));

var _scrollbar = _interopRequireDefault(require("./scrollbar"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var App = function App(mdl) {
  return {
    view: function view() {
      return m(".app", [m(_toolbar["default"], {
        mdl: mdl
      }), m(".board.container.columns col-oneline", mdl.cols.map(function (col) {
        return m(_column["default"], {
          col: col,
          mdl: mdl
        });
      })), m(_scrollbar["default"], {
        mdl: mdl
      })]);
    }
  };
};

var _default = App;
exports["default"] = _default;
});

;require.register("card.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ramda = require("ramda");

var drag = function drag(mdl) {
  return function (colId) {
    return function (evt) {
      mdl.state.dragging.cardId = evt.target.id;
      mdl.state.dragging.oldColId = colId;
    };
  };
};

var Card = function Card() {
  return {
    view: function view(_ref) {
      var _ref$attrs = _ref.attrs,
          colId = _ref$attrs.colId,
          cardId = _ref$attrs.cardId,
          mdl = _ref$attrs.mdl;
      var card = mdl.cards.filter((0, _ramda.propEq)("id", cardId))[0];
      return m(".card", {
        id: cardId,
        draggable: true,
        ondragstart: drag(mdl)(colId)
      }, [m(".card-header", [m("p.card-id", cardId), m("input.panel-title", {
        oninput: function oninput(e) {
          return card.name = e.target.value;
        },
        placeholder: "card title"
      }, card.name)]), m(".card-body", [m("textbox.panel-title", {
        oninput: function oninput(e) {
          return card.name = e.target.value;
        },
        placeholder: "card title"
      }, card.name)]), m(".card-footer")]);
    }
  };
};

var _default = Card;
exports["default"] = _default;
});

;require.register("column.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _card = _interopRequireDefault(require("./card"));

var _model = require("./model");

var _helpers = require("./helpers");

var _ramda = require("ramda");

var _index = require("@mithril-icons/clarity/cjs/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var drop = function drop(mdl) {
  return function (state) {
    return function (evt) {
      evt.preventDefault();

      if (!state.isSelected) {
        var cardId = mdl.state.dragging.cardId;
        var oldColId = mdl.state.dragging.oldColId;
        var oldCol = mdl.cols.filter((0, _ramda.propEq)("id", oldColId))[0];
        oldCol.cards = (0, _ramda.without)([cardId], oldCol.cards);
        var newCol = mdl.cols.filter((0, _ramda.propEq)("id", state.colId))[0];
        newCol.cards.push(cardId);
        state.highlight = false;
        return mdl;
      }
    };
  };
};

var dragOver = function dragOver(mdl) {
  return function (state) {
    return function (evt) {
      // let col = mdl.cols.filter(propEq("id", state.colId))[0]
      if (state.isSelected) {
        state.highlight = false;
      } else {
        state.highlight = true;
      }

      evt.preventDefault();
    };
  };
};

var dragEnter = function dragEnter(mdl) {
  return function (state) {
    return function (evt) {
      // state.highlight = true
      evt.preventDefault();
      return true;
    };
  };
};

var dragLeave = function dragLeave(mdl) {
  return function (state) {
    return function (evt) {
      state.highlight = false;
      evt.preventDefault();
      return true;
    };
  };
};

var dragEnd = function dragEnd(mdl) {
  return function (state) {
    return function (evt) {
      state.highlight = false;
      evt.preventDefault();
      return true;
    };
  };
};

var Column = function Column(_ref) {
  var _ref$attrs = _ref.attrs,
      mdl = _ref$attrs.mdl,
      col = _ref$attrs.col;
  var state = {
    highlight: false,
    colId: col.id,
    isSelected: false,
    togglePinSection: {
      onclick: function onclick() {
        return state.isSelected = !state.isSelected;
      }
    }
  };

  var addCard = function addCard(mdl) {
    return function (colId) {
      return function (id) {
        return mdl.cols.filter((0, _ramda.propEq)("id", colId)).map(function (col) {
          var card = (0, _model.newCard)(id);
          mdl.cards.push(card);
          col.cards.push(card.id);
        });
      };
    };
  };

  return {
    view: function view(_ref2) {
      var _ref2$attrs = _ref2.attrs,
          col = _ref2$attrs.col,
          mdl = _ref2$attrs.mdl;
      return m(".panel.column col-4", {
        id: col.id,
        "class": state.highlight ? "highlight-col" : "",
        ondrop: drop(mdl)(state),
        ondragover: dragOver(mdl)(state),
        ondragenter: dragEnter(mdl)(state),
        ondragend: dragEnd(mdl)(state),
        ondragleave: dragLeave(mdl)(state)
      }, [m(".panel-header", [m("button", {
        onclick: function onclick() {
          return addCard(mdl)(col.id)((0, _helpers.uuid)());
        }
      }, "Add Card"), m(state.isSelected ? _index.PinSolid : _index.PinLine, state.togglePinSection), m(".panel-title", col.id), m("input.panel-title", {
        oninput: function oninput(e) {
          return col.name = e.target.value;
        },
        placeholder: "column title"
      }, col.name)]), m(".panel-body", col.cards.map(function (cardId) {
        return m(_card["default"], {
          colId: col.id,
          cardId: cardId,
          mdl: mdl
        });
      }))]);
    }
  };
};

var _default = Column;
exports["default"] = _default;
});

;require.register("helpers.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.log = exports.uuid = void 0;

var uuid = function uuid() {
  return "xxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
        v = c == "x" ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
};

exports.uuid = uuid;

var log = function log(m) {
  return function (v) {
    console.log(m, v);
    v;
  };
}; // const updateDropped = mdl => cardId => newColId =>
// mdl.cols.filtet


exports.log = log;
});

;require.register("index.js", function(exports, require, module) {
"use strict";

var _app = _interopRequireDefault(require("./app.js"));

var _model = _interopRequireDefault(require("./model.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var root = document.body;
var winW = window.innerWidth;

if (module.hot) {
  module.hot.accept();
}

if ('development' !== "production") {
  console.log("Looks like we are in development mode!");
} else {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("./service-worker.js").then(function (registration) {
        console.log("⚙️ SW registered: ", registration);
      })["catch"](function (registrationError) {
        console.log("🧟 SW registration failed: ", registrationError);
      });
    });
  }
} // set display profiles


var getProfile = function getProfile(w) {
  if (w < 668) return "phone";
  if (w < 920) return "tablet";
  return "desktop";
};

var checkWidth = function checkWidth(winW) {
  var w = window.innerWidth;

  if (winW !== w) {
    winW = w;
    var lastProfile = _model["default"].settings.profile;
    _model["default"].settings.profile = getProfile(w);
    if (lastProfile != _model["default"].settings.profile) m.redraw();
  }

  return requestAnimationFrame(checkWidth);
};

_model["default"].settings.profile = getProfile(winW);
checkWidth(winW);
m.mount(root, (0, _app["default"])(_model["default"]));
});

;require.register("initialize.js", function(exports, require, module) {
"use strict";

document.addEventListener("DOMContentLoaded", function () {
  require("./index.js");
});
});

;require.register("model.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.newCol = exports.newCard = void 0;

var newCard = function newCard(id) {
  return {
    id: id,
    title: "",
    description: ""
  };
};

exports.newCard = newCard;

var newCol = function newCol(id) {
  return {
    id: id,
    title: "",
    cards: [],
    isSelected: false
  };
};

exports.newCol = newCol;
var model = {
  settings: {},
  state: {
    dragging: {
      oldColId: "",
      cardId: ""
    }
  },
  cols: [],
  cards: []
};
var _default = model;
exports["default"] = _default;
});

;require.register("scrollbar.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var ScrollBar = function ScrollBar() {
  return {
    view: function view(_ref) {
      var mdl = _ref.attrs.mdl;
      return m(".scrollbar", []);
    }
  };
};

var _default = ScrollBar;
exports["default"] = _default;
});

;require.register("toolbar.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _model = require("./model");

var _helpers = require("./helpers");

var Toolbar = function Toolbar() {
  return {
    view: function view(_ref) {
      var mdl = _ref.attrs.mdl;
      return m(".toolbar", [m("button", {
        onclick: function onclick() {
          return mdl.cols.push((0, _model.newCol)((0, _helpers.uuid)()));
        }
      }, "Add Column")]);
    }
  };
};

var _default = Toolbar;
exports["default"] = _default;
});

;require.register("___globals___", function(exports, require, module) {
  

// Auto-loaded modules from config.npm.globals.
window.m = require("mithril");
window.Stream = require("mithril-stream");


});})();require('___globals___');


//# sourceMappingURL=app.js.map