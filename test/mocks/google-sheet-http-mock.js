( function( angular ) {
  "use strict";

  angular.module( "google-sheet-http-mock", [ "ngMockE2E" ] )

    .run( [ "$httpBackend", "$log", "SHEETS_API", "API_KEY",
      function( $httpBackend, $log, SHEETS_API, API_KEY ) {

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
          },
          successColumnsData = {
            "range": "Worksheet 1!A1:F994",
            "majorDimension": "COLUMNS",
            "values": [
            [ "A1 value", "A2 value" ],
            [ "B1 value", "B2 value" ],
            [ "C1 value", "C2 value" ],
            [ "D1 value", "D2 value" ]
            ]
          },
          errorColumnsData = {
            "error": {
              "code": 400,
              "message": "Unable to parse range: Cars!fsasaf:fdsfsd",
              "status": "INVALID_ARGUMENT"
            }
          };

        function getSpreadsheetHTTP( key ) {
          return SHEETS_API + key + "?key=" + API_KEY;
        }

        function getColumnsHTTP( range ) {
          return SHEETS_API + "public/values/Worksheet%201" + ( ( range ) ? "!" + range : "" ) +
            "?key=" + API_KEY + "&majorDimension=COLUMNS"
        }

        $httpBackend.whenGET( getSpreadsheetHTTP( "public" ) ).respond( function() {
          return [ 200, successData, {} ];
        } );

        $httpBackend.whenGET( getSpreadsheetHTTP( "not-public" ) ).respond( function() {
          return [ 302, {}, {} ];
        } );

        $httpBackend.whenGET( getColumnsHTTP( "" ) ).respond( function() {
          return [ 200, successColumnsData, {} ];
        } );

        $httpBackend.whenGET( getColumnsHTTP( "abc:abc" ) ).respond( function() {
          return [ 400, errorColumnsData, {} ];
        } );
      } ] );

} )( angular );

