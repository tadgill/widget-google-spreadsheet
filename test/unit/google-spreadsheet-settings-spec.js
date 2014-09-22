/*jshint expr:true */
"use strict";

describe("Services: columns settings", function () {

  var vizApi, columnsService;

  beforeEach(module("risevision.widget.googleSpreadsheet.settings"));

  beforeEach(inject(function (_visualizationApi_, _columnsService_) {
    vizApi = _visualizationApi_;
    columnsService = _columnsService_;

  }));

  it("visualization api should exist", function () {
    expect(vizApi).be.defined;
    expect(vizApi.get).be.defined;
  });

  it("columns service should exist", function () {
    expect(columnsService).be.defined;
    expect(columnsService.getColumns).be.defined;
  });

});
