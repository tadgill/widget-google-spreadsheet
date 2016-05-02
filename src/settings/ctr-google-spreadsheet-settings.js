angular.module("risevision.widget.googleSpreadsheet.settings")
  .controller("spreadsheetSettingsController", ["$scope", "$log",
    function (/*$scope, $log*/) {


    }])
  .value("defaultSettings", {
    params: {},
    additionalParams: {
      spreadsheet: {
        cells: "sheet",
        range: {
          startCell: "",
          endCell: ""
        }
      }
    }
  });
