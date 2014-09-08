angular.module("risevision.widget.googleSpreadsheet.settings")
  .controller("spreadsheetSettingsController", ["$scope", "$log",
    function ($scope, $log) {

      $scope.sheetColumns = [];

      $scope.$watch("settings.additionalParams.spreadsheet.sheet", function (newSheetUrl, oldSheetUrl) {
        if (typeof newSheetUrl !== "undefined") {
          if (newSheetUrl !== oldSheetUrl) {
            $log.info("worksheet change: ", newSheetUrl);
            //TODO: logic for using columns settings service to eventually update/refresh column setting component
          }
        }
      });

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
