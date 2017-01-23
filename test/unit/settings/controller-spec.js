/* global Q, sinon, describe, beforeEach, it, expect, module, inject */

/* eslint-disable func-names */

"use strict";

describe( "Google Spreadsheet Settings", function() {
  var defaultSettings,
    scope,
    rootScope,
    requestToSheet,
    requestToColumns;

  beforeEach( module( "risevision.widget.googleSpreadsheet.settings" ) );

  beforeEach( module( function( $provide ) {
    $provide.service( "googleSheet", function() {
      return {
        getWorkSheets: function() {
          var deferred = Q.defer();

          if ( requestToSheet ) {
            deferred.resolve();
          } else {
            deferred.reject();
          }
          return deferred.promise;
        },
        getColumnsData: function() {
          var deferred = Q.defer();

          if ( requestToColumns ) {
            deferred.resolve( [
              { id: 0, name: "A" },
              { id: 1, name: "B" },
              { id: 2, name: "C" }
            ] );
          } else {
            deferred.reject();
          }
          return deferred.promise;
        },
        resetColumns: function() {}
      }
    } );
  } ) );

  beforeEach( inject( function( $injector, $rootScope, $controller ) {
    defaultSettings = $injector.get( "defaultSettings" );
    scope = $rootScope.$new();
    rootScope = $rootScope;
    $controller( "spreadsheetSettingsController", {
      $scope: scope,
      googleSheet: $injector.get( "googleSheet" )
    } );

    scope.settingsForm = {
      $setValidity: function() {
        return;
      }
    };

    scope.settings = {
      params: defaultSettings.params,
      additionalParams: defaultSettings.additionalParams
    };
  } ) );

  it( "should define defaultSettings", function() {
    expect( defaultSettings ).to.be.truely;
    expect( defaultSettings ).to.be.an( "object" );
  } );

  it( "should call window open with url when previewing", function() {
    var windowSpy = sinon.spy( window, "open" );

    scope.settings.additionalParams.spreadsheet.url = "testUrl";
    scope.previewFile();
    expect( windowSpy ).to.have.been.calledWith( "testUrl", "_blank" );
  } );

  it( "should set spreadsheet data when picked event is fired", function() {
    var expectedData = { name: "testSpreadSheet", url: "testUrl", id: "testId" };

    rootScope.$broadcast( "picked", [ expectedData ] );
    expect( scope.settings.additionalParams.spreadsheet.docName ).to.be.equal( expectedData.name );
    expect( scope.settings.additionalParams.spreadsheet.url ).to.be.equal( expectedData.url );
    expect( scope.settings.additionalParams.spreadsheet.fileId ).to.be.equal( expectedData.id );
  } );

  it( "should clear spreadsheet URL selection", function() {
    scope.clearSelection();

    expect( scope.settings.additionalParams.spreadsheet.docName ).to.be.equal( "" );
    expect( scope.settings.additionalParams.spreadsheet.url ).to.be.equal( "" );
    expect( scope.settings.additionalParams.spreadsheet.fileId ).to.be.equal( "" );
  } );

  it( "should clear spreadsheet key selection", function() {
    scope.settings.additionalParams.spreadsheet.url = "testUrl";
    scope.settings.additionalParams.spreadsheet.fileId = "testId";

    scope.clearSelection();

    expect( scope.settings.additionalParams.spreadsheet.url ).to.be.equal( "" );
    expect( scope.settings.additionalParams.spreadsheet.fileId ).to.be.equal( "" );
  } );

  it( "should update url when fileId is changed", function() {

    scope.settings.additionalParams.spreadsheet.selection = "key";
    scope.settings.additionalParams.spreadsheet.fileId = "testId";
    scope.fileIdBlur();
    scope.$apply();

    expect( scope.settings.additionalParams.spreadsheet.url ).to.be.equal( "https://docs.google.com/spreadsheets/d/testId/edit#gid=0" );
  } );

  describe( "Api Key", function() {

    it( "should set valid api key to false", function( done ) {

      requestToSheet = false;

      scope.settings.additionalParams.spreadsheet.fileId = "testId";
      scope.settings.additionalParams.spreadsheet.apiKey = "notValid";
      scope.apiKeyBlur();

      scope.$digest();

      setTimeout( function() {
        expect( scope.validApiKey ).to.be.false;
        done();
      }, 10 );
    } );

    it( "should set valid api key to true", function( done ) {

      requestToSheet = true;

      scope.settings.additionalParams.spreadsheet.fileId = "testId";
      scope.settings.additionalParams.spreadsheet.apiKey = "valid";
      scope.apiKeyBlur();

      scope.$digest();

      setTimeout( function() {
        expect( scope.validApiKey ).to.be.true;
        done();
      }, 10 );
    } );
  } );

  describe( "Columns", function() {

    it( "should set columns when sheetName has a value or changes", function( done ) {
      requestToColumns = true;

      scope.settings.additionalParams.spreadsheet.fileId = "testId";
      scope.settings.additionalParams.spreadsheet.sheetName = "Sheet1";

      scope.$digest();

      setTimeout( function() {
        expect( scope.columns.length ).to.equal( 3 );
        done();
      }, 10 );
    } );

    it( "should reset columns and formats when a columns data response error occurs", function( done ) {
      scope.settings.additionalParams.spreadsheet.fileId = "testId";
      scope.columns = [
        { id: 0, name: "A" },
        { id: 1, name: "B", show: true },
        { id: 2, name: "C" }
      ];
      scope.settings.additionalParams.format.columns = [ {
        id: 1, name: "B", show: true, fontStyle: {}
      } ];

      requestToColumns = false;

      scope.settings.additionalParams.spreadsheet.sheetName = "Sheet1";

      scope.$digest();

      setTimeout( function() {
        expect( scope.columns.length ).to.equal( 0 );
        expect( scope.settings.additionalParams.format.columns.length ).to.equal( 0 );
        done();
      }, 10 );
    } );

    it( "should reset columns when spreadsheet selection cleared", function() {
      scope.settings.additionalParams.spreadsheet.fileId = "testId";
      scope.settings.additionalParams.spreadsheet.sheetName = "Sheet1";
      scope.columns = [
        { id: 0, name: "A" },
        { id: 1, name: "B", show: true },
        { id: 2, name: "C" }
      ];
      scope.settings.additionalParams.format.columns = [ {
        id: 1, name: "B", show: true, fontStyle: {}
      } ];

      scope.clearSelection();

      expect( scope.columns.length ).to.equal( 0 );
      expect( scope.settings.additionalParams.format.columns.length ).to.equal( 0 );
    } );

  } );
} );
