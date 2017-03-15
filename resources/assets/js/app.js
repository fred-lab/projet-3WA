
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

import './bootstrap';

/**
 * Import routes file
 */
import router from './routes.js';



/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

Vue.component('admin-nav', require('./components/AdminNav.vue'));
Vue.component('picture-form', require('./components/PictureForm.vue'));
Vue.component('gallery-form', require('./components/GalleryForm.vue'));
Vue.component('admin-galleries', require('./components/AdminGalleriesIndex.vue'));
Vue.component('admin-gallery', require('./components/AdminGallery.vue'));
Vue.component('gallery-preview', require('./components/GalleryPreview.vue'));
Vue.component('main-preview', require('./components/MainPreview.vue'));

Vue.directive('focus',
    (el, value) => {
        if(value){
            Vue.nextTick(_ =>{
                el.focus()
            })
        }
})

Vue.directive('area',
    (el) => {
        Vue.nextTick(_ =>{
            el.style.height = (el.scrollHeight) + 'px'
        })
    })


const app = new Vue({
    el: '#app',
    router,
    mounted : function () {
        console.log('App is ready to rock !')
    }
});
