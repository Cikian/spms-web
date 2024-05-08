import request from "../utils/reqRepInterceptors.ts";

export function getNotification() {
    return request({
        url: '/notification/getNotification',
        method: 'get',
    })
}

export function getUnreadNotificationCount() {
    return request({
        url: '/notification/getUnreadNotificationCount',
        method: 'get',
    })
}

export function getOldNotification() {
    return request({
        url: '/notification/getOldNotification',
        method: 'get',
    })
}

export function readNotification(notificationId) {
    return request({
        url: '/notification/readNotification/' + notificationId,
        method: 'get',
    })
}