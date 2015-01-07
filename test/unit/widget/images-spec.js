/*jshint expr:true */
"use strict";

describe("Google Spreadsheet Widget: images module", function() {

  it("should exist", function() {
    expect(RiseVision.Spreadsheet.Images).to.be.truely;
    expect(RiseVision.Spreadsheet.Images).to.be.an("object");
    expect(RiseVision.Spreadsheet.Images.load).to.be.a("function");
  });

  it("should process images", function(done) {
    assert.doesNotThrow(function() {

      var images = [{url: "image1.jpg", $cell: ""}, {url: "image2.jpg", $cell: ""}];

      RiseVision.Spreadsheet.Images.load(images, function() {
        done();
      });
    });
  });

});
