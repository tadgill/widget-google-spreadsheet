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
      ["9.95", 6565.67, new Date(2014, 2, 24), ""]
    ]
  };

})(window);
