/* global describe, beforeEach, it, expect, module, inject */

/* eslint-disable func-names */

"use strict";

describe( "getWorkSheets", function() {

  var googleSheetService,
    base,
    apiKey,
    httpBackend;

  beforeEach( module( "risevision.widget.googleSpreadsheet.settings" ) );

  beforeEach( inject( function( _googleSheet_, _SHEETS_API_, _API_KEY_, $httpBackend ) {
    googleSheetService = _googleSheet_;
    base = _SHEETS_API_;
    apiKey = _API_KEY_;
    httpBackend = $httpBackend;

  } ) );

  it( "should exist", function() {
    expect( googleSheetService ).be.defined;
  } );

  describe( "getWorkSheets", function() {
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
        }
      ]
    };

    function getHTTP( key ) {
      return base + key + "?key=" + apiKey;
    }

    it( "should successfully provide work sheets as select field options", function() {
      httpBackend.whenGET( getHTTP( "public" ) ).respond( function() {
        return [ 200, successData, {} ];
      } );

      googleSheetService.getWorkSheets( "public" ).then( function( results ) {
        expect( results ).be.defined;
        expect( results.length ).to.equal( 2 );

        expect( results ).to.deep.equal( successData.sheets );
      } );

      httpBackend.flush();
    } );
  } );

  describe( "getColumnsData", function() {
    var successColumnsData = {
        "range": "Worksheet 1!A1:F994",
        "majorDimension": "COLUMNS",
        "values": [
        [ "A1 value", "A2 value" ],
        [ "B1 value", "B2 value" ],
        [ "C1 value", "C2 value" ],
        [ "D1 value", "D2 value" ]
        ]
      },
      successColumnsRangeData = {
        "range": "Worksheet 1!B1:C2",
        "majorDimension": "COLUMNS",
        "values": [
          [ "B1 value", "B2 value" ],
          [ "C1 value", "C2 value" ]
        ]
      },
      errorResponse = {
        "error": {
          "code": 400,
          "message": "Unable to parse range: Cars!fsasaf:fdsfsd",
          "status": "INVALID_ARGUMENT"
        }
      };

    function getHTTP( range ) {
      return base + "public/values/Worksheet%201" + ( ( range ) ? "!" + range : "" ) +
        "?key=" + apiKey + "&majorDimension=COLUMNS"
    }

    it( "should provide column data", function() {
      httpBackend.whenGET( getHTTP() ).respond( function() {
        return [ 200, successColumnsData, {} ];
      } );

      googleSheetService.getColumnsData( "public", apiKey, "Worksheet 1" )
        .then( function( columns ) {
          expect( columns ).be.defined;
          expect( columns.length ).to.equal( 4 );

          expect( columns[ 0 ] ).to.have.property( "id" );
          expect( columns[ 0 ].id ).to.equal( 0 );
          expect( columns[ 0 ] ).to.have.property( "name" );
          expect( columns[ 0 ].name ).to.equal( "A" );

          // test to ensure null is provided when request same as previous successful request
          googleSheetService.getColumnsData( "public", apiKey, "Worksheet 1" )
            .then( function( columns ) {
              expect( columns ).to.be.null;
            } );

        } );

      httpBackend.flush();

    } );

    it( "should provide column data based on range", function() {
      httpBackend.whenGET( getHTTP( "B1:C2" ) ).respond( function() {
        return [ 200, successColumnsRangeData, {} ];
      } );

      googleSheetService.getColumnsData( "public", apiKey, "Worksheet 1", "B1:C2" ).then( function( columns ) {
        expect( columns ).be.defined;
        expect( columns.length ).to.equal( 2 );

        expect( columns[ 0 ].id ).to.equal( 0 );
        expect( columns[ 0 ].name ).to.equal( "B" );

        expect( columns[ 1 ].id ).to.equal( 1 );
        expect( columns[ 1 ].name ).to.equal( "C" );
      } );

      httpBackend.flush();
    } );

    it( "should provide an error", function() {
      httpBackend.whenGET( getHTTP() ).respond( function() {
        return [ 400, errorResponse, {} ];
      } );

      googleSheetService.getColumnsData( "public", apiKey, "Worksheet 1" )
        .then( null, function( error ) {
          expect( error ).be.defined;
          expect( error ).to.deep.equal( errorResponse.error );
        } );

      httpBackend.flush();
    } );
  } );

} );
