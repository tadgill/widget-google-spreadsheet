angular.module("risevision.widget.googleSpreadsheet.settings")
  .constant("SPREADSHEET_API_WORKSHEETS", "https://spreadsheets.google.com/feeds/worksheets/")
  .constant("SPREADSHEET_API_SUFFIX", "/public/basic")

  .factory("googleSheet", ["$http", "$log", "SPREADSHEET_API_WORKSHEETS", "SPREADSHEET_API_SUFFIX",
    function ($http, $log, SPREADSHEET_API_WORKSHEETS, SPREADSHEET_API_SUFFIX) {

      var factory = {},
        filterSheets = function (data) {
          var option, sheets;

          sheets = data.feed.entry.map(function (value, index) {
            option = {};

            // Worksheet tab name
            option.label = value.title.$t;

            // Worksheet tab number
            option.value = (index + 1);

            return option;
          });

          return sheets;
        };

      factory.getWorkSheets = function(fileId) {
        var api = SPREADSHEET_API_WORKSHEETS + fileId + SPREADSHEET_API_SUFFIX;

        return $http.get(encodeURI(api + "?alt=json"))
          .then(function (response) {
            return response.data;
          })
          .then(function (data) {
            return filterSheets(data);
          });
      };

      return factory;

    }]);
