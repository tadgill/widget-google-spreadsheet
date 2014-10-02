/* global gadgets */

var RiseVision = RiseVision || {};
RiseVision.Spreadsheet = {};

RiseVision.Spreadsheet = (function (window, document, gadgets, utils, Visualization) {

  "use strict";

  // private constants
  var CLASS_FONT_HEADING = "heading_font-style",
    CLASS_FONT_DATA = "data_font-style",
    CLASS_PAGE = "page",
    CLASS_TR_ITEM = "item",
    CLASS_DT_SCROLL_BODY = "dataTables_scrollBody";

  // private variables
  var _prefs = null,
    _spreadsheetData = {},
    _columnsData = [],
    _isLoading = true,
    _dataTable = null,
    _sortConfig = {
      bDestroy: true,
      bFilter: false,
      bInfo: false,
      bLengthChange: false,
      bPaginate: false,
      bSort: false,
      sScrollY: "500px"
    },
    _tableCols = [],
    _vizData, _viz, $el;

  function _cache() {
    $el = {
      container:            $("#container"),
      page:                 $("." + CLASS_PAGE)
    };
  }

  function _ready() {
    gadgets.rpc.call("", "rsevent_ready", null, _prefs.getString("id"), true, true, true, true, true);
  }

  function _renderHeadings() {
    // TODO: logic to come
  }

  function _addCell($tr, value, style, className) {
    var $td = $("<td>");

    if (style !== "") {
      $td.attr("style", style);
    }

    $td.addClass(CLASS_FONT_DATA + " " + className);
    $td.html(value);
    $tr.append($td);
  }

  function _renderRow(colsCount, row) {
    var $tr = $("<tr class='" + CLASS_TR_ITEM + "'>"),
      col;

    for (col = 0; col < colsCount; col += 1) {
      var value = "", style = "";

      value = _vizData.getFormattedValue(row, col);
      style = _vizData.getProperty(row, col, "style");

      //Strip out the font-family that holds an incorrect value.
      if (style) {
        style = style.substring(0, style.indexOf("font-family:"));
      }

      _addCell($tr, value, style, _tableCols[col]);
    }

    $el.page.append($tr);
  }

  function _formatColumns(/*$elem*/) {
    // TODO: logic to come
  }

  function _createDataTable() {
    $el.container.width(_prefs.getString("rsW"));
    $el.container.height(_prefs.getString("rsH"));

    $el.page.empty();

    //Add column headings.
    if (_vizData.getNumberOfColumns() > 0) {
      _renderHeadings();
    }

    //Add rows.
    for (var row = 0, numRows = _vizData.getNumberOfRows(); row < numRows; row += 1) {
      _renderRow(_vizData.getNumberOfColumns(), row);
    }

    _formatColumns($("." + CLASS_PAGE + " th"));
    _sortConfig.aoColumnDefs = [];

    // TODO: continue logic from here
  }

  function _updateHeadings() {
    // TODO: logic to come
  }

  function _addRows() {
    var numRows = _vizData.getNumberOfRows(),
      numCols = _vizData.getNumberOfColumns(),
      newRow, row, col;

    for (row = 0; row < numRows; row += 1) {
      newRow = [];

      for (col = 0; col < numCols; col += 1) {
        newRow.push(_vizData.getFormattedValue(row, col));
      }

      _dataTable.fnAddData(newRow);
    }
    $("." + CLASS_DT_SCROLL_BODY + " table tbody tr").addClass(CLASS_TR_ITEM);
    $("." + CLASS_DT_SCROLL_BODY + " table tbody tr td").addClass(CLASS_FONT_DATA);

    for (col = 0; col < numCols; col++) {
      $("." + CLASS_DT_SCROLL_BODY + " table tbody tr td:nth-child(" + (col + 1) + ")").addClass(_tableCols[col]);
    }

    _formatColumns($("." + CLASS_PAGE + " th"));
  }

  function _showLayout() {
    if (!_isLoading && !_dataTable) {
      _dataTable.fnClearTable(false);
    }

    _tableCols = [];

    for (var col = 0, totalCols = _vizData.getNumberOfColumns(); col < totalCols; col += 1) {
      _tableCols.push(_vizData.getColumnId(col));
    }

    if (_isLoading) {
      _createDataTable();
    }
    else {
      if ($(".dataTables_scrollHeadInner ." + CLASS_PAGE + " th").length !== _vizData.getNumberOfColumns()) {
        _dataTable.fnDestroy(true);
        _dataTable = null;
        _createDataTable();
      }
      else {
        _updateHeadings();
        _addRows();
      }
    }

    // TODO: configure padding, font sizes, scrolling, and conditions

    if (_isLoading) {
      _isLoading = false;
      _ready();
    }
    /*else {
      // TODO: start infinite scrolling
    }*/
  }

  function _pause() {
    //TODO: logic to come
  }

  function _play() {
    //TODO: logic to come
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
    // cache common elements
    _cache();

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

        // store the columns data that was saved in settings
        _columnsData = $.extend([], value.columns);

        //Inject CSS fonts into the DOM since they are stored as additional parameters.
        styleNode.appendChild(document.createTextNode(utils.getFontCssStyle(CLASS_FONT_HEADING, value.table.colHeaderFont)));
        styleNode.appendChild(document.createTextNode(utils.getFontCssStyle(CLASS_FONT_DATA, value.table.dataFont)));
        styleNode.appendChild(document.createTextNode("a:active" + utils.getFontCssStyle(CLASS_FONT_DATA, value.table.dataFont)));

        document.getElementsByTagName("head")[0].appendChild(styleNode);

        //TODO: more handling of CSS for a table layout

        _getData();
      }
    }
  }

  return {
    additionalParams: _additionalParams,
    getData: _getData,
    pause: _pause,
    play: _play
  };

})(window, document, gadgets, RiseVision.Common.Utilities, RiseVision.Common.Visualization);


