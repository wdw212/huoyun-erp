<template>
	<div style="width: 100%;">

		<el-dialog v-model="showDrop" title="落箱数据" width="78%">
			<div class="w-100 flex1 mt-1">
				<el-card style="width: 32%">
				    <template #header>
						<div class="d-flex">
							<el-icon :size="20" color="#0db4e6"> <Setting /> </el-icon>
							<div class="font-w pl-1 font-16">集装箱基础信息</div>
						</div>
					</template>
					<el-input v-model="data1" type="textarea" :rows="25" resize="none" />
				</el-card>
				<el-card style="width: 32%">
				    <template #header>
						<div class="d-flex">
							<el-icon :size="20" color="#c596e6"> <Ship /> </el-icon>
							<div class="font-w pl-1 font-16">集装箱进港情况</div>
						</div>
					</template>
					<el-input v-model="data2" type="textarea" :rows="25" resize="none" />
				</el-card>
				<el-card style="width: 32%">
				    <template #header>
						<div class="d-flex">
							<el-icon :size="20" color="#3ad695"> <Box /> </el-icon>
							<div class="font-w pl-1 font-16">落箱未进港数据</div>
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
		Setting,
		Box,
		Ship
	} from '@element-plus/icons-vue'
	import {
		httpPost,
		httpGet
	} from '@/api/apiCommon';

	const props = defineProps({
		
	})

	const showDrop = ref(false);
	const saveData = ref('');
	const data1 = ref('');
	const data2 = ref('');
	const data3 = ref('');
	const openDrop = (val, options) => {
		console.log('openDrop', val)
		saveData.value = val;
		showDrop.value = true;
		
		var entered_port_wharf = val.entered_port_wharf_id?options.MT.find(v=>{return v.id==val.entered_port_wharf_id}):{};  //进港码头
		data1.value = `进港码头：${entered_port_wharf.name||''}`
					  + '\n' + `船名/航次：${val.ship_name}/${val.ship_no}`
					  + '\n' + `开港时间：${val.port_open_at}` + '\n' + `截港时间：${val.port_close_at}`
					  + '\n' + `提单号：${val.bl_no}`
		data2.value = `进港码头：${entered_port_wharf.name||''}`
					  + '\n' + `船名/航次：${val.ship_name}/${val.ship_no}`
					  + '\n' + `开港时间：${val.port_open_at}` + '\n' + `截港时间：${val.port_close_at}`
					  + '\n' + `提单号：${val.bl_no}`
		data3.value = `进港码头：${entered_port_wharf.name||''}`
					  + '\n' + `船名/航次：${val.ship_name}/${val.ship_no}`
					  + '\n' + `开港时间：${val.port_open_at}` + '\n' + `截港时间：${val.port_close_at}`
		
		var dropBox = {};
		val.boxInfo.forEach((item,index)=>{
			var boxType = item.container_type_id?options.XZLX.find(v=>{return v.id==item.container_type_id}):{};  //箱型
			var lxdc = item.drop_off_wharf_id?options.LX.find(v=>{return v.id==item.drop_off_wharf_id}):{};  //落箱堆场
			if(lxdc.name&&item.is_entered_port!=2){
				if(dropBox[lxdc.name]){
					dropBox[lxdc.name] = dropBox[lxdc.name] + '\n' + `箱号：${item.no||''}`;
				}else{
					dropBox[lxdc.name] = '\n' + `箱号：${item.no||''}`;
				}
			}
			data1.value = data1.value + '\n' + `箱型：${boxType.name||''}    箱号：${item.no||''}    封号：${item.seal_number||''}    序列号：${item.serial_number||''}`
			data2.value = data2.value + '\n' + `柜型：${boxType.name||''}    箱号：${item.no||''}    封号：${item.seal_number||''}    ${['未进港','未进港——预录入已做','已进港'][item.is_entered_port]}`
		})
		for(var key in dropBox){
			data3.value = data3.value + '\n' + `落箱堆场：${key}` + dropBox[key] + '\n'
		}
		data3.value = data3.value + '\n' + `落箱未进港`
	}

	onMounted(() => {

	})

	const emit = defineEmits([])
	defineExpose({
		openDrop
	})
</script>

<style>
</style>