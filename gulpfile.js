/* jshint node: true */

(function () {
  "use strict";

  var gulp = require("gulp");
  var gutil = require("gulp-util");
  var rimraf = require("gulp-rimraf");
  var concat = require("gulp-concat");
  var bump = require("gulp-bump");
  var html2js = require("gulp-html2js");
  var jshint = require("gulp-jshint");
  var uglify = require("gulp-uglify");
  var runSequence = require("run-sequence");
  var path = require("path");
  var rename = require("gulp-rename");
  var factory = require("widget-tester").gulpTaskFactory;

  var jsFiles = [
    "src/**/*.js",
    "test/**/*.js",
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
    return gulp.src(jsFiles)
      .pipe(jshint())
      .pipe(jshint.reporter("jshint-stylish"));
    // .pipe(jshint.reporter("fail"));
  });

  gulp.task("html", ["lint"], function () {
    return gulp.src(['./src/*.html'])
      .pipe(gulp.dest("dist/"));
  });

  gulp.task("i18n", function() {
    return gulp.src("src/locales/**/*.json")
      .pipe(gulp.dest("dist/locales"));
  });

  gulp.task('build', function (cb) {
    runSequence(["clean", "config"], ["html", "i18n"], cb);
  });

  gulp.task("html:e2e", factory.htmlE2E());
  gulp.task("webdriver_update", factory.webdriveUpdate());
  gulp.task("e2e:server-close", factory.testServerClose());
  gulp.task("test:ensure-directory", factory.ensureReportDirectory());
  gulp.task("test:e2e:ng:core", factory.testE2EAngular());
  gulp.task("test:metrics", factory.metrics());

  gulp.task("e2e:server", ["config", "html:e2e"], factory.testServer());

  gulp.task("test:e2e:settings", ["webdriver_update"], function (cb) {
    return runSequence("e2e:server", "test:e2e:ng:core",
      function (err) {
        gulp.run("e2e:server-close");
        cb(err);
      });
  });

  gulp.task("test", ["build"], function (cb) {
    runSequence("test:e2e:settings", "test:metrics", cb);
  });

  gulp.task("default", ["build"]);


})();
