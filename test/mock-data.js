(function(window) {

  "use strict";

  window.gadget = window.gadget || {};

  window.gadget.settings = {
    "params": {
      layoutURL: ""
    },
    "additionalParams": {
      "spreadsheet": {
        "fileId": "dummyFileId",
        "url": "https://spreadsheets.google.com/tq?key=dummyFileId&sheet=od6&headers=-1",
        "sheetIndex": 0,
        "cells": "sheet",
        "range": "",
        "headerRow": "-1",
        "refresh": 5,
        "docName": "Rise Training Spreadsheet Example",
        "docURL": "https://docs.google.com/spreadsheet/ccc?key=dummyFileId&usp=drive_web"
      },
      "scroll": {
        "by":"none",
        "speed":"medium",
        "pause":5
      },
      "table": {
        "colHeaderFont": {
          "font": {
            "family":"Verdana"
          },
          "size":"20",
          "bold":false,
          "italic":false,
          "underline":false,
          "color":"black",
          "highlightColor":"transparent"
        },
        "dataFont": {
          "font": {
            "family":"Verdana"
          },
          "size":"20",
          "bold":false,
          "italic":false,
          "underline":false,
          "color":"black",
          "highlightColor":"transparent"
        },
        "rowColor":"transparent",
        "altRowColor":"transparent",
        "rowPadding":"0"
      },
      "columns": [],
      "background": {
        "color": "transparent"
      },
      "layout": {
        "default": true,
        "customURL": ""
      }
    }
  };

  window.gadget.data = {
    cols: [
      {"id":"A","label":"Column 1","type":"string"},
      {"id":"B","label":"Column 2","type":"number"},
      {"id":"C","label":"Column 3","type":"date"},
      {"id":"D","label":"Column 4","type":"string"}
    ],
    rows: [
      ["test 1", 345453, new Date(2013, 7, 10), ""],
      ["test 2", 6565.67, new Date(2014, 2, 24), ""],
      ["test 3", 56, new Date(2005, 10, 29), ""],
      ["test 4", 45454, new Date(2012, 7, 23), ""]
    ]
  };

})(window);
