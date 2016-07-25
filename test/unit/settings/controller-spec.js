/*jshint expr:true */
"use strict";

describe("Google Spreadsheet Settings", function () {
  var googleSheetService, base, apiKey, httpBackend, defaultSettings, scope, rootScope, ctrl,requestToSheet,
    successData = {
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



  beforeEach(module("risevision.widget.googleSpreadsheet.settings"));

  beforeEach(module(function ($provide) {
    $provide.service('googleSheet',function(){
      return {
        getWorkSheets: function(fileId, apiKey) {
          var deferred = Q.defer();
          if(requestToSheet){
            deferred.resolve();
          }else{
            deferred.reject();
          }
          return deferred.promise;
        }
      }
    });
  }));

  beforeEach(inject(function (_googleSheet_, _SHEETS_API_, _API_KEY_, $httpBackend) {
    googleSheetService = _googleSheet_;
    base = _SHEETS_API_;
    apiKey = _API_KEY_;
    httpBackend = $httpBackend;
  }));

  beforeEach(inject(function($injector, $rootScope, $controller) {
    defaultSettings = $injector.get("defaultSettings");
    scope = $rootScope.$new();
    rootScope = $rootScope;
    ctrl = $controller("spreadsheetSettingsController", {
      $scope: scope,
      googleSheet: $injector.get('googleSheet')
    });

    scope.settingsForm = {
      $setValidity: function () {
        return;
      }
    };

    scope.settings = {
      params: defaultSettings.params,
      additionalParams: defaultSettings.additionalParams
    };
  }));

  it("should define defaultSettings", function (){
    expect(defaultSettings).to.be.truely;
    expect(defaultSettings).to.be.an("object");
  });

  it("should call window open with url when previewing", function (){
    var windowSpy = sinon.spy(window, "open");
    scope.settings.additionalParams.spreadsheet.url = "testUrl";
    scope.previewFile();
    expect(windowSpy).to.have.been.calledWith("testUrl", "_blank");
  });

  it("should set spreadsheet data when picked event is fired", function (){
    var expectedData = {name: "testSpreadSheet", url: "testUrl", id: "testId"};
    rootScope.$broadcast('picked', [expectedData]);
    expect(scope.settings.additionalParams.spreadsheet.docName).to.be.equal(expectedData.name);
    expect(scope.settings.additionalParams.spreadsheet.url).to.be.equal(expectedData.url);
    expect(scope.settings.additionalParams.spreadsheet.fileId).to.be.equal(expectedData.id);
  });

  it("should clear spreadsheet URL selection", function () {
    scope.clearSelection();

    expect(scope.settings.additionalParams.spreadsheet.docName).to.be.equal("");
    expect(scope.settings.additionalParams.spreadsheet.url).to.be.equal("");
    expect(scope.settings.additionalParams.spreadsheet.fileId).to.be.equal("");
  });

  it("should clear spreadsheet key selection", function () {
    scope.settings.additionalParams.spreadsheet.url = "testUrl";
    scope.settings.additionalParams.spreadsheet.fileId = "testId";

    scope.clearSelection();

    expect(scope.settings.additionalParams.spreadsheet.url).to.be.equal("");
    expect(scope.settings.additionalParams.spreadsheet.fileId).to.be.equal("");
  });

  it("should update url when fileId is changed", function () {

    scope.settings.additionalParams.spreadsheet.selection = "key";
    scope.$apply('settings.additionalParams.spreadsheet.fileId="testId"');

    expect(scope.settings.additionalParams.spreadsheet.url).to.be.equal("https://docs.google.com/spreadsheets/d/testId/edit#gid=0");
  });

  describe("Api Key", function () {

    it("should set valid api key to false", function (done) {

      requestToSheet = false;

      scope.settings.additionalParams.spreadsheet.fileId="testId";
      scope.settings.additionalParams.spreadsheet.apiKey = "notValid";
      scope.apiKeyBlur();

      scope.$digest();

      setTimeout(function(){
        expect(scope.validApiKey).to.be.false;
        done();
      },10);
    });

    it("should set valid api key to true", function (done) {

      requestToSheet = true;

      scope.settings.additionalParams.spreadsheet.fileId="testId";
      scope.settings.additionalParams.spreadsheet.apiKey = "valid";
      scope.apiKeyBlur();

      scope.$digest();

      setTimeout(function(){
        expect(scope.validApiKey).to.be.true;
        done();
      },10);
    });
  });
});
