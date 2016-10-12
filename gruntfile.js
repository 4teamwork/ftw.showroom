module.exports = function(grunt) {

  "use strict";

  grunt.initConfig({

    pkg: grunt.file.readJSON("package.json"),

    browserify: {
      options: {
        browserifyOptions: {
          standalone: "<%= pkg.name %>",
        }
      },
      dist: {
        options: {
          paths: ["./ftw/showroom/js/src", "./ftw/showroom/js/test/spec"],
          transform: [
            ["babelify", {
              presets: "es2015"
            }],
            "browserify-shim"
          ]
        },
        files: {
          "./ftw/showroom/resources/<%= pkg.name %>.js": ["./ftw/showroom/js/src/<%= pkg.name %>.js"]
        }
      }
    },

    karma: {
      options: {
        configFile: "karma.conf.js"
      },
      dev: {
        browsers: ["PhantomJS", "Chrome"]
      },
      ci: {
        browsers: ["PhantomJS"],
        autoWatch: false,
        singleRun: true
      }
    },

    watch: {
      scripts: {
        files: ["./ftw/showroom/js/src/**/*.js"],
        tasks: ["browserify"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask("default", ["watch"]);
  grunt.registerTask("build", ["browserify"]);
  grunt.registerTask("test", ["karma:dev"]);
  grunt.registerTask("test-ci", ["karma:ci"]);

};
