(function(window) {
  "use strict";

  window.gadget.settings.additionalParams.scroll.by = 'page';

  window.gadget.data = {
    cols: [
      {"id":"A","label":"Column 1","type":"string"},
      {"id":"B","label":"Column 2","type":"number"},
      {"id":"C","label":"Column 3","type":"date"}
    ],
    // lots of rows to require needing to scroll
    rows: [
      ["test 1", 345453, new Date(2013, 7, 10), ""],
      ["test 2", 6565.67, new Date(2014, 2, 24), ""],
      ["test 3", 56, new Date(2005, 10, 29), ""],
      ["test 4", 56, new Date(2005, 10, 29), ""],
      ["test 5", 56, new Date(2005, 10, 29), ""],
      ["test 6", 56, new Date(2005, 10, 29), ""],
      ["test 7", 56, new Date(2005, 10, 29), ""],
      ["test 8", 56, new Date(2005, 10, 29), ""],
      ["test 9", 56, new Date(2005, 10, 29), ""],
      ["test 10", 56, new Date(2005, 10, 29), ""],
      ["test 11", 56, new Date(2005, 10, 29), ""],
      ["test 12", 56, new Date(2005, 10, 29), ""],
      ["test 13", 56, new Date(2005, 10, 29), ""],
      ["test 14", 45454, new Date(2012, 7, 23), ""]
    ]
  };

})(window);
