const { mix } = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/assets/js/app.js', 'public/js')
    .extract(['vue', 'jquery', 'axios','lodash', 'vue-router'])
    .mix.copy('node_modules/normalize-css/normalize.css', 'public/css')
    .mix.minify('public/css/normalize.css')
    .sass('resources/assets/sass/app.scss', 'public/css')
    .version();
