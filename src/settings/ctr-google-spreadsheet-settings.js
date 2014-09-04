angular.module("risevision.widget.googleSpreadsheet.settings")
  .controller("spreadsheetSettingsController", ["$scope",
    function ($scope) {

      $scope.sheetColumns = [];

    }])
  .value("defaultSettings", {
    params: {},
    additionalParams: {
      spreadsheet: {},
      columns: [],
      scroll: {},
      table: {},
      background: {}
    }
  });
