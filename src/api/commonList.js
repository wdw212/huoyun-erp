import { httpPost, httpGet } from '@/api/apiCommon';

//业务员列表
export async function getYWY() {
	var params = {
		is_paginate: 0,
		code: 'BUSINESS'
	}
	let res = await httpGet('/admin-users', params);
	return res.data||[]
}

//操作员列表
export async function getCZY() {
	var params = {
		is_paginate: 0,
		code: 'OPERATE'
	}
	let res = await httpGet('/admin-users', params);
	return res.data||[]
}