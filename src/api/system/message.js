import request from '@/utils/request'

// 未读列表
export function unreadIndex(query) {
	return request({
		url: '/notifications/unread-index',
		method: 'get'
	})
}
// 列表
export function getData(query) {
	return request({
		url: '/notifications',
		method: 'get',
		params: query
	})
}
// 全部设为已读
export function markAsRead(query) {
	return request({
		url: '/notifications/mark-as-read',
		method: 'put'
	})
}
// 单条设为已读
export function read(id) {
	return request({
		url: '/notifications/read/' + id,
		method: 'put'
	})
}


// 删除
export function destroy(id) {
	return request({
		url: '/notifications/destroy/' + id,
		method: 'delete'
	})
}