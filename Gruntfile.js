'use strict';
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-casper');
  grunt.loadNpmTasks('grunt-mongoimport');
  grunt.loadNpmTasks('grunt-sass');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      build: ['build'],
      dev: {
        src: ['build/server.js', 'build/<%= pkg.name %>.css', 'build/<%= pkg.name %>.js']
      },
      prod: ['dist']
    },

    copy: {
      all: {
        expand: true,
        cwd: 'public',
        src: ['/css/*.css', '*.html', '/images/**/*' ],
        dest: 'dist/',
        flatten: true,
        filter: 'isFile'
      },
      dev: {
        expand: true,
        cwd: 'public',
        src: ['/css/*.css', '*.html', '/images/**/*' ],
        dest: 'build/',
        flatten: true,
        filter: 'isFile'
      }
    },

    browserify: {
      prod: {
        src: ['public/js/*.js'],
        dest: 'dist/server.js',
        options: {
          transform: ['debowerify'],
          debug: false
        }
      },
      dev: {
        src: ['public/js/*.js'],
        dest: 'build/server.js',
        options: {
          transform: ['debowerify'],
          debug: true
        }
      }
    },

    express: {
      options: {
        // Override defaults here
      },
      dev: {
        options: {
          script: 'server.js'
        }
      },
      prod: {
        options: {
          script: 'server.js',
          node_env: 'production'
        }
      },
      test: {
        options: {
          script: 'server.js'
        }
      }
    },
    simplemocha: {
      dev:{
        src:['test/*_test.js','!test/acceptance/*_test.js'],
        options:{
          reporter: 'spec',
          slow: 200,
          timeout: 1000
        }
      }
    },
    watch: {
      all: {
        files:['server.js', '**/*.js' ],
        tasks:['jshint']
      },
      express: {
        files:  [ 'server.js','models/**/*.js','routes/**/*.js' ],
        tasks:  [ 'express:dev' ],
        options: {
          // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions.
          // Without this option specified express won't be reloaded
          spawn: false
        }
      }
    },
    casper: {
      acceptance : {
        options : {
          test : true,
        },
        files : {
          'test/acceptance/casper-results.xml' : ['test/acceptance/*_test.js']
        }
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'server.js', 'models/**/*.js', 'test/**/*.js'],
      options: {
        jshintrc: true,
        globals: {
          console: true,
          module: true
        }
      }
    },
    sass: {
      dist: {
        files: {'build/css/styles.css': 'assets/scss/styles.scss'}
      },
      dev: {
        options: {
          includePaths: ['public/scss/'],
          sourceComments: 'map'
        },
        files: {'build/css/styles.css': 'assets/scss/styles.scss'}
      }
    },
    mongoimport: {
      options: {
        db : 'oaa',
        //optional
        //host : 'localhost',
        //port: '27017',
        //username : 'username',
        //password : 'password',
        //stopOnError : false,
        collections : [
          {
            name : 'users',
            type : 'json',
            file : 'db/seeds/users.json',
            jsonArray : true,  //optional
            upsert : true,  //optional
            drop : true  //optional
          },
          {
            name : 'meetings',
            type :'json',
            file : 'db/seeds/meetings.json',
            jsonArray : true,
            upsert : true,
            drop : true
          }
        ]
      }
    }
  });

  grunt.registerTask('build:dev',  ['clean:dev', 'browserify:dev', 'jshint:all', 'copy:dev']);
  grunt.registerTask('build:prod', ['clean:prod', 'browserify:prod', 'jshint:all', 'copy:prod']);
  grunt.registerTask('test', ['jshint', 'simplemocha:dev']);
  grunt.registerTask('server', [ 'jshint', 'express:dev','watch:express' ]);
  grunt.registerTask('test:acceptance',['express:dev','casper']);
  grunt.registerTask('default', ['jshint', 'test','watch:express']);
  grunt.registerTask('travis', ['jshint']);

};
