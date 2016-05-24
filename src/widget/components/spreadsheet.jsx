/* global gadgets */

require("fixed-data-table/dist/fixed-data-table.min.css");

const React = require("react");
const TableHeader = require("./table-header");
const Table = require("./table");
const Logger = require("../../components/widget-common/dist/logger");

const prefs = new gadgets.Prefs();
const sheet = document.querySelector("rise-google-sheet");

var params = null;

const Spreadsheet = React.createClass({
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
    // var _message = new RiseVision.Common.Message(document.getElementById("container"),
    //   document.getElementById("messageContainer"));

    document.getElementById("container").style.width = params.width + "px";
    document.getElementById("container").style.height = params.height + "px";

    document.getElementById("rise-google-sheet").setAttribute("refresh", params.spreadsheet.refresh * 60);

    this.initRiseGoogleSheet();
    this.ready();
  },

  initRiseGoogleSheet: function() {
    // var app = $("#app");

    sheet.addEventListener("rise-google-sheet-response", function(e) {
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
    sheet.go();
  },

  ready: function() {
    gadgets.rpc.call("", "rsevent_ready", null, prefs.getString("id"), true, true, true, true, true);
  },

  done: function() {
    gadgets.rpc.call("", "rsevent_done", null, prefs.getString("id"));
  },

  play: function() {

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

  getColumnCount: function() {
    var totalCols = 0;

    while (this.state.data[totalCols].gs$cell.row === "1") {
      totalCols++;
    }

    return totalCols;
  },

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
      row = null

    for (var i = totalCols; i < this.state.data.length; i++) {
      if (this.state.data[i].gs$cell.col === "1") {
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
        <div>
          {params.spreadsheet.hasHeader ?
            <div className="header">
              <TableHeader data={headers} width={params.width} height={rowHeight} />
            </div> : false}
          <div id="table">
            <section className="page">
              <Table data={rows} width={params.width}
                height={params.spreadsheet.hasHeader ? params.height - rowHeight : params.height}
                totalCols={totalCols} />
            </section>
          </div>
        </div>
      );
    }
    else {
      return null;
    }
  }
});

module.exports = Spreadsheet;
