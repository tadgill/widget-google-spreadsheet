/* global CONFIG: true */
/* exported CONFIG */
if (typeof CONFIG === "undefined") {
  var CONFIG = {
    ARROW_LOGOS_URL: "https://s3.amazonaws.com/risecontentlogos/financial/"
  };
}

if (typeof angular !== "undefined") {
  angular.module("risevision.widget.googleSpreadsheet.config", [])
    .value("defaultLayout", "http://s3.amazonaws.com/widget-google-spreadsheet-test/0.1.0/dist/widget.html");

  angular.module("risevision.common.i18n.config", [])
    .constant("LOCALES_PREFIX", "locales/translation_")
    .constant("LOCALES_SUFIX", ".json");
}
