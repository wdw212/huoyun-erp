import request from '@/utils/request'

// 查询部门列表
export function list(query) {
	return request({
		url: '/activity-logs',
		method: 'get',
		params: query
	})
}