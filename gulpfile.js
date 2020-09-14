"use strict";

const gulp = require('gulp');
const webpack = require('webpack-stream');  // Use webpack-stream to compile

const sass = require('gulp-sass');                // Include SASS
const autoprefixer = require('gulp-autoprefixer');  // Autoprefixer (always)
const rename = require('gulp-rename');            // Gulp Rename
const sourcemaps = require('gulp-sourcemaps');    // Sourcemaps (for sass)
const plumber = require('gulp-plumber');
const browsersync = require("browser-sync");
const cleanCSS = require('gulp-clean-css');

var autoprefixerList = [
    'Chrome >= 45',
    'Firefox ESR',
    'Edge >= 12',
    'Explorer >= 10',
    'iOS >= 9',
    'Safari >= 9',
    'Android >= 4.4',
    'Opera >= 30'
];

var path = {
    dist: {
        html: './dist/',
        js: './dist/js/',
        style: './dist/css/',
        images: './dist/images/',
        fonts: './dist/fonts/'
    },
    src: {
        html: './src/index.html',
        js: './src/js/index.js',
        style: './src/scss/style.scss',
        images: './src/images/**/*.*',
        fonts: './src/fonts/**/*.*'
    },
    clean: './dist/*'
};

gulp.task("fonts:copy", () => {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.dist.fonts))
        .on("end", browsersync.reload);
});

gulp.task("images:copy", () => {
    return gulp.src(path.src.images)
        .pipe(gulp.dest(path.dist.images))
        .on("end", browsersync.reload);
});

gulp.task('html:copy', function () {
    return gulp.src("./src/*.html")
        .pipe(gulp.dest(path.dist.html))
        .pipe(browsersync.stream());
});

gulp.task('css:build', function () {
    return gulp.src(path.src.style)
        .pipe(plumber()) 
        .pipe(sourcemaps.init()) 
        .pipe(sass()) 
        .pipe(autoprefixer(autoprefixerList))
        .pipe(gulp.dest(path.dist.style))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cleanCSS()) 
        .pipe(sourcemaps.write('./')) 
        .pipe(gulp.dest(path.dist.style)) 
        .on("end", browsersync.reload); 
});

gulp.task("js:build", () => {
    return gulp.src(path.src.js)
                .pipe(webpack({
                    mode: 'development',
                    output: {
                        filename: 'script.js'
                    },
                    watch: false,
                    devtool: "source-map",
                    module: {
                        rules: [
                          {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,
                            use: {
                              loader: 'babel-loader',
                              options: {
                                presets: [['@babel/preset-env', {
                                    debug: true,
                                    corejs: 3,
                                    useBuiltIns: "usage"
                                }]]
                              }
                            }
                          }
                        ]
                      }
                }))
                .pipe(gulp.dest(path.dist.js))
                .on("end", browsersync.reload);
});

gulp.task("watch", () => {
    browsersync.init({
		server: "./dist/",
		port: 4000,
		notify: true
    });
    
    gulp.watch(path.src.html, gulp.parallel("html:copy"));
    gulp.watch(path.src.style, gulp.parallel("css:build"));
    gulp.watch(path.src.images, gulp.parallel("images:copy"));
    gulp.watch(path.src.fonts, gulp.parallel("fonts:copy"));
    gulp.watch(path.src.js, gulp.parallel("js:build"));
});

gulp.task("build", gulp.parallel("html:copy", "css:build", "images:copy", "fonts:copy", "js:build"));
gulp.task("default", gulp.parallel("watch", "build"));