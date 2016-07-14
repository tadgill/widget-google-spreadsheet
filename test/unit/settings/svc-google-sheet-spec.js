/*jshint expr:true */
"use strict";

describe("getWorkSheets", function() {

  var googleSheetService, base, apiKey, httpBackend;

  var successData = {
    sheets: [
      {
        properties: {
          title: "Worksheet 1"
        }
      },
      {
        properties: {
          title: "Worksheet 2"
        }
      }
    ]
  };

  beforeEach(module("risevision.widget.googleSpreadsheet.settings"));

  beforeEach(inject(function (_googleSheet_, _SHEETS_API_, _API_KEY_, $httpBackend) {
    googleSheetService = _googleSheet_;
    base = _SHEETS_API_;
    apiKey = _API_KEY_;
    httpBackend = $httpBackend;

  }));

  it("should exist", function() {
    expect(googleSheetService).be.defined;
  });

  it("should successfully provide work sheets as select field options", function () {
    function getHTTP(key) {
      return base + key + "?key=" + apiKey;
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
