'use strict';

import args from 'yargs';
import babel from 'gulp-babel';
import browserSync from 'browser-sync';
import concat from 'gulp-concat';
import imageDataUri from 'gulp-image-data-uri';
import del from 'del';
import gulp from 'gulp';
import iff from 'gulp-if';
import jshint from 'gulp-jshint';
import maps from 'gulp-sourcemaps';
import notify from 'gulp-notify';
import plumber from 'gulp-plumber';
import autoprefix from 'gulp-autoprefixer';
import sass from 'gulp-sass';
import uglify from 'gulp-uglify';
import util from 'gulp-util';


// Import configurations
import config from './gulp-config';


// Prepare production state and browser sync
var production = args.argv.production;
var sync = browserSync.create();


gulp.task('clean', (callback) =>
    del('./build', callback)
);

gulp.task('js', () => {
    gulp.src(config.tasks.js.src)
        .pipe(plumber({errorHandler: onError}))
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(iff( ! production, maps.init()))
        .pipe(babel())
        .pipe(concat(config.tasks.js.concat))
        .pipe(uglify())
        .pipe(iff( ! production, maps.write('./')))
        .pipe(gulp.dest(config.tasks.js.dest))
        .pipe(notify('JavaScript complete'));
});

gulp.task('vendor-js', () => {
    gulp.src(config.tasks.vendorJs.src)
        .pipe(plumber({errorHandler: onError}))
        .pipe(babel())
        .pipe(concat(config.tasks.vendorJs.concat))
        .pipe(uglify())
        .pipe(gulp.dest(config.tasks.vendorJs.dest))
        .pipe(notify('Vendor JavaScript complete'));
});

gulp.task('scss', () => {
    gulp.src(config.tasks.scss.src)
        .pipe(plumber({errorHandler: onError}))
        .pipe(iff( ! production, maps.init()))
        .pipe(sass(config.plugins.sass))
        .pipe(autoprefix(config.plugins.autoprefix))
        .pipe(concat(config.tasks.scss.concat))
        .pipe(iff( ! production, maps.write('./')))
        .pipe(gulp.dest(config.tasks.scss.dest))
        .pipe(notify('SCSS complete'));
});

gulp.task('svg', () => {
    gulp.src(config.tasks.svg.src)
        .pipe(plumber({errorHandler: onError}))
        .pipe(imageDataUri(config.plugins.imageDataUri))
        .pipe(concat(config.tasks.svg.concat))
        .pipe(gulp.dest(config.tasks.svg.dest))
        .pipe(notify('SVG complete'));
});

gulp.task('watch', () => {
    sync.init(config.plugins.browserSync);
    gulp.watch(config.tasks.js.watch, ['js']).on('change', sync.reload);
    gulp.watch(config.tasks.scss.watch, ['scss']).on('change', sync.reload);
    gulp.watch(config.tasks.svg.watch, ['svg']).on('change', sync.reload);
});

gulp.task('default', ['clean', 'vendor-js', 'js', 'svg', 'scss', 'watch']);

function onError(err) {
    util.beep();
    util.log(util.colors.red(err));
    this.emit('end');
}
