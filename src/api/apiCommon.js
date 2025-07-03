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
		method: 'get',
		data: data
	})
}