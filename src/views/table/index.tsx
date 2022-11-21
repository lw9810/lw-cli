import { defineComponent, reactive, shallowRef } from "vue";
import lTable from "@/components/lTable/index";

export default defineComponent({
    name: 'tableCop',
    components: { lTable },
    setup() {
        const oninput = (value, event, record) => {
            console.log(value, event, record)
        }
        const columns = shallowRef([{
            title: 'Name',
            dataIndex: 'name',
            slotName: 'name',
            slot: (record, rowIndex) => <a-input onInput={(value, event) => { oninput(value, event, record) }} v-model={record.name} />
        }, {
            title: 'Salary',
            dataIndex: 'salary',
        }, {
            title: 'Address',
            dataIndex: 'address',
        }])
        const data = reactive([{
            key: '1',
            name: 'Jane Doe',
            salary: 23000,
            address: '32 Park Road, London',
            province: 'Beijing',
            city: 'Haidian',
            email: 'jane.doe@example.com'
        }, {
            key: '2',
            name: 'Alisa Ross',
            salary: 25000,
            address: '35 Park Road, London',
            email: 'alisa.ross@example.com'
        }])

        const pagination = reactive({
            total: 50,
            current: 1,
            pageSize: 10
        })
        const pageSizeChange = pageSize => {
            pagination.pageSize = pageSize

        }
        const pageChange = (current) => {
            pagination.current = current
        }

        const table = reactive({ columns, data, pagination: false })
        return { table, pagination, pageSizeChange, pageChange }

    },
    render() {
        const { table, pagination, pageSizeChange, pageChange } = this
        return <><div><lTable table={table} pagination={pagination} onPageChange={pageChange} onPageSizeChange={pageSizeChange}></lTable></div></>
    }
})