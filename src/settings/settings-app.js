angular.module("risevision.widget.googleSpreadsheet.settings",
  ["risevision.widget.common",
  "risevision.widget.common.visualization",
  "risevision.widget.common.translate",
  "risevision.widget.common.tooltip",
  "risevision.widget.common.google-spreadsheet-controls",
  "risevision.widget.common.column-selector",
  "risevision.widget.common.scroll-setting",
  "risevision.widget.common.table-setting",
  "risevision.widget.common.background-setting",
  "risevision.widget.common.widget-button-toolbar"]);

angular.module("risevision.widget.common.translate", ["pascalprecht.translate"])
  .config(["$translateProvider", function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
      prefix: "locales/",
      suffix: "/translation.json"
    });
    $translateProvider.determinePreferredLanguage();
    if($translateProvider.preferredLanguage().indexOf("en_") === 0){
      //default to "en" on any of the English variants
      $translateProvider.preferredLanguage("en");
    }
  }]);
