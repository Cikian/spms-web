import axios from "axios";
import {useRoute} from "vue-router";

const router = useRoute()

const service = axios.create({
    headers: {
        "Content-Type": "application/json;charset=utf-8"
    },
    baseURL: '/api'
})

service.interceptors.request.use(function (config) {
    let token = localStorage.getItem("token")
    console.log(config.url !== "/user/login" && !token)
    if (config.url !== "/user/login" && !token){
        router.push("/login")
        return
    }

    if (config.url === "/file/upload" || config.url === "/common/upload/avatar") {
        config.headers["Content-Type"] = "multipart/form-data"
    }

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