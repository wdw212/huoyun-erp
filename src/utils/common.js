//详情数据回显
export const detailInfo = (formList, data) => {
	formList.forEach((item, index) => {
		item.formData && item.formData.forEach((v, i) => {
			if (v.formItem && v.formItem.length > 0) {
				v.formItem.forEach((vv, ii) => {
					if(!vv.key) return;
					if (vv.key.indexOf('.')>-1){
						var key = vv.key.split('.');
						formList[index].formData[i].formItem[ii].defaultValue = data[key[0]][key[1]];
					} else {
						formList[index].formData[i].formItem[ii].defaultValue = data[vv.key];
					}
				})
			}
		})
	})
	return formList;
}

import userStore from "@/store/modules/user";
import { getYWY, getCZY, getYWLX, getTT, getCGS, getDZY, getSW, getXHDW, getMT, getXZLX,getLX,getFYLX,getGK,getSJ } from '@/api/commonList';
const role = userStore().roles;
//权限限制
export const commonParam = () => {
	var params = {
		WTTT_params: { company_type: 0 }, //委托抬头
		YFTT_params: { company_type: 1 }, //应付抬头
		SFT_params: {},  //收发通列表
	};
	if(role.indexOf('OPERATE')>-1){  //操作员
		params.WTTT_params.operation_user_id = userStore().id;
		params.YFTT_params.operation_user_id = userStore().id;
		params.SFT_params.operation_user_id = userStore().id;
	}else if(role.indexOf('SUPER_ADMIN')>-1){  //超级管理员
		
	}
	return params;
}
export const getSelect = async (callBack) => {
	var params = commonParam();
	const noCacheQuery = { _t: Date.now() };
	const yardWharves = await getLX(noCacheQuery);
	const normalizeType = (value) => {
		if (value === null || value === undefined || value === '') return null;
		const numberValue = Number(value);
		return Number.isNaN(numberValue) ? null : numberValue;
	}
	const prePullYardWharves = Array.isArray(yardWharves)
		? yardWharves.filter(item => normalizeType(item?.type) === 0)
		: [];
	const dropOffYardWharves = Array.isArray(yardWharves)
		? yardWharves.filter(item => normalizeType(item?.type) === 1)
		: [];
	var data = {
		YWY: await getYWY({status:1, ...noCacheQuery}),//业务员
		CZY: await getCZY({status:1, ...noCacheQuery}),  //操作员
		YWLX: await getYWLX(noCacheQuery), //业务类型
		WTTT: await getTT({ ...params.WTTT_params, ...noCacheQuery }), //委托公司抬头
		YFTT: await getTT({ ...params.YFTT_params, ...noCacheQuery }), //应付公司抬头
		CGS: await getCGS(noCacheQuery), //船公司
		DZY: await getDZY({status:1, ...noCacheQuery}), //单证员
		SW: await getSW({status:1, ...noCacheQuery}), //商务
		XHDW: await getXHDW(noCacheQuery), //销货单位
		MT: await getMT(noCacheQuery), //码头
		XZLX: await getXZLX(noCacheQuery),  //箱子类型
		LX: dropOffYardWharves,  //落箱堆场
		YT: prePullYardWharves,  //预提
		FYLX: await getFYLX(noCacheQuery),  //费用类型
		GK: await getGK(noCacheQuery),  //港口
		SJ: await getSJ(noCacheQuery),  //司机
	}
	callBack(data);
}

const keyInfo = {
	disabledKey: [],  //只读状态字段
	noShowKey: [],  //不显示的字段
	defaultValue: {},  //字段默认值
}
const cloneSelectOptions = (options = []) => (
	Array.isArray(options)
		? options.map((option) => (
			option && typeof option === 'object'
				? { ...option }
				: option
		))
		: []
);

const setKeyInfo = () => {
	if(role.indexOf('OPERATE')>-1){  //操作员
		keyInfo.disabledKey = ['finish_at','operate_user_id','commerce_user_id','container_type'];
		keyInfo.defaultValue.operate_user_id = userStore().id;
	}else if(role.indexOf('SUPER_ADMIN')>-1){  //超级管理员
		keyInfo.disabledKey = ['finish_at','operate_user_id','commerce_user_id'];
	}
	console.log('role',role);
	console.log('setKeyInfo',keyInfo);
	return keyInfo;
}

//单据数据字段状态处理
export const keyStatus = (formList, page, callBack) => {
	var form = JSON.parse(JSON.stringify(formList));
	
	// 下拉选择框赋值
	getSelect(function(seletData){
		console.log('YWLX.value', seletData)
		form[0].formData[0].formItem[0].options = seletData.YWLX;
		form[0].formData[0].formItem[4].options = seletData.YWY;
		form[0].formData[0].formItem[5].options = seletData.CZY;
		form[0].formData[0].formItem[6].options = seletData.DZY;
		form[0].formData[0].formItem[7].options = seletData.SW;
		form[0].formData[0].formItem[8].options = seletData.CGS;
		form[0].formData[0].formItem[10].options = cloneSelectOptions(seletData.GK);
		form[0].formData[0].formItem[11].options = cloneSelectOptions(seletData.GK);
		form[1].formData[0].formItem[0].options = seletData.XHDW;
		form[1].formData[0].formItem[1].options = seletData.WTTT;
		form[2].formData[0].formItem[10].options = seletData.MT;
		
		//业务类型默认（代拉代报）
		form[0].formData[0].formItem[0].defaultValue = seletData.YWLX[0].id;
		
		var keyInfo = setKeyInfo();
		form.forEach((item, index) => {
			item.formData && item.formData.forEach((v, i) => {
				if (v.formItem && v.formItem.length > 0) {
					v.formItem.forEach((vv, ii) => {
						if(!vv.key) return;
						if(keyInfo.disabledKey.indexOf(vv.key)>-1){
							form[index].formData[i].formItem[ii].disabled = true;
						}
						if(keyInfo.defaultValue[vv.key]||keyInfo.defaultValue[vv.key]==0){
							form[index].formData[i].formItem[ii].defaultValue = keyInfo.defaultValue[vv.key];
						}
					})
				}
			})
		})
		console.log('form', form);
		callBack&&callBack(form, seletData);
	});
}
