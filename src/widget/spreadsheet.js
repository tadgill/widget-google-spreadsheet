/* global gadgets */

var RiseVision = RiseVision || {};
RiseVision.Spreadsheet = {};

RiseVision.Spreadsheet = (function (window, document, gadgets, utils, Visualization) {

  "use strict";

  // private variables
  var _prefs = null,
    _spreadsheetData = {},
    _spreadsheetTable = null,
    _initialLoad = true,
    _viz = null;

  function _ready() {
    gadgets.rpc.call("", "rsevent_ready", null, _prefs.getString("id"), true, true, true, true, true);
  }

  function _done() {
    gadgets.rpc.call("", "rsevent_done", null, _prefs.getString("id"));
  }

  function _configureVizData(data) {
    var empty = true,
      numOfRows, cellValue, indexCount, j;

    numOfRows = data.getNumberOfRows();
    indexCount = data.getNumberOfColumns() - 1;

    while (indexCount > -1 ) {
      for (j = 0; j < numOfRows; j += 1) {
        cellValue = data.getValue(j, indexCount);
        if (cellValue && cellValue !== "") {
          empty = false;
          break;
        }
      }

      if (empty) {
        // remove unused column
        data.removeColumn(indexCount);
      }

      empty = true;
      indexCount -= 1;
    }

    return data;
  }

  function _pause() {
    _spreadsheetTable.scrollPause();
  }

  function _play() {
    _spreadsheetTable.scrollPlay();
  }

  function _onVizDataLoaded(data) {
    var vizData = null;

    if (!data) {
      if (_initialLoad) {
        _initialLoad = false;
        _ready();
      }
    }
    else {
      vizData = _configureVizData(data);

      _spreadsheetTable.build(vizData, _done);

      if (_initialLoad) {
        _initialLoad = false;
        _ready();
      }
      else {
        _play();
      }
    }
  }

  function _getData(url) {
    if (url) {
      _spreadsheetData.url = url;
    }

    _viz.getData({
      url: _spreadsheetData.url,
      refreshInterval: _spreadsheetData.refresh * 60,
      callback: _onVizDataLoaded
    });
  }

  function _setParams(names, values) {
    var columnsData = {},
      scrollData = {},
      tableData = {},
      value;

    // create visualization instance
    if (!_viz) {
      _viz = new Visualization();
    }

    // create spreadsheet table instance
    if (!_spreadsheetTable) {
      _spreadsheetTable = new RiseVision.Spreadsheet.Table();
    }

    _prefs = new gadgets.Prefs();

    if (Array.isArray(names) && names.length > 0 && names[0] === "additionalParams") {
      if (Array.isArray(values) && values.length > 0) {
        value = JSON.parse(values[0]);

        // store the spreadsheet data that was saved in settings
        _spreadsheetData = $.extend({}, value.spreadsheet);

        scrollData = $.extend({}, value.scroll);
        tableData = $.extend({}, value.table);
        columnsData = $.extend([], value.columns);

        // return the column ids to the actual id values in the spreadsheet
        $.each(columnsData, function(index, column) {
          column.id = column.id.slice(0, (column.id.indexOf("_")));
        });

        // set the document background with value saved in settings
        document.body.style.background = value.background.color;

        // initialize the spreadsheet table with settings data
        _spreadsheetTable.init(utils, _prefs, columnsData, tableData, scrollData);

        RiseVision.Spreadsheet.Arrows.load(function() {
          _getData();
        });

      }
    }
  }

  return {
    setParams: _setParams,
    getData: _getData,
    pause: _pause,
    play: _play
  };

})(window, document, gadgets, RiseVision.Common.Utilities, RiseVision.Common.Visualization);


