"use strict";

window.gadget = window.gadget || {};

window.gadget.settings = {
  params: {},
  additionalParams: {
    format: {
      body: {
        fontStyle: {
          font: {
            family: "verdana,geneva,sans-serif",
            type: "standard",
            url: ""
          },
          size: "18px",
          customSize: "",
          align: "left",
          verticalAlign: "middle",
          bold: false,
          italic: false,
          underline: false,
          forecolor: "black",
          backcolor: "transparent"
        }
      },
      columns: [
        {
          id: 0,
          name: "A",
          show: true,
          fontStyle: {
            font: {
              family: "verdana,geneva,sans-serif",
              type: "standard",
              url: ""
            },
            size: "18px",
            customSize: "",
            align: "left",
            verticalAlign: "middle",
            bold: false,
            italic: false,
            underline: false,
            forecolor: "black",
            backcolor: "transparent"
          },
          width: 100,
          colorCondition: "none",
          headerText: "Custom Header"
        }
      ],
      evenRowColor: "rgba(255, 255, 255, 0)",
      header: {
        fontStyle: {
          font: {
            family: "verdana,geneva,sans-serif",
            type: "standard",
            url: ""
          },
          size: "18px",
          customSize: "",
          align: "center",
          verticalAlign: "middle",
          bold: false,
          italic: false,
          underline: false,
          forecolor: "black",
          backcolor: "transparent"
        }
      },
      oddRowColor: "rgba(255, 255, 255, 0)",
      rowHeight: 50,
      separator: {
        color: "rgba(238,238,238, 1)",
        showColumn: true,
        showRow: true
      }
    },
    scroll: {},
    spreadsheet: {
      selection: "drive",
      docName: "Test",
      url: "https://docs.google.com/a/risevision.com/spreadsheets/d/xxxxxxxxxx/edit?usp=drive_web",
      fileId: "xxxxxxxxxx",
      cells: "sheet",
      range: {
        startCell: "",
        endCell: ""
      },
      tabId: 1,
      sheetName: "Sheet1",
      hasHeader: true,
      refresh: 60,
      apiKey: "abc123"
    }
  }
};

window.innerWidth = 600;
window.innerHeight = 400;

window.gadget.data = {
  cols: [
    { "id": 0, "label": "A" },
    { "id": 1, "label": "B" },
    { "id": 2, "label": "C" },
    { "id": 3, "label": "D" }
  ],
  rows: [
    [ "test 1", 345453, new Date( 2013, 7, 10 ), "" ],
    [ "test 2", 6565.67, new Date( 2014, 2, 24 ), "" ],
    [ "test 3", 56, new Date( 2005, 10, 29 ), "" ],
    [ "test 4", 45454, new Date( 2012, 7, 23 ), "" ]
  ]
};

module.exports = window.gadget;
