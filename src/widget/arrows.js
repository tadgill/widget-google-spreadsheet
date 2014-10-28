/* global CONFIG */

var RiseVision = RiseVision || {};
RiseVision.Spreadsheet = RiseVision.Spreadsheet || {};
RiseVision.Spreadsheet.Arrows = {};

RiseVision.Spreadsheet.Arrows = (function (config) {

  "use strict";

  var _arrows = ["animated-green-arrow.gif", "animated-red-arrow.gif"];
  var _arrowCount = 0;
  var _loaded = false;
  var _callback = null;

  function _load(callback) {
    if (!_loaded) {
      _loadArrows();

      if (callback) {
        _callback = callback;
      }
    }
    else if (callback) {
      callback();
    }
  }

  function _loadArrows() {
    for (var i = 0; i < _arrows.length; i += 1) {
      _loadArrow(config.ARROW_LOGOS_URL + _arrows[i]);
    }
  }

  function _loadArrow(url) {
    var img = new Image();

    img.onload = function() {
      _onArrowLoaded();
    };

    img.onerror = function() {
      _onArrowLoaded();
    };

    img.src = url;
  }

  function _onArrowLoaded() {
    _arrowCount += 1;

    if (_arrowCount === _arrows.length && _callback && typeof _callback === "function") {
      _loaded = true;
      _callback();
    }
  }

  return {
    load: _load
  };

})(CONFIG);
