angular.module("risevision.widget.googleSpreadsheet.settings")
  .controller("spreadsheetSettingsController", ["$scope", "$log", "columnsService",
    function ($scope, $log, columnsService) {

      $scope.sheetColumns = [];
      $scope.currentSheetColumn = null;

      $scope.getColumns = function (url) {
        columnsService.getColumns(url)
          .then(function (columns) {
            if (columns.length > 0) {
              $scope.sheetColumns = columns;
            }
          })
          .then(null, $log.error);
      };

      $scope.$watch("settings.additionalParams.spreadsheet.url", function (newUrl, oldUrl) {
        if (typeof newUrl !== "undefined") {
          if (newUrl !== oldUrl) {

            // reset the column selector
            $scope.sheetColumns = [];
            $scope.settings.additionalParams.columns = [];

            if (newUrl !== "") {
              $scope.getColumns(newUrl);
            }
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
