import request from "@/utils/request";
namespace Login {
    /**
     * 用户登录表单
     */
    export interface LoginReqForm {
        username: string,
        password: string,
        picCode: string,
    }
}
/**
 * 用户登录
 * @param params 
 * @returns 
 */
export const login = (params: Login.LoginReqForm) => {
    return request.post('/admin/login', params);
}
/**
 * 获取验证码图片
 * @param params 
 * @returns 
 */
export const getCode = (params: object) => {
    // 返回的数据格式可以和服务端约定
    return request.getImg<BlobPart>('/admin/verifyCode', params);
}