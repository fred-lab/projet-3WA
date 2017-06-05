
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

/** Import Axios **/
import Axios from 'axios'

Axios.defaults.headers.common['Accept'] = 'application/json'
Axios.defaults.headers.common['Authorization'] = 'Bearer '+sessionStorage.getItem('access_token')


/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

Vue.component('admin-layout', require('./components/studio/Studio.vue'));
Vue.component('admin-nav', require('./components/studio/AdminNav.vue'));
Vue.component('gallery-form', require('./components/studio/GalleryForm.vue'));
Vue.component('admin-galleries', require('./components/studio/AdminGalleriesIndex.vue'));
Vue.component('admin-gallery', require('./components/studio/AdminGallery.vue'));
Vue.component('boite-reception', require('./components/studio/BoiteReception.vue'));

Vue.component('gallery-preview', require('./components/home/GalleryPreview.vue'));
Vue.component('homepage', require('./components/home/Homepage.vue'));
Vue.component('gallery', require('./components/home/Gallery.vue'));
Vue.component('gallery-category', require('./components/home/IndexCategory.vue'));
Vue.component('picture', require('./components/home/Picture.vue'));
Vue.component('home-nav', require('./components/home/HomeNav.vue'));
Vue.component('footer-view', require('./components/home/Footer.vue'));
Vue.component('about-view', require('./components/home/About.vue'));
Vue.component('contact-view', require('./components/home/Contact.vue'));

Vue.component('user-login', require('./components/auth/Login.vue'));

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

Vue.directive('width',
    (el) => {
        Vue.nextTick(_ =>{
            el.style.width = (el.firstChild.naturalWidth) + 'px'
        })
    })

Vue.directive('click-outside', {
    bind: function (el, binding, vnode) {
        let event = function (event) {
            if (!(el == event.target || el.contains(event.target)) ) {
                vnode.context[binding.expression](event);
            }
        };
        document.body.addEventListener('click', event)
    },
    unbind: function () {
        document.body.removeEventListener('click', this.event)
    }
})

Vue.directive('scroll', {
    inserted: (el, binding)=>{
        let handler = event => binding.value(event, el)
        window.addEventListener('scroll', handler)
    },
    unbind: binding => window.removeEventListener('scroll', binding.value)
})


Vue.directive('wheel', {
    inserted: (el, binding) =>{
        let handler = event => {
            let direction = event.deltaY > 0 ? 'down' : 'up'
            binding.value(direction)
            // console.log('wheelDelta ', event.deltaY)
        }
        window.addEventListener('wheel', handler)
    },
    unbind: (el, binding) => window.removeEventListener('wheel', binding.value)
})

Vue.directive('touch', {
    inserted: (el, binding) =>{
        let origin, final = 0
        const sensitivity = 100
        let direction = ''

        let getPosition = event => {
            origin = event.touches[0].clientY
            // console.log('origin ', origin)
        }

        let getDirection = event =>{
            final = event.changedTouches[0].clientY
            // console.log('final ', final)

            if(Math.abs(origin - final ) > sensitivity){
                if(origin > final){
                    direction = 'down'
                }
                else {
                    direction = 'up'
                }
                binding.value(direction)
            }
        }

        window.addEventListener('touchstart', getPosition)
        window.addEventListener('touchmove', getDirection)
    },
    unbind: (el, binding) => window.removeEventListener('touch', binding.value)
})



router.beforeEach((to, from, next) =>{
    if(to.matched.some(e => e.meta.studio)){
        if( ! Vue.auth.isAuthenticated()){
            next({
                name: 'studio.login'
            })
        }
        else{
            next()
        }
    }
    else{
        next()
    }
})



const app = new Vue({
    el: '#app',
    data:{
        transition: ''
    },
    router,
    mounted : function () {
        console.log('App is ready to rock !')
    }
});
