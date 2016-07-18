/* global gadgets, config */

require("fixed-data-table/dist/fixed-data-table.css");
require("../css/fixed-data-table-overrides.css");

import React from "react";
import Scroll from "./scroll";
import TableHeaderContainer from "../containers/TableHeaderContainer";
import Logger from "../../components/widget-common/dist/logger";
import Common from "../../components/widget-common/dist/common";
import config from "../../config/config";

const prefs = new gadgets.Prefs();
const sheet = document.querySelector("rise-google-sheet");

var params = null;

const Spreadsheet = React.createClass({
  headerClass: "header_font-style",
  bodyClass: "body_font-style",
  isLoading: true,
  viewerPaused: true,
  errorFlag: false,
  errorTimer: null,
  errorLog: null,
  dataColumnIds: [],
  totalCols: 0,


  API_KEY_DEFAULT: config.apiKey,

  getInitialState: function() {
    return {
      data: null
    };
  },

  componentDidMount: function() {
    var id = new gadgets.Prefs().getString("id");

    if (id && id !== "") {
      gadgets.rpc.register("rscmd_play_" + id, this.play);
      gadgets.rpc.register("rscmd_pause_" + id, this.pause);
      gadgets.rpc.register("rscmd_stop_" + id, this.stop);
      gadgets.rpc.register("rsparam_set_" + id, this.configure);
      gadgets.rpc.call("", "rsparam_get", null, id, ["companyId", "displayId", "additionalParams"]);
    }
  },

  componentWillUnmount: function() {
    sheet.removeEventListener("rise-google-sheet-response", this.onGoogleSheetResponse);
    sheet.removeEventListener("rise-google-sheet-error", this.onGoogleSheetError);
  },

  configure: function(names, values) {
    var additionalParams = null,
      companyId = "",
      displayId = "";

    if (Array.isArray(names) && names.length > 0 && Array.isArray(values) && values.length > 0) {
      if (names[0] === "companyId") {
        companyId = values[0];
      }

      if (names[1] === "displayId") {
        if (values[1]) {
          displayId = values[1];
        }
        else {
          displayId = "preview";
        }
      }

      Logger.setIds(companyId, displayId);

      if (names[2] === "additionalParams") {
        additionalParams = JSON.parse(values[2]);

        this.setParams(additionalParams);
      }
    }
  },

  setParams: function(additionalParams) {
    params = JSON.parse(JSON.stringify(additionalParams));

    params.width = prefs.getInt("rsW");
    params.height = prefs.getInt("rsH");

    this.init();
  },

  init: function() {
    this.props.initSize(params.width, params.height);

    this.convertColumnFormatIds();
    this.setRowStyle();
    this.setSeparator();

    if (Common.isLegacy()) {
      this.showError("This version of Spreadsheet Widget is not supported on this version of Rise Player. " +
        "Please use the latest Rise Player version available from https://help.risevision.com/user/create-a-display");

      this.isLoading = false;
      this.ready();

    } else {
      // show wait message while Storage initializes
      this.props.showMessage("Please wait while your google sheet is loaded.");

      this.loadFonts();
      this.setVerticalAlignment();
      this.initRiseGoogleSheet();
    }

  },

  setRowStyle: function() {
    Common.addCSSRules([
        ".even" + " div * {background-color: " + params.format.evenRowColor + " !important }",
        ".odd" + " div * {background-color: " + params.format.oddRowColor + " !important }"
      ]);
  },

  setVerticalAlignment: function() {
    if (params.spreadsheet.hasHeader ) {
      Common.addCSSRules([
        ".header_font-style .fixedDataTableCellLayout_wrap3 {vertical-align: " + params.format.header.fontStyle.verticalAlign + " }"
      ]);
    }

    Common.addCSSRules([
      ".body_font-style .fixedDataTableCellLayout_wrap3 {vertical-align: " + params.format.body.fontStyle.verticalAlign + " }"
    ]);
  },

  setSeparator: function() {
    var rules, columnBorderW, rowBorderW;

    if (!params.format.separator.showRow && !params.format.separator.showColumn) {
      // rely on default css overrides which have all borders transparent
      return;
    }

    // colors
    rules = [
      ".fixedDataTableCellLayout_main {border-color: " + params.format.separator.color + "; }",
      ".public_fixedDataTableCell_main {border-color: " + params.format.separator.color + "; }"
    ];

    // row and column separators (border widths of either 1 or 0)
    columnBorderW = (params.format.separator.showColumn) ? "1px" : "0";
    rowBorderW = (params.format.separator.showRow) ? "1px" : "0";

    rules.push(".fixedDataTableCellLayout_main {border-style: solid; border-width: 0 " + columnBorderW +
      " " + rowBorderW + " 0; }");

    if (params.spreadsheet.hasHeader) {
      // fill in gap between header and data tables
      rules.push(".fixedDataTableLayout_main, .public_fixedDataTable_main {margin-bottom: -2px; }");

      if (params.format.separator.showRow) {
        // apply border color to the border that visually shows to the top of the first row of the data table
        rules.push(".public_fixedDataTable_header, .public_fixedDataTable_hasBottomBorder {border-color: " +
          params.format.separator.color + "; }");
      }
    }

    Common.addCSSRules(rules);
  },

  initRiseGoogleSheet: function() {
    var mapStartRange, mapEndRange;

    function mapCell(cell) {
      var obj = {},
        column, row;

      column = cell.substr(0, 1);
      row = cell.substr(1);

      if (!isNaN(parseInt(column, 10))) {
        return null;
      }

      if (isNaN(parseInt(row, 10))) {
        return null;
      }

      // code for lowercase 'a' is 97 so subtract
      obj.column = (column.toLowerCase().charCodeAt(0) - 97 ) + 1;
      obj.row = parseInt(row, 10);

      return obj;
    }

    sheet.addEventListener("rise-google-sheet-response", this.onGoogleSheetResponse);
    sheet.addEventListener("rise-google-sheet-error", this.onGoogleSheetError);



    sheet.setAttribute("key", params.spreadsheet.fileId);
    sheet.setAttribute("tab-id", params.spreadsheet.tabId);
    sheet.setAttribute("refresh", params.spreadsheet.refresh * 60);

    if (params.spreadsheet.cells === "range") {
      mapStartRange = mapCell(params.spreadsheet.range.startCell);
      mapEndRange = mapCell(params.spreadsheet.range.endCell);

      if (mapStartRange && mapEndRange) {
        sheet.setAttribute("min-column", mapStartRange.column);
        sheet.setAttribute("max-column", mapEndRange.column);
        sheet.setAttribute("min-row", mapStartRange.row);
        sheet.setAttribute("max-row", mapEndRange.row);
      }
    }

    var stop = false;
    if (params.spreadsheet.apiKey) {
      sheet.setAttribute("apikey", params.spreadsheet.apiKey);
    } else if (params.spreadsheet.refresh >= 60) {
      sheet.setAttribute("apikey", this.API_KEY_DEFAULT);
    } else {
      stop = true;
      this.showError("Missing API Key.");
      this.logEvent({
            "event": "error",
            "event_details": "missing API Key",
            "url": params.spreadsheet.url
          }, true);
    }

    if (!stop) {
      sheet.go();
    }
  },

  onGoogleSheetResponse: function(e) {
    this.props.hideMessage();

    if (e.detail && e.detail.cells) {
      this.setState({ data: e.detail.cells });
    }

    if (this.isLoading) {
      this.isLoading = false;
      this.ready();
    }
    else {
      // in case refresh fixed previous error
      this.errorFlag = false;
    }
  },

  onGoogleSheetError: function(e) {
    this.showError("To use this Google Spreadsheet it must be published to the web. To publish, open the Google Spreadsheet and select 'File > Publish to the web', then click 'Publish'.");

    this.logEvent({
      "event": "error",
      "event_details": "spreadsheet not published",
      "error_details": e.detail,
      "url": params.spreadsheet.url
    }, true);

    this.setState({ data: null });

    if (this.isLoading) {
      this.isLoading = false;
      this.ready();
    }
  },

  loadFonts: function() {
    const { columns } = params.format;

    var fontSettings = [];

    fontSettings.push({
      "class": this.headerClass,
      "fontStyle": params.format.header.fontStyle
    });

    fontSettings.push({
      "class": this.bodyClass,
      "fontStyle": params.format.body.fontStyle
    });

    fontSettings.push({
      "class": this.bodyClass,
      "fontStyle": params.format.body.fontStyle
    });

    columns.forEach(function (column, index, array) {
      fontSettings.push({
        "class": column.id,
        "fontStyle": column.fontStyle
      });
    });

    Common.loadFonts(fontSettings);
  },

  ready: function() {
    gadgets.rpc.call("", "rsevent_ready", null, prefs.getString("id"), true, true, true, true, true);
  },

  done: function() {
    gadgets.rpc.call("", "rsevent_done", null, prefs.getString("id"));

    if (this.errorLog !== null) {
      this.logEvent(this.errorLog, true);
    }

    this.logEvent({
      "event": "done",
      "url": params.spreadsheet.url
    });
  },

  play: function() {
    this.viewerPaused = false;

    this.logEvent({
      "event": "play",
      "url": params.spreadsheet.url
    });

    if (this.errorFlag) {
      this.startErrorTimer();
    }

    if (this.refs.scrollComponent) {
      this.refs.scrollComponent.play();
    }
  },

  pause: function() {
    this.viewerPaused = true;
    if (this.refs.scrollComponent) {
      this.refs.scrollComponent.pause();
    }
  },

  stop: function() {
    this.pause();
  },

  getTableName: function() {
    return "spreadsheet_events";
  },

  clearErrorTimer: function() {
    clearTimeout(this.errorTimer);
    this.errorTimer = null;
  },

  startErrorTimer: function() {
    var self = this;

    this.clearErrorTimer();

    this.errorTimer = setTimeout(function () {
      // notify Viewer widget is done
      self.done();
    }, 5000);
  },

  logEvent: function(params, isError) {
    if (isError) {
      this.errorLog = params;
    }
    Logger.logEvent(this.getTableName(), params);
  },

  showError: function(messageVal) {
    this.errorFlag = true;

    this.props.showMessage(messageVal);

    // if Widget is playing right now, run the timer
    if (!this.viewerPaused) {
      this.startErrorTimer();
    }
  },

  convertColumnFormatIds: function() {
    const { columns } = params.format;

    if (columns !== undefined) {
      for (let i = 0; i < columns.length; i++) {
        columns[i].id = columns[i].id.slice(0, (columns[i].id.indexOf("_")));
      }
    }
  },

  setDataColumnIds: function() {
    var matchFound = false;

    this.dataColumnIds = [];

    // For every column...
    for (let i = 0; i < this.totalCols; i++) {
      // title.$t = A1, B1, etc. Remove the trailing number so that ids can be compared.
      this.dataColumnIds.push(this.state.data[i].title.$t.replace(/\d+/g, ""));
    }
  },

  // Calculate the width that is taken up by rendering columns with an explicit width.
  getColumnWidthObj: function() {
    const { columns } = params.format;

    var column = null,
      width = 0,
      numCols = 0;

    if (columns !== undefined) {
      // For every column formatting option...
      for (let j = 0; j < columns.length; j++) {
        column = columns[j];

        if ((column.width !== undefined) && (column.width !== "")) {
          width += parseInt(column.width, 10);
          numCols++;
        }
      }
    }
    else {
      width = 0;
    }

    return {
      width: width,
      numCols: numCols
    };
  },

  getColumnWidth: function(column) {
    if ((column.width !== undefined) && (column.width !== "")) {
      return parseInt(column.width, 10);
    }
    else {
      return this.getDefaultColumnWidth();
    }
  },

  getDefaultColumnWidth: function() {
    const columnWidthObj = this.getColumnWidthObj();

    return (params.width - columnWidthObj.width) / (this.totalCols - columnWidthObj.numCols);
  },

  getColumnAlignment: function(column) {
    var alignment = "";

    if ((column.fontStyle !== undefined) && (column.fontStyle.align !== undefined)
      && (column.fontStyle.align !== "")) {
      return column.fontStyle.align;
    }
    else {
      return this.getDefaultColumnAlignment();
    }
  },

  getDefaultColumnAlignment: function() {
    return "left";
  },

  /* Get per column formatting as an object.
   * Object format: [{id: "A", alignment: "left", width: 100}]
   * 'width' is always returned; 'id' and 'alignment' are optionally returned.
   */
  getColumnFormats: function() {
    const { columns } = params.format;

    var found = false,
      column = null,
      columnFormats = [];

    if (columns !== undefined) {
      // Iterate over every column.
      for (let i = 0; i < this.totalCols; i++) {
        found = false;
        columnFormats[i] = {};

        // Iterate over every column format setting.
        for (let j = 0; j < columns.length; j++) {
          column = columns[j];

          if (column.id === this.dataColumnIds[i]) {
            const columnFormat = columnFormats[i];

            columnFormat.id = column.id;
            columnFormat.numeric = column.numeric ? column.numeric : false;
            columnFormat.alignment = this.getColumnAlignment(column);
            columnFormat.width = this.getColumnWidth(column);
            columnFormat.colorCondition = column.colorCondition;
            found = true;

            break;
          }
        }

        // No column formatting option for just this column.
        if (!found) {
          columnFormats[i].width = this.getDefaultColumnWidth();
        }
      }
    }
    // No per column format settings.
    else {
      for (let i = 0; i < this.totalCols; i++) {
        columnFormats[i] = {};
        // Equal width columns.
        columnFormats[i].width = params.width / this.totalCols;
      }
    }

    return columnFormats;
  },

  setColumnCount: function() {
    var columns = [],
      found, row, val;

    for (var i = 0; i < this.state.data.length; i += 1) {
      if (row && parseInt(this.state.data[i].gs$cell.row, 10) !== row) {
        // no need to go further than first row
        break;
      } else {
        row = parseInt(this.state.data[i].gs$cell.row, 10);
      }

      val = parseInt(this.state.data[i].gs$cell.col, 10);
      found = columns.some(function (col) {
        return col === val;
      });

      if (!found) {
        columns.push(val);
      }
    }

    this.totalCols = columns.length;
  },

  getRowCount: function() {
    var rows = [],
      found, col, val;

    for (var i = 0; i < this.state.data.length; i += 1) {
      if (col && parseInt(this.state.data[i].gs$cell.col, 10) === col) {
        // skip to next cell
        continue;
      } else {
        col = parseInt(this.state.data[i].gs$cell.col, 10);
      }

      val = parseInt(this.state.data[i].gs$cell.row, 10);
      found = rows.some(function (row) {
        return row === val;
      });

      if (!found) {
        rows.push(val);
      }
    }

    return rows.length;
  },

  getHeaders: function() {
    var matchFound = false,
      column = null,
      headers = [],
      { columns } = params.format;

    // Iterate over every column header.
    for (let i = 0; i < this.totalCols; i++) {
      matchFound = false;

      // Iterate over every column formatting option.
      if (columns !== undefined) {
        for (let j = 0; j < columns.length; j++) {
          column = columns[j];

          if (column.id === this.dataColumnIds[i]) {
            if ((column.headerText !== undefined) && (column.headerText !== "")) {
              headers.push(column.headerText);
              matchFound = true;
            }

            break;
          }
        }
      }

      // Use the header from the spreadsheet.
      if (!matchFound) {
        headers.push(this.state.data[i].content.$t);
      }
    }

    return headers;
  },

  // Convert data to a two-dimensional array of rows.
  getRows: function() {
    var rows = [],
      row = null,
      startingCol = parseInt(this.state.data[0].gs$cell.col,10),
      startingIndex = (params.spreadsheet.hasHeader) ? this.totalCols : 0;

    for (var i = startingIndex; i < this.state.data.length; i += 1) {
      if (parseInt(this.state.data[i].gs$cell.col, 10) === startingCol) {
        if (row !== null) {
          rows.push(row);
        }

        row = [];
      }

      row.push(this.state.data[i].content.$t);
    }

    rows.push(row);

    return rows;
  },

  canRenderBody: function() {
    if (!params.spreadsheet.hasHeader) {
      return true;
    }

    return this.getRowCount() > 1;
  },

  render: function() {
    if (this.state.data) {
      this.setColumnCount();
      this.setDataColumnIds();

      return(
        <div id="table">
        {params.spreadsheet.hasHeader ?
          <TableHeaderContainer
            align={params.format.header.fontStyle.align}
            data={this.getHeaders()}
            width={params.width}
            height={params.format.rowHeight}
            columnFormats={this.getColumnFormats()} />
            : false}
          {this.canRenderBody() ?
            <Scroll
              ref="scrollComponent"
              onDone={this.done}
              scroll={params.scroll}
              data={this.getRows()}
              align={params.format.body.fontStyle.align}
              class={this.bodyClass}
              totalCols={this.totalCols}
              rowHeight={params.format.rowHeight}
              width={params.width}
              height={params.spreadsheet.hasHeader ? params.height - params.format.rowHeight : params.height}
              columnFormats={this.getColumnFormats()} />
          : false}
        </div>
      );
    }
    else {
      return null;
    }
  }
});

export default Spreadsheet;
