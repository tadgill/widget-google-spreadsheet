angular.module( "risevision.widget.googleSpreadsheet.settings" )
  .constant( "SHEETS_API", "https://sheets.googleapis.com/v4/spreadsheets/" )

  .factory( "googleSheet", [ "$http", "$q", "$log", "SHEETS_API", "API_KEY",
    function( $http, $q, $log, SHEETS_API, API_KEY ) {

      var factory = {},
        columnsRequest = null,
        columnsRequestSuccess = true,
        getColumnName = function( index ) {
          var ordA = "a".charCodeAt( 0 ),
            ordZ = "z".charCodeAt( 0 ),
            len = ordZ - ordA + 1,
            s = "";

          while ( index >= 0 ) {
            s = String.fromCharCode( index % len + ordA ) + s;
            index = Math.floor( index / len ) - 1;
          }
          return s;
        },
        configureColumns = function( values, range ) {
          var nameIndex = 0,
            column;

          if ( values && values.length > 0 ) {
            if ( range ) {
              nameIndex = range.slice( 0, range.indexOf( ":" ) ).toLowerCase().charCodeAt( 0 ) - 97;
            }

            return values.map( function( val, index ) {
              column = {};

              column.id = index;
              column.name = getColumnName( nameIndex ).toUpperCase();

              nameIndex += 1;

              return column;
            } );
          } else {
            return [];
          }

        };

      factory.getWorkSheets = function( fileId, apiKey ) {
        var api = SHEETS_API + fileId + "?key=" + ( ( apiKey ) ? apiKey : API_KEY );

        return $http.get( api )
          .then( function( response ) {
            return response.data.sheets;
          } );
      };

      factory.getColumnsData = function( fileId, apiKey, sheet, range ) {
        var api = SHEETS_API + fileId + "/values/" + encodeURIComponent( sheet ) + ( ( range ) ? "!" + range : "" ) +
          "?key=" + ( ( apiKey ) ? apiKey : API_KEY ) + "&majorDimension=COLUMNS",
          deferred = $q.defer();

        if ( columnsRequest === api && columnsRequestSuccess ) {
          // resolve but pass null to indicate no new data to provide
          deferred.resolve( null );
          return deferred.promise;
        } else {
          columnsRequest = api;

          return $http.get( api )
            .then( function( response ) {
              columnsRequestSuccess = true;
              return response.data.values;
            } )
            .then( function( values ) {
              return configureColumns( values, range );
            } )
            .then( null, function( response ) {
              columnsRequest = null;
              columnsRequestSuccess = false;

              deferred.reject( response.data.error );
              return deferred.promise;
            } );
        }

      };

      factory.resetColumns = function() {
        columnsRequest = null;
        columnsRequestSuccess = true;
      };

      return factory;

    } ] );
