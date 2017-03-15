/**
 * Import Vue-Router
 */
import VueRouter from 'vue-router'

const routes = [
    /** Homepage **/
    // {
    //     path: '/',
    //     component: require('./components/MainPreview')
    // },
    /** Studio **/
    {
        path: '/gallery',
        name: 'gallery.index',
        component: require('./components/AdminGalleriesIndex')
    },
    {
        path: '/gallery/create',
        name: 'gallery.create',
        component: require('./components/GalleryForm.vue')
    },
    {
        path: '/gallery/:id(\\d+)',
        name: 'gallery.show',
        component: require('./components/AdminGallery')
    }
]

export default new VueRouter({
    routes
})

