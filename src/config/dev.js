/* global CONFIG: true */
/* exported CONFIG */
if (typeof CONFIG === "undefined") {
  var CONFIG = {
    ARROW_LOGOS_URL: "https://s3.amazonaws.com/risecontentlogos/financial/"
  };
}

if (typeof angular !== "undefined") {
  angular.module("risevision.widget.googleSpreadsheet.config", [])
    .value("defaultLayout", "widget.html");

  angular.module("risevision.common.i18n.config", [])
    .constant("LOCALES_PREFIX", "components/rv-common-i18n/dist/locales/translation_")
    .constant("LOCALES_SUFIX", ".json");

  angular.module("risevision.widget.common.storage-selector.config")
    .value("STORAGE_MODAL", "https://storage-stage-rva-test.risevision.com/files/");
}
