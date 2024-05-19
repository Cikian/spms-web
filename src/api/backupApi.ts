import request from '../utils/reqRepInterceptors'

export function queryBackupList() {
    return request({
        url: '/backup/getBackupFileList',
        method: 'get',
    })
}

export function restore(data) {
    return request({
        url: '/backup/restore',
        method: 'post',
        data
    })
}

export function restoreInit() {
    return request({
        url: '/backup/restoreInit',
        method: 'get'
    })
}