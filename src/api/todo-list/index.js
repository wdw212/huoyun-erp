import request from '@/utils/request'

// 查询列表
export function listData() {
	return request({
		url: '/todos',
		method: 'get'
	})
}

// 新增
export function addData(data) {
	return request({
		url: '/todos',
		method: 'post',
		data: data
	})
}

// 修改
export function updateData(data) {
	return request({
		url: '/todos/' + data.id,
		method: 'put',
		data: data
	})
}

// 删除
export function delByIds(id) {
	return request({
		url: '/todos/' + id,
		method: 'delete'
	})
}

// 备注
// 查询列表
export function listDataRemarks(params) {
	return request({
		url: '/remarks',
		method: 'get',
		params
	})
}

// 新增
export function addDataRemarks(data) {
	return request({
		url: '/remarks',
		method: 'post',
		data: data
	})
}

// 修改
export function updateDataRemarks(data) {
	return request({
		url: '/remarks/' + data.id,
		method: 'put',
		data: data
	})
}

// 删除
export function delByIdsRemarks(id) {
	return request({
		url: '/remarks/' + id,
		method: 'delete'
	})
}