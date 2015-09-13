'use strict';

import args from 'yargs';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import del from 'del';
import gulp from 'gulp';
import iff from 'gulp-if';
import jshint from 'gulp-jshint';
import maps from 'gulp-sourcemaps';
import plumber from 'gulp-plumber';
import prefix from 'gulp-autoprefixer';
import sass from 'gulp-sass';
import uglify from 'gulp-uglify';
import util from 'gulp-util';

var production = args.argv.production;

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
        .pipe(gulp.dest('./assets/build'));
});

gulp.task('scss', () => {
    gulp.src('./assets/src/scss/app.scss')
        .pipe(plumber({errorHandler: onError}))
        .pipe(maps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(prefix('last 2 versions', 'IE 9', 'Firefox ESR'))
        .pipe(iff( ! production, maps.write('./')))
        .pipe(gulp.dest('./assets/build'));
});

gulp.task('clean', (callback) =>
    del('./assets/build', callback)
);

gulp.task('watch', () => {
    gulp.watch('./assets/src/js/**/*.js', ['js']);
    gulp.watch('./assets/src/scss/**/*.scss', ['scss']);
});

gulp.task('default', ['clean', 'js', 'scss', 'watch']);

function onError(err) {
    util.beep();
    util.log(util.colors.red(err));
    this.emit('end');
}
