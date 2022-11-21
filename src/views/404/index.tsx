import { defineComponent } from "vue";
import { useRouter } from 'vue-router'
import './index.scss'
const dom = defineComponent({
    name: '404',
    setup() {
        const router = useRouter()
        const rollback = () => {
            router.back()
        }
        return { rollback }
    },
    render() {
        const { rollback } = this
        return <>
            <a-layout>
                <a-layout-content>
                    <a-empty description='网页好像被外星人劫持啦~'>
                        <a-button type="primary" onClick={rollback}>
                            <icon-left />
                            返回上一级
                        </a-button>
                    </a-empty>
                </a-layout-content>
            </a-layout>
        </>
    }

})
export default dom