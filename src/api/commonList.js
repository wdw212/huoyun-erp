import { httpPost, httpGet } from '@/api/apiCommon';

//业务员列表
export async function getYWY(data={}) {
	var params = {
		is_paginate: 0,
		code: 'BUSINESS',
		...data
	}
	let res = await httpGet('/admin-users', params);
	return res.data||[]
}

//操作员列表
export async function getCZY(data={}) {
	var params = {
		is_paginate: 0,
		code: 'OPERATE',
		...data
	}
	let res = await httpGet('/admin-users', params);
	return res.data||[]
}

//单证员列表
export async function getDZY(data={}) {
	var params = {
		is_paginate: 0,
		code: 'DOCUMENT',
		...data
	}
	let res = await httpGet('/admin-users', params);
	return res.data||[]
}

//商务列表
export async function getSW(data={}) {
	var params = {
		is_paginate: 0,
		code: 'COMMERCE',
		...data
	}
	let res = await httpGet('/admin-users', params);
	return res.data||[]
}

//抬头列表
export async function getTT(data={}) {
	var params = {
		is_paginate: 0,
		...data
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

//预落堆场码头列表
export async function getLX(data={}) {
	var params = {
		is_paginate: 0,
		...data
	}
	let res = await httpGet('/yard-wharves', params);
	return res.data||[]
}

//销货单位列表
export async function getXHDW(data={}) {
	var params = {
		is_paginate: 0,
		...data
	}
	let res = await httpGet('/sellers', params);
	return res.data||[]
}

//装柜地址列表
export async function getZGDZ(data={}) {
	var params = {
		is_paginate: 0,
		...data
	}
	let res = await httpGet('/loading-addresses', params);
	return res.data||[]
}

//费用类型
export async function getFYLX(data={}) {
	var params = {
		is_paginate: 0,
		...data
	}
	let res = await httpGet('/fee-types', params);
	return res.data||[]
}

//港口
export async function getGK(data={}) {
	var params = {
		is_paginate: 0,
		...data
	}
	let res = await httpGet('/harbors', params);
	return res.data||[]
}

//司机
export async function getSJ(data={}) {
	var params = {
		is_paginate: 0,
		...data
	}
	let res = await httpGet('/drivers', params);
	return res.data||[]
}


//其他选项
export const optionsComm = {
	'付款方式': [
		{label: '月结', value: 1},
		{label: '付款买单', value: 2},
	],
	'提货': [
		{label: '未提货', value: '0'},
		{label: '已提货', value: 1},
		{label: '超期未提货', value: 2},
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
		{label: '未兑付', value: '0'},
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
		{label: '无提单',value: '0'}, 
		{label: '正本提单',value: 1}, 
		{label: '等通知电放',value: 2}, 
		{label: '已电放',value: 3}, 
		{label: '已seawaybil',value: 4}
	],
	'完结状态': [
		{label: '已完结',value: 1}, 
		{label: '未完结',value: '0'}, 
	],
	'放行': [
		{label: '未放行',value: '0'}, 
		{label: '已放行',value: 1}, 
	],
	'柜型': [
		{label: '20GP', value: '20GP'},
		{label: '40HQ', value: '40HQ'},
		{label: '45HQ', value: '45HQ'},
		{label: '40RH', value: '40RH'},
		{label: '其他', value: '其他'},
	],
	'是否进港': [
		{label: '未进港',value: '0'}, 
		{label: '未进港——预录入已做',value: 1},
		{label: '已进港',value: 2},
	],
	'保险': [
		{label: '不需要',value: '0'},
		{label: '需要',value: 1}, 
		{label: '已做',value: 2}, 
	],
	'运费情况': [
		{label: '月结',value: '0'}, 
		{label: '现金未付',value: 1}, 
		{label: '现金已付',value: 2},
		{label: '驮鸟未确认',value: 3},
		{label: '驮鸟已确认',value: 4},
	],
	'币种': [{
			label: 'CNY',
			value: 'cny'
		},
		{
			label: 'USD',
			value: 'usd'
		}
	],
	'人民币金额': [
		{label: '人民币大于0', value: '1'},
		{label: '人民币小于0', value: '2'},
	],
	'是否开票': [
		{label: '开票', value: '1'},
		{label: '不开票', value: '2'},
	],
	'有无发票号': [
		{label: '有发票号', value: '1'},
		{label: '无发票号', value: '2'},
	],
	'是否必选': [
		{label: '是', value: '1'},
		{label: '否', value: '0'},
	],
	'是否单选': [
		{label: '单选', value: '1'},
		{label: '多选', value: '2'},
	],
}