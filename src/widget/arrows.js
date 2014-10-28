/* global CONFIG */

var RiseVision = RiseVision || {};
RiseVision.Spreadsheet = RiseVision.Spreadsheet || {};
RiseVision.Spreadsheet.Arrows = {};

RiseVision.Spreadsheet.Arrows = (function (config) {

  "use strict";

  var _arrows = ["animated-green-arrow.gif", "animated-red-arrow.gif"],
    _arrowCount = 0,
    _loaded = false,
    _callback = null;

  function _onArrowLoaded() {
    _arrowCount += 1;

    if (_arrowCount === _arrows.length && _callback && typeof _callback === "function") {
      _loaded = true;
      _callback();
    }
  }

  function _loadArrow(url) {
    var img = new Image();

    img.onload = function () {
      _onArrowLoaded();
    };

    img.onerror = function () {
      _onArrowLoaded();
    };

    img.src = url;
  }

  function _loadArrows() {
    var i;

    for (i = 0; i < _arrows.length; i += 1) {
      _loadArrow(config.ARROW_LOGOS_URL + _arrows[i]);
    }
  }

  function _load(callback) {
    if (!_loaded) {
      _loadArrows();

      if (callback) {
        _callback = callback;
      }
    } else if (callback) {
      callback();
    }
  }

  return {
    load: _load
  };

})(CONFIG);
