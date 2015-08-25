var system = require("system");
var e2ePort = system.env.E2E_PORT || 8099;
var url = "http://localhost:"+e2ePort+"/src/widget-e2e.html";

casper.on("remote.message", function(msg) {
  this.echo(msg);
});

casper.test.begin("Integration Testing - PUD Failover", {
  setUp: function(test) {
    casper.options.clientScripts = [
      "test/data/pud-failover.js",
      "node_modules/sinon/pkg/sinon.js"
    ];

    casper.options.viewportSize = { width: 800, height: 1600 };
  },

  test: function(test) {
    var clock, spreadsheet;

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
            clock = sinon.useFakeTimers();
            spreadsheet = RiseVision.Spreadsheet;

            // Ensure the PUD timer is cleared.
            spreadsheet.pause();
          });
        });
    });

    casper.then(function() {
      var spyCalledTwice = this.evaluate(function() {
        var playSpy = sinon.spy(spreadsheet, "play");

        spreadsheet.play();

        // Advance clock so that PUD timer fires.
        clock.tick(10000);

        // When PUD timer fires, it should trigger the "done" event, which in turn will tell the
        // Widget to play.
        return playSpy.calledTwice;
      });

      test.assert(spyCalledTwice, "PUD timer fired");
    });

    casper.run(function runTest() {
      test.done();
    });

  /*test: function(test) {
    casper.start();

    casper.thenOpen(url, function() {
      test.assertTitle("Google Spreadsheet Widget");

      casper.evaluate(function() {
        window.clock = sinon.useFakeTimers();
      });
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

          test.comment("Table refreshes data when column is removed");

          casper.evaluate(function() {
            // Change the data to only have 2 columns.
            window.gadget.data = {
              cols: [
                {"id":"A","label":"Column 1","type":"string"},
                {"id":"B","label":"Column 2","type":"number"}
              ],
              rows: [
                ["test 1", 345453],
                ["test 2", 6565.67]
              ]
            };

            // Trigger a refresh.
            window.clock.tick(300000);
          });

          casper.waitFor(function waitForTimer() {
              return this.evaluate(function expireTimer() {
                // TODO: Figure out what condition to wait for.
                return document.querySelectorAll(".dataTables_scroll").length > 0;
              });
            },
            function then() {
              this.evaluate(function() {
                window.clock.restore();
              });

              // test.assertElementCount(".dataTables_scrollHead th.heading_font-style", 2,
              //   "Check number of columns");
              // test.assertElementCount(".dataTables_scrollBody tr.item td", 4,
              //   "Check number of cells");
            });
        });
    });

    casper.run(function() {
      test.done();
    });*/
  }
});
