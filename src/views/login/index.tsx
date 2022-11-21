import './index.scss'
import logo from '~@static/images/kxhk-logo.png'
import { defineComponent, ref, reactive } from "vue";
import { getCode, login } from '@/api/login';
import checkCodeofRandom from '@/utils/code'
import useStore from '@/store/user';
import { useRouter } from "vue-router";
const dom = defineComponent({
    setup() {
        
        const router = useRouter()
        const ruleFormRef = ref()
        const loginForm = reactive({
            username: '',
            password: '',
            picCode: ''
        })
        const rules = reactive({
            username: [{ required: true, message: '请输入用户名' },],
            password: [{ required: true, message: '请输入密码' },],
            picCode: [{ required: true, message: '请输入验证码' },]
        })
        let codeUrl = ref()
        const getCodeUrl = () => {
            getCode({ picCode: checkCodeofRandom() }).then((res: BlobPart) => {
                const myBlob = new window.Blob([res], { type: "image/jpeg" });
                codeUrl.value = window.URL.createObjectURL(myBlob);
            })
        }
        getCodeUrl()
        const submitForm = async ({ errors }) => {
            if (!errors) {
                await login(loginForm).then(res => {
                    const data: any = res.data
                    const store = useStore()
                    store.setToken(data.tokenValue)
                    store.setUserInfo(data)
                    router.push('/home')
                })
            }
        }
        return { ruleFormRef, loginForm, rules, codeUrl, submitForm, getCodeUrl }
    },
    render() {
        const { ruleFormRef, loginForm, rules, codeUrl, submitForm, getCodeUrl } = this

        return <>
            <a-layout class="layout">
                <a-layout-header class="header">
                    <a-image src={logo} class="logo" preview={false} />
                </a-layout-header>
                <a-layout-content class="main">
                    <a-card class="login-box">
                        <div>账户登录</div>
                        <a-form ref="ruleFormRef" model={loginForm} status-icon rules={rules} onSubmit={submitForm} >
                            <a-form-item label="" field="username" validate-trigger={['blur']} hide-asterisk hide-label>
                                <a-input v-model={loginForm.username} allow-clear placeholder="请输入账号" />
                            </a-form-item>
                            <a-form-item label="" field="password" validate-trigger={['blur']} hide-asterisk hide-label>
                                <a-input-password v-model={loginForm.password} allow-clear placeholder="请输入密码" />
                            </a-form-item>
                            <a-form-item label="" field="picCode" validate-trigger={['blur']} hide-asterisk hide-label>
                                <a-input v-model={loginForm.picCode} allow-clear placeholder="请输入验证码" >
                                    {{ suffix: () => <a-image onClick={getCodeUrl} preview={false} style="" src={codeUrl} /> }}
                                </a-input>
                            </a-form-item>
                            <a-form-item hide-label>
                                <a-button html-type="submit" type="primary" >登录</a-button>
                            </a-form-item>
                        </a-form>
                    </a-card>
                </a-layout-content>
            </a-layout>
        </>
    }


})
export default dom