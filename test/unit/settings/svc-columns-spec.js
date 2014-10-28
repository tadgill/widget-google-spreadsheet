/*jshint expr:true */
"use strict";

describe("Google Spreadsheet Settings: columnsService", function () {

  var columnsService, testUrl = "http://testurl.com";

  beforeEach(module("risevision.widget.googleSpreadsheet.settings"));

  beforeEach(module(function ($provide) {
    $provide.service("$q", function() {return Q;});

  }));

  beforeEach(function(){
    inject(function($injector){
      columnsService = $injector.get("columnsService");
    });
  });

  it("should exist", function () {
    expect(columnsService).to.be.truely;
    expect(columnsService).to.be.an("object");
    expect(columnsService.getColumns).to.be.a("function");
  });

  describe("get columns", function () {

    it("should retrieve columns using worksheet url", function (done) {
      return columnsService.getColumns(testUrl)
        .then(function (columns) {
          expect(columns).to.be.truely;
          expect(columns).to.have.length.above(0);

          for(var i = 0; i < columns.length; i += 1){
            expect(columns[i]).to.be.an("object");
            expect(columns[i]).to.be.truely;
          }

          done();
        })
        .then(null, done);
    });

    it("should not include empty columns from visualization data", function (done) {
      return columnsService.getColumns(testUrl)
        .then(function (columns) {
          // mock data actually has 4 columns but with empty cells, hence the returned columns should be 3
          expect(columns).to.have.length(3);

          done();
        })
        .then(null, done);
    });

    it("should create a unique id value for a column", function (done) {
      return columnsService.getColumns(testUrl)
        .then(function (columns) {
          expect(columns[0].id).to.equal("A_string_Column 1");

          done();
        })
        .then(null, done);
    });

  });


});
