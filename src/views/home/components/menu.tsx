import { defineComponent, PropType, toRefs } from "vue";
export default defineComponent({
    name: 'menuItem',
    props: {
        list: {
            type: Array as PropType<Array<any>>,
            required: true
        }
    },
    setup(props) {
        let { list } = toRefs(props)
        return { list }
    },
    render() {
        const { list } = this
        return <>
            {list.map(item => {
                return (
                    item.children?.length ?
                        <a-sub-menu key={item.path + item.name}>
                            {{
                                title: () => <span>{item.name}</span>,
                                default: () => <menuItem list={item.children}></menuItem>
                            }}
                        </a-sub-menu>
                        : <a-menu-item key={item.path}>{item.name}</a-menu-item>
                )
            })}
        </>
    }
})