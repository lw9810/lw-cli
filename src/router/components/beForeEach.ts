import { Router } from "vue-router";
import useStore from "@/store/user";
import { storeToRefs } from "pinia";
import { Message } from '@arco-design/web-vue'

export default class beForeEach {
    router: Router;
    next: any;
    from: any;
    to: any;
    constructor({ to, from, next }: any, router: Router) {
        this.to = to
        this.from = from
        this.next = next
        this.router = router
    }
    /**
     * 检查路由是否存在
     * @returns 
     */
    checkAuth() {
        if (this.router.getRoutes().length <= 3) {
            const store = useStore()
            store.addRoute()
            this.next({ ...this.to, replace: true })
        } else if (!this.router.hasRoute(this.to.name)) {
            this.next({ path: '/404' })
        } else {
            this.next()
        }
    }
    /**
     * 检查是否登录
     * @returns 未登录跳转登录页 登录后前往登录页调转到home页 登录后判断是否调转404
     */
    checkLogin() {
        const store = useStore()
        const { token } = storeToRefs(store)
        if (!token.value && this.to.name != "login") {
            this.next({ path: '/' })
            Message.warning('请先登录');
        } else if (token.value && this.to.name == "login") {
            this.next({ path: '/home' })
        } else {
            this.checkAuth()
        }

    }
}