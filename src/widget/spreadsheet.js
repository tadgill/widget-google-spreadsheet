/* global gadgets */

var RiseVision = RiseVision || {};
RiseVision.Spreadsheet = {};

RiseVision.Spreadsheet = (function (window, document, gadgets, utils, Visualization) {

  "use strict";

  // private constants

  // CSS classes
  var CLASS_FONT_HEADING = "heading_font-style",
    CLASS_FONT_DATA = "data_font-style",
    CLASS_PAGE = "page",
    CLASS_TR_ITEM = "item",
    CLASS_DT_SCROLL_BODY = "dataTables_scrollBody",
    CLASS_DT_SCROLL_HEAD = "dataTables_scrollHead";

  // Plugins
  var PLUGIN_SCROLL = "plugin_autoScroll";

  // Condition values
  var CONDITION_CHANGE_UP = "change-up",
    CONDITION_CHANGE_DOWN = "change-down",
    CONDITION_VALUE_POSITIVE = "value-positive",
    CONDITION_VALUE_NEGATIVE = "value-negative";

  // Defaults
  var DEFAULT_BODY_SIZE = 16;

  // private variables
  var _prefs = null,
    _spreadsheetData = {},
    _columnsData = [],
    _scrollData = {},
    _rowData = {},
    _isLoading = true,
    _dataTable = null,
    _dataTableOptions = {
      destroy: true,
      searching: false,
      info: false,
      lengthChange: false,
      paging: false,
      ordering: false,
      scrollY: "500px",
      scrollCollapse: true
    },
    _tableCols = [],
    _conditions = null,
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

  function _done() {
    gadgets.rpc.call("", "rsevent_done", null, _prefs.getString("id"));
  }

  function _hasHeadings() {
    var hasHeading = false;

    for (var col = 0; col < _vizData.getNumberOfColumns(); col++) {
      var label = _vizData.getColumnLabel(col);

      if (label && label !== "") {
        hasHeading = true;
        break;
      }
    }

    return hasHeading;
  }

  function _renderHeadings() {
    var $thead = $("<thead>"),
      $tr = $("<tr>");

    for (var col = 0; col < _vizData.getNumberOfColumns(); col++) {
      var $th = $("<th class='heading_font-style'>");

      if (_hasHeadings()) {
        $th.html(_vizData.getColumnLabel(col));
      }

      $tr.append($th);
    }

    $thead.append($tr);
    $el.page.append($thead);
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

  function _formatColumns($elem) {
    $.each(_columnsData, function(index, column) {
      column.id = column.id.slice(0,(column.id.indexOf("_")));

      var $columns = $("." + column.id),
        colIndex = $("." + column.id + ":first").parent().children().index($("." + column.id + ":first")),
        width;

      if ($columns.length > 0) {
        //Header Text
        if (column.headerText !== "") {
          $elem.eq(colIndex).html(column.headerText);
        }

        if (_isLoading) {
          width = column.width / _prefs.getInt("rsW") * 100;
          column.width = width.toString() + "%";
        }

        $elem.eq(colIndex).css("text-align", column.align);
        $columns.css("text-align", column.align);

        // Decimals and signs
        $.each($columns, function () {
          var $el = $(this),
            logosURL = "https://s3.amazonaws.com/risecontentlogos/financial/",
            val, $img;

          if ($el.text() && $.trim($el.text()) !== "" && !isNaN($el.text())) {

            $el.text(parseFloat($el.text()).toFixed(column.decimals));

            val = $el.text();

            switch(column.sign) {
              case "none":
                $el.html(Math.abs(val).toFixed(column.decimals));
                break;
              case "pos-neg":
                if (parseFloat(val) > 0) {
                  $el.html("+" + val);
                }
                break;
              case "bracket":
                if (parseFloat(val) < 0) {
                  $el.html("(" + Math.abs(val).toFixed(column.decimals) + ")");
                }
                break;
              case "arrow":
                $img = $("<img class='arrow'>");

                $img.height($el.height());

                $el.html(Math.abs(val).toFixed(column.decimals));

                if (parseFloat(val) < 0) {
                  $img.attr("src", logosURL + "animated-red-arrow.gif");
                }
                else if (parseFloat(val) >= 0) {
                  $img.attr("src", logosURL + "animated-green-arrow.gif");
                }

                $el.prepend($img);
                break;
              default:
                // includes sign type "neg", do nothing, default behaviour
                break;
            }
          }
        });
      }
    });
  }

  function _createDataTable() {
    $el.container.width(_prefs.getInt("rsW"));
    $el.container.height(_prefs.getInt("rsH"));

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
    _dataTableOptions.columnDefs = [];

    // Apply widths to customized columns
    $.each(_columnsData, function(index, column) {
      _dataTableOptions.columnDefs.push({
       "width": column.width,
       "targets": [$("." + column.id + ":first").parent().children().index($("." + column.id + ":first"))]
       });
    });

    // Instantiate the data table
    _dataTable = $el.page.dataTable(_dataTableOptions);
  }

  function _updateHeadings() {
    var $th, col;

    for (col = 0; col < _vizData.getNumberOfColumns(); col += 1) {
      $th = $("." + CLASS_PAGE + " thead th").eq(col);

      if (_hasHeadings() && ($th.length > 0)) {
        $th.html(_vizData.getColumnLabel(col));
      }
    }
  }

  function _addRows() {
    var numRows = _vizData.getNumberOfRows(),
      numCols = _vizData.getNumberOfColumns(),
      newRow, row, col, rows = [];

    for (row = 0; row < numRows; row += 1) {
      newRow = [];

      for (col = 0; col < numCols; col += 1) {
        newRow.push(_vizData.getFormattedValue(row, col));
      }

      rows.push(newRow);
    }

    _dataTable.api().rows.add(rows).draw();

    $("." + CLASS_DT_SCROLL_BODY + " table tbody tr").addClass(CLASS_TR_ITEM);
    $("." + CLASS_DT_SCROLL_BODY + " table tbody tr td").addClass(CLASS_FONT_DATA);

    for (col = 0; col < numCols; col++) {
      $("." + CLASS_DT_SCROLL_BODY + " table tbody tr td:nth-child(" + (col + 1) + ")").addClass(_tableCols[col]);
    }

    _formatColumns($("." + CLASS_PAGE + " th"));
  }

  function _setFontSizes() {
    var $headingFont = $("." + CLASS_FONT_HEADING),
      $dataFont = $("." + CLASS_FONT_DATA),
      headingFontSize = parseInt($headingFont.css("font-size")) / DEFAULT_BODY_SIZE,
      dataFontSize = parseInt($dataFont.css("font-size")) / DEFAULT_BODY_SIZE;

    $headingFont.css("font-size", headingFontSize + "em");
    $dataFont.css("font-size", dataFontSize + "em");
    $(".tableMenuButton").css("font-size", dataFontSize + "em");
  }

  function _configureScrolling() {
    // Set the height on the data table scroll body
    $("." + CLASS_DT_SCROLL_BODY).height($el.container.outerHeight(true) - $("." + CLASS_DT_SCROLL_HEAD).outerHeight() + "px");

    // Intitiate auto scrolling on the data table scroll body
    $("." + CLASS_DT_SCROLL_BODY).autoScroll(_scrollData)
      .on("done", function() {
        _done();
      });
  }

  function _checkConditions(conditionColumn, condition) {
    var colIndex = $("." + conditionColumn.id + ":first").parent().children().index($("." + conditionColumn.id + ":first")),
      numRows = _vizData.getNumberOfRows(),
      row, current, previous;

    for (row = 0; row < numRows; row += 1) {
      current = _vizData.getValue(row, colIndex);
      previous = conditionColumn.values[row];

      if (current !== "" && isNaN(current)) {
        current = current.replace(/[^0-9\.-]+/g,"");
        current = parseFloat(current);
      }

      if (previous !== "" && isNaN(previous)) {
        previous = previous.replace(/[^0-9\.-]+/g,"");
        previous = parseFloat(previous);
      }

      //The data type of a column can still be a number even if there is string data in it.
      //To be sure, let's check that the values we are comparing are numbers.
      if (current !== previous && current !== "" && previous !== "") {
        if (!isNaN(current) && !isNaN(previous)) {
          var $cell = $("." + conditionColumn.id).eq(row);

          if (condition === CONDITION_CHANGE_UP) {
            if (current > previous) {
              $cell.addClass("changeUpIncrease");
            }
            else {
              $cell.addClass("changeUpDecrease");
            }
          }
          else {
            if (current < previous) {
              $cell.addClass("changeDownDecrease");
            }
            else {
              $cell.addClass("changeDownIncrease");
            }
          }
        }
      }
    }
  }

  function _checkSigns(columnId, condition){
    var colIndex = $("." + columnId + ":first").parent().children().index($("." + columnId + ":first")),
      numRows = _vizData.getNumberOfRows(),
      row, current;

    for (row = 0; row < numRows; row += 1) {
      current = _vizData.getValue(row, colIndex);

      if (current !== "" && isNaN(current)) {
        current = current.replace(/[^0-9\.-]+/g,"");
        current = parseFloat(current);
      }

      if (current !== "" && !isNaN(current)) {
        var $cell = $("." + _tableCols[colIndex]).eq(row);

        if (condition === CONDITION_VALUE_POSITIVE) {
          if (current >= 0) {
            $cell.addClass("valuePositivePositive");
          }
          else {
            $cell.addClass("valuePositiveNegative");
          }
        }
        else {
          if (current < 0) {
            $cell.addClass("valueNegativeNegative");
          }
          else {
            $cell.addClass("valueNegativePositive");
          }
        }
      }
    }
  }

  function _saveConditions() {
    _conditions.columns = [];

    $.each(_columnsData, function(index, column) {
      var numRows = _vizData.getNumberOfRows(),
        values = [],
        colIndex, row;

      if (typeof column.colorCondition !== "undefined") {
        if (column.colorCondition === CONDITION_CHANGE_UP || column.colorCondition === CONDITION_CHANGE_DOWN) {

          colIndex = $("." + column.id + ":first").parent().children().index($("." + column.id + ":first"));

          for (row = 0; row < numRows; row += 1) {
            values.push(_vizData.getValue(row, colIndex));
          }

          _conditions.columns.push({
            id: column.id,
            values: values
          });

        }
      }

    });
  }

  function _handleConditions() {
    var colIndex = -1;

    if (!_conditions) {
      _conditions = {};
    }

    $.each(_columnsData, function(index, column) {
      if (column.colorCondition === CONDITION_CHANGE_UP || column.colorCondition === CONDITION_CHANGE_DOWN) {
        if (_conditions.hasOwnProperty("columns")) {
          $.each(_conditions.columns, function(conditionIndex, condition) {
            if (condition.columnId === column.id) {
              colIndex = conditionIndex;

              return false;
            }
          });

          _checkConditions(_conditions.columns[colIndex], column.colorCondition);
        }
      }
      else if (column.colorCondition === CONDITION_VALUE_POSITIVE || column.colorCondition === CONDITION_VALUE_NEGATIVE) {
        _checkSigns(column.id, column.colorCondition);
      }
    });

    _saveConditions();	//TODO: Maybe need to save from _checkSigns?
  }

  function _showLayout() {
    if (!_isLoading && _dataTable) {
      _dataTable.api().clear();
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
        _dataTable.api().destroy(true);
        _dataTable = null;
        _createDataTable();
      }
      else {
        _updateHeadings();
        _addRows();
      }
    }

    $("." + CLASS_DT_SCROLL_HEAD + " table tr th, td").css({
      "padding-top": _rowData.padding,
      "padding-bottom": _rowData.padding
      // TODO: maybe right and left padding should be added (column padding used to be in Table Setting component)
    });

    //First cell shouldn't have any padding in front of it.
    $("." + CLASS_DT_SCROLL_HEAD + " table tr th:first-child, td:first-child").css({
      "padding-left": "10px"
    });

    //Last cell shouldn't have any padding after it.
    $("." + CLASS_DT_SCROLL_HEAD + " table tr th:last-child, td:last-child").css({
      "padding-right": "10px"
    });

    _setFontSizes();
    _handleConditions();
    _configureScrolling();

    if (_isLoading) {
      _isLoading = false;
      _ready();
    }
    else {
      _play();
    }
  }

  function _pause() {
    $("." + CLASS_DT_SCROLL_BODY).data(PLUGIN_SCROLL).pause();
  }

  function _play() {
    $("." + CLASS_DT_SCROLL_BODY).data(PLUGIN_SCROLL).play();
  }

  function _onDataLoaded(data) {
    var empty = true,
      numOfRows, cellValue, indexCount, j;

    if (!data) {
      if (_isLoading) {
        _isLoading = false;
        _ready();
      }
    }
    else {
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

      // store the visualization data table
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
      refreshInterval: _spreadsheetData.refresh,
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
        value = JSON.parse(value);

        // store the spreadsheet data that was saved in settings
        _spreadsheetData = $.extend({}, value.spreadsheet);

        // store the columns data that was saved in settings
        _columnsData = $.extend([], value.columns);

        // store the scrolling data that was saved in settings
        _scrollData = $.extend({}, value.scroll);

        _rowData.rowColor = value.table.rowColor;
        _rowData.altRowColor = value.table.altRowColor;
        _rowData.padding = parseInt(value.table.rowPadding / 2) + "px";

        // set the document background with value saved in settings
        document.body.style.background = value.background.color;

        //Inject CSS fonts into the DOM since they are stored as additional parameters.
        utils.addCSSRules([
          utils.getFontCssStyle(CLASS_FONT_HEADING, value.table.colHeaderFont),
          utils.getFontCssStyle(CLASS_FONT_DATA, value.table.dataFont),
          "a:active" + utils.getFontCssStyle(CLASS_FONT_DATA, value.table.dataFont)
        ]);

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


