import request from "../utils/reqRepInterceptors.ts";

export function addAnno(data) {
    return request({
        url: '/proAnno',
        method: 'post',
        data
    })
}

export function selectByProId(proId) {
    return request({
        url: '/proAnno/byId?proId=' + proId,
        method: 'get',
    })
}