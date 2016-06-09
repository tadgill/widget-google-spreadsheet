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

    describe("Initialization", function () {
      it("Should load Save button", function () {
        expect(element(by.css("button#save")).isPresent()).to.eventually.be.true;
      });

      it("Should load Cancel button", function () {
        expect(element(by.css("button#cancel")).isPresent()).to.eventually.be.true;
      });

      it("Should load Row Color Picker components", function () {
        expect(element(by.model("settings.additionalParams.format.oddRowColor")).isDisplayed()).to.eventually.be.true;
        expect(element(by.model("settings.additionalParams.format.evenRowColor")).isDisplayed()).to.eventually.be.true;
      });

      it("Should load scroll component", function () {
        expect(element(by.id("scroll-by")).isPresent()).to.eventually.be.true;
      });

      it("Should load Separator Color Picker component", function () {
        expect(element(by.model("settings.additionalParams.format.separator.color")).isDisplayed()).to.eventually.be.true;
      });
    });

    describe("Defaults", function () {

      it("Should load drive picker button", function () {
        expect(element(by.css(".google-drive-picker")).isPresent()).to.eventually.be.true;
      });

      it("Should select 'Show Entire Sheet'", function () {
        expect(element(by.css("input[type='radio'][value='sheet']")).isSelected()).to.eventually.be.true;
      });

      it("Should show Select worksheet dropbox", function () {
        expect(element(by.css("select#sheet")).isPresent()).to.eventually.be.true;
      });

      it("Should show first row as header checkbox unchecked", function () {
        expect(element(by.model("settings.additionalParams.spreadsheet.hasHeader")).isSelected()).to.eventually.be.false;
      });

      it("Should show refresh interval input default to 5 minutes", function () {
        expect(element(by.model("settings.additionalParams.spreadsheet.refresh")).getAttribute('value')).to.eventually.equal("5");
      });

      it("Should apply form as invalid due to no spreadsheet doc name", function () {
        expect(element(by.css("form[name='settingsForm'].ng-invalid")).isPresent()).to.eventually.be.true;
      });

      it("Should disable Save button", function () {
        expect(element(by.css("button#save[disabled=disabled")).isPresent()).to.eventually.be.true;
      });

      it("Should not show publishing instructions", function () {
        expect(element(by.css("div.content-box div.bg-danger")).isPresent()).to.eventually.be.false;
        expect(element(by.css("div.bg-danger a.btn")).isPresent()).to.eventually.be.false;
      });

      it("Should show row height input default to 50 pixels", function () {
        expect(element(by.model("settings.additionalParams.format.rowHeight")).getAttribute('value')).to.eventually.equal("50");
      });

      it("Should set default for even row color", function () {
        expect(element(by.model("settings.additionalParams.format.evenRowColor")).getAttribute("value")).to.eventually.equal("rgba(255, 255, 255, 0)");
      });

      it("Should set default for odd row color", function () {
        expect(element(by.model("settings.additionalParams.format.oddRowColor")).getAttribute("value")).to.eventually.equal("rgba(255, 255, 255, 0)");
      });

      it("Should not show Header Font Setting component", function () {
        expect(element(by.css("#header-font .font-setting")).isPresent()).to.eventually.be.false;
      });

      it("Should show Body font setting component", function () {
        expect(element(by.css("#body-font .font-setting")).isPresent()).to.eventually.be.true;
      });

      it("Should not scroll by default", function () {
        expect(element(by.id("scroll-by")).getAttribute("value")).to.eventually.equal("none");
      });

      it("Should select 'Show Separator'", function () {
        expect(element(by.model("settings.additionalParams.format.separator.show")).isSelected()).to.eventually.be.true;
      });

      it("Should set default for Separator size", function () {
        expect(element(by.model("settings.additionalParams.format.separator.size")).getAttribute("value")).to.eventually.equal("1");
      });

      it("Should set default for Separator color", function () {
        expect(element(by.model("settings.additionalParams.format.separator.color")).getAttribute("value")).to.eventually.equal("rgba(238,238,238, 1)");
      });

    });

    describe("Visibility", function() {
      it("Should not show file name and preview button", function() {
        expect(element(by.css(".preview")).isPresent()).to.eventually.be.false;
      });

      it("Should hide spreadsheet URL field when 'Enter Spreadsheet Key' button is clicked", function() {
        element(by.id("spreadsheet-key")).click();

        expect(element(by.model("settings.additionalParams.spreadsheet.docName")).isPresent()).to.eventually.be.false;
      });

      it("Should show spreadsheet key field when 'Enter Spreadsheet Key' button is clicked", function() {
        element(by.id("spreadsheet-key")).click();

        expect(element(by.model("settings.additionalParams.spreadsheet.fileId")).isDisplayed()).to.eventually.be.true;
      });

      it("Should show spreadsheet URL field when 'Select Spreadsheet' button is clicked", function() {
        element(by.id("google-drive")).click();

        browser.executeScript(function () {
          window.pickFiles([{
            id: "not-published",
            name: "Test File",
            url: "https://test-not-published"
          }]);
        });

        expect(element(by.model("settings.additionalParams.spreadsheet.docName")).isDisplayed()).to.eventually.be.true;
      });

      it("Should hide spreadsheet key field when 'Select Spreadsheet' button is clicked", function() {
        element(by.id("google-drive")).click();

        browser.executeScript(function () {
          window.pickFiles([{
            id: "not-published",
            name: "Test File",
            url: "https://test-not-published"
          }]);
        });

        expect(element(by.model("settings.additionalParams.spreadsheet.fileId")).isPresent()).to.eventually.be.false;
      });

      it("Should not show starting or ending range cell inputs if 'Show Entire Sheet' is selected", function () {
        expect(element(by.model("settings.additionalParams.spreadsheet.range.startCell")).isPresent()).to.eventually.be.false;
        expect(element(by.model("settings.additionalParams.spreadsheet.range.endCell")).isPresent()).to.eventually.be.false;
      });

      it("Should show range input settings if 'Show Range' is selected", function() {
        element(by.css("input[type='radio'][value='range']")).click();

        expect(element(by.model("settings.additionalParams.spreadsheet.range.startCell")).isDisplayed()).to.eventually.be.true;
        expect(element(by.model("settings.additionalParams.spreadsheet.range.endCell")).isDisplayed()).to.eventually.be.true;
      });

      it("Should show Header font formatting if 'Use First Row as Header' selected", function () {
        element(by.model("settings.additionalParams.spreadsheet.hasHeader")).click();

        expect(element(by.css("#header-font .font-setting")).isPresent()).to.eventually.be.true;
      });

      it("Should not display size and color selections for Separator", function () {
        element(by.model("settings.additionalParams.format.separator.show")).click();
        expect(element(by.model("settings.additionalParams.format.separator.size")).isPresent()).to.eventually.be.false;
        expect(element(by.model("settings.additionalParams.format.separator.color")).isPresent()).to.eventually.be.false;
      });

    });

    describe("Spreadsheet Publishing", function () {

      it("Should show instructions, retry button, and disable Save when spreadsheet not published", function () {
        // open dialog
        element(by.css(".google-drive-picker button")).click();

        // simulate picking a file
        browser.executeScript(function () {
          window.pickFiles([{
            id: "not-published",
            name: "Test File",
            url: "https://test-not-published"
          }]);
        });

        expect(element(by.css("div.content-box div.bg-danger")).isDisplayed()).to.eventually.be.true;
        expect(element(by.css("div.bg-danger a.btn")).isDisplayed()).to.eventually.be.true;
        expect(element(by.css("button#save[disabled=disabled")).isPresent()).to.eventually.be.true;

      });

      it("Should not show instructions when clear selection clicked", function () {
        // open dialog
        element(by.css(".google-drive-picker button")).click();

        // simulate picking a file
        browser.executeScript(function () {
          window.pickFiles([{
            id: "not-published",
            name: "Test File",
            url: "https://test-not-published"
          }]);
        });

        expect(element(by.css("div.content-box div.bg-danger")).isDisplayed()).to.eventually.be.true;
        expect(element(by.css("div.bg-danger a.btn")).isDisplayed()).to.eventually.be.true;

        element(by.css("div.clear-selection span")).click();

        expect(element(by.css("div.content-box div.bg-danger")).isPresent()).to.eventually.be.false;
        expect(element(by.css("div.bg-danger a.btn")).isPresent()).to.eventually.be.false;
      });

      it("Should not show instructions and enable Save when spreadsheet is published", function () {
        // open dialog
        element(by.css(".google-drive-picker button")).click();

        // simulate picking a file
        browser.executeScript(function () {
          window.pickFiles([{
            id: "published",
            name: "Test File",
            url: "https://test-published"
          }]);
        });

        expect(element(by.css("div.content-box div.bg-danger")).isPresent()).to.eventually.be.false;
        expect(element(by.css("div.bg-danger a.btn")).isPresent()).to.eventually.be.false;
        expect(element(by.css("button#save[disabled=disabled")).isPresent()).to.eventually.be.false;

        expect(element(by.model("currentSheet")).$('option:checked').getText()).to.eventually.equal("Worksheet 1");

      });

    });

    describe("Sheet Selection", function () {

      it("Should select the first sheet when file is loaded", function () {
        // open dialog
        element(by.css(".google-drive-picker button")).click();

        // simulate picking a file
        browser.executeScript(function () {
          window.pickFiles([{
            id: "published",
            name: "Test File",
            url: "https://test-published"
          }]);
        });

        expect(element(by.model("currentSheet")).$('option:checked').getText()).to.eventually.equal("Worksheet 1");

      });
    });

    describe("Saving", function () {

      it("Should correctly save settings", function () {
        var settings = {
          params: {},
          additionalParams: {
            format: {
              body: {
                fontStyle:{
                  font:{
                    family:"tahoma,arial,helvetica,sans-serif",
                    type:"standard",
                    url:""
                  },
                  size:"18px",
                  customSize:"",
                  align:"left",
                  verticalAlign: "middle",
                  bold:false,
                  italic:false,
                  underline:false,
                  forecolor:"black",
                  backcolor:"transparent"
                }
              },
              columns: [],
              evenRowColor: "rgba(255, 255, 255, 0)",
              header: {
                fontStyle:{
                  font:{
                    family:"tahoma,arial,helvetica,sans-serif",
                    type:"standard",
                    url:""
                  },
                  size:"18px",
                  customSize:"",
                  align:"left",
                  verticalAlign: "middle",
                  bold:false,
                  italic:false,
                  underline:false,
                  forecolor:"black",
                  backcolor:"transparent"
                }
              },
              oddRowColor: "rgba(255, 255, 255, 0)",
              rowHeight: 50,
              separator: {
                color: "rgba(238,238,238, 1)",
                show: true,
                size: 1
              }
            },
            scroll: {
              by: "none",
              direction: "up",
              speed: "medium",
              pause: 5,
              pud: 10
            },
            spreadsheet: {
              selection: "drive",
              docName: "Test File",
              url: "https://test-published",
              fileId: "published",
              cells: "sheet",
              range: {
                startCell: "",
                endCell: ""
              },
              tabId: 1,
              hasHeader: false,
              refresh: 5
            }
          }
        };

        // open dialog
        element(by.css(".google-drive-picker button")).click();

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
            "additionalParams": JSON.stringify(settings.additionalParams),
            "params": ""
          });
      });
    });

  });

})();
