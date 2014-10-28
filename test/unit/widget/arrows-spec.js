/*jshint expr:true */
"use strict";

describe("Google Spreadsheet Widget: arrows module", function() {

  it("should exist", function() {
    expect(RiseVision.Spreadsheet.Arrows).to.be.truely;
    expect(RiseVision.Spreadsheet.Arrows).to.be.an("object");
    expect(RiseVision.Spreadsheet.Arrows.load).to.be.a("function");
  });

  it("should load arrows", function(done) {
    assert.doesNotThrow(function() {
      RiseVision.Spreadsheet.Arrows.load(function() {
        done();
      });
    });
  });

});
