var RiseVision = RiseVision || {};
RiseVision.GoogleSpreadsheet = {};

RiseVision.GoogleSpreadsheet.Settings = (function($,gadgets, i18n) {
  "use strict";

  // private variables
  var _prefs = null, _el;

  // private functions
  function _bind() {
    // Add event handlers
    $("#save").on("click", function() {
      _saveSettings();
    });

    $("#cancel, #settings-close").on("click", function() {
      gadgets.rpc.call("", "rscmd_closeSettings", null);
    });

    $("#help").on("click", function() {
      window.open("http://www.risevision.com/help/users/what-are-gadgets/" +
        "free-gadgets/rise-vision-google-spreadsheet/", "_blank");
    });
  }

  function _cache() {
    _el = {
      wrapperCtn:           $(".widget-wrapper"),
      alertCtn:             $("#settings-alert")
    };
  }

  function _saveSettings(){
    //TODO: Dependent on writing validation code first
  }

  // public space
  return {
    init: function () {
      _cache();
      _bind();
    }
  };

})($,gadgets, i18n);

RiseVision.GoogleSpreadsheet.Settings.init();

