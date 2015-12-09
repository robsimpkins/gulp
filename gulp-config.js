module.exports = {
    // Gulp tasks
    tasks: {
        clean: {
            src: ['./build/svg', './build']
        },
        image: {
            src: './assets/images/**.*',
            dest: './build/images'
        },
        js: {
            src: [
                './assets/js/**/*.js',
                './assets/js/app.js'
                // ...
            ],
            concat: 'app.js',
            dest: './build',
            watch: './assets/js/**/*.js'
        },
        scss: {
            src: './assets/scss/app.scss',
            concat: 'app.css',
            dest: './build',
            watch: './assets/scss/**/*.scss'
        },
        svg: {
            src: './assets/svg/*.svg',
            concat: 'icons.css',
            dest: './build',
            watch: './assets/svg/*.svg'
        },
        vendorJs: {
            src: [
                './vendor/**/*.js'
                // ...
            ],
            concat: 'vendor.js',
            dest: './build'
        }
    },

    // Gulp plugins
    plugins: {
        autoprefix: {
            browsers: ['last 2 versions', 'IE 9', 'Firefox ESR']
        },
        browserSync: {
            proxy: 'http://localhost/gulp'
        },
        imageDataUri: {
            customClass: function (className, file) {
                return 'icon-' + className.toLowerCase();
            },
            template: {
                file: './data-uri-template.css'
            }
        },
        sass: {
            outputStyle: 'compressed'
        }
    }
};
