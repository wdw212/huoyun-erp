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