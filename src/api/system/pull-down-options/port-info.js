import request from '@/utils/request'

// 查询列表
export function listData(params) {
	return request({
		url: '/harbors',
		method: 'get',
		params
	})
}

// 查询详细
export function getData(id) {
	return request({
		url: '/harbors/' + id,
		method: 'get'
	})
}

// 新增
export function addData(data) {
	return request({
		url: '/harbors',
		method: 'post',
		data: data
	})
}

// 修改
export function updateData(data) {
	return request({
		url: '/harbors/' + data.id,
		method: 'put',
		data: data
	})
}

// 删除
export function delByIds(id) {
	return request({
		url: '/harbors/' + id,
		method: 'delete'
	})
}

// 下载模板
export function downLoadTemplate(params) {
	return request({
		url: '/harbors/import-template',
		method: 'get'
	})
}

// 批量上传
export function batchImport(data) {
	return request({
		url: '/harbors/batch-import',
		method: 'post',
		data
	})
}