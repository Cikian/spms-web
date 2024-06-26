import request from '../utils/reqRepInterceptors'

export function queryTestPlanList(data, condition, type) {
    return request({
        url: '/testPlan/list?page=' + data.page + '&size=' + data.size + '&type=' + type + '&status=' + data.status,
        method: 'post',
        data: condition
    })
}

export function queryTestPlanListByProId(data) {
    return request({
        url: '/testPlan/listByProId?proId=' + data.proId + '&testPlanName=' + data.testPlanName + '&status=' + data.status,
        method: 'get',
    })
}

export function queryTestPlanByDemandId(demandId) {
    return request({
        url: '/testPlan/byDemand/' + demandId,
        method: 'get',
    })
}

export function queryTestPlanById(data) {
    return request({
        url: '/testPlan/queryById/' + data,
        method: 'get',
    })
}

export function addTestPlan(data) {
    return request({
        url: '/testPlan/add',
        method: 'post',
        data
    })
}

export function addTestCase(data) {
    return request({
        url: '/testCase/add',
        method: 'post',
        data
    })
}

export function queryTestCaseByPlanId(data) {
    return request({
        url: '/testCase/list/' + data,
        method: 'get',
    })
}

export function updateTestPlan(data) {
    return request({
        url: '/testPlan/update',
        method: 'post',
        data
    })
}

export function queryTestCaseById(data) {
    return request({
        url: '/testCase/queryById/' + data,
        method: 'get',
    })
}

export function updateTestCase(data) {
    return request({
        url: '/testCase/update',
        method: 'post',
        data
    })
}

export function deleteTestCaseById(data) {
    return request({
        url: '/testCase/delete/' + data,
        method: 'post'
    })
}

export function queryTestReportByPlanId(data) {
    return request({
        url: '/testReport/list/' + data,
        method: 'get',
    })
}

export function deleteTestReportById(data) {
    return request({
        url: '/testReport/delete/' + data,
        method: 'post'
    })
}

export function updateTestReportApprovalStatusById(data, status) {
    return request({
        url: '/testReport/update/' + data + '/' + status,
        method: 'post'
    })
}

export function uploadTestReport(data, config) {
    return request({
        url: '/common/upload/testReport',
        method: 'post',
        data,
        ...config
    })
}


export function queryAllPendingByProId(data) {
    return request({
        url: '/testPlan/listAllPendingByProId?proId=' + data,
        method: 'get',
    })
}

export function updateReviewStatus(data) {
    return request({
        url: '/testPlan/updateReviewStatus/' + data.testPlanId + '/' + data.reviewResult,
        method: 'post',
    })
}

export function listMySubmit(data, condition) {
    return request({
        url: '/testPlan/listMySubmit?page=' + data.page + '&size=' + data.size + '&reviewStatus=' + data.reviewStatus,
        method: 'post',
        data: condition
    })
}


export function finishTestPlan(data) {
    return request({
        url: '/testPlan/finishTestPlan/' + data,
        method: 'post',
    })
}