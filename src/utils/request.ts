import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import qs from 'qs';
import { Message } from '@arco-design/web-vue'
import { useRouter } from 'vue-router'
import userStore from "@/store/user";
import { storeToRefs } from "pinia";
// 数据返回的接口
// 定义请求响应参数，不含data
interface Result {
    code: number;
    msg: string
}

// 请求响应参数，包含data
interface ResultData<T = any> extends Result {
    data?: T;
}
// 请求接口
interface PendingType {
    url?: string;
    method?: any;
    params: any;
    data: any;
    cancel: any;
}
// 取消重复请求
const pending: Array<PendingType> = [];
const CancelToken = axios.CancelToken;

const URL: string = 'http://183.215.190.178:38002'
enum RequestEnums {
    TIMEOUT = 20000,
    OVERDUE = 600, // 登录失效
    FAIL = 999, // 请求失败
    SUCCESS = 200, // 请求成功
}
const config = {
    // 默认地址
    baseURL: URL as string,
    // 设置超时时间
    timeout: RequestEnums.TIMEOUT as number,
    // 跨域时候允许携带凭证
    withCredentials: false
}

class RequestHttp {
    // 定义成员变量并指定类型
    service: AxiosInstance;
    public constructor(config: AxiosRequestConfig) {
        // 实例化axios

        axios.defaults.headers.post['Content-Type'] = 'application/json'
        this.service = axios.create(config);

        /**
         * 请求拦截器
         * 客户端发送请求 -> [请求拦截器] -> 服务器
         * token校验(JWT) : 接受服务器返回的token,存储到vuex/pinia/本地储存当中
         */
        this.service.interceptors.request.use(
            (config: AxiosRequestConfig) => {
                this.removePending(config);
                config.cancelToken = new CancelToken((c) => {
                    pending.push({ url: config.url, method: config.method, params: config.params, data: config.data, cancel: c });
                });
                // 登录流程控制中，根据本地是否存在token判断用户的登录情况        
                // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token        
                // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码        
                // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
                // localStorage.setItem('token', token);
                const store = userStore()
                const { token } = storeToRefs(store)
                const headers = {
                    Authorization: token.value,
                }
                return {
                    ...config,
                    headers: headers
                }
            },
            (error: AxiosError) => {
                // 请求报错
                Promise.reject(error)
            }
        )
        /**
         * 响应拦截器
         * 服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
         */
        this.service.interceptors.response.use(
            (response: AxiosResponse) => {
                const { data, config } = response; // 解构
                this.removePending(config);
                if (data.code === RequestEnums.OVERDUE) {
                    // 登录信息失效，应跳转到登录页面，并清空本地的token
                    const store = userStore()
                    store.clearUser()
                    useRouter().replace({
                        path: '/'
                    })
                    return Promise.reject(data);

                }
                // 全局错误信息拦截（防止下载文件得时候返回数据流，没有code，直接报错）
                if (data.code && data.code !== RequestEnums.SUCCESS) {
                    Message.error(data.msg); // 此处也可以使用组件提示报错信息
                    return Promise.reject(data)
                }
                return data;
            },
            (error: AxiosError) => {
                const { response } = error;
                if (response) {
                    this.handleCode(response.status)
                }
                if (!window.navigator.onLine) {
                    Message.error('网络连接失败');
                    // 可以跳转到错误页面，也可以不做操作
                    // return useRouter().replace({
                    //     path: '/404'
                    // });
                }
            }
        )
    }
    handleCode(code: number): void {
        switch (code) {
            case 401:
                Message.error('登录失败，请重新登录');
                break;
            default:
                Message.error('请求失败');
                break;
        }
    }
    // 移除重复请求
    removePending(config: AxiosRequestConfig) {
        for (const key in pending) {
            const item: number = +key;
            const list: PendingType = pending[key];
            // 当前请求在数组中存在时执行函数体
            if (list.url === config.url && list.method === config.method && JSON.stringify(list.params) === JSON.stringify(config.params) && JSON.stringify(list.data) === JSON.stringify(config.data)) {
                // 执行取消操作
                list.cancel('操作太频繁，请稍后再试');
                // 从数组中移除记录
                pending.splice(item, 1);
            }
        }
    }
    // 常用方法封装
    get<T>(url: string, params?: object): Promise<ResultData<T>> {
        return this.service.get(url, { params });
    }
    getImg<T>(url: string, params?: object): Promise<BlobPart> {
        return this.service.get(url, {
            params: params,
            responseType: 'arraybuffer'
        });
    }
    post<T>(url: string, params?: object): Promise<ResultData<T>> {
        return this.service.post(url, params);
    }
    postFromData<T>(url: string, params?: object): Promise<ResultData<T>> {
        return this.service.post(url, {
            data: qs.stringify(params),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        });
    }
    put<T>(url: string, params?: object): Promise<ResultData<T>> {
        return this.service.put(url, params);
    }
    delete<T>(url: string, params?: object): Promise<ResultData<T>> {
        return this.service.delete(url, { params });
    }

}

// 导出一个实例对象
export default new RequestHttp(config);