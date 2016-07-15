(function (angular) {
  "use strict";

  angular.module("google-sheet-http-mock", ["ngMockE2E"])

    .run(["$httpBackend", "$log", "SHEETS_API", "API_KEY",
      function($httpBackend, $log, SHEETS_API, API_KEY) {

        var successData = {
          sheets: [
            {
              properties: {
                title: "Worksheet 1"
              }
            },
            {
              properties: {
                title: "Worksheet 2"
              }
            },
            {
              properties: {
                title: "Worksheet 3"
              }
            },
            {
              properties: {
                title: "Worksheet 4"
              }
            }
          ]
        };

        function getHTTP(key) {
          return SHEETS_API + key + "?key=" + API_KEY;
        }

        $httpBackend.whenGET(getHTTP("public")).respond(function () {
          return [200, successData, {}];
        });

        $httpBackend.whenGET(getHTTP("not-public")).respond(function () {
          return [302, {}, {}];
        });
      }]);

})(angular);

