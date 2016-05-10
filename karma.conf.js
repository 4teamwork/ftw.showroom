"use strict";

module.exports = function(karma) {
  karma.set({

    frameworks: [ "jasmine", "browserify", "chai", "fixture" ],

    files: [
      { pattern: "./ftw/showroom/js/test/**/*.js" },
      { pattern: "./ftw/showroom/js/test/fixtures/**/*.html" }
    ],

    reporters: [ "dots" ],

    preprocessors: {
      "./ftw/showroom/js/test/**/*.js": "browserify",
      "./ftw/showroom/js/test/fixtures/**/*.html": "html2js"
    },

    browserify: {
      debug: true,
      paths: ["./ftw/showroom/js/src", "./ftw/showroom/js/test/spec"],
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
