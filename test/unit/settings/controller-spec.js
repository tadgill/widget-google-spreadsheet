/*jshint expr:true */
"use strict";

describe("Google Spreadsheet Settings", function () {
  var googleSheetService, base, suffix, httpBackend, defaultSettings, scope, rootScope, ctrl,
    successData = {
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
          }
        ]
      }
    };

  beforeEach(module("risevision.widget.googleSpreadsheet.settings"));

  beforeEach(inject(function (_googleSheet_, _SPREADSHEET_API_WORKSHEETS_, _SPREADSHEET_API_SUFFIX_, $httpBackend) {
    googleSheetService = _googleSheet_;
    base = _SPREADSHEET_API_WORKSHEETS_;
    suffix = _SPREADSHEET_API_SUFFIX_;
    httpBackend = $httpBackend;
  }));

  beforeEach(inject(function($injector, $rootScope, $controller) {
    defaultSettings = $injector.get("defaultSettings");
    scope = $rootScope.$new();
    rootScope = $rootScope;
    ctrl = $controller("spreadsheetSettingsController", {
      $scope: scope
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
    httpBackend.when("GET", "https://spreadsheets.google.com/feeds/worksheets/testId/public/basic?alt=json")
      .respond(function () {
        return [200, successData, {}];
      });

    scope.settings.additionalParams.spreadsheet.selection = "key";
    scope.$apply('settings.additionalParams.spreadsheet.fileId="testId"');

    expect(scope.settings.additionalParams.spreadsheet.url).to.be.equal("https://docs.google.com/spreadsheets/d/testId/edit#gid=0");
  });
});
