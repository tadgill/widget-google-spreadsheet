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

      expect(element(by.css("form[name=settingsform].ng-valid")).isPresent()).
        to.eventually.be.false;

      // the only validation error is associated with spreadsheet controls and is a "required" validation
      // should initially show
      expect(element(by.css(".text-danger")).isDisplayed()).
        to.eventually.be.true;

      // save button should be disabled
      expect(element(by.css("button#save[disabled=disabled")).isPresent()).
        to.eventually.be.true;
    });

    //TODO: Provide fake data and use mock visualization api to test saving and restoring settings


  });

})();
