import { defineComponent } from "vue";
import useStore from "@/store/user";
import { Ref, ref } from "vue";
import Menu from "./components/menu";
import './index.scss'
import { RouterView, useRouter, useRoute } from "vue-router";
namespace menu {
    export interface menuType {
        name: string,
        path?: string,
        icon?: string,
        children?: menuType[]
    }
}
const dom = defineComponent({
    setup() {
        const store = useStore()
        store.addRoute()
        let menuList: Ref<menu.menuType[]> = ref([{
            name: '菜单一',
            path: '11',
            icon: "",
            children: [{
                name: '菜单一-一',
                path: '22',
                icon: "",
                children: [{
                    name: '页面一',
                    path: '/table',
                    icon: "",
                    children: []
                }]

            }]
        }, {
            name: '菜单二',
            path: '33',
            icon: "",
            children: [{
                name: '页面二',
                path: '/tree',
                icon: "",
                children: []
            }]
        }])
        const router = useRouter()
        const onClickMenuItem = (key) => {
            router.push(key)
            console.info({ content: `You select ${key}` });
        }
        const route = useRoute()
        let defaultMenu = route.path
        return { menuList, defaultMenu, onClickMenuItem }
    },
    render() {
        const { menuList, defaultMenu, onClickMenuItem } = this
        return <>
            <a-layout>
                <a-layout-header>Header</a-layout-header>
                <a-layout>
                    <a-layout-sider>
                        <a-menu default-selected-keys={[defaultMenu]} onMenu-item-click={onClickMenuItem}>
                            <Menu list={menuList}></Menu>
                        </a-menu>
                    </a-layout-sider>
                    <a-layout>
                        <RouterView></RouterView>
                    </a-layout>
                </a-layout>
            </a-layout>
        </>
    }

})
export default dom