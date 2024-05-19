import request from '../utils/reqRepInterceptors'

export function addPro(data) {
    return request({
        url: '/pro',
        method: 'post',
        data
    })
}

export function getProList() {
    return request({
        url: '/pro',
        method: 'get',
    })
}

export function getProListByStatus(data) {
    return request({
        url: '/pro/getProjectByStatus/' + data,
        method: 'get',
    })
}

export function getAddMembers() {
    return request({
        url: '/user/queryCanAddToProject',
        method: 'get',
    })
}



export function getProAddMembers(data) {
    return request({
        url: '/user/queryCanAddToProjectMember/' + data,
        method: 'get',
    })
}

export function addMember(data) {
    return request({
        url: '/pro/addMember',
        method: 'post',
        data
    })
}

export function deleteMember(data) {
    return request({
        url: '/pro/deleteMember',
        method: 'post',
        data
    })
}