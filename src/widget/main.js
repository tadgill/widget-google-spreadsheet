/* global RiseVision, gadgets */

require("./css/spreadsheet.css");

const React = require("react");
const ReactDOM = require("react-dom");
const Spreadsheet = require("./spreadsheet");
const SpreadsheetHeader = require("./spreadsheet-header");
const SpreadsheetTable = require("./spreadsheet-table");

(function (window, document, gadgets) {
  "use strict";

  var id = new gadgets.Prefs().getString("id");

  // Disable context menu (right click menu)
  window.oncontextmenu = function () {
    return false;
  };

  function configure(names, values) {
    var additionalParams,
      companyId = "",
      displayId = "";

    if (Array.isArray(names) && names.length > 0 && Array.isArray(values) && values.length > 0) {
      // company id
      if (names[0] === "companyId") {
        companyId = values[0];
      }

      // display id
      if (names[1] === "displayId") {
        if (values[1]) {
          displayId = values[1];
        }
        else {
          displayId = "preview";
        }
      }

      // provide LoggerUtils the ids to use
      RiseVision.Common.LoggerUtils.setIds(companyId, displayId);

      // additional params
      if (names[2] === "additionalParams") {
        additionalParams = JSON.parse(values[2]);

        Spreadsheet.setAdditionalParams(additionalParams);
      }
    }
  }

  function play() {
    Spreadsheet.play();
  }

  function pause() {
    Spreadsheet.pause();
  }

  function stop() {
    Spreadsheet.stop();
  }

  function webComponentsReady() {
    if (id && id !== "") {
      gadgets.rpc.register("rscmd_play_" + id, play);
      gadgets.rpc.register("rscmd_pause_" + id, pause);
      gadgets.rpc.register("rscmd_stop_" + id, stop);
      gadgets.rpc.register("rsparam_set_" + id, configure);
      gadgets.rpc.call("", "rsparam_get", null, id, ["companyId", "displayId", "additionalParams"]);
    }

    ReactDOM.render(<SpreadsheetHeader />, document.querySelector(".header"));
    ReactDOM.render(<SpreadsheetTable />, document.querySelector(".page"));
  }

  window.addEventListener("WebComponentsReady", webComponentsReady);
})(window, document, gadgets);
