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
      columns: [],
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
        show: true,
        size: 1
      }
    },
    scroll: {},
    spreadsheet: {
      selection: "drive",
      docName: "",
      url: "",
      fileId: "",
      cells: "range",
      range: {
        startCell: "B2",
        endCell: "C3"
      },
      tabId: 1,
      hasHeader: true,
      refresh: 5
    }
  }
};

window.innerWidth = 600;
window.innerHeight = 400;

module.exports = window.gadget;
