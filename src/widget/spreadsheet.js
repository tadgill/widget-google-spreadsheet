/* global gadgets */

var RiseVision = RiseVision || {};
RiseVision.Spreadsheet = {};

RiseVision.Spreadsheet = (function (window, document, gadgets, utils) {

  "use strict";

  // private constants
  var HEADING_FONT_CLASS = "heading_font-style",
    DATA_FONT_CLASS = "data_font-style";

  // private variables
  var _url;

  function _additionalParams(name, value) {
    if (name === "additionalParams") {
      if (value) {
        var styleNode = document.createElement("style");

        value = JSON.parse(value);

        //Inject CSS fonts into the DOM since they are stored as additional parameters.
        styleNode.appendChild(document.createTextNode(utils.getFontCssStyle(HEADING_FONT_CLASS, value.table.colHeaderFont)));
        styleNode.appendChild(document.createTextNode(utils.getFontCssStyle(DATA_FONT_CLASS, value.table.dataFont)));
        styleNode.appendChild(document.createTextNode("a:active" + utils.getFontCssStyle(DATA_FONT_CLASS, value.table.dataFont)));

        console.log(styleNode);

        document.getElementsByTagName("head")[0].appendChild(styleNode);

      }
    }

    //TODO: more logic to come

  }

  function _getData(url) {
    if (url) {
      _url = url;
    }

    //TODO: continue logic from here
  }

  function _pause() {
    //TODO: logic to come
  }

  function _play() {
    //TODO: logic to come
  }

  return {
    additionalParams: _additionalParams,
    getData: _getData,
    pause: _pause,
    play: _play
  };

})(window, document, gadgets, RiseVision.Common.Utilities);


