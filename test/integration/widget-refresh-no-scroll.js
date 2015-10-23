var system = require("system");
var e2ePort = system.env.E2E_PORT || 8099;
var url = "http://localhost:"+e2ePort+"/src/widget-e2e.html";

casper.on("remote.message", function(message) {
  this.echo(message);
});

casper.test.begin("Integration Testing - Refresh (can't scroll)", {
  setUp: function(test) {
    casper.options.clientScripts = [
      "test/data/sheet-data.js"
    ];

  },
  test: function(test) {
    var spreadsheet;

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
          this.evaluate(function() {
            spreadsheet = RiseVision.Spreadsheet;

            // Force refreshing the data
            window.gadget.data.rows.push(["refresh", 123, new Date(2015, 10, 22), ""]);

            spreadsheet.getData();
          });
        });

    });

    casper.then(function() {
      casper.waitFor(function waitForUI() {
          return this.evaluate(function loadData() {
            return document.querySelectorAll(".dataTables_scroll").length > 0 &&
              document.querySelectorAll(".dataTables_scrollBody tr.item").length > 2;
          });
        },
        function then() {
          test.comment("Table is showing refresh data");
          test.assertSelectorHasText(".dataTables_scrollBody tr.item td", "refresh");
        });
    });

    casper.run(function runTest() {
      test.done();
    });
  }
});
