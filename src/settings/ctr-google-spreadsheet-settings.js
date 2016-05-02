angular.module("risevision.widget.googleSpreadsheet.settings")
  .controller("spreadsheetSettingsController", ["$scope", "$window", "$log",
    function ($scope,$window /*,$log*/) {

      $scope.$on("picked", function (event, data) {
        $scope.settings.additionalParams.spreadsheet.docName = data[0].name;
        $scope.settings.additionalParams.spreadsheet.docURL = encodeURI(data[0].url);
        $scope.settings.additionalParams.spreadsheet.fileId = data[0].id;
      });

      $scope.previewFile = function () {
        $window.open($scope.settings.additionalParams.spreadsheet.docURL, "_blank");
      };

      $scope.clearSelection = function () {
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
