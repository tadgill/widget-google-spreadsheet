/* global gadgets */

require("fixed-data-table/dist/fixed-data-table.css");
require("../css/fixed-data-table-overrides.css");
require("../../components/widget-common/dist/css/message.css");

import React from "react";
import TableHeader from "./table-header";
import Table from "./table";
import Logger from "../../components/widget-common/dist/logger";
import Common from "../../components/widget-common/dist/common";
import Message from "../../components/widget-common/dist/message";

const prefs = new gadgets.Prefs();
const sheet = document.querySelector("rise-google-sheet");

var params = null;
var message = null;

const Spreadsheet = React.createClass({
  headerClass: "header_font-style",
  bodyClass: "body_font-style",

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
    document.getElementById("container").style.width = params.width + "px";
    document.getElementById("container").style.height = params.height + "px";

    this.setRowStyle();

    message = new Message(document.getElementById("container"),
      document.getElementById("messageContainer"));

    // show wait message while Storage initializes
    message.show("Please wait while your google sheet is loaded.");

    this.loadFonts();
    this.initRiseGoogleSheet();
    this.ready();
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

      this.showError("To use this Google Spreadsheet it must be published to the web. To publish, open the Google Spreadsheet and select 'File &gt; Publish to the web', then click 'Publish'.");

      this.setState({ data: null });

    }.bind(this));

    sheet.addEventListener("rise-google-sheet-response", function(e) {
      message.hide();

      if (e.detail && e.detail.cells) {
        this.setState({ data: e.detail.cells });
      }

      // Must execute after data is rendered.
      // $(".page").height(this.table.props.rowsCount * this.table.props.rowHeight);

      // if ($app.data("plugin_autoScroll") === undefined) {
      //   $app.autoScroll({
      //     "by": "continuous",
      //     "speed": "fastest"
      //   }).on("done", function () {
      //     $app.data("plugin_autoScroll").play();
      //   });

      //   $app.data("plugin_autoScroll").play();
      // }
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

    this.logEvent({
      "event": "done",
      "url": params.spreadsheet.url
    });
  },

  play: function() {
    this.logEvent({
      "event": "play",
      "url": params.spreadsheet.url
    });
  },

  pause: function() {

  },

  stop: function() {
    this.pause();
  },

  getTableName: function() {
    return "spreadsheet_events";
  },

  logEvent: function(params) {
    Logger.logEvent(this.getTableName(), params);
  },

  showError: function(messageVal) {
    message.show(messageVal);
  },

  getColumnCount: function() {
    var totalCols = 0,
      startingRow = parseInt(this.state.data[0].gs$cell.row, 10);

    while (parseInt(this.state.data[totalCols].gs$cell.row, 10) === startingRow) {
      totalCols += 1;
    }

    return totalCols;
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

  render: function() {
    const rowHeight = 50;
    var totalCols = 0,
      headers = null,
      rows = null;

    if (this.state.data) {
      totalCols = this.getColumnCount();
      headers = this.getHeaders(totalCols);
      rows = this.getRows(totalCols);

      return(
        <div id="app">
        {params.spreadsheet.hasHeader ?
          <TableHeader
            class={this.headerClass}
            data={headers}
            align={this.getColumnAlignment()}
            width={params.width}
            height={rowHeight} />
            : false}
          <Table
            data={rows}
            align={params.format.body.fontStyle.align}
            class={this.bodyClass}
            totalCols={totalCols}
            width={params.width}
            height={params.spreadsheet.hasHeader ? params.height - rowHeight : params.height} />
        </div>
      );
    }
    else {
      return null;
    }
  }
});

module.exports = Spreadsheet;
