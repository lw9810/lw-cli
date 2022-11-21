import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import beForeEach from "./components/beForeEach";
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/login',
        name: 'login',
        component: () => import("@/views/login/index")
    },
    {
        path: '/home',
        name: 'home',
        component: () => import("@/views/home/index")
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})
/**
 * 路由守卫
 */
router.beforeEach(async (to, from, next) => {
    const BeForeEach = new beForeEach({ to, from, next }, router)
    BeForeEach.checkLogin()
})

export default router
