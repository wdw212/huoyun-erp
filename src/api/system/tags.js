import request from '@/utils/request'

// 查询列表
export function listNoticeTag(query) {
	return request({
		url: '/notice-tags',
		method: 'get',
		params: query
	})
}

// 查询详细
export function getNoticeTag(id) {
	return request({
		url: '/notice-tags/' + id,
		method: 'get'
	})
}

// 新增
export function addNoticeTag(data) {
	return request({
		url: '/notice-tags',
		method: 'post',
		data: data
	})
}

// 修改
export function updateNoticeTag(data) {
	return request({
		url: '/notice-tags/' + data.id,
		method: 'put',
		data: data
	})
}

// 删除
export function delNoticeTag(id) {
	return request({
		url: '/notice-tags/' + id,
		method: 'delete'
	})
}