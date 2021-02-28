import Vue from 'vue'
import VueRouter from 'vue-router'
import MainContainer from '@/components/MainContainer'
import Lost from '@/components/lost'
import Missing from '@/components/Missing'
import axios from "axios";
import "../mock"

Vue.use(VueRouter)

const routes = [
     {
         path: '/user/:username',
         meta: {
             requireAuth: true
         },
         component: MainContainer,
     },
    {
        path: '/user/:username/star*',
        meta: {
            requireAuth: true
        },
        component: Lost
    },
    {
        name: 'disk',
        path: '/user/:username/disk*',
        meta: {
            requireAuth: true
        },
        component: MainContainer
    },
    {
        path: '/user/:username/bin*',
        meta: {
            requireAuth: true
        },
        component: Lost
    }, {
        path: '*',
        component: Missing
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requireAuth)) {
        console.log('hh')
        axios.get('/auth'
            , {
                params: {
                    token: localStorage.getItem('Authorization'),
                    mail: localStorage.getItem('mail')
                }
            }).then(res => {
            if (res.data.message==='success') next()
            else window.location.href = '/login.html'
            next()
        }).catch(e => {
            console.log(e)
        })
    } else {
        if (to.path !== '/') {
            try {
                next()
            } catch (e) {
                console.log(e)
            }
        } else {
            let user = localStorage.getItem('username')
            if (user)
                next('/user/' + user + '/disk')
            else next('/login.html')
        }
    }
})
/*const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}*/
export default router
