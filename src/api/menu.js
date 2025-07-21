import request from '@/utils/request'

// 获取路由
export const getRouters = (query) => {
	return request({
		url: '/permissions',
		method: 'get',
		params: query
	})
}