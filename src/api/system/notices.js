import request from '@/utils/request'

// 查询公告列表
export function listNotices(query) {
	return request({
		url: '/notices',
		method: 'get',
		params: query
	})
}

// 查询公告详细
export function getNotices(id) {
	return request({
		url: '/notices/' + id,
		method: 'get'
	})
}

// 新增公告
export function addNotices(data) {
	return request({
		url: '/notices',
		method: 'post',
		data: data
	})
}

// 修改公告
export function updateNotices(data) {
	return request({
		url: '/notices/' + data.id,
		method: 'put',
		data: data
	})
}

// 删除公告
export function delNotices(id) {
	return request({
		url: '/notices/' + id,
		method: 'delete'
	})
}