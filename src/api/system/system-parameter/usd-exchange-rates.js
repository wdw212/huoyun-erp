import request from '@/utils/request'

// 查询列表
export function listData(query) {
	return request({
		url: '/usd-exchange-rates',
		method: 'get',
		params: query
	})
}

// 查询详细
export function getData(id) {
	return request({
		url: '/usd-exchange-rates/' + id,
		method: 'get'
	})
}

// 新增
export function addData(data) {
	return request({
		url: '/usd-exchange-rates',
		method: 'post',
		data: data
	})
}

// 修改
export function updateData(data) {
	return request({
		url: '/usd-exchange-rates/' + data.id,
		method: 'put',
		data: data
	})
}

// 删除
export function delByIds(id) {
	return request({
		url: '/usd-exchange-rates/' + id,
		method: 'delete'
	})
}