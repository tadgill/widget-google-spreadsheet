/*jshint expr:true */
"use strict";

describe("Google Spreadsheet Settings", function () {

  var defaultSettings, scope, ctrl;

  beforeEach(module("risevision.widget.googleSpreadsheet.settings"));

  beforeEach(inject(function($injector, $rootScope, $controller) {
    defaultSettings = $injector.get("defaultSettings");
    scope = $rootScope.$new();
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

});
