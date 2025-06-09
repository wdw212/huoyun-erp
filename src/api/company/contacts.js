import request from '@/utils/request'

// 查询列表
export function listData(query) {
	return request({
		url: '/company-contacts',
		method: 'get',
		params: query
	})
}

// 查询详细
export function getData(id) {
	return request({
		url: '/company-contacts/' + id,
		method: 'get'
	})
}

// 新增
export function addData(data) {
	return request({
		url: '/company-contacts',
		method: 'post',
		data: data
	})
}

// 修改
export function updateData(data) {
	return request({
		url: '/company-contacts/' + data.id,
		method: 'put',
		data: data
	})
}

// 删除
export function delByIds(id) {
	return request({
		url: '/company-contacts/' + id,
		method: 'delete'
	})
}