<template>
	<div style="width: 100%;">

		<el-dialog v-model="showDrop" title="装柜数据" width="78%">
			<div class="w-100 flex1 mt-1">
				<el-card style="width: 49.5%" v-if="type==1">
				    <template #header>
						<div class="d-flex">
							<el-icon :size="20" color="#3fd655"> <CircleCheck /> </el-icon>
							<div class="font-w pl-1 font-16">预提装柜数据</div>
						</div>
					</template>
					<el-input v-model="data2" type="textarea" :rows="25" resize="none" />
				</el-card>
				<el-card style="width: 49.5%">
				    <template #header>
						<div class="d-flex">
							<el-icon :size="20" color="#0db4e6"> <Refrigerator /> </el-icon>
							<div class="font-w pl-1 font-16">装柜数据</div>
						</div>
					</template>
					<el-input v-model="data" type="textarea" :rows="25" resize="none" />
				</el-card>
				<el-card style="width: 49.5%" v-if="type==2">
				    <template #header>
						<div class="d-flex">
							<el-icon :size="20" color="#f13838"> <CircleClose /> </el-icon>
							<div class="font-w pl-1 font-16">未预提装柜数据</div>
						</div>
					</template>
					<el-input v-model="data3" type="textarea" :rows="25" resize="none" />
				</el-card>
			</div>
		</el-dialog>

	</div>
</template>

<script setup>
	import {
		ref,
		defineProps,
		watch,
		defineExpose,
		defineEmits,
		onMounted
	} from "vue";
	import {
		Refrigerator,
		CircleCheck,
		CircleClose,
	} from '@element-plus/icons-vue'
	import {
		httpPost,
		httpGet
	} from '@/api/apiCommon';
	import { optionsComm } from '@/api/commonList';
	import { timeToTimestamp, timeto, getWeek } from '@/utils/index';

	const props = defineProps({
		
	})
	
	function timeShow(time, type){
		if(!time) return '';
		time = time + ':00';
		var timeNum = timeToTimestamp(time).getTime();
		var md = timeto(timeNum, 'md', '.');
		var week = getWeek(timeNum, '周');
		var h = new Date(timeNum).getHours();
		if(type==1){ // 8.18（周一 ）下午5点
			return md+'（'+week+'）'+(h>11?'下午':'上午')+(h>11?h-12:h)+'点'
		}else { // 8.16号周六早上9点
			return md+'号（'+week+'）'+(h>11?'下午':'早上')+(h>11?h-12:h)+'点'
		}
	}

	const showDrop = ref(false);
	const saveData = ref('');
	const type = ref(0);
	const data = ref('');
	const data2 = ref('');
	const data3 = ref('');
	const openLoading = (val, options) => {
		console.log('openLoading', val, options)
		saveData.value = val;
		showDrop.value = true;
		var boxInfo = val.boxInfo||{};
		var packInfo = val.packInfo||{};
		
		var entered_port_wharf = val.entered_port_wharf_id?options.MT.find(v=>{return v.id==val.entered_port_wharf_id}):{};  //进港码头
		var boxType = boxInfo.container_type_id?options.XZLX.find(v=>{return v.id==boxInfo.container_type_id}):{};  //箱型
		var lxdc = boxInfo.drop_off_wharf_id?options.LX.find(v=>{return v.id==boxInfo.drop_off_wharf_id}):{};  //落箱堆场
		var yt = boxInfo.pre_pull_wharf_id?options.YT.find(v=>{return v.id==boxInfo.pre_pull_wharf_id}):{};  //预提
		var txmt = boxInfo.wharf_id?options.MT.find(v=>{return v.id==boxInfo.wharf_id}):{};  //提箱码头
		var freight_status = boxInfo.freight_status?optionsComm['运费情况'].find(v=>{return v.value==boxInfo.freight_status}):{};  //运费情况
		// console.log('运费情况', yt)
		
		var time1 = timeShow(boxInfo.loading_at, 1);
		var time2 = timeShow(boxInfo.loading_at, 2);
		
		data.value =  `合同号：${val.contract_no||''} `+ '\n' +
					  `装箱时间：${time1} `+ '\n' +
					  `船名/航次：${packInfo.ship_info||''}`+ '\n' +
					  `提单号：${val.bl_no||''}`+ '\n' +
					  `箱号： ${packInfo.value8||''}`+ '\n' +
					  `封号： ${packInfo.value9||''}`+ '\n' +
					  `箱型箱尺： ${packInfo.value10||''}`+ '\n' +
					  `司机信息：${packInfo.value14||''}`+ '\n'
		
		if(boxInfo.pre_pull_wharf_id){
			type.value = 1;
			data2.value = `合同号：${val.contract_no||''} `+ '\n' +
						  `提单号：${val.bl_no||''}     柜型：${packInfo.value10||''}     货重：${boxInfo.cargo_weight||''}  `+ '\n' +
						  `时间：${time1}   `+ '\n'
		}else{
			type.value = 2;
			data3.value = `合同号：${val.contract_no||''} `+ '\n' +
						  `提单号：${val.bl_no||''}       箱型：${packInfo.value10||''}      货重：${boxInfo.cargo_weight||''}	`+ '\n' +
						  `装箱时间：${time2}    `+ '\n'
		}
		if(boxInfo.container_loading_addresses&&boxInfo.container_loading_addresses.length>0){
			boxInfo.container_loading_addresses.forEach((vv,ii)=>{
				if(ii==0){
					data.value = data.value + `装箱地点：${vv.address||''}`+ '\n'
				}
				data2.value = data2.value + `${ii+1}.地址：${vv.loading_address||''}，${vv.contact_name||''}--${vv.phone||''}`+ '\n' +`备注：${vv.remark||''}`+ '\n'+ '\n'
				data3.value = data3.value + `${ii+1}.装箱地址：${vv.loading_address||''}，${vv.contact_name||''}--${vv.phone||''}`+ '\n' +`备注：${vv.remark||''}`+ '\n'+ '\n'
				data.value = data.value + `${ii+1}.装箱地址：${vv.loading_address||''}，${vv.contact_name||''}--${vv.phone||''}`+ '\n' +`备注：${vv.remark||''}`+ '\n'+ '\n'
			})
		}
		
		data.value = data.value +
					  `提醒：请仔细核对提单号、箱号等和图片是否一致，如不一致请与我司联系！`+ '\n\n' +
					  `提箱地点：${packInfo.value7||''}`+ '\n' +
					  `进港/还箱地点：${packInfo.wharf||''}`+ '\n' +
					  `开港时间：${val.port_open_at||''}`+ '\n' +`截港时间：${val.port_close_at||''}`
		data2.value = data2.value +
					  `箱子已预提 预提费月结`+ '\n' +
					  `箱号：${packInfo.value8||''} `+ '\n' +
					  `封号：${packInfo.value9||''} `+ '\n' +
					  `预提堆场地址：${yt.address||''}`+ '\n'

	}

	onMounted(() => {

	})

	const emit = defineEmits([])
	defineExpose({
		openLoading
	})
</script>

<style>
</style>