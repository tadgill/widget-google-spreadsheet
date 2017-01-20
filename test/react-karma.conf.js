var path = require( "path" ),
  webpackConfig = require( "../webpack.config.js" );

webpackConfig.devtool = "inline-source-map";

module.exports = function( config ) {
  config.set( {

    autoWatch: false,

    frameworks: [ "mocha", "chai", "chai-as-promised", "sinon-chai" ],

    browsers: [ "PhantomJS" ],

    files: [
      "unit/widget/mocks/container-mock.js",
      "unit/widget/mocks/gadget-mock.js",
      "unit/widget/test_index.js"
    ],

    preprocessors: {
      "unit/widget/test_index.js": [ "webpack" ]
    },

    webpack: webpackConfig,

    reporters: [ "progress", "junit", "coverage" ],

    plugins: [
      "karma-mocha",
      "karma-chai",
      "sinon-chai",
      "karma-junit-reporter",
      "karma-coverage",
      "karma-chai-plugins",
      "karma-phantomjs-launcher",
      "karma-webpack"
    ],

    junitReporter: {
      outputFile: path.join( __dirname, "../reports/react-karma-xunit.xml" )
    },

    // optionally, configure the reporter
    coverageReporter: {
      type: "cobertura",
      dir: path.join( __dirname, "../reports/react-coverage" )
    },

    // web server port
    port: 9876,
    logLevel: config.LOG_INFO,

    // enable / disable colors in the output (reporters and logs)
    colors: true

  } );
};
