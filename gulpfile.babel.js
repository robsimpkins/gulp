'use strict';

import args from 'yargs';
import babel from 'gulp-babel';
import browser from 'browser-sync';
import concat from 'gulp-concat';
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
    del('./assets/build', callback)
);

gulp.task('js', () => {
    gulp.src([
            './assets/src/js/**/*.js',
            './assets/src/js/app.js'
            // ...
        ])
        .pipe(plumber({errorHandler: onError}))
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(maps.init())
        .pipe(babel())
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(iff( ! production, maps.write('./')))
        .pipe(gulp.dest('./assets/build'))
        .pipe(notify('JavaScript complete'));
});

gulp.task('scss', () => {
    gulp.src('./assets/src/scss/app.scss')
        .pipe(plumber({errorHandler: onError}))
        .pipe(maps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(prefix('last 2 versions', 'IE 9', 'Firefox ESR'))
        .pipe(iff( ! production, maps.write('./')))
        .pipe(gulp.dest('./assets/build'))
        .pipe(notify('SCSS complete'));
});

gulp.task('watch', () => {
    sync.init({proxy: config.proxy});
    gulp.watch('./assets/src/js/**/*.js', ['js']).on('change', sync.reload);
    gulp.watch('./assets/src/scss/**/*.scss', ['scss']).on('change', sync.reload);
});

gulp.task('default', ['clean', 'js', 'scss', 'watch']);

function onError(err) {
    util.beep();
    util.log(util.colors.red(err));
    this.emit('end');
}
