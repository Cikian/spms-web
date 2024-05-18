import request from '../utils/reqRepInterceptors'

export function queryDefectTypes() {
    return request({
        url: '/dictionaryData/queryByTypeId/1788490393917911051',
        method: 'get',
    })
}

export function queryDemandSource() {
    return request({
        url: '/dictionaryData/queryByTypeId/1788140939901153282',
        method: 'get',
    })
}

export function queryDemandMembers(proId) {
    return request({
        url: '/user/queryProjectMembers/' + proId + '/0',
        method: 'get',
    })
}

export function queryDemandByProId(proId) {
    return request({
        url: '/demand/list/' + proId,
        method: 'get',
    })
}

export function queryProByProId(proId) {
    return request({
        url: '/pro/getByProId/' + proId,
        method: 'get',
    })
}

export function insertNewDefect(data) {
    return request({
        url: '/defect',
        method: 'post',
        data
    })
}

export function getAllDefectByProId(proId) {
    return request({
        url: '/defect/list/' + proId,
        method: 'get'
    })
}

export function updateDefectStatus(demandId, status) {
    return request({
        url: '/defect/changeStatus/' + demandId + '/' + status,
        method: 'put',
    })
}

export function updateDefectHeadId(demandId, headId) {
    return request({
        url: '/defect/changeHeadId/' + demandId + '/' + headId,
        method: 'put',
    })
}

export function updateDefectPriority(demandId, priority) {
    return request({
        url: '/defect/changePriority/' + demandId + '/' + priority,
        method: 'put',
    })
}

export function updateDefectSeverity(demandId, severity) {
    return request({
        url: '/defect/changeSeverity/' + demandId + '/' + severity,
        method: 'put',
    })
}

export function updateDefectType(demandId, type) {
    return request({
        url: '/defect/changeType/' + demandId + '/' + type,
        method: 'put',
    })
}

export function updateDefectProbability(demandId, probability) {
    return request({
        url: '/defect/changeProbability/' + demandId + '/' + probability,
        method: 'put',
    })
}

export function updateDefectDesc(data) {
    return request({
        url: '/defect/changeDesc',
        method: 'put',
        data
    })
}

export function updateDefectStartTime(data) {
    console.log(data)
    return request({
        url: '/defect/changeStartTime',
        method: 'put',
        data
    })
}

export function updateDemandEndTime(data) {
    return request({
        url: '/demand/changeEndTime',
        method: 'put',
        data
    })
}

export function addComment(data) {
    return request({
        url: '/comment',
        method: 'post',
        data
    })
}

export function getCommentList(workItemId) {
    return request({
        url: '/comment?id=' + workItemId,
        method: 'get',
    })
}

export function getChildrenWorkItemList(workItemId) {
    return request({
        url: '/demand/child/' + workItemId,
        method: 'get',
    })
}

export function getDefectById(workItemId) {
    return request({
        url: '/demand/' + workItemId,
        method: 'get',
    })
}

export function getDemandActiveList(workItemId) {
    return request({
        url: '/demandActive?demandId=' + workItemId,
        method: 'get',
    })
}