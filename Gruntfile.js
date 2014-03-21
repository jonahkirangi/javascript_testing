'use strict';
/*jslint node: true */

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
    all: ['Gruntfile.js', 'test/**/*.js', 'lib/**/*.js'],
    options: {

      globals: {
        jQuery: true,
        console: true,
        module: true
        }
      }
    },
    simplemocha: {
      options: {
        timeout: 3000,
        ignoreLeaks: false,
        reporter: 'tap'
      },

      all: { src: ['test/**/*.js'] }
    }
  });

  // For this to work, you need to have run `npm install grunt-simple-mocha`
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-simple-mocha');

  // Add a default task. This is optional, of course :)
  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('test', ['jshint', 'simplemocha']);

};
