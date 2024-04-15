import request from '../utils/reqRepInterceptors'

export function queryUserList(data, userDTO) {
    return request({
        url: '/user/list?page=' + data.page + '&size=' + data.size,
        method: 'post',
        data: userDTO
    })
}