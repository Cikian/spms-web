import request from '../utils/reqRepInterceptors'

export function addPro(data) {
    return request({
        url: '/pro',
        method: 'post',
        data
    })
}

export function updatePro(data) {
    return request({
        url: '/pro',
        method: 'put',
        data
    })
}

export function deletePro(data) {
    return request({
        url: '/pro?id=' + data,
        method: 'delete',
    })
}

export function getProList() {
    return request({
        url: '/pro',
        method: 'get',
    })
}

export function getNeedCompleteProList() {
    return request({
        url: '/pro/needComplete',
        method: 'get',
    })
}

export function getMyProList() {
    return request({
        url: '/pro/myPro',
        method: 'get',
    })
}

export function getMySubmitProList() {
    return request({
        url: '/pro/mySubmit',
        method: 'get',
    })
}

export function getAuditProList() {
    return request({
        url: '/pro/audit',
        method: 'get',
    })
}

export function searchProList(data) {
    return request({
        url: '/pro/search/' + data,
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

export function addDeviceToPro(data) {
    return request({
        url: '/pro/addDevice',
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

export function deleteDevice(data) {
    return request({
        url: '/pro/deleteDevice',
        method: 'post',
        data
    })
}