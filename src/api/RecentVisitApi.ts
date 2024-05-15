import request from '../utils/reqRepInterceptors'

export function recordVisit(data, type) {
    return request({
        url: '/recentVisit/recordVisit/' + data + '/' + type,
        method: 'post',
    })
}

export function queryRecentVisits() {
    return request({
        url: '/recentVisit/getRecentVisits',
        method: 'get',
    })
}

export function queryRecentVisitsPro() {
    return request({
        url: '/recentVisit/getRecentVisitsPro',
        method: 'get',
    })
}