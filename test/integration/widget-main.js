var system = require("system");
var e2ePort = system.env.E2E_PORT || 8099;
var url = "http://localhost:"+e2ePort+"/src/widget-e2e.html";

casper.on("remote.message", function(msg) {
  this.echo(msg);
});

casper.test.begin("Integration Testing", {
  setUp: function(test) {
    casper.options.clientScripts = [
      "test/data/sheet-data.js"
    ];
  },

  test: function(test) {
    casper.start();

    casper.thenOpen(url, function() {
      test.assertTitle("Google Spreadsheet Widget", "Test page has loaded");
    });

    casper.then(function() {
      casper.waitFor(function waitForUI() {
        return this.evaluate(function loadData() {
          return document.querySelectorAll(".dataTables_scroll").length > 0;
        });
      },
      function then() {
        test.comment("Table header is present");
        test.assertExists(".dataTables_scrollHead th.heading_font-style");
        test.assertElementCount(".dataTables_scrollHead th.heading_font-style", 3,
          "Check number of columns");

        test.comment("Table is showing data");
        test.assertElementCount(".dataTables_scrollBody tr.item", 4,
          "Check number of rows");
        test.assertElementCount(".dataTables_scrollBody tr.item td", 12,
          "Check number of cells");

        test.assertSelectorHasText(".dataTables_scrollBody tr.item td", "9.95");
      });
    });

    casper.run(function() {
      test.done();
    });
  }
});
