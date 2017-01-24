/* global require, browser, describe, beforeEach, it, element, by */

/* eslint-disable func-names */

( function() {
  "use strict";

  /* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

  var chai = require( "chai" ),
    chaiAsPromised = require( "chai-as-promised" ),
    expect;

  chai.use( chaiAsPromised );
  expect = chai.expect;

  browser.driver.manage().window().setSize( 1024, 768 );

  describe( "Google Spreadsheet Settings - e2e Testing", function() {

    beforeEach( function() {
      browser.get( "/src/settings-e2e.html" );
    } );

    describe( "Initialization", function() {
      it( "Should load Save button", function() {
        expect( element( by.css( "button#save" ) ).isPresent() ).to.eventually.be.true;
      } );

      it( "Should load Cancel button", function() {
        expect( element( by.css( "button#cancel" ) ).isPresent() ).to.eventually.be.true;
      } );

      it( "Should load Row Color Picker components", function() {
        expect( element( by.model( "settings.additionalParams.format.oddRowColor" ) ).isDisplayed() ).to.eventually.be.true;
        expect( element( by.model( "settings.additionalParams.format.evenRowColor" ) ).isDisplayed() ).to.eventually.be.true;
      } );

      it( "Should load scroll component", function() {
        expect( element( by.id( "scroll-by" ) ).isPresent() ).to.eventually.be.true;
      } );

      it( "Should load Separator Color Picker component", function() {
        expect( element( by.model( "settings.additionalParams.format.separator.color" ) ).isDisplayed() ).to.eventually.be.true;
      } );
    } );

    describe( "Defaults", function() {

      it( "Should load drive picker button", function() {
        expect( element( by.css( ".google-drive-picker" ) ).isPresent() ).to.eventually.be.true;
      } );

      it( "Should select 'Show Entire Sheet'", function() {
        expect( element( by.css( "input[type='radio'][value='sheet']" ) ).isSelected() ).to.eventually.be.true;
      } );

      it( "Should show Select worksheet dropbox", function() {
        expect( element( by.css( "select#sheet" ) ).isPresent() ).to.eventually.be.true;
      } );

      it( "Should show first row as header checkbox unchecked", function() {
        expect( element( by.model( "settings.additionalParams.spreadsheet.hasHeader" ) ).isSelected() ).to.eventually.be.false;
      } );

      it( "Should show refresh interval input disabled", function() {
        expect( element( by.model( "settings.additionalParams.spreadsheet.refresh" ) ).isEnabled() ).to.eventually.be.false;
      } );

      it( "Should show api key input disabled", function() {
        expect( element( by.model( "settings.additionalParams.spreadsheet.apiKey" ) ).isEnabled() ).to.eventually.be.false;
      } );

      it( "Should apply form as invalid due to no spreadsheet doc name", function() {
        expect( element( by.css( "form[name='settingsForm'].ng-invalid" ) ).isPresent() ).to.eventually.be.true;
      } );

      it( "Should disable Save button", function() {
        expect( element( by.css( "button#save[disabled=disabled" ) ).isPresent() ).to.eventually.be.true;
      } );

      it( "Should not show instructions to make spreadsheet public", function() {
        expect( element( by.css( "div.content-box div.bg-danger" ) ).isPresent() ).to.eventually.be.false;
        expect( element( by.css( "div.bg-danger a.btn" ) ).isPresent() ).to.eventually.be.false;
      } );

      it( "Should show row height input default to 50 pixels", function() {
        expect( element( by.model( "settings.additionalParams.format.rowHeight" ) ).getAttribute( "value" ) ).to.eventually.equal( "50" );
      } );

      it( "Should not show Header Font Setting component", function() {
        expect( element( by.css( "#header-font .font-setting" ) ).isPresent() ).to.eventually.be.false;
      } );

      it( "Should show Body font setting component", function() {
        expect( element( by.css( "#body-font .font-setting" ) ).isPresent() ).to.eventually.be.true;
      } );

      it( "Should not scroll by default", function() {
        expect( element( by.id( "scroll-by" ) ).getAttribute( "value" ) ).to.eventually.equal( "none" );
      } );

      it( "Should select 'Show Separator Between Rows'", function() {
        expect( element( by.model( "settings.additionalParams.format.separator.showRow" ) ).isSelected() ).to.eventually.be.true;
      } );

      it( "Should select 'Show Separator Between Columns'", function() {
        expect( element( by.model( "settings.additionalParams.format.separator.showColumn" ) ).isSelected() ).to.eventually.be.true;
      } );

      it( "Should set default for Separator color", function() {
        expect( element( by.model( "settings.additionalParams.format.separator.color" ) ).getAttribute( "value" ) ).to.eventually.equal( "rgba(238,238,238, 1)" );
      } );

    } );

    describe( "Visibility", function() {
      it( "Should not show file name and preview button", function() {
        expect( element( by.css( ".preview" ) ).isPresent() ).to.eventually.be.false;
      } );

      it( "Should hide spreadsheet URL field when 'Enter Spreadsheet Key' button is clicked", function() {
        element( by.id( "spreadsheet-key" ) ).click();

        expect( element( by.model( "settings.additionalParams.spreadsheet.docName" ) ).isPresent() ).to.eventually.be.false;
      } );

      it( "Should show spreadsheet key field when 'Enter Spreadsheet Key' button is clicked", function() {
        element( by.id( "spreadsheet-key" ) ).click();

        expect( element( by.model( "settings.additionalParams.spreadsheet.fileId" ) ).isDisplayed() ).to.eventually.be.true;
      } );

      it( "Should show spreadsheet URL field when 'Select Spreadsheet' button is clicked", function() {
        element( by.id( "google-drive" ) ).click();

        browser.executeScript( function() {
          window.pickFiles( [ {
            id: "not-public",
            name: "Test File",
            url: "https://test-not-public"
          } ] );
        } );

        expect( element( by.model( "settings.additionalParams.spreadsheet.docName" ) ).isDisplayed() ).to.eventually.be.true;
      } );

      it( "Should hide spreadsheet key field when 'Select Spreadsheet' button is clicked", function() {
        element( by.id( "google-drive" ) ).click();

        browser.executeScript( function() {
          window.pickFiles( [ {
            id: "not-public",
            name: "Test File",
            url: "https://test-not-public"
          } ] );
        } );

        expect( element( by.model( "settings.additionalParams.spreadsheet.fileId" ) ).isPresent() ).to.eventually.be.false;
      } );

      it( "Should not show starting or ending range cell inputs if 'Show Entire Sheet' is selected", function() {
        expect( element( by.model( "settings.additionalParams.spreadsheet.range.startCell" ) ).isPresent() ).to.eventually.be.false;
        expect( element( by.model( "settings.additionalParams.spreadsheet.range.endCell" ) ).isPresent() ).to.eventually.be.false;
      } );

      it( "Should show range input settings if 'Show Range' is selected", function() {
        element( by.css( "input[type='radio'][value='range']" ) ).click();

        expect( element( by.model( "settings.additionalParams.spreadsheet.range.startCell" ) ).isDisplayed() ).to.eventually.be.true;
        expect( element( by.model( "settings.additionalParams.spreadsheet.range.endCell" ) ).isDisplayed() ).to.eventually.be.true;
      } );

      it( "Should show Header font formatting if 'Use First Row as Header' selected", function() {
        element( by.model( "settings.additionalParams.spreadsheet.hasHeader" ) ).click();

        expect( element( by.css( "#header-font .font-setting" ) ).isPresent() ).to.eventually.be.true;
      } );

      it( "Should not display color selection for Separator", function() {
        element( by.model( "settings.additionalParams.format.separator.showRow" ) ).click();
        element( by.model( "settings.additionalParams.format.separator.showColumn" ) ).click();
        expect( element( by.model( "settings.additionalParams.format.separator.color" ) ).isPresent() ).to.eventually.be.false;
      } );

    } );

    describe( "Spreadsheet Publishing", function() {

      it( "Should show instructions, retry button, and disable Save when spreadsheet not public", function() {
        // open dialog
        element( by.css( ".google-drive-picker button" ) ).click();

        // simulate picking a file
        browser.executeScript( function() {
          window.pickFiles( [ {
            id: "not-public",
            name: "Test File",
            url: "https://test-not-public"
          } ] );
        } );

        expect( element( by.css( "div.content-box div.bg-danger" ) ).isDisplayed() ).to.eventually.be.true;
        expect( element( by.css( "div.bg-danger a.btn" ) ).isDisplayed() ).to.eventually.be.true;
        expect( element( by.css( "button#save[disabled=disabled" ) ).isPresent() ).to.eventually.be.true;

      } );

      it( "Should not show instructions when clear selection clicked", function() {
        // open dialog
        element( by.css( ".google-drive-picker button" ) ).click();

        // simulate picking a file
        browser.executeScript( function() {
          window.pickFiles( [ {
            id: "not-public",
            name: "Test File",
            url: "https://test-not-public"
          } ] );
        } );

        expect( element( by.css( "div.content-box div.bg-danger" ) ).isDisplayed() ).to.eventually.be.true;
        expect( element( by.css( "div.bg-danger a.btn" ) ).isDisplayed() ).to.eventually.be.true;

        element( by.css( "div.clear-selection span" ) ).click();

        expect( element( by.css( "div.content-box div.bg-danger" ) ).isPresent() ).to.eventually.be.false;
        expect( element( by.css( "div.bg-danger a.btn" ) ).isPresent() ).to.eventually.be.false;
      } );

      it( "Should not show instructions and enable Save when spreadsheet is public", function() {
        // open dialog
        element( by.css( ".google-drive-picker button" ) ).click();

        // simulate picking a file
        browser.executeScript( function() {
          window.pickFiles( [ {
            id: "public",
            name: "Test File",
            url: "https://test-public"
          } ] );
        } );

        expect( element( by.css( "div.content-box div.bg-danger" ) ).isPresent() ).to.eventually.be.false;
        expect( element( by.css( "div.bg-danger a.btn" ) ).isPresent() ).to.eventually.be.false;
        expect( element( by.css( "button#save[disabled=disabled" ) ).isPresent() ).to.eventually.be.false;

        expect( element( by.model( "currentSheet" ) ).$( "option:checked" ).getText() ).to.eventually.equal( "Worksheet 1" );

      } );

    } );

    describe( "Sheet Selection", function() {

      it( "Should select the first sheet when file is loaded", function() {
        // open dialog
        element( by.css( ".google-drive-picker button" ) ).click();

        // simulate picking a file
        browser.executeScript( function() {
          window.pickFiles( [ {
            id: "public",
            name: "Test File",
            url: "https://test-public"
          } ] );
        } );

        expect( element( by.model( "currentSheet" ) ).$( "option:checked" ).getText() ).to.eventually.equal( "Worksheet 1" );

      } );
    } );

    describe( "Api Key", function() {

      beforeEach( function() {
        // open dialog
        element( by.css( ".google-drive-picker button" ) ).click();

        // simulate picking a file
        browser.executeScript( function() {
          window.pickFiles( [ {
            id: "public",
            name: "Test File",
            url: "https://test-public"
          } ] );
        } );
      } );

      it( "Should disable refresh interval field if a non valid api key is entered", function() {
        element( by.model( "settings.additionalParams.spreadsheet.apiKey" ) ).sendKeys( "non valid key" );
        element( by.model( "settings.additionalParams.spreadsheet.refresh" ) ).click();

        expect( element( by.model( "settings.additionalParams.spreadsheet.refresh" ) ).isEnabled() ).to.eventually.be.false;
        expect( element( by.css( "button#save[disabled=disabled" ) ).isPresent() ).to.eventually.be.true;

      } );

      it( "Should disable API Key when clearing out the file selection", function() {
        element( by.css( ".fa-times-circle" ) ).click();

        expect( element( by.model( "settings.additionalParams.spreadsheet.refresh" ) ).isEnabled() ).to.eventually.be.false;
        expect( element( by.model( "settings.additionalParams.spreadsheet.apiKey" ) ).isEnabled() ).to.eventually.be.false;
      } );

    } );

    describe( "Invalid Range", function() {

      it( "Should show message when range values resulted in a failed columns data request", function() {
        // open dialog
        element( by.css( ".google-drive-picker button" ) ).click();

        // simulate picking a file
        browser.executeScript( function() {
          window.pickFiles( [ {
            id: "public",
            name: "Test File",
            url: "https://test-public"
          } ] );
        } );

        expect( element( by.css( "div.content-box div.bg-danger" ) ).isPresent() ).to.eventually.be.false;

        element( by.css( "input[type='radio'][value='range']" ) ).click();

        element( by.css( "input[name='startCell']" ) ).sendKeys( "abc" );
        element( by.css( "input[name='endCell']" ) ).sendKeys( "abc" );

        // arbitrary click to lose focus from end cell
        element( by.css( ".modal-body > h4" ) ).click();

        expect( element( by.css( "div.content-box div.bg-danger" ) ).isDisplayed() ).to.eventually.be.true;
      } );

    } );

    describe( "Saving", function() {

      it( "Should correctly save settings", function() {
        var settings = {
          params: {},
          additionalParams: {
            format: {
              body: {
                fontStyle: {
                  font: {
                    family: "tahoma,arial,helvetica,sans-serif",
                    type: "standard",
                    url: ""
                  },
                  size: "18px",
                  customSize: "",
                  align: "left",
                  verticalAlign: "middle",
                  bold: false,
                  italic: false,
                  underline: false,
                  forecolor: "black",
                  backcolor: "transparent"
                }
              },
              columns: [],
              evenRowColor: "rgba(0,0,0,0)",
              header: {
                fontStyle: {
                  font: {
                    family: "tahoma,arial,helvetica,sans-serif",
                    type: "standard",
                    url: ""
                  },
                  size: "18px",
                  customSize: "",
                  align: "left",
                  verticalAlign: "middle",
                  bold: false,
                  italic: false,
                  underline: false,
                  forecolor: "black",
                  backcolor: "transparent"
                }
              },
              oddRowColor: "rgba(0,0,0,0)",
              rowHeight: 50,
              separator: {
                color: "rgba(238,238,238, 1)",
                showColumn: true,
                showRow: true
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
              url: "https://test-public",
              fileId: "public",
              cells: "sheet",
              range: {
                startCell: "",
                endCell: ""
              },
              sheetName: "Worksheet 1",
              hasHeader: false,
              refresh: 60,
              "apiKey": ""
            }
          }
        };

        // open dialog
        element( by.css( ".google-drive-picker button" ) ).click();

        // simulate picking a file
        browser.executeScript( function() {
          window.pickFiles( [ {
            id: "public",
            name: "Test File",
            url: "https://test-public"
          } ] );
        } );

        element( by.id( "save" ) ).click();

        expect( browser.executeScript( "return window.result" ) ).to.eventually.deep.equal(
          {
            "additionalParams": JSON.stringify( settings.additionalParams ),
            "params": ""
          } );
      } );
    } );

  } );

} )();
