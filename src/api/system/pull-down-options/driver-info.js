import request from '@/utils/request'

// 查询列表
export function listData() {
	return request({
		url: '/drivers',
		method: 'get'
	})
}

// 查询详细
export function getData(id) {
	return request({
		url: '/drivers/' + id,
		method: 'get'
	})
}

// 新增
export function addData(data) {
	return request({
		url: '/drivers',
		method: 'post',
		data: data
	})
}

// 修改
export function updateData(data) {
	return request({
		url: '/drivers/' + data.id,
		method: 'put',
		data: data
	})
}

// 删除
export function delByIds(id) {
	return request({
		url: '/drivers/' + id,
		method: 'delete'
	})
}