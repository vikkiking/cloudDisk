import Vue from 'vue'
import VueRouter from 'vue-router'
import MainContainer from '@/components/MainContainer'
import Lost from '@/components/lost'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
    {
        path: '/user/star',
        meta: {requiresAuth: true},
        component: Lost,
        children: [
            {
                path: '*',
                component: Lost
            }
        ]
    },
    {
        name: 'disk',
        path: '/user/disk',
        meta: {requiresAuth: true},
        component: MainContainer,
        children: [
            {
                path: '*',
                component: MainContainer
            }
        ]
    },
    {
        path: '/user/bin',
        meta: {requiresAuth: true},
        component: Lost,
        children: [
            {
                path: '*',
                component: Lost
            }
        ]
    }, {
        path: '/',
        redirect: '/user/disk'
    },
    {
        path: '*',
        component: () => import('../views/404')
    }
]
const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

function go(path) {
    window.location.href = path.path
}

router.beforeEach((to, from, next) => {
    if (to.path === '/admin' || to.path === '/admin.html') {
        next()
    } else {
        if (to.matched.some(record => record.meta.requiresAuth)) {
            if (store.state.me.Authorization !== '') {
                next()
            } else
                go({path: '/login'})
        } else next()
    }
})

export default router
