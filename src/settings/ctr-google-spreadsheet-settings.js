angular.module("risevision.widget.googleSpreadsheet.settings")
  .controller("spreadsheetSettingsController", ["$scope", "$window", "$log", "googleSheet",
    function ($scope, $window, $log, googleSheet) {

      $scope.showPreview = false;

      $scope.sheets = [];
      $scope.currentSheet = null;
      function getWorkSheets(fileId) {
        googleSheet.getWorkSheets(fileId)
          .then(function (sheets) {
            $log.debug("Worksheets", sheets);
            $scope.published = true;
            $scope.sheets = sheets;
            $scope.currentSheet = sheets[$scope.settings.additionalParams.spreadsheet.tabId - 1];
          })
          .then(null, function () {
            $scope.published = false;
            $scope.sheets = [];
            $scope.currentSheet = null;
            $scope.settings.additionalParams.spreadsheet.tabId = 1;
          });
      }

      $scope.$watch("currentSheet", function (currentSheet) {
        if (currentSheet) {
          $scope.settings.additionalParams.spreadsheet.tabId = currentSheet.value;
        }
      });

      $scope.published = true;

      $scope.$watch("settings.additionalParams.spreadsheet.fileId", function (fileId) {
        if (typeof fileId === "undefined" || !fileId) {
          $scope.settingsForm.$setValidity("fileId", false);
        }
        else {
          $scope.showPreview = true;
          $scope.settingsForm.$setValidity("fileId", true);

          if ($scope.settings.additionalParams.spreadsheet.selection === "key") {
            $scope.settings.additionalParams.spreadsheet.url =
              "https://docs.google.com/spreadsheets/d/" + fileId + "/edit#gid=0";
          }

          getWorkSheets(fileId);
        }
      });

      $scope.$watch("published", function (value) {
        if (typeof value !== "undefined" && $scope.settings.additionalParams.spreadsheet &&
          $scope.settings.additionalParams.spreadsheet.fileId &&
          $scope.settings.additionalParams.spreadsheet.fileId !== "") {
          $scope.settingsForm.$setValidity("fileId", value);
        }
      });

      $scope.$on("picked", function (event, data) {
        $scope.showPreview = true;
        $scope.settings.additionalParams.spreadsheet.selection = "drive";
        $scope.settings.additionalParams.spreadsheet.docName = data[0].name;
        $scope.settings.additionalParams.spreadsheet.url = encodeURI(data[0].url);
        $scope.settings.additionalParams.spreadsheet.fileId = data[0].id;
      });

      $scope.setSelection = function() {
        $scope.showPreview = true;
        $scope.settings.additionalParams.spreadsheet.selection = "key";
      };

      $scope.previewFile = function () {
        $window.open($scope.settings.additionalParams.spreadsheet.url, "_blank");
      };

      $scope.retryFile = function () {
        if ($scope.settings.additionalParams.spreadsheet.fileId &&
          $scope.settings.additionalParams.spreadsheet.fileId !== "") {
          $scope.published = true;
          getWorkSheets($scope.settings.additionalParams.spreadsheet.fileId);
        }
      };

      $scope.clearSelection = function () {
        $scope.published = true;

        if ($scope.settings.additionalParams.spreadsheet.selection === "drive") {
          $scope.settings.additionalParams.spreadsheet.docName = "";
        }

        $scope.settings.additionalParams.spreadsheet.url = "";
        $scope.settings.additionalParams.spreadsheet.fileId = "";
      };
    }])
  .value("defaultSettings", {
    params: {},
    additionalParams: {
      spreadsheet: {
        selection: "drive",
        docName: "",
        url: "",
        fileId: "",
        cells: "sheet",
        range: {
          startCell: "",
          endCell: ""
        },
        tabId: 1,
        hasHeader: false,
        refresh: 5
      }
    }
  });
