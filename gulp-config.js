module.exports = {
    // Browser sync proxy
    proxy: 'http://localhost/gulp',

    // Task source, destination and watch globs
    vendorJs: {
        src: [],
        dest: './build'
    },
    js: {
        src: [
            './assets/js/**/*.js',
            './assets/js/app.js'
            // ...
        ],
        dest: './build',
        watch: './assets/js/**/*.js',
    },
    scss: {
        src: './assets/scss/app.scss',
        dest: './build',
        watch: './assets/scss/**/*.scss'
    },
    svg: {
        src: './assets/svg/*.svg',
        dest: './build',
        watch: './assets/svg/*.svg',
        options: {
            customClass: function (className, fileName) {
                return 'icon-' + className;
            }
        }
    }
};
