import axios from "axios";
import router from "../router";

const service = axios.create({
    headers: {
        "Content-Type": "application/json;charset=utf-8"
    },
    baseURL: '/api'
})

service.interceptors.request.use(function (config) {
    // 如果是上传文件，需要设置请求头为multipart/form-data
    if (config.url === "/file/upload" || config.url === "/common/upload/avatar") {
        config.headers["Content-Type"] = "multipart/form-data"
    }
    let token = localStorage.getItem("token")

    if (token !== null && token !== undefined) {
        config.headers.token = token
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

service.interceptors.response.use(function (response) {
    if (response.data.code === 401 || response.data.code === 402 || response.data.code === 405) {
        ElNotification({
            title: '警告',
            message: response.data.message,
            type: 'warning',
        })
        localStorage.removeItem("token")
        router.push("/login")
    }

    let newToken = response.headers.get("newToken");
    if (newToken) {
        localStorage.setItem("token", newToken)
    }
    return response;

}, function (error) {
    console.log("响应拦截器")
    return Promise.reject(error);
});

export default service;