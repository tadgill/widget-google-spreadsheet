/*jshint expr:true */
"use strict";

describe("getWorkSheets", function() {

  var googleSheetService, base, suffix, httpBackend;

  var successData = {
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

  it("should exist", function() {
    expect(googleSheetService).be.defined;
  });

  it("should successfully provide work sheets as select field options", function () {
    function getHTTP(key) {
      return base + key + suffix + "?alt=json";
    }

    httpBackend.whenGET(getHTTP("published")).respond(function () {
      return [200, successData, {}];
    });

    googleSheetService.getWorkSheets("published").then(function (results) {
      expect(results).be.defined;
      expect(results.length).to.equal(2);

      expect(results[0]).to.deep.equal({
        "label": "Worksheet 1",
        "value": 1
      });

      expect(results[1]).to.deep.equal({
        "label": "Worksheet 2",
        "value": 2
      });

    });

    httpBackend.flush();
  });


});
