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

//抬头列表
export async function getTT(keyword) {
	var params = {
		is_paginate: 0,
	}
	if(keyword){
		params.keyword = keyword;
	}
	let res = await httpGet('/company-headers', params);
	return res.data||[]
}

//业务/单据类型列表
export async function getYWLX() {
	var params = {
		is_paginate: 0,
	}
	let res = await httpGet('/order-types', params);
	return res.data||[]
}

//船公司列表
export async function getCGS() {
	var params = {
		is_paginate: 0,
	}
	let res = await httpGet('/shipping-companies', params);
	return res.data||[]
}

//码头列表
export async function getMT() {
	var params = {
		is_paginate: 0,
	}
	let res = await httpGet('/wharves', params);
	return res.data||[]
}

//车队列表
export async function getCHD() {
	var params = {
		is_paginate: 0,
	}
	let res = await httpGet('/fleets', params);
	return res.data||[]
}

//箱子类型列表
export async function getXZLX() {
	var params = {
		is_paginate: 0,
	}
	let res = await httpGet('/container-types', params);
	return res.data||[]
}

//落箱/预落堆场码头列表
export async function getLX() {
	var params = {
		is_paginate: 0,
	}
	let res = await httpGet('/yard-wharves', params);
	return res.data||[]
}


//其他选项
export const optionsComm = {
	'付款方式': [
		{label: '月结', value: 1},
		{label: '付款买单', value: 2},
	],
	'提货': [
		{label: '已提货', value: '1'},
		{label: '未提货', value: '0'},
		{label: '超期未提货', value: '2'},
	],
	'发票': [
		{label: '已开', value: '1'},
		{label: '未开', value: '2'},
	],
	'毛利润': [
		{label: '毛利润 > 0', value: '1'},
		{label: '毛利润 = 0', value: '2'},
		{label: '毛利润 < 0', value: '3'},
	],
	'费用比例': [
		{label: '符合比例', value: '1'},
		{label: '不符合比例', value: '2'},
	],
	'兑付': [
		{label: '未兑付', value: 0},
		{label: '已兑付', value: 1},
	],
	'费用完结': [
		{label: '费用未完结', value: '1'},
		{label: '费用已完结', value: '2'},
	],
	'截单状态': [
		{label: '正常截单',value: 1}, 
		{label: '等通知截单',value: 2}, 
		{label: '开港后截单',value: 3}
	],
	'提单状态': [
		{label: '正常提单',value: 1}, 
		{label: '等通知电放',value: 2}, 
		{label: '已电放',value: 3}, 
		{label: '已seawaybil',value: 4}
	],
	'完结状态': [
		{label: '已完结',value: 1}, 
		{label: '未完结',value: 0}, 
	],
	'放行': [
		{label: '已放行',value: 1}, 
		{label: '未放行',value: 0}, 
	],
	'柜型': [
		{label: '20GP', value: '20GP'},
		{label: '40HQ', value: '40HQ'},
		{label: '45HQ', value: '45HQ'},
		{label: '40RH', value: '40RH'},
		{label: '其他', value: '其他'},
	],
	'是否进港': [
		{label: '已进港',value: 1},
		{label: '未进港',value: 0}, 
	]
}