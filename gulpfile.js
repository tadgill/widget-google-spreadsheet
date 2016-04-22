/* jshint node: true */

(function () {
  "use strict";

  var bower = require("gulp-bower");
  var bump = require("gulp-bump");
  var colors = require("colors");
  var del = require("del");
  var env = process.env.NODE_ENV || "prod";
  var factory = require("widget-tester").gulpTaskFactory;
  var gulp = require("gulp");
  var gulpif = require("gulp-if");
  var gutil = require("gulp-util");
  var jshint = require("gulp-jshint");
  var minifyCSS = require("gulp-minify-css");
  var path = require("path");
  var rename = require("gulp-rename");
  var runSequence = require("run-sequence");
  var sourcemaps = require("gulp-sourcemaps");
  var uglify = require("gulp-uglify");
  var usemin = require("gulp-usemin");
  var wct = require("web-component-tester").gulp.init(gulp);

  var appJSFiles = [
    "src/**/*.js",
    "!./src/components/**/*"
  ],
    htmlFiles = [
      "./src/settings.html",
      "./src/widget.html"
    ];

  gulp.task("clean", function (cb) {
    del(["./dist/**"], cb);
  });

  gulp.task("clean-bower", function(cb){
    del(["./src/components/**"], cb);
  });

  gulp.task("config", function() {
    var configFile = (env === "dev" ? "dev.js" : "prod.js");

    gutil.log("Environment is", env);

    return gulp.src(["./src/config/" + configFile])
      .pipe(rename("config.js"))
      .pipe(gulp.dest("./src/config"));
  });

  gulp.task("lint", function() {
    return gulp.src(appJSFiles)
      .pipe(jshint())
      .pipe(jshint.reporter("jshint-stylish"))
      .pipe(jshint.reporter("fail"));
  });

  gulp.task("source", ["lint"], function () {
    var isProd = (env === "prod");

    return gulp.src(htmlFiles)
      .pipe(gulpif(isProd,
        // Minify for production.
        usemin({
          css: [sourcemaps.init(), minifyCSS(), sourcemaps.write()],
          js: [sourcemaps.init(), uglify(), sourcemaps.write()]
        }),
        // Don't minify for staging.
        usemin({})
      ))
      .pipe(gulp.dest("dist/"));
  });

  gulp.task("unminify", function () {
    return gulp.src(htmlFiles)
      .pipe(usemin({
        css: [rename(function (path) {
          path.basename = path.basename.substring(0, path.basename.indexOf(".min"))
        }), gulp.dest("dist")],
        js: [rename(function (path) {
          path.basename = path.basename.substring(0, path.basename.indexOf(".min"))
        }), gulp.dest("dist")]
      }))
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

  gulp.task("webdriver_update", factory.webdriveUpdate());

  // ***** e2e Testing ***** //
  gulp.task("e2e:server-close", factory.testServerClose());

  gulp.task("html:e2e:settings",
    factory.htmlE2E({
      files: ["./src/settings.html"],
      e2eAngularMocks: "components/angular-mocks/angular-mocks.js",
      e2eVisualization: "../node_modules/widget-tester/mocks/visualization-api-mock.js",
      e2ePicker: "../node_modules/widget-tester/mocks/gapi-picker-mock.js",
      e2eSpreadsheetHTTP: "../node_modules/widget-tester/mocks/spreadsheet-controls-http-mock.js",
      e2eTestApp: "../test/e2e/settings-app.js",
      e2eAppReplace: "../test/e2e/settings-app-replace.js",
      e2eMockData: "../test/data/main.js"
    }));

  gulp.task("e2e:server:settings", ["config", "html:e2e:settings"], factory.testServer());

  gulp.task("test:e2e:settings:run", ["webdriver_update"], factory.testE2EAngular({
    testFiles: "test/e2e/settings.js"}
  ));

  gulp.task("test:e2e:settings", function(cb) {
    runSequence(["e2e:server:settings"], "test:e2e:settings:run", "e2e:server-close", cb);
  });

  gulp.task("test:e2e", function(cb) {
    runSequence("test:e2e:settings", cb);
  });

  // ****** Unit Testing ***** //
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
      "test/data/main.js",
      "test/unit/settings/**/*spec.js"]}
  ));

  gulp.task("test:unit:widget", factory.testUnitAngular(
    {testFiles: [
      "src/components/jquery/dist/jquery.js",
      "test/data/main.js",
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

  gulp.task("test:unit", function(cb) {
    runSequence("test:unit:widget", "test:unit:settings", cb);
  });

  // ***** Integration Testing ***** //
  gulp.task("test:integration", function(cb) {
    runSequence("test:local", cb);
  });

  // ***** Primary Tasks ***** //
  gulp.task("bower-clean-install", ["clean-bower"], function(cb){
    return bower().on("error", function(err) {
      console.log(err);
      cb();
    });
  });

  gulp.task("bower-update", function (cb) {
    return bower({ cmd: "update"}).on("error", function(err) {
      console.log(err);
      cb();
    });
  });

  gulp.task("build", function (cb) {
    runSequence(["clean", "config", "bower-update"], ["source", "fonts", "images", "i18n"], ["unminify"], cb);
  });

  gulp.task("bump", function(){
    return gulp.src(["./package.json", "./bower.json"])
      .pipe(bump({type:"patch"}))
      .pipe(gulp.dest("./"));
  });

  gulp.task("test", function(cb) {
    runSequence("test:unit", "test:e2e", "test:integration", cb);
  });

  gulp.task("default", [], function() {
    console.log("********************************************************************".yellow);
    console.log("  gulp bower-clean-install: delete and re-install bower components".yellow);
    console.log("  gulp bower-update: update bower components".yellow);
    console.log("  gulp build: build a distribution version".yellow);
    console.log("  gulp bump: bump the release version".yellow);
    console.log("  gulp test: run e2e, integration, and unit tests".yellow);
    console.log("********************************************************************".yellow);
    return true;
  });

})();
