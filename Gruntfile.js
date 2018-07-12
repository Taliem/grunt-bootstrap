module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-juwain-posthtml');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        less: {
            build: {
                options: {
                    paths: ['node_modules/normalize.css/', 'source/blocks/'],
                    sourceMap: true,
                    sourceMapFileInline: true,
                    outputSourceFiles: true
                },
                files: [{
                    expand: true,
                    cwd: 'source/less/',
                    src: ['*.less'],
                    ext: '.css',
                    dest: 'build/css/',
                }]
            }
        },
        
        postcss: {
            build: {
                options: {
                    map: true,  // без этого переписывает sourcemap от less
                    processors: [
                        require('autoprefixer')({browsers: '> 1%'})
                    ]
                },
                build: {
                    src: ['build/css/*.css']
                }
            }
        },

        posthtml: {
            options: {
                use: [
                    require('posthtml-include')({root: 'source/html/particles/'})
                ]
            },
            build: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: 'source/html/',
                    src: ['*.html'],
                    dest: 'build/'
                }]
            }
        },

        copy: {
            fonts: {
                files: [{
                    expand: true,
                    cwd: 'source/fonts/',
                    src: ['*.{woff,woff2}'],
                    dest: 'build/fonts/'
                }]
            },
            images: {
                files: [{
                    expand: true,
                    flatten: true,
                    cwd: 'source/blocks/',
                    src: ['**/*.{png,jpg,gif,svg}'],
                    dest: 'build/images/'
                }]
            }
        },

        clean: ['build/'],

        browserSync: {
            bsFiles: {
                src : [
                    'build/**/*'
                ]
            },
            options: {
                watchTask: true,
                open: false,
                server: './build'
            }
        },

        // cssmin интерфейс для clean-css
        cssmin: {
            options: {
                report: 'gzip',
                level: {1: {specialComments: 0}}
            },
            files: {
                expand: true,
                cwd: 'build/css/',
                src: ['*.css'],
                dest: 'build/css/',
            }
        },

        imagemin: {
            minify: {
                options: {
                    optimizationLevel: 3,
                    progressive: true
                },
                files: [{
                    expand: true,
                    cwd: 'source/blocks/',
                    src: ['**/*.{png,jpg,gif,svg}'],
                    flatten: true,
                    dest: 'build/images/'
                }]
            }
        },

        uglify: {
            dev: {
                options: {
                    mangle: false,
                    beautify: true,
                    compress: false,
                    sourceMap: true,
                },
                files: {
                    'build/scripts/script.js': [
                        'source/blocks/header/header.js',
                        'source/blocks/footer/footer.js'
                    ]
                }
            },
            prod: {
                files: {
                    'build/scripts/script.js': [
                        'source/blocks/header/header.js',
                        'source/blocks/footer/footer.js'
                    ]
                }
            }
        },

        watch: {
            styles: {
                files: ['source/**/*.less'],
                tasks: ['less', 'postcss']
            },
            html : {
                files: ['source/html/particles/*.html'],
                tasks: ['posthtml']
            },
            images: {
                files: [
                    'source/**/*.{png,jpg,gif,svg}',
                    'source/fonts/*'
                ],
                tasks: ['copy']
            }
        }
    }),
    
    grunt.registerTask('default', [
        'clean',
        'less',
        'postcss',
        'posthtml',
        'copy',
        'uglify:dev',
        'browserSync',
        'watch'
    ]);

    grunt.registerTask('build', [
        'clean',
        'less',
        'postcss',
        'cssmin',
        'posthtml',
        'copy:fonts',
        'uglify:prod',
        'imagemin',
    ]);
  };