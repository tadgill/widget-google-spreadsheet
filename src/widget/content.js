/* global CONFIG */

var RiseVision = RiseVision || {};
RiseVision.Spreadsheet = RiseVision.Spreadsheet || {};

RiseVision.Spreadsheet.Content = function () {

  "use strict";

  // CSS classes
  var CLASS_PAGE = "page",
    CLASS_FONT_DATA = "data_font-style",
    CLASS_FONT_HEADING = "heading_font-style",
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

  var _prefs = null,
    _useCustomLayout = false,
    _columnsData = [],
    _rowData = {},
    _scrollData = {},
    _scrollDoneFn = null,
    _initialBuild = true,
    _columnIds = [],
    _conditions = null,
    _dataTable = null,
    _imagesToLoad = [],
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
    _isScrolling = false,
    _updateWaiting = false,
    _pudTimerID = null,
    _vizData, $el;

  function _cache() {
    $el = {
      scrollContainer: $("#scrollContainer")
    };
  }

  function _checkConditions(conditionColumn, condition) {
    var $colEl = $("." + conditionColumn.id + ":first"),
      colIndex = $colEl.parent().children().index($colEl),
      numRows = _vizData.getNumberOfRows(),
      row, current, previous, $cell;

    for (row = 0; row < numRows; row += 1) {
      current = _vizData.getValue(row, colIndex);
      previous = conditionColumn.values[row];

      if (current !== "" && isNaN(current)) {
        current = current.replace(/[^0-9\.-]+/g, "");
        current = parseFloat(current);
      }

      if (previous !== "" && isNaN(previous)) {
        previous = previous.replace(/[^0-9\.-]+/g, "");
        previous = parseFloat(previous);
      }

      //The data type of a column can still be a number even if there is string data in it.
      //To be sure, let's check that the values we are comparing are numbers.
      if (current !== previous && current !== "" && previous !== "") {
        if (!isNaN(current) && !isNaN(previous)) {
          $cell = $("." + conditionColumn.id).eq(row);

          if (condition === CONDITION_CHANGE_UP) {
            if (current > previous) {
              $cell.addClass("changeUpIncrease");
            } else {
              $cell.addClass("changeUpDecrease");
            }
          } else {
            if (current < previous) {
              $cell.addClass("changeDownDecrease");
            } else {
              $cell.addClass("changeDownIncrease");
            }
          }
        }
      }
    }
  }

  function _checkSigns(columnId, condition) {
    var $colEl = $("." + columnId + ":first"),
      colIndex = $colEl.parent().children().index($colEl),
      numRows = _vizData.getNumberOfRows(),
      row, current, $cell;

    for (row = 0; row < numRows; row += 1) {
      current = _vizData.getValue(row, colIndex);

      if (current !== "" && isNaN(current)) {
        current = current.replace(/[^0-9\.-]+/g, "");
        current = parseFloat(current);
      }

      if (current !== "" && !isNaN(current)) {
        $cell = $("." + _columnIds[colIndex]).eq(row);

        if (condition === CONDITION_VALUE_POSITIVE) {
          if (current >= 0) {
            $cell.addClass("valuePositivePositive");
          } else {
            $cell.addClass("valuePositiveNegative");
          }
        } else {
          if (current < 0) {
            $cell.addClass("valueNegativeNegative");
          } else {
            $cell.addClass("valueNegativePositive");
          }
        }
      }
    }
  }

  function _getScrollEl() {
    var $scrollBody = $("." + CLASS_DT_SCROLL_BODY);

    if ($scrollBody.length > 0) {
      if (typeof $scrollBody.data(PLUGIN_SCROLL) !== "undefined") {
        return $scrollBody.data(PLUGIN_SCROLL);
      }
    } else {
      if (typeof $el.scrollContainer.data(PLUGIN_SCROLL) !== "undefined") {
        return $el.scrollContainer.data(PLUGIN_SCROLL);
      }
    }

    return null;
  }

  function _saveConditions() {
    _conditions.columns = [];

    $.each(_columnsData, function (index, column) {
      var numRows = _vizData.getNumberOfRows(),
        values = [],
        $colEl = $("." + column.id + ":first"),
        colIndex, row;

      if (typeof column.colorCondition !== "undefined") {
        if (column.colorCondition === CONDITION_CHANGE_UP || column.colorCondition === CONDITION_CHANGE_DOWN) {

          colIndex = $colEl.parent().children().index($colEl);

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

  function _formatColumns($elem) {

    $.each(_columnsData, function (index, column) {
      var $columns = $("." + column.id),
        $colEl = $("." + column.id + ":first"),
        colIndex = $colEl.parent().children().index($colEl),
        width;

      if ($columns.length > 0) {
        //Header Text
        if (column.headerText !== "") {
          $elem.eq(colIndex).html(column.headerText);
        }

        if (_initialBuild) {
          width = column.width / _prefs.getInt("rsW") * 100;
          column.width = width.toString() + "%";
        }

        $elem.eq(colIndex).css("text-align", column.align);
        $columns.css("text-align", column.align);

        // Decimals and signs
        $.each($columns, function () {
          var $element = $(this),
            val, $img;

          if ($element.text() && $.trim($element.text()) !== "" && !isNaN($element.text())) {

            if (typeof column.decimals !== "undefined") {
              $element.text(parseFloat($element.text()).toFixed(column.decimals));
            }

            val = $element.text();

            switch (column.sign) {
              case "none":
                $element.html(Math.abs(val).toFixed(column.decimals));
                break;
              case "pos-neg":
                if (parseFloat(val) > 0) {
                  $element.html("+" + val);
                }
                break;
              case "bracket":
                if (parseFloat(val) < 0) {
                  $element.html("(" + Math.abs(val).toFixed(column.decimals) + ")");
                }
                break;
              case "arrow":
                $img = $("<img class='arrow'>");

                $img.height($element.height());

                $element.html(Math.abs(val).toFixed(column.decimals));

                if (parseFloat(val) < 0) {
                  $img.attr("src", CONFIG.ARROW_LOGOS_URL + "animated-red-arrow.gif");
                } else if (parseFloat(val) >= 0) {
                  $img.attr("src", CONFIG.ARROW_LOGOS_URL + "animated-green-arrow.gif");
                }

                $element.prepend($img);
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

  function _hasHeadings() {
    var hasHeading = false,
      col, label;

    for (col = 0; col < _vizData.getNumberOfColumns(); col += 1) {
      label = _vizData.getColumnLabel(col);

      if (label && label !== "") {
        hasHeading = true;
        break;
      }
    }

    return hasHeading;
  }

  function _renderHeadings() {
    var $thead = $("<thead>"),
      $tr = $("<tr>"),
      col, $th;

    for (col = 0; col < _vizData.getNumberOfColumns(); col += 1) {
      $th = $("<th class='heading_font-style'>");

      if (_hasHeadings()) {
        $th.html(_vizData.getColumnLabel(col));
      }

      $tr.append($th);
    }

    $thead.append($tr);
    $("." + CLASS_PAGE).append($thead);
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
      value, style, col;

    for (col = 0; col < colsCount; col += 1) {
      value = _vizData.getFormattedValue(row, col);
      style = _vizData.getProperty(row, col, "style");

      //Strip out the font-family that holds an incorrect value.
      if (style) {
        style = style.substring(0, style.indexOf("font-family:"));
      }

      _addCell($tr, value, style, _columnIds[col]);
    }

    $("." + CLASS_PAGE).append($tr);
  }

  function _setScrollContainerSize() {
    $el.scrollContainer.width(_prefs.getInt("rsW"));
    $el.scrollContainer.height(_prefs.getInt("rsH"));
  }

  function _createDataTable() {
    var numRows = _vizData.getNumberOfRows(),
      row;

    $("." + CLASS_PAGE).empty();

    //Add column headings.
    if (_vizData.getNumberOfColumns() > 0) {
      _renderHeadings();
    }

    //Add rows.
    for (row = 0; row < numRows; row += 1) {
      _renderRow(_vizData.getNumberOfColumns(), row);
    }

    _formatColumns($("." + CLASS_PAGE + " th"));
    _dataTableOptions.columnDefs = [];

    // Apply widths to customized columns
    $.each(_columnsData, function (index, column) {
      var $colEl = $("." + column.id + ":first");

      _dataTableOptions.columnDefs.push({
        "width": column.width,
        "targets": [$colEl.parent().children().index($colEl)]
      });
    });

    // Instantiate the data table
    _dataTable = $("." + CLASS_PAGE).dataTable(_dataTableOptions);

    $("." + CLASS_DT_SCROLL_BODY).css("overflow", "hidden");
  }

  function _updateRows() {
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

    for (col = 0; col < numCols; col += 1) {
      $("." + CLASS_DT_SCROLL_BODY + " table tbody tr td:nth-child(" + (col + 1) + ")").addClass(_columnIds[col]);
    }

    _formatColumns($("." + CLASS_PAGE + " th"));
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

  function _setFontSizes() {
    var $headingFont = $("." + CLASS_FONT_HEADING),
      $dataFont = $("." + CLASS_FONT_DATA),
      headingFontSize = parseInt($headingFont.css("font-size"), 10) / DEFAULT_BODY_SIZE,
      dataFontSize = parseInt($dataFont.css("font-size"), 10) / DEFAULT_BODY_SIZE;

    $headingFont.css("font-size", headingFontSize + "em");
    $dataFont.css("font-size", dataFontSize + "em");
    $(".tableMenuButton").css("font-size", dataFontSize + "em");
  }

  function _configureColumnIds() {
    var totalCols = _vizData.getNumberOfColumns(),
      col;

    _columnIds = [];

    for (col = 0; col < totalCols; col += 1) {
      _columnIds.push(_vizData.getColumnId(col));
    }
  }

  function _setScrolling() {
    var $scrollBody = $("." + CLASS_DT_SCROLL_BODY);

    if ($scrollBody.length > 0) {
      // Set the height on the data table scroll body
      $scrollBody.height($el.scrollContainer.outerHeight(true) - $("." + CLASS_DT_SCROLL_HEAD).outerHeight() + "px");

      if (!_getScrollEl()) {
        // Intitiate auto scrolling on the data table scroll body
        $scrollBody.autoScroll(_scrollData)
          .on("done", function () {
            if (!_useCustomLayout && _updateWaiting) {
              _updateTable();
              _updateWaiting = false;
            }

            _isScrolling = false;

            if (_scrollDoneFn) {
              _scrollDoneFn();
            }
          });
      }
    }
    else {
      if (!_getScrollEl()) {
        // Intitiate auto scrolling on the scroll container
        $el.scrollContainer.autoScroll(_scrollData)
          .on("done", function () {
            _isScrolling = false;

            if (_scrollDoneFn) {
              _scrollDoneFn();
            }
          });
      }
    }
  }

  function _setConditions() {
    var colIndex = -1;

    if (!_conditions) {
      _conditions = {};
    }

    $.each(_columnsData, function (index, column) {
      if (column.colorCondition === CONDITION_CHANGE_UP || column.colorCondition === CONDITION_CHANGE_DOWN) {
        if (_conditions.hasOwnProperty("columns")) {
          $.each(_conditions.columns, function (conditionIndex, condition) {
            if (condition.id === column.id) {
              colIndex = conditionIndex;

              return false;
            }
          });

          _checkConditions(_conditions.columns[colIndex], column.colorCondition);
        }
      } else if (column.colorCondition === CONDITION_VALUE_POSITIVE || column.colorCondition === CONDITION_VALUE_NEGATIVE) {
        _checkSigns(column.id, column.colorCondition);
      }
    });

    _saveConditions(); //TODO: Maybe need to save from _checkSigns?
  }

  function _setPadding() {
    $("." + CLASS_DT_SCROLL_HEAD + " table tr th, td").css({
      "padding-top": _rowData.padding,
      "padding-bottom": _rowData.padding
    });

    //First cell shouldn't have any padding in front of it.
    $("." + CLASS_DT_SCROLL_HEAD + " table tr th:first-child, td:first-child").css({
      "padding-left": "10px"
    });

    //Last cell shouldn't have any padding after it.
    $("." + CLASS_DT_SCROLL_HEAD + " table tr th:last-child, td:last-child").css({
      "padding-right": "10px"
    });
  }

  function _updateTable() {
    _dataTable.api().clear();

    _configureColumnIds();

    if ($(".dataTables_scrollHeadInner ." + CLASS_PAGE + " th").length !== _vizData.getNumberOfColumns()) {
      _dataTable.api().destroy(true);
      _dataTable = null;
      $el.scrollContainer.append("<table class='page'></table>");
      _createDataTable();
    } else {
      _updateHeadings();
      _updateRows();
    }

    _setPadding();
    _setFontSizes();
    _setConditions();
    _setScrolling();
  }

  function _configureImages() {
    var numRows = _vizData.getNumberOfRows(),
      numCols = _columnIds.length,
      $repeat = $(".repeat"),
      row, col;

    _imagesToLoad = [];

    for (row = 0; row < numRows; row += 1) {
      if (row > 0) {
        $repeat.parent().append($repeat.clone());
      }

      for (col = 0; col < numCols; col += 1) {
        var $cell = $("." + _columnIds[col] + ":last");

        if ($cell) {
          //Show an image.
          if ($cell.hasClass("image")) {
            _imagesToLoad.push({
              url: _vizData.getValue(row, col),
              $cell: $cell
            });
          }
          //Generate QR code.
          else if ($cell.hasClass("qrCode")) {
            if (_vizData.getValue(row, col)) {
              _imagesToLoad.push({
                url: "https://chart.googleapis.com/chart?cht=qr&chs=100x100&chld=H|0&chl=" +
                encodeURIComponent(_vizData.getValue(row, col)),
                $cell: $cell
              });
            }
          }
          else {
            $cell.html(_vizData.getFormattedValue(row, col));
          }
        }
      }
    }
  }

  function _startPUDTimer() {
    // If there is not enough content to scroll, use the PUD Failover setting as the trigger
    // for sending "done".
    var delay = (typeof _scrollData.pud === "undefined" ? 10 : _scrollData.pud) * 1000;

    if (!_pudTimerID) {
      _pudTimerID = setTimeout(function() {
        if (_scrollDoneFn) {
          _pudTimerID = null;
          _scrollDoneFn();
        }
      }, delay);
    }
  }


  function scrollPlay() {
    var $scroll = _getScrollEl();

    if ($scroll && $scroll.canScroll() && !_isScrolling) {
      $scroll.play();
      _isScrolling = true;
    } else {
      _startPUDTimer();
    }
  }

  function scrollPause() {
    var $scroll = _getScrollEl();

    if ($scroll && $scroll.canScroll()) {
      $scroll.pause();
      _isScrolling = false;
    }

    // Clear the PUD timer if the playlist item is not set to PUD.
    if (_pudTimerID) {
      clearTimeout(_pudTimerID);
      _pudTimerID = null;
    }
  }

  function build(vizData) {
    var $scroll = _getScrollEl();

    _vizData = vizData;

    if (_useCustomLayout) {
      _configureColumnIds();
      _setScrollContainerSize();
      _configureImages();

      // Load the images
      RiseVision.Spreadsheet.Images.load(_imagesToLoad, function () {

        //Only execute the following code if the layout is a table.
        if ($("table").length > 0) {
          _formatColumns($("." + CLASS_PAGE + " th"));
          _dataTable = $("." + CLASS_PAGE).dataTable(_dataTableOptions);
          $("." + CLASS_DT_SCROLL_BODY).css("overflow", "hidden");
          _setPadding();
        }

        _setFontSizes();
        _setConditions();
        _setScrolling();
        _initialBuild = false;
      });

    } else {
      if (_initialBuild) {
        _configureColumnIds();
        _setScrollContainerSize();
        _createDataTable();
        _setPadding();
        _setFontSizes();
        _setConditions();
        _setScrolling();
        _initialBuild = false;
      } else {
        if (!$scroll || !$scroll.canScroll() || !_isScrolling) {
          _updateTable();
        } else {
          _updateWaiting = true;
        }
      }
    }
  }

  function initialize(prefs, additionalParams, scrollDoneFn) {
    _prefs = prefs;
    _columnsData = additionalParams.columns;
    _scrollData = additionalParams.scroll;

    _rowData = {};
    _rowData.rowColor = additionalParams.table.rowColor;
    _rowData.altRowColor = additionalParams.table.altRowColor;
    _rowData.padding = parseInt(additionalParams.table.rowPadding / 2, 10) + "px";

    if (scrollDoneFn && typeof scrollDoneFn === "function") {
      _scrollDoneFn = scrollDoneFn;
    }

    if (additionalParams.hasOwnProperty("layout")) {
      if (!additionalParams.layout.default && additionalParams.layout.customURL && additionalParams.layout.customURL !== "") {
        _useCustomLayout = true;
      }
    }
  }

  _cache();

  return {
    initialize: initialize,
    build: build,
    scrollPlay: scrollPlay,
    scrollPause: scrollPause
  };

};
