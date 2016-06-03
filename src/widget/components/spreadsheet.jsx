/* global gadgets */

require("fixed-data-table/dist/fixed-data-table.css");
require("../css/fixed-data-table-overrides.css");

import React from "react";
import TableHeader from "./table-header";
import Scroll from "./scroll";
import Logger from "../../components/widget-common/dist/logger";
import Common from "../../components/widget-common/dist/common";

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
    sheet.removeEventListener("rise-google-sheet-response");
    sheet.removeEventListener("rise-google-sheet-error");
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

    this.setRowStyle();

    if (Common.isLegacy()) {
      this.showError("This version of Spreadsheet Widget is not supported on this version of Rise Player. " +
        "Please use the latest Rise Player version available from https://help.risevision.com/user/create-a-display");

      this.isLoading = false;
      this.ready();

    } else {
      // show wait message while Storage initializes
      this.props.showMessage("Please wait while your google sheet is loaded.");

      this.loadFonts();
      this.initRiseGoogleSheet();
    }

  },

  setRowStyle: function() {
    Common.addCSSRules([
        ".even" + " div * {background-color: " + params.format.evenRowColor + " !important }",
        ".odd" + " div * {background-color: " + params.format.oddRowColor + " !important }"
      ]);
  },

  initRiseGoogleSheet: function() {
    var mapStartRange, mapEndRange;

    function mapCell(cell) {
      var obj = {},
        column, row;

      column = cell.substr(0, 1);
      row = cell.substr(1);

      if (!Number.isNaN(parseInt(column, 10))) {
        return null;
      }

      if (Number.isNaN(parseInt(row, 10))) {
        return null;
      }

      // code for lowercase 'a' is 97 so subtract
      obj.column = (column.toLowerCase().charCodeAt(0) - 97 ) + 1;
      obj.row = parseInt(row, 10);

      return obj;
    }

    sheet.addEventListener("rise-google-sheet-error", function (e) {

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

    }.bind(this));

    sheet.addEventListener("rise-google-sheet-response", function(e) {
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

    }.bind(this));

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

    sheet.go();
  },

  loadFonts: function() {
    var fontSettings = [];

    fontSettings.push({
      "class": this.headerClass,
      "fontStyle": params.format.header.fontStyle
    });

    fontSettings.push({
      "class": this.bodyClass,
      "fontStyle": params.format.body.fontStyle
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

  getColumnCount: function() {
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

    return columns.length;
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

  getColumnAlignment: function() {
    var alignment = params.format.header.fontStyle.align;

    if (!alignment) {
      alignment = "left";
    }

    return alignment;
  },

  // getColumnWidth: function(columnKey) {
  //   var width = stylingData.defaultColumnWidth;

  //   for (var i = 0; i < stylingData.columns.length; i++) {
  //     if (stylingData.columns[i].id === columnKey) {
  //       width = stylingData.columns[i].width;
  //       break;
  //     }
  //   }

  //   return width;
  // },

  // getColumnHeader: function(dataValue) {
  //   var value = dataValue;

    // for (var i = 0; i < stylingData.columns.length; i++) {
    //   if (stylingData.columns[i].id === columnKey) {
    //     value = stylingData.columns[i].headerText;
    //     break;
    //   }
    // }

  //   return value;
  // },

  getHeaders: function(totalCols) {
    var headers = [];

    for (var i = 0; i < totalCols; i++) {
      headers.push(this.state.data[i].content.$t);
    }

    return headers;
  },

  // Convert data to a two-dimensional array of rows.
  getRows: function(totalCols) {
    var rows = [],
      row = null,
      startingCol = parseInt(this.state.data[0].gs$cell.col,10),
      startingIndex = (params.spreadsheet.hasHeader) ? totalCols : 0;

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
    var totalCols = 0,
      headers = null,
      rows = null;

    if (this.state.data) {
      totalCols = this.getColumnCount();
      headers = this.getHeaders(totalCols);
      rows = this.getRows(totalCols);

      return(
        <div id="table">
          {params.spreadsheet.hasHeader ?
            <TableHeader
              class={this.headerClass}
              data={headers}
              align={this.getColumnAlignment()}
              width={params.width}
              height={params.format.rowHeight} />
            : false}
          {this.canRenderBody() ?
            <Scroll
              ref="scrollComponent"
              onDone={this.done}
              scroll={params.scroll}
              data={rows}
              align={params.format.body.fontStyle.align}
              class={this.bodyClass}
              totalCols={totalCols}
              rowHeight={params.format.rowHeight}
              width={params.width}
              height={params.spreadsheet.hasHeader ? params.height - params.format.rowHeight : params.height} />
          : false}
        </div>
      );
    }
    else {
      return null;
    }
  }
});

module.exports = Spreadsheet;