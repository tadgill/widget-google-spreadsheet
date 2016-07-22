"use strict";

window.gadget = window.gadget || {};

window.gadget.settings = {
  params: {},
  additionalParams: {
    format: {
      body: {
        fontStyle:{
          font:{
            family:"verdana,geneva,sans-serif",
            type:"standard",
            url:""
          },
          size:"18px",
          customSize:"",
          align:"left",
          verticalAlign: "middle",
          bold:false,
          italic:false,
          underline:false,
          forecolor:"black",
          backcolor:"transparent"
        }
      },
      columns: [
        {
          id: "A_string_Column 1",
          name: "Column 1",
          type: "string",
          show: true,
          fontStyle: {
            font:{
              family:"verdana,geneva,sans-serif",
              type:"standard",
              url:""
            },
            size:"18px",
            customSize:"",
            align:"left",
            verticalAlign: "middle",
            bold:false,
            italic:false,
            underline:false,
            forecolor:"black",
            backcolor:"transparent"
          },
          width: 100,
          colorCondition: "none",
          headerText: "Custom Header"
        }
      ],
      evenRowColor: "rgba(255, 255, 255, 0)",
      header: {
        fontStyle:{
          font:{
            family:"verdana,geneva,sans-serif",
            type:"standard",
            url:""
          },
          size:"18px",
          customSize:"",
          align:"left",
          verticalAlign: "middle",
          bold:false,
          italic:false,
          underline:false,
          forecolor:"black",
          backcolor:"transparent"
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
      cells: "range",
      range: {
        startCell: "B2",
        endCell: "C3"
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

module.exports = window.gadget;
