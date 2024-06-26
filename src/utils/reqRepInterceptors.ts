import axios from "axios";
import router from "../router";


const service = axios.create({
    headers: {
        "Content-Type": "application/json;charset=utf-8"
    },
    baseURL: '/api'
})

service.interceptors.request.use(function (config) {
    let token = localStorage.getItem("token")
    if (!token && (config.url !== "/user/login" && config.url !== "/user/sendEmailCode" && config.url !== "/user/verifyEmail" && config.url !== "/user/retrievePassword")) {
        router.push("/login")
        return
    }

    if (config.url === "/upload/importUser" || config.url === "/common/upload/avatar" || config.url === "/common/upload/testReport" || config.url === '/common/upload/meetingReport') {
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