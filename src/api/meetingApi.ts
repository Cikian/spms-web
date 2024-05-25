import request from '../utils/reqRepInterceptors'

export function uploadMeetingReport(data) {
    return request({
        url: '/common/upload/meetingReport',
        method: 'post',
        data
    })
}

export function addMeeting(data) {
    return request({
        url: '/meeting',
        method: 'post',
        data
    })
}

export function getMeetingByProId(data) {
    return request({
        url: '/meeting?proId=' + data,
        method: 'get',
    })
}