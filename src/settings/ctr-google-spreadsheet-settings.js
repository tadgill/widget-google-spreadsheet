angular.module("risevision.widget.googleSpreadsheet.settings")
  .controller("spreadsheetSettingsController", ["$scope", "$window", "$log", "googleSheet",
    function ($scope, $window, $log, googleSheet) {

      function getWorkSheets(fileId) {
        googleSheet.getWorkSheets(fileId)
          .then(function (sheets) {
            $log.debug("Worksheets", sheets);
            $scope.published = true;
          })
          .then(null, function () {
            $scope.published = false;
          });
      }

      $scope.published = true;

      $scope.$watch("settings.additionalParams.spreadsheet.fileId", function (fileId) {
        if (fileId && fileId !== "") {
          getWorkSheets(fileId);
        }
      });

      $scope.$watch("settings.additionalParams.spreadsheet.docName", function (docURL) {
        if (typeof docURL === "undefined" || !docURL) {
          $scope.settingsForm.$setValidity("docName", false);
        }
        else {
          $scope.settingsForm.$setValidity("docName", true);
        }
      });

      $scope.$watch("published", function (value) {
        if (typeof value !== "undefined" &&
          $scope.settings.additionalParams.spreadsheet.docName &&
          $scope.settings.additionalParams.spreadsheet.docName !== "") {
          $scope.settingsForm.$setValidity("docName", value);
        }
      });

      $scope.$on("picked", function (event, data) {
        $scope.settings.additionalParams.spreadsheet.docName = data[0].name;
        $scope.settings.additionalParams.spreadsheet.docURL = encodeURI(data[0].url);
        $scope.settings.additionalParams.spreadsheet.fileId = data[0].id;
      });

      $scope.previewFile = function () {
        $window.open($scope.settings.additionalParams.spreadsheet.docURL, "_blank");
      };

      $scope.retryFile = function () {
        if ($scope.settings.additionalParams.spreadsheet.fileId &&
          $scope.settings.additionalParams.spreadsheet.fileId !== "") {
          getWorkSheets($scope.settings.additionalParams.spreadsheet.fileId);
        }
      };

      $scope.clearSelection = function () {
        $scope.published = true;

        delete $scope.settings.additionalParams.spreadsheet.docName;
        delete $scope.settings.additionalParams.spreadsheet.docURL;
        delete $scope.settings.additionalParams.spreadsheet.fileId;
      };
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
