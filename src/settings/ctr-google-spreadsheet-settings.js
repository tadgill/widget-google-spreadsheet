angular.module("risevision.widget.googleSpreadsheet.settings")
  .controller("spreadsheetSettingsController", ["$scope", "$log", "columnsService", "defaultLayout",
    function ($scope, $log, columnsService, defaultLayout) {

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

            if (typeof oldUrl !== "undefined" && oldUrl !== "") {
              // widget settings have already gone through initialization, safe to reset columns array
              $scope.settings.additionalParams.columns = [];
            }

            if (newUrl !== "") {
              $scope.getColumns(newUrl);
            }
          }
        }
      });

      $scope.$watch("settings.additionalParams.layout.customURL", function (url) {
        if (typeof url !== "undefined") {
          if (!$scope.settings.additionalParams.layout.default) {
            $scope.settings.params.layoutURL = url;
          }
        }
      });

      // need to watch this once to set the initial value of params.layoutURL
      $scope.$watch("settings.additionalParams.layout.default", function(defaultVal) {
        if (typeof defaultVal !== "undefined") {
          if (defaultVal) {
            $scope.settings.params.layoutURL = defaultLayout;

            // text for custom url may have been entered in a previous save, remove it
            $scope.settings.additionalParams.layout.customURL = "";
          } else {
            $scope.settings.params.layoutURL = $scope.settings.additionalParams.layout.customURL;
          }
        }
      });

    }])
  .value("defaultSettings", {
    params: {
      layoutURL: ""
    },
    additionalParams: {
      spreadsheet: {},
      columns: [],
      scroll: {},
      table: {},
      background: {},
      layout: {
        default: true,
        customURL: ""
      }
    }
  });
