(function (angular) {
  "use strict";

  angular.module("google-sheet-http-mock", ["ngMockE2E"])

    .run(["$httpBackend", "$log", "SPREADSHEET_API_WORKSHEETS", "SPREADSHEET_API_SUFFIX",
      function($httpBackend, $log, SPREADSHEET_API_WORKSHEETS, SPREADSHEET_API_SUFFIX) {

        var successData = {
          version: "1.0",
          encoding: "UTF-8",
          feed: {
            entry: [
              {
                title: {
                  $t: "Worksheet 1"
                }
              },{
                title: {
                  $t: "Worksheet 2"
                }
              },{
                title: {
                  $t: "Worksheet 3"
                }
              },{
                title: {
                  $t: "Worksheet 4"
                }
              }
            ]
          }
        };

        function getHTTP(key) {
          return SPREADSHEET_API_WORKSHEETS + key + SPREADSHEET_API_SUFFIX + "?alt=json";
        }

        $httpBackend.whenGET(getHTTP("published")).respond(function () {
          return [200, successData, {}];
        });

        $httpBackend.whenGET(getHTTP("not-published")).respond(function () {
          return [302, {}, {}];
        });
      }]);

})(angular);

