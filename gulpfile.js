/* jshint node: true */

(function () {
  "use strict";

  var gulp = require("gulp");
  var gutil = require("gulp-util");
  var rimraf = require("gulp-rimraf");
  var concat = require("gulp-concat");
  var bump = require("gulp-bump");
  var jshint = require("gulp-jshint");
  var minifyCSS = require("gulp-minify-css");
  var usemin = require("gulp-usemin");
  var uglify = require("gulp-uglify");
  var runSequence = require("run-sequence");
  var path = require("path");
  var rename = require("gulp-rename");
  var factory = require("widget-tester").gulpTaskFactory;
  var sass = require('gulp-sass');
  var sourcemaps = require("gulp-sourcemaps");

  var appJSFiles = [
    "src/**/*.js",
    "!./src/components/**/*"
  ];

  gulp.task("clean-dist", function () {
    return gulp.src("dist", {read: false})
      .pipe(rimraf());
  });

  gulp.task("clean-tmp", function () {
    return gulp.src("tmp", {read: false})
      .pipe(rimraf());
  });

  gulp.task("clean", ["clean-dist", "clean-tmp"]);

  gulp.task("config", function() {
    var env = process.env.NODE_ENV || "dev";
    gutil.log("Environment is", env);

    return gulp.src(["./src/config/" + env + ".js"])
      .pipe(rename("config.js"))
      .pipe(gulp.dest("./src/config"));
  });

  gulp.task("bump", function(){
    return gulp.src(["./package.json", "./bower.json"])
      .pipe(bump({type:"patch"}))
      .pipe(gulp.dest("./"));
  });

  gulp.task("lint", function() {
    return gulp.src(appJSFiles)
      .pipe(jshint())
      .pipe(jshint.reporter("jshint-stylish"))
      .pipe(jshint.reporter("fail"));
  });

  gulp.task("source", ["lint"], function () {
    return gulp.src(['./src/settings.html', './src/widget.html'])
      .pipe(usemin())
      .pipe(usemin({
        css: [sourcemaps.init(), minifyCSS(), sourcemaps.write()],
        js: [sourcemaps.init(), uglify(), sourcemaps.write()]
      }))
      .pipe(gulp.dest("dist/"));
  });

  gulp.task("fonts", function() {
    return gulp.src("src/components/common-style/dist/fonts/**/*")
      .pipe(gulp.dest("dist/fonts"));
  });

  gulp.task("images", function() {
    return gulp.src("src/components/rv-bootstrap-formhelpers/img/bootstrap-formhelpers-googlefonts.png")
      .pipe(gulp.dest("dist/img"));
  });

  gulp.task("i18n", function(cb) {
    return gulp.src(["src/components/rv-common-i18n/dist/locales/**/*"])
      .pipe(gulp.dest("dist/locales"));
  });

  gulp.task("build", function (cb) {
    runSequence(["clean", "config"], ["source", "fonts", "images", "i18n"], cb);
  });

  gulp.task("html:e2e",
    factory.htmlE2E({
      files: ["./src/settings.html", "./src/widget.html"],
      e2eAngularMocks: "components/angular-mocks/angular-mocks.js",
      e2eVisualization: "../node_modules/widget-tester/mocks/visualization-api-mock.js",
      e2ePicker: "../node_modules/widget-tester/mocks/gapi-picker-mock.js",
      e2eSpreadsheetHTTP: "../node_modules/widget-tester/mocks/spreadsheet-controls-http-mock.js",
      e2eTestApp: "../test/e2e/settings-app.js",
      e2eAppReplace: "../test/e2e/settings-app-replace.js",
      e2eMockData: "../test/mock-data.js"
    }));

  gulp.task("test:unit:settings", factory.testUnitAngular(
    {testFiles: [
      "src/components/jquery/dist/jquery.js",
      "src/components/q/q.js",
      "src/components/angular/angular.js",
      "src/components/angular-translate/angular-translate.js",
      "src/components/angular-translate-loader-static-files/angular-translate-loader-static-files.js",
      "src/components/angular-route/angular-route.js",
      "src/components/angular-mocks/angular-mocks.js",
      "node_modules/widget-tester/mocks/common-mock.js",
      "src/components/bootstrap-sass-official/assets/javascripts/bootstrap.js",
      "src/components/angular-bootstrap/ui-bootstrap-tpls.js",
      "src/components/component-storage-selector/dist/storage-selector.js",
      "src/components/widget-settings-ui-components/dist/js/**/*.js",
      "src/components/widget-settings-ui-core/dist/*.js",
      "src/components/bootstrap-form-components/dist/js/**/*.js",
      "src/components/google-drive-picker/dist/js/**/*.js",
      "src/components/google-spreadsheet-controls/dist/js/**/*.js",
      "src/config/test.js",
      "src/settings/settings-app.js",
      "src/settings/**/*.js",
      "node_modules/widget-tester/mocks/visualization-api-mock.js",
      "test/mock-data.js",
      "test/unit/settings/**/*spec.js"]}
  ));

  gulp.task("test:unit:widget", factory.testUnitAngular(
    {testFiles: [
      "src/components/jquery/dist/jquery.js",
      "test/mock-data.js",
      "node_modules/widget-tester/mocks/gadget-mocks.js",
      "node_modules/widget-tester/mocks/visualization-api-mock.js",
      "src/config/test.js",
      "src/components/widget-common/dist/visualization.js",
      "src/components/widget-common/dist/common.js",
      "src/config/test.js",
      "src/widget/spreadsheet.js",
      "src/widget/arrows.js",
      "src/widget/images.js",
      "src/widget/content.js",
      "src/widget/main.js",
      "test/unit/widget/**/*spec.js"]}
  ));

  gulp.task("webdriver_update", factory.webdriveUpdate());
  gulp.task("e2e:server-close", factory.testServerClose());
  gulp.task("test:metrics", factory.metrics());

  gulp.task("e2e:server", ["config", "html:e2e"], factory.testServer());

  gulp.task("test:e2e:widget", factory.testE2E({
      testFiles: "test/e2e/widget-scenarios.js"}
  ));

  gulp.task("test:e2e:settings", ["webdriver_update"], factory.testE2EAngular({
      testFiles: "test/e2e/settings-scenarios.js"}
  ));

  gulp.task("test:e2e", function(cb) {
    runSequence(["html:e2e", "e2e:server"], "test:e2e:widget", "test:e2e:settings", "e2e:server-close", cb);
  });

  gulp.task("test:unit", function(cb) {
    runSequence("test:unit:widget", "test:unit:settings", cb);
  });

  gulp.task("test", function(cb) {
    runSequence("build", "test:unit", "test:e2e", "test:metrics", cb);
  });

  gulp.task("dev",function(){
    console.log("watching ./src/**/* for changes");
    gulp.watch("./src/**/*", ["build"]);
  });

  gulp.task("default", function(cb) {
    runSequence("test", "build", cb);
  });

})();
