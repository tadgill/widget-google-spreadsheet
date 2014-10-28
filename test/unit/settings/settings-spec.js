/*jshint expr:true */
"use strict";

describe("Google Spreadsheet Settings", function () {

  var defaultSettings, $scope;

  beforeEach(module("risevision.widget.googleSpreadsheet.settings"));

  beforeEach(function(){
    inject(function($injector, $rootScope, $controller){
      defaultSettings = $injector.get("defaultSettings");
      $scope = $rootScope.$new();
      $controller("spreadsheetSettingsController", {$scope: $scope});
    });
  });

  it("should define defaultSettings", function (){
    expect(defaultSettings).to.be.truely;
    expect(defaultSettings).to.be.an("object");
  });

  it("should define spreadsheetSettingsController", function (){
    expect($scope.currentSheetColumn).to.be.truely;
    expect($scope.currentSheetColumn).to.be.null;
    expect($scope.sheetColumns).to.be.truely;
    expect($scope.sheetColumns).to.have.length(0);
    expect($scope.getColumns).to.be.a("function");
  });

});
