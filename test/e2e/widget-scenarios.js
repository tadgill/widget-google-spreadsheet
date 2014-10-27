casper.test.begin("Google Spreadsheet Widget - e2e Testing", function (test) {
  var system = require('system');
  var e2ePort = system.env.E2E_PORT || 8099;

  casper.options.waitTimeout = 1000;

  casper.start("http://localhost:"+e2ePort+"/src/widget-e2e.html",
    function () {
      test.assertTitle("Google Spreadsheet Widget");
    }
  );

  casper.waitFor(function check() {
    return this.evaluate(function() {
      return document.querySelectorAll('.dataTables_scroll').length > 0;
    });
  }, function then() {

    casper.then(function() {
      casper.test.comment("Table header is present");

      test.assertExists(".dataTables_scrollHead th.heading_font-style");

      test.assertElementCount(".dataTables_scrollHead th.heading_font-style", 3,
        "Check number of columns");

    });

    casper.then(function () {
      casper.test.comment("Table is showing data");

      test.assertElementCount(".dataTables_scrollBody tr.item", 4,
        "Check number of rows");

      test.assertElementCount(".dataTables_scrollBody tr.item td", 12,
        "Check number of cells");
    });

  });

  casper.run(function() {
    test.done();
  });
});
