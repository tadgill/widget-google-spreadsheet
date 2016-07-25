angular.module("risevision.widget.googleSpreadsheet.settings")
  .constant("SHEETS_API", "https://sheets.googleapis.com/v4/spreadsheets/")

  .factory("googleSheet", ["$http", "$log", "SHEETS_API", "API_KEY",
    function ($http, $log, SHEETS_API, API_KEY) {

      var factory = {},
        filterSheets = function (sheets) {
          var option;

          return sheets.map(function (sheet, index) {
            option = {};

            // Worksheet tab name
            option.label = sheet.properties.title;

            // Worksheet tab number
            option.value = (index + 1);

            return option;
          });
        };

      factory.getWorkSheets = function(fileId, apiKey) {
        var api = SHEETS_API + fileId + "?key=" + ( (apiKey)? apiKey: API_KEY);

        return $http.get(encodeURI(api))
          .then(function (response) {
            return response.data.sheets;
          })
          .then(function (sheets) {
            return filterSheets(sheets);
          });
      };

      return factory;

    }]);
