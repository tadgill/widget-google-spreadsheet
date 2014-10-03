/* global RiseVision, gadgets, google */

(function (window, document, google, gadgets) {
  "use strict";

  var prefs = new gadgets.Prefs(),
    id = prefs.getString("id");

  // Disable context menu (right click menu)
  window.oncontextmenu = function () {
    return false;
  };

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

  google.setOnLoadCallback(function() {
    gadgets.rpc.register("rsparam_set_" + id, RiseVision.Spreadsheet.additionalParams);
    gadgets.rpc.register("rscmd_getSpreadsheetData", function (url) {
      RiseVision.Spreadsheet.getData(url);
    });
    gadgets.rpc.call("", "rsparam_get", null, id, "additionalParams");
  });

})(window, document, google, gadgets);


