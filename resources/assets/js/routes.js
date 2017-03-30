/**
 * Import Vue-Router
 */
import VueRouter from 'vue-router'

const routes = [
    /** Homepage **/
    {
        path: '/',
        name: 'homepage',
        component: require('./components/home/Homepage'),
    },
    {
        path: '/about',
        name: 'about',
        component: require('./components/home/About'),
    },{
        path: '/contact',
        name: 'contact',
        component: require('./components/home/Contact')
    },
    /** Studio **/
    {
        path: '/studio/',
        component: require('./components/studio/Studio'),
        children: [
            {
                path: 'login',
                name: 'studio.login',
                component: require('./components/auth/Login')
            },{
                path: '',
                name: 'studio.gallery.index',
                component: require('./components/studio/AdminGalleriesIndex'),
                meta: { studio: true}
            },
            {
                path: 'gallery/create',
                name: 'studio.gallery.create',
                component: require('./components/studio/GalleryForm.vue'),
                meta: { studio: true}
            },
            {
                path: 'gallery/:id(\\d+)',
                name: 'studio.gallery.show',
                component: require('./components/studio/AdminGallery'),
                meta: { studio: true}
            },
            {
                path: 'messages',
                name: 'studio.messages.index',
                component: require('./components/studio/BoiteReception'),
                meta: { studio: true}
            }
        ]
    },
    {
        path: '*',
        redirect: '/'
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
    }
]

export default new VueRouter({
    mode: 'history',
    routes
})

