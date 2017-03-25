/**
 * Import Vue-Router
 */
import VueRouter from 'vue-router'

const routes = [
    /** Homepage **/
    {
        path: '/',
        name: 'homepage',
        component: require('./components/home/Homepage')
    },
    {
        path: '/about',
        name: 'about',
        component: require('./components/home/About')
    },{
        path: '/contact',
        name: 'contact',
        component: require('./components/home/Contact')
    },
    {
        path: '/:category',
        name: 'gallery.category',
        component: require('./components/home/IndexCategory')
    },
    {
        path: '/:category/:slug',
        name: 'gallery.show',
        component: require('./components/home/Gallery'),
        props: true
    },
    /** Studio **/
    {
        path: '/gallery',
        name: 'studio.gallery.index',
        component: require('./components/studio/AdminGalleriesIndex')
    },
    {
        path: '/gallery/create',
        name: 'studio.gallery.create',
        component: require('./components/studio/GalleryForm.vue')
    },
    {
        path: '/gallery/:id(\\d+)',
        name: 'studio.gallery.show',
        component: require('./components/studio/AdminGallery')
    },
    {
        path: '/messages',
        name: 'studio.messages.index',
        component: require('./components/studio/BoiteReception')
    },
    {
        path: '*',
        redirect: '/'
    }
]

export default new VueRouter({
    mode: 'history',
    routes
})

