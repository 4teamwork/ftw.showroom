"use strict";

module.exports = function(karma) {
  karma.set({

    frameworks: [ "jasmine", "browserify", "chai", "fixture" ],

    files: [
      { pattern: "./test/**/*.js" },
      { pattern: "./test/fixtures/**/*.html" }
    ],

    reporters: [ "dots" ],

    preprocessors: {
      "./test/**/*.js": "browserify",
      "./test/fixtures/**/*.html": "html2js"
    },

    browserify: {
      debug: true,
      paths: ["./src", "./test/spec"],
      transform: [
        ["babelify", {
            presets: ["es2015"],
            sourceRoot: "../../src"
        }]
      ]
    },

    browsers: [ "PhantomJS" ],

    singleRun: false,
    autoWatch: true
  });
};
