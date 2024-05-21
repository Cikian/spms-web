import request from '../utils/reqRepInterceptors'

export function uploadMeetingReport(data) {
    return request({
        url: '/common/upload/meetingReport',
        method: 'post',
        data
    })
}