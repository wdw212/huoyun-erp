import request from '@/utils/request'

// 查询列表
export function listData() {
	return request({
		url: '/invoice-types',
		method: 'get'
	})
}

// 查询详细
export function getData(id) {
	return request({
		url: '/invoice-types/' + id,
		method: 'get'
	})
}

// 新增
export function addData(data) {
	return request({
		url: '/invoice-types',
		method: 'post',
		data: data
	})
}

// 修改
export function updateData(data) {
	return request({
		url: '/invoice-types/' + data.id,
		method: 'put',
		data: data
	})
}

// 删除
export function delByIds(id) {
	return request({
		url: '/invoice-types/' + id,
		method: 'delete'
	})
}