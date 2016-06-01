/*jshint expr:true */
"use strict";

describe("getColumns", function () {

  var columns, testUrl = "http://testurl.com";

  beforeEach(module("risevision.widget.googleSpreadsheet.settings"));

  beforeEach(module(function ($provide) {
    $provide.service("$q", function() {return Q;});
  }));

  beforeEach(function(){
    inject(function($injector){
      columns = $injector.get("columns");
    });
  });

  it("should get columns", function (done) {
    return columns.getColumns(testUrl)
      .then(function (columns) {
        expect(columns).to.be.truely;
        expect(columns[0]).to.be.an("object");

        done();
      });
  });

  it("should not return empty columns", function (done) {
    return columns.getColumns(testUrl)
      .then(function (columns) {
        expect(columns).to.have.length(3);

        done();
      });
  });

  it("should set id property", function (done) {
     return columns.getColumns(testUrl)
      .then(function (columns) {
        expect(columns[0]).to.have.property("id");
        expect(columns[0].id).to.equal("A_string_Column 1");

        done();
    });
  });

  it("should set name property", function (done) {
     return columns.getColumns(testUrl)
      .then(function (columns) {
        expect(columns[0]).to.have.property("name");
        expect(columns[0].name).to.equal("Column 1");

        done();
    });
  });

  it("should set type property", function (done) {
     return columns.getColumns(testUrl)
      .then(function (columns) {
        expect(columns[0]).to.have.property("type");
        expect(columns[0].type).to.equal("string");

        done();
    });
  });
});
