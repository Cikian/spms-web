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

export function getCalcProTestProgress(proId) {
    return request({
        url: '/testCase/calcProTestProgress/' + proId,
        method: 'get',
    })
}

export function getWorkItemProgressCount(proId) {
    return request({
        url: '/demand/counts/' + proId,
        method: 'get',
    })
}

export function getDefectProgressCount(proId) {
    return request({
        url: '/defect/counts/' + proId,
        method: 'get',
    })
}

export function updateProStatus(proId, status) {
    return request({
        url: '/pro/changeStatus/' + proId + '/' + status,
        method: 'put',
    })
}