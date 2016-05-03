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
          paths: ["./src", "./test/spec"],
          transform: [
            ["babelify", {
              presets: "es2015"
            }],
            "browserify-shim"
          ]
        },
        files: {
          "./dist/<%= pkg.name %>.js": ["./src/<%= pkg.name %>.js"]
        }
      }
    },

    watch: {
      scripts: {
        files: ["src/**/*.js"],
        tasks: ["browserify"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.registerTask("default", ["watch"]);
  grunt.registerTask("build", ["browserify"]);

};
