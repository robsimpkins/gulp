'use strict';

import args from 'yargs';
import babel from 'gulp-babel';
import browser from 'browser-sync';
import concat from 'gulp-concat';
import dataUri from 'gulp-image-data-uri';
import del from 'del';
import gulp from 'gulp';
import iff from 'gulp-if';
import jshint from 'gulp-jshint';
import maps from 'gulp-sourcemaps';
import notify from 'gulp-notify';
import plumber from 'gulp-plumber';
import prefix from 'gulp-autoprefixer';
import sass from 'gulp-sass';
import uglify from 'gulp-uglify';
import util from 'gulp-util';


// Import configurations
import config from './gulp-config';


// Prepare production state and browser sync
var production = args.argv.production;
var sync = browser.create();


gulp.task('clean', (callback) =>
    del('./build', callback)
);

gulp.task('vendor-js', () => {
    gulp.src(config.vendorJs.src)
        .pipe(plumber({errorHandler: onError}))
        .pipe(babel())
        .pipe(concat('vendor.js'))
        .pipe(uglify())
        .pipe(gulp.dest(config.vendorJs.dest))
        .pipe(notify('Vendor JavaScript complete'));
});

gulp.task('js', () => {
    gulp.src(config.js.src)
        .pipe(plumber({errorHandler: onError}))
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(maps.init())
        .pipe(babel())
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(iff( ! production, maps.write('./')))
        .pipe(gulp.dest(config.js.dest))
        .pipe(notify('JavaScript complete'));
});

gulp.task('scss', () => {
    gulp.src(config.scss.src)
        .pipe(plumber({errorHandler: onError}))
        .pipe(maps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(prefix('last 2 versions', 'IE 9', 'Firefox ESR'))
        .pipe(iff( ! production, maps.write('./')))
        .pipe(gulp.dest(config.scss.dest))
        .pipe(notify('SCSS complete'));
});

gulp.task('svg', () => {
    gulp.src(config.svg.src)
        .pipe(plumber({errorHandler: onError}))
        .pipe(dataUri(config.svg.options))
        .pipe(concat('icons.css'))
        .pipe(gulp.dest(config.svg.dest))
        .pipe(notify('SVG complete'));
});

gulp.task('watch', () => {
    sync.init(config.proxy);
    gulp.watch(config.js.watch, ['js']).on('change', sync.reload);
    gulp.watch(config.scss.watch, ['scss']).on('change', sync.reload);
    gulp.watch(config.svg.watch, ['svg']).on('change', sync.reload);
});

gulp.task('default', ['clean', 'vendor-js', 'js', 'scss', 'svg', 'watch']);

function onError(err) {
    util.beep();
    util.log(util.colors.red(err));
    this.emit('end');
}
