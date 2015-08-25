var system = require("system");
var e2ePort = system.env.E2E_PORT || 8099;
var url = "http://localhost:"+e2ePort+"/src/widget-e2e.html";

casper.on("remote.message", function(message) {
  this.echo(message);
});

casper.test.begin("Integration Testing - PUD No Failover", {
  setUp: function(test) {
    casper.options.clientScripts = [
      "test/data/pud-no-failover.js",
      "node_modules/sinon/pkg/sinon.js"
    ];

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
      var spyCalledOnce = this.evaluate(function() {
        var playSpy = sinon.spy(spreadsheet, "play");

        spreadsheet.play();
        clock.tick(10000);

        // PUD timer should not fire, thereby not triggering the "done" event and telling the
        // Widget to play.
        return playSpy.calledOnce;
      });

      test.assert(spyCalledOnce, "PUD timer not fired");
    });

    casper.run(function runTest() {
      test.done();
    });
  }
});
