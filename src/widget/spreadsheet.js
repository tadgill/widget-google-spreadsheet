/* global gadgets */

var RiseVision = RiseVision || {};
RiseVision.Spreadsheet = {};

RiseVision.Spreadsheet = (function (/*window, document, gadgets*/) {

  "use strict";

  // private variables
  var _url;

  function _additionalParams(/*name, value*/) {
    //TODO: logic to come
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

})(window, document, gadgets);


