/*jshint expr:true */
"use strict";

describe("Google Spreadsheet Settings", function () {

  var defaultSettings, scope, rootScope,ctrl;

  beforeEach(module("risevision.widget.googleSpreadsheet.settings"));

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

  it("should call window open with docURL when previewing", function (){
    var windowSpy = sinon.spy(window, "open");
    scope.settings.additionalParams.spreadsheet.docURL = "testUrl";
    scope.previewFile();
    expect(windowSpy).to.have.been.calledWith("testUrl", "_blank");
  });

  it("should set spreadsheet data when picked event is fired", function (){
    var expectedData = {name: "testSpreadSheet", url: "testUrl", id: "testId"};
    rootScope.$broadcast('picked', [expectedData]);
    expect(scope.settings.additionalParams.spreadsheet.docName).to.be.equal(expectedData.name);
    expect(scope.settings.additionalParams.spreadsheet.docURL).to.be.equal(expectedData.url);
    expect(scope.settings.additionalParams.spreadsheet.fileId).to.be.equal(expectedData.id);
  });

  it("should clean selection", function (){
    scope.clearSelection();

    expect(scope.settings.additionalParams.spreadsheet.docName).to.be.undefined;
    expect(scope.settings.additionalParams.spreadsheet.docURL).to.be.undefined;
    expect(scope.settings.additionalParams.spreadsheet.fileId).to.be.undefined;
  });

});
