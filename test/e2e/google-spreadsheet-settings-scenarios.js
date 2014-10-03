/* jshint expr: true */

(function () {
  "use strict";

  /* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");

  chai.use(chaiAsPromised);
  var expect = chai.expect;

  browser.driver.manage().window().setSize(1024, 768);

  describe("Google Spreadsheet Settings - e2e Testing", function() {
    beforeEach(function () {
      browser.get("/src/settings-e2e.html");
    });

    it("Should load all components", function () {
      // google drive picker component
      expect(element(by.css(".btn-google-drive")).isPresent()).
        to.eventually.be.true;

      // spreadsheet controls component
      expect(element(by.id("spreadsheet-controls")).isPresent()).
        to.eventually.be.true;

      // column selector component
      expect(element(by.id("column-selector")).isPresent()).
        to.eventually.be.true;

      // scroll setting component
      expect(element(by.id("scroll-by")).isPresent()).
        to.eventually.be.true;

      // table setting component
      expect(element(by.id("row-padding")).isPresent()).
        to.eventually.be.true;

    });

    it("Should correctly load default settings", function () {
      // spreadsheet controls don't show as there is no spreadsheet chosen
      expect(element(by.id("spreadsheet-controls")).isDisplayed()).
        to.eventually.be.false;

      // column selector has no options (other than internal default)
      expect(element.all(by.css("#column-selector option")).count()).
        to.eventually.equal(1);

      //scroll disabled
      expect(element(by.id("scroll-by")).getAttribute("value")).
        to.eventually.equal("none");

    });

    it("Should show invalid form", function () {
      expect(element(by.css("form[name=settingsForm].ng-invalid")).isPresent()).
        to.eventually.be.true;

      expect(element(by.css("form[name=settingsForm].ng-valid")).isPresent()).
        to.eventually.be.false;

      // the only validation error is associated with spreadsheet controls and is a "required" validation
      // should initially show
      expect(element(by.css(".text-danger")).isDisplayed()).
        to.eventually.be.true;

      // save button should be disabled
      expect(element(by.css("button#save[disabled=disabled")).isPresent()).
        to.eventually.be.true;
    });

    it("Should show and populate controls and column selector by selecting a published file", function () {
      // open dialog
      element(by.css(".btn-google-drive")).click();

      // simulate picking a file
      browser.executeScript(function () {
        window.pickFiles([{
          id: "published",
          name: "Rise Training Spreadsheet Example",
          url: "https://test-published/"
        }]);
      });

      // spreadsheet controls should show
      expect(element(by.id("spreadsheet-controls")).isDisplayed()).
        to.eventually.not.be.null;

      // spreadsheet document hyperlink should show
      expect(element(by.id("spreadsheet")).isDisplayed()).
        to.eventually.be.true;

      // spreadsheet hyperlink href value should be the published one
      expect(element(by.css("#spreadsheet a")).getAttribute("href")).
        to.eventually.equal("https://test-published/");

      // column selector has 3 options (4 counting internal default)
      expect(element.all(by.css("#column-selector option")).count()).
        to.eventually.equal(4);

    });

    it("Should show valid form", function () {
      // open dialog
      element(by.css(".btn-google-drive")).click();

      // simulate picking a file
      browser.executeScript(function () {
        window.pickFiles([{
          id: "published",
          name: "Rise Training Spreadsheet Example",
          url: "https://test-published/"
        }]);
      });

      expect(element(by.css("form[name=settingsForm].ng-invalid")).isPresent()).
        to.eventually.be.false;

      expect(element(by.css("form[name=settingsForm].ng-valid")).isPresent()).
        to.eventually.be.true;

      // the only validation error is associated with spreadsheet controls and is a "required" validation
      // should initially show
      expect(element(by.css(".text-danger")).isDisplayed()).
        to.eventually.be.false;

      // save button should be enabled
      expect(element(by.css("button#save[disabled=disabled")).isPresent()).
        to.eventually.be.false;
    });

    it("Should correctly save settings", function (done) {
      var settings = {
        params: {},
        additionalParams: {
          "spreadsheet": {
            "fileId":"published",
            "url":"https://test=published&sheet=test1&headers=-1",
            "sheetIndex":0,
            "cells":"sheet",
            "range":"",
            "headerRow":"-1",
            "refresh":"60",
            "docName":"Test File",
            "docURL":"https://test-published"
          },
          "columns": [],
          "scroll": {
            "by":"none",
            "speed":"medium",
            "pause":5
          },
          "table": {
            "colHeaderFont": {
              "font": {
                "family":"Verdana"
              },
              "size":"20",
              "bold":false,
              "italic":false,
              "underline":false,
              "color":"black",
              "highlightColor":"transparent",
              "align":"left"
            },
            "dataFont": {
              "font": {
                "family":"Verdana"
              },
              "size":"20",
              "bold":false,
              "italic":false,
              "underline":false,
              "color":"black",
              "highlightColor":"transparent",
              "align":"left"
            },
            "rowColor":"transparent",
            "altRowColor":"transparent",
            "rowPadding":"0"
          },
          "background": {
            "color": "transparent"
          }
        }
      };

      // open dialog
      element(by.css(".btn-google-drive")).click();

      // simulate picking a file
      browser.executeScript(function () {
        window.pickFiles([{
          id: "published",
          name: "Test File",
          url: "https://test-published"
        }]);
      });

      element(by.id("save")).click();

      expect(browser.executeScript("return window.result")).to.eventually.deep.equal(
        {
          'additionalParams': JSON.stringify(settings.additionalParams),
          'params': '?'
        });
    });

  });

})();
