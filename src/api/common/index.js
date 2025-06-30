import request from '@/utils/request'

// 页面注明-查询详细
export function getData(params) {
	return request({
		url: '/page-annotations/get-show-by-model-type',
		method: 'get',
		params
	})
}

// 页面注明-提交
export function updateData(data) {
	return request({
		url: '/page-annotations/' + data.id,
		method: 'put',
		data
	})
}