import axios from "axios";
// 请求拦截器
const service = axios.create({
    headers: {
        "Content-Type": "application/json;charset=utf-8"
    },
    baseURL: '/api'
})
service.interceptors.request.use(function (config) {
    let token = localStorage.getItem("token")
    if (token) {
        config.headers.token = token
    }
    console.log("请求拦截器")
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 响应拦截器
service.interceptors.response.use(function (response) {
    console.log("响应拦截器")


    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    console.log("响应拦截器")
    return Promise.reject(error);
});

export default service;