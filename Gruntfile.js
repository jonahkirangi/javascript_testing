'use strict';
/*jslint node: true */

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['Gruntfile.js', './*.js', 'api/**/*.js', 'app/assets**/*.js'],
      options: {
        jshintrc: true,
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

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-simple-mocha');

  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('test', ['jshint', 'simplemocha']);
};
