(function(window) {

  "use strict";

  window.gadget = window.gadget || {};

  window.gadget.settings = {
    "params": {},
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
            verticalAlign: "bottom",
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
            verticalAlign: "top",
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
        docName: "",
        url: "",
        fileId: "xxxxxxxxxx",
        cells: "range",
        range: {
          startCell: "B2",
          endCell: "C3"
        },
        tabId: 1,
        sheetName: "Test",
        hasHeader: true,
        refresh: 60,
        apiKey: ""
      }
    }
  };

  window.innerWidth = 600;
  window.innerHeight = 400;

})(window);
