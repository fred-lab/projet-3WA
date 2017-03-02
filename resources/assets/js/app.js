
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

Vue.component('picture-form', require('./components/PictureForm.vue'));
Vue.component('gallery-form', require('./components/GalleryForm.vue'));
Vue.component('admin-galleries', require('./components/AdminGalleries.vue'));
Vue.component('gallery-preview', require('./components/GalleryPreview.vue'));
Vue.component('main-preview', require('./components/MainPreview.vue'));

const app = new Vue({
    el: '#app',
    mounted : function () {
        console.log('App is ready to rock !')
    }
});
