/* global gadgets */

var RiseVision = RiseVision || {};
RiseVision.Spreadsheet = {};

RiseVision.Spreadsheet = (function (window, document, gadgets, utils, Visualization) {

  "use strict";

  // private constants
  var HEADING_FONT_CLASS = "heading_font-style",
    DATA_FONT_CLASS = "data_font-style";

  // private variables
  var _prefs = null,
    _spreadsheetData = {},
    _isLoading = true,
    _vizData, _viz;

  function _showLayout() {
    //TODO: logic to come
  }

  function _pause() {
    //TODO: logic to come
  }

  function _play() {
    //TODO: logic to come
  }

  function _ready() {
    gadgets.rpc.call("", "rsevent_ready", null, _prefs.getString("id"), true, true, true, true, true);
  }

  function _onDataLoaded(data) {
    if (!data) {
      if (_isLoading) {
        _isLoading = false;
        _ready();
      }
    }
    else {
      _pause();
      // store the table data from visualization
      _vizData = data;

      _showLayout();
    }
  }

  function _getData(url) {
    if (url) {
      _spreadsheetData.url = url;
    }

    _viz.getData({
      url: _spreadsheetData.url,
      refreshInterval: parseInt(_spreadsheetData.refresh,10),
      callback: _onDataLoaded
    });
  }

  function _additionalParams(name, value) {
    // create visualization instance
    if (!_viz) {
      _viz = new Visualization();
    }

    _prefs = new gadgets.Prefs();

    if (name === "additionalParams") {
      if (value) {
        var styleNode = document.createElement("style");

        value = JSON.parse(value);

        // store the spreadsheet data that was saved in settings
        _spreadsheetData = $.extend({}, value.spreadsheet);

        //Inject CSS fonts into the DOM since they are stored as additional parameters.
        styleNode.appendChild(document.createTextNode(utils.getFontCssStyle(HEADING_FONT_CLASS, value.table.colHeaderFont)));
        styleNode.appendChild(document.createTextNode(utils.getFontCssStyle(DATA_FONT_CLASS, value.table.dataFont)));
        styleNode.appendChild(document.createTextNode("a:active" + utils.getFontCssStyle(DATA_FONT_CLASS, value.table.dataFont)));

        document.getElementsByTagName("head")[0].appendChild(styleNode);

      }

      _getData();

      //TODO: more handling of CSS for a table layout
    }
  }

  return {
    additionalParams: _additionalParams,
    getData: _getData,
    pause: _pause,
    play: _play
  };

})(window, document, gadgets, RiseVision.Common.Utilities, RiseVision.Common.Visualization);


