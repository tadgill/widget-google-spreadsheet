/* exported config */

var config = {
  apiKey: "AIzaSyAdX5yRzScPWbRm0FnNcoYxbiLeQo8owwc"
};

if (typeof angular !== "undefined") {
  angular.module("risevision.widget.googleSpreadsheet.config", [])
    .value("API_KEY", "AIzaSyAdX5yRzScPWbRm0FnNcoYxbiLeQo8owwc");

  angular.module("risevision.common.i18n.config", [])
    .constant("LOCALES_PREFIX", "locales/translation_")
    .constant("LOCALES_SUFIX", ".json");
}
