(function(window) {

  "use strict";

  window.gadget = window.gadget || {};

  window.gadget.settings = {
    "params": {
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
      }
    }
  };

})(window);
