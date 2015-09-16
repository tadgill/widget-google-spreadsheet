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
    var clock, spreadsheet, scroll;

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
            scroll = $(".dataTables_scrollBody").data("plugin_autoScroll");

            // Ensure the PUD timer is cleared.
            spreadsheet.pause();
          });
        });
    });

    casper.then(function() {
      var spyCalledTwice = this.evaluate(function() {
        var playSpy = sinon.spy(spreadsheet, "play"),
          scrollPlay = sinon.spy(scroll, "play");

        spreadsheet.play();

        // Advance clock so that PUD timer fires.
        clock.tick(10000);

        // When PUD timer fires, it should trigger the "done" event, which in turn will tell the
        // Widget to play.
        return playSpy.calledTwice && scrollPlay.callCount === 0;
      });

      test.assert(spyCalledTwice, "PUD timer fired");
    });

    casper.run(function runTest() {
      test.done();
    });

  }
});
