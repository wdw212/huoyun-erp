<template>
	<div style="width: 100%;">

		<el-dialog v-model="showDrop" title="装柜数据" width="78%">
			<div class="w-100 flex1 mt-1">
				<el-card style="width: 32%">
				    <template #header>
						<div class="d-flex">
							<el-icon :size="20" color="#0db4e6"> <Refrigerator /> </el-icon>
							<div class="font-w pl-1 font-16">装柜数据</div>
						</div>
					</template>
					<el-input v-model="data1" type="textarea" :rows="25" resize="none" />
				</el-card>
				<el-card style="width: 32%">
				    <template #header>
						<div class="d-flex">
							<el-icon :size="20" color="#3fd655"> <CircleCheck /> </el-icon>
							<div class="font-w pl-1 font-16">预提装柜数据</div>
						</div>
					</template>
					<el-input v-model="data2" type="textarea" :rows="25" resize="none" />
				</el-card>
				<el-card style="width: 32%">
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

	const props = defineProps({
		
	})

	const showDrop = ref(false);
	const saveData = ref('');
	const data1 = ref('');
	const data2 = ref('');
	const data3 = ref('');
	const openLoading = (val, options) => {
		console.log('openLoading', val)
		saveData.value = val;
		showDrop.value = true;
		var boxInfo = val.boxInfo||{};
		
		var template8 = val.template8?options.MT.find(v=>{return v.id==val.template8}):{};  //进港码头
		var boxType = boxInfo.container_type_id?options.XZLX.find(v=>{return v.id==boxInfo.container_type_id}):{};  //箱型
		var lxdc = boxInfo.drop_off_wharf_id?options.LX.find(v=>{return v.id==boxInfo.drop_off_wharf_id}):{};  //落箱堆场
		var yt = boxInfo.drop_off_wharf_id?options.LX.find(v=>{return v.id==boxInfo.drop_off_wharf_id}):{};  //预提
		var txmt = boxInfo.drop_off_wharf_id?options.LX.find(v=>{return v.id==boxInfo.drop_off_wharf_id}):{};  //提箱码头
		var freight_status = boxInfo.freight_status?optionsComm['运费情况'].find(v=>{return v.value==boxInfo.freight_status}):{};  //运费情况
		
		data1.value = `装箱时间：${1} `+ '\n' +
					  `船名/航次：${val.ship_name||''}/${val.ship_no||''}`+ '\n' +
					  `提单号：${val.bl_no||''}`+ '\n' +
					  `箱号： ${boxInfo.no||''}`+ '\n' +
					  `封号： ${boxInfo.seal_number||''}`+ '\n' +
					  `箱型箱尺： ${boxType.name||''}`+ '\n' +
					  `司机信息：${boxInfo.driver||''}`+ '\n' +
					  `装箱地点：${boxInfo.no||''}`+ '\n' +
					  `拆/装箱地址：${boxInfo.no||''}`+ '\n' +
					  `1浙江省绍兴市越城区临江路460号，中日韩半导体产业园7幢4楼，小高15167517023`+ '\n' +
					  `备注：1111`+ '\n\n' +
					  `2.浙江省金华市婺城区威达日化包装实业有限公司  盛琪琪 18395990226`+ '\n' +
					  `备注：2222`+ '\n\n' +
					  `3.仙居县下各镇杏村村（创新工业园区） 仙居好生活家居用品有限公司  13566862553 郑玲丽`+ '\n' +
					  `备注：${boxInfo.no||''}`+ '\n\n' +
					  `提醒：请仔细核对提单号、箱号等和图片是否一致，如不一致请与我司联系！`+ '\n\n' +
					  `提箱地点：${txmt.name||''}`+ '\n' +
					  `进港/还箱地点：${template8.name||''}`+ '\n' +
					  `开港时间：${val.template2||''}`+ '\n' +`截港时间：${val.template6||''}`
					  
		data2.value = `提单号：${val.bl_no||''} 柜型：${boxType.name||''}   13吨  `+ '\n' +
					  `时间：8.18（周一 ）下午17点   `+ '\n' +
					  `地址：亿豪地址：仙居县官路镇工业园区  叶伟伟15272316249 郑里永(厂长)     15157658880 郑李杰15957630126 `+ '\n' +
					  `备注：箱单信息发群里   箱单不要带到工厂 不要给工厂人看 `+ '\n\n' +
					  `箱子已预提 预提费${freight_status.label||''} `+ '\n' +
					  `箱号：${boxInfo.no||''} `+ '\n' +
					  `封号：${boxInfo.seal_number||''} `+ '\n' +
					  `预提堆场地址：霞浦临港二路--明阳堆场--13685829110`+ '\n'
					  
		data3.value = `提单号：${val.bl_no||''}       箱型：${boxType.name||''}      货重：10吨	`
					  `装箱时间：8.16号周六早上9点    `
					  `装箱地址：宁波金雨科技实业有限公司，`
					  `余姚市城东冶山路589号。唐经理13454739466`
					  `备注：城东冶山路限行的，需要做通行证，进出冶山路之前请联系我并提供车牌号和挂车车牌号做通行证。 注意：早晚高峰（7：00-9：00 ； 16：00-18：00）冶山路禁行，不准进出，做了通行证也无效。谢谢！`

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