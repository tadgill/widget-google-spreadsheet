(function(window) {
  "use strict";

  window.gadget.data = {
    cols: [
      {"id":"A","label":"Column 1","type":"string"},
      {"id":"B","label":"Column 2","type":"number"},
      {"id":"C","label":"Column 3","type":"date"},
      {"id":"D","label":"Column 4","type":"string"}
    ],
    rows: [
      ["test 1", 345453, new Date(2013, 7, 10), ""],
      ["test 2", 6565.67, new Date(2014, 2, 24), ""],
      ["test 3", 56, new Date(2005, 10, 29), ""],
      ["test 4", 45454, new Date(2012, 7, 23), ""]
    ]
  };

})(window);
