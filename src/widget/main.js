/* global RiseVision, gadgets, google */

(function (window, document, google, gadgets) {
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

        RiseVision.Spreadsheet.setParams(additionalParams);
      }
    }
  }

  function play() {
    RiseVision.Spreadsheet.play();
  }

  function pause() {
    RiseVision.Spreadsheet.pause();
  }

  function stop() {
    RiseVision.Spreadsheet.pause();
  }

  if (id && id !== "") {
    gadgets.rpc.register("rscmd_play_" + id, play);
    gadgets.rpc.register("rscmd_pause_" + id, pause);
    gadgets.rpc.register("rscmd_stop_" + id, stop);
  }

  // ensuring a transparent background immediately
  document.body.style.background = "transparent";

  google.setOnLoadCallback(function () {
    gadgets.rpc.register("rsparam_set_" + id, configure);
    gadgets.rpc.register("rscmd_getSpreadsheetData", function (url) {
      RiseVision.Spreadsheet.getData(url);
    });
    gadgets.rpc.call("", "rsparam_get", null, id, ["companyId", "displayId", "additionalParams"]);
  });

})(window, document, google, gadgets);
