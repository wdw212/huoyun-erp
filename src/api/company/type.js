import request from '@/utils/request'

// 查询列表
export function listCompanyType(query) {
	return request({
		url: '/company-types',
		method: 'get',
		params: query
	})
}

// 查询详细
export function getCompanyType(id) {
	return request({
		url: '/company-types/' + id,
		method: 'get'
	})
}

// 新增
export function addCompanyType(data) {
	return request({
		url: '/company-types',
		method: 'post',
		data: data
	})
}

// 修改
export function updateCompanyType(data) {
	return request({
		url: '/company-types/' + data.id,
		method: 'put',
		data: data
	})
}

// 删除
export function delCompanyType(id) {
	return request({
		url: '/company-types/' + id,
		method: 'delete'
	})
}