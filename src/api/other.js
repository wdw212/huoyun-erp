import request from '@/utils/request'

// 获取路由
export const getSelectOptions = (key) => {
	return request({
		url: '/select-options/' + key,
		method: 'get'
	})
}