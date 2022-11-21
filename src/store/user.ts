import router from '@/router'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const useStore = defineStore('user', () => {
  let userInfo = ref()
  let token = ref()


  const addRoute = () => {
    const routeList =
      [{
        title: '树',
        name: 'tree',
        path: '/tree',
        icon: "",
        component: 'tree/index',
      }, {
        title: '表格',
        name: 'tableCop',
        path: '/table',
        icon: "",
        component: 'table/index',
      },
      ]
    // 获取views下所有的.tsx结尾的文件(自行替换.vue或.js)
    const modules = import.meta.glob("../**/*.tsx")

    routeList.map(item => {
      router.addRoute('home',
        {
          name: item.name,
          path: item.path,
          component: modules[`../views/${item.component}.tsx`],
        }
      )
    })
    router.addRoute(
      {
        name: '404',
        path: '/404',
        component: modules[`../views/404/index.tsx`],
      }
    )
    router.addRoute(
      {
        path: "/:pathMath(.*)", // 此处需特别注意置于最底部
        redirect: "/404",
      }
    )
  }

  const setUserInfo = (data: object) => {
    userInfo.value = data
  }
  const setToken = (data: string) => {
    token.value = data
  }
  const clearUser = () => {
    userInfo.value = {}
    token.value = ''
  }

  return {
    userInfo,
    token,
    setUserInfo,
    setToken,
    clearUser,
    addRoute
  }
}, { persist: true }
)

export default useStore