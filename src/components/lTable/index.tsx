import { defineComponent, reactive, shallowRef, toRefs } from "vue";

export default defineComponent({
    name: 'lTable',
    props: {
        table: {
            type: Object,
            required: true
        },
        pagination: {
            type: Object,
            required: true
        }
    },
    setup(props, { emit }) {
        const { table, pagination } = toRefs(props)
        // const emit = defineEmits(['pageChange', 'pageSizeChange'])
        const columns = reactive(table.value.columns)
        const soltData = shallowRef({})
        columns.forEach(item => {
            if (item.slotName) {
                soltData.value[item.slotName] = item.slot
            }
        })
        const pageChange = (current) => {
            emit('pageChange', current)
        }
        const pageSizeChange = (pageSize) => {
            emit('pageSizeChange', pageSize)
        }
        return { table, soltData, pagination, pageChange, pageSizeChange }
    },
    render() {
        const { table, soltData, pagination, pageChange, pageSizeChange } = this
        return <>
            <a-space direction="vertical" fill>
                <a-table {...table}>{soltData}</a-table>
                <a-pagination {...pagination} onChange={pageChange} onPageSizeChange={pageSizeChange} show-total show-jumper show-page-size />
            </a-space>
        </>
    }
})