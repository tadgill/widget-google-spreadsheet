require("./css/spreadsheet.css");

const React = require("react");
const ReactDOM = require("react-dom");
const Main = require("./components/main");

(function (window, document) {
  "use strict";

  // Disable context menu (right click menu)
  window.oncontextmenu = function () {
    return false;
  };

  window.addEventListener("WebComponentsReady", function() {
    ReactDOM.render(<Main />, document.getElementById("mainContainer"));
  });
})(window, document);
