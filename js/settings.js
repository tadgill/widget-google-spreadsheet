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
      alertCtn:             $("#settings-alert"),
      urlInp:               $("#url")
    };
  }

  function _getAdditionalParams(){
    var additionalParams = {};

    additionalParams["url"] = _el.urlInp.val();

    return additionalParams;
  }

  function _getParams(){
    var params = "";

    return params;
  }

  function _saveSettings(){
    //TODO: Will be conditional on validation code
    //construct settings object
    var settings = {
      "params" : _getParams(),
      "additionalParams" : JSON.stringify(_getAdditionalParams())
    };

    gadgets.rpc.call("", "rscmd_saveSettings", null, settings);
  }

  // public space
  return {
    init: function () {
      _cache();
      _bind();

      _el.alertCtn.hide();

      //Request additional parameters from the Viewer.
      gadgets.rpc.call("", "rscmd_getAdditionalParams", function(result) {

        _prefs = new gadgets.Prefs();

        if (result) {
          result = JSON.parse(result);

          // Set values from params

          //Additional params
          _el.urlInp.val(result["url"]);

        }

        i18n.init({ fallbackLng: "en" }, function(t) {
          _el.wrapperCtn.i18n().show();

          // Set tooltips only after i18n has shown
          $("label[for='validate-url'] + button").popover({trigger:'click'});

          //Set buttons to be sticky only after wrapper is visible.
          $(".sticky-buttons").sticky({
            container : _el.wrapperCtn,
            topSpacing : 41,	//top margin + border of wrapper
            getWidthFrom : _el.wrapperCtn
          });
        });
      });


    }
  };

})($,gadgets, i18n);

RiseVision.GoogleSpreadsheet.Settings.init();

