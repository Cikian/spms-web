import request from '../utils/reqRepInterceptors'

export function queryDemandTypes() {
    return request({
        url: '/dictionaryData/queryByTypeId/1788120802536046593',
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

export function insertNewDemand(data) {
    return request({
        url: '/demand',
        method: 'post',
        data
    })
}

export function getAllDemandByProId(proId) {
    return request({
        url: '/demand/list/' + proId,
        method: 'get'
    })
}

export function getAuditByProId(proId) {
    return request({
        url: '/demand/audit/' + proId,
        method: 'get'
    })
}

export function getAllDemandByHeadId(proId) {
    return request({
        url: '/demand/byHead/' + proId,
        method: 'get'
    })
}

export function getAllDemandByCreateId(proId) {
    return request({
        url: '/demand/byCreat/' + proId,
        method: 'get'
    })
}

export function updateDemandStatus(demandId, status) {
    return request({
        url: '/demand/changeStatus/' + demandId + '/' + status,
        method: 'put',
    })
}

export function updateDemandHeadId(demandId, headId) {
    return request({
        url: '/demand/changeHeadId/' + demandId + '/' + headId,
        method: 'put',
    })
}

export function updateDemandPriority(demandId, priority) {
    return request({
        url: '/demand/changePriority/' + demandId + '/' + priority,
        method: 'put',
    })
}

export function updateDemandType(demandId, type) {
    return request({
        url: '/demand/changeType/' + demandId + '/' + type,
        method: 'put',
    })
}

export function updateDemandSource(demandId, source) {
    return request({
        url: '/demand/changeSource/' + demandId + '/' + source,
        method: 'put',
    })
}

export function updateDemandDesc(data) {
    return request({
        url: '/demand/changeDesc',
        method: 'put',
        data
    })
}

export function updateDemandStartTime(data) {
    console.log(data)
    return request({
        url: '/demand/changeStartTime',
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

export function getDependenceWorkItemList(workItemId) {
    return request({
        url: '/demand/dependence/' + workItemId,
        method: 'get',
    })
}

export function getDemandById(workItemId) {
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

export function deleteDemandById(data) {
    return request({
        url: '/demand/' + data,
        method: 'delete',
    })
}

export function judgeProjectHeader(data) {
    return request({
        url: '/pro/judgeIsProHeader?proId=' + data,
        method: 'get',
    })
}

export function searchDemandList(proId, data) {
    return request({
        url: '/demand/search?proId=' + proId + '&keyword=' + data,
        method: 'get',
    })
}

export function getGanttRowList(proId) {
    return request({
        url: '/pro/gantt?proId=' + proId,
        method: 'get',
    })
}

export function getProTime(proId) {
    return request({
        url: '/pro/getProTime?proId=' + proId,
        method: 'get',
    })
}

export function updateTimeByGantt(proId, data) {
    return request({
        url: '/demand/changeTime?demandId=' + proId,
        method: 'put',
        data
    })
}