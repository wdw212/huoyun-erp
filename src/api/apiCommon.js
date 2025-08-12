import request from '@/utils/request'

export function httpGet(url, query) {
	return request({
		url: url,
		method: 'get',
		params: query
	})
}

export function httpPost(url, data) {
	return request({
		url: url,
		method: 'post',
		data: data
	})
}

export function httpPut(url, data) {
	return request({
		url: url,
		method: 'put',
		data: data
	})
}

export function httpDelete(url) {
	return request({
		url: url,
		method: 'delete'
	})
}