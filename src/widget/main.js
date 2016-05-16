require("./css/spreadsheet.css");

const React = require("react");
const ReactDOM = require("react-dom");
const Spreadsheet = require("./components/spreadsheet");

(function (window, document) {
  "use strict";

  // Disable context menu (right click menu)
  window.oncontextmenu = function () {
    return false;
  };

  window.addEventListener("WebComponentsReady", function() {
    ReactDOM.render(<Spreadsheet />, document.getElementById("container"));
  });
})(window, document);
