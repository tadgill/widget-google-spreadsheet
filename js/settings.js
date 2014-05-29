var RiseVision = RiseVision || {};
RiseVision.GoogleSpreadsheet = {};

RiseVision.GoogleSpreadsheet.Settings = (function($,gadgets, i18n) {
  "use strict";

  // private variables
  var _prefs = null, _el;

  // private functions
  function _bind() {
    // Add event handlers
  }

  function _cache() {
    _el = {};
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

