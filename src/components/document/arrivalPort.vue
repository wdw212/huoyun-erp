<template>
	<div style="width: 100%;">

		<el-dialog v-model="showDrop" title="进港数据" width="30%">
			<div class="w-100 flex1">
				<el-card style="width: 100%;margin-bottom: 10px">
					<el-input v-model="data" type="textarea" :rows="25" resize="none" />
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
	const data = ref('');
	const openLoading = (val, options) => {
		console.log('openLoading', val)
		saveData.value = val;
		showDrop.value = true;
		
		data.value = `船名/航次：${val.ship_name||''}/${val.ship_no||''}`
					 + '\n' + `箱号：${val.boxInfo&&val.boxInfo.no||''}`
					 + '\n' + `封号：${val.boxInfo&&val.boxInfo.seal_number||''}` + '\n'
					 
		if(val.boxInfo&&val.boxInfo.container_items.length>0){
			var remark = '\n' + `备注：` + '\n';
			val.boxInfo.container_items.forEach((vv,ii)=>{
				data.value = data.value + '\n' + `提单号：${vv.bl_no||''}`
							 + '\n' + `${vv.quantity||''} - ${vv.gross_weight||''} - ${vv.volume||''}`
				remark = remark + `${vv.remark||''}` + '\n';
			})
			data.value = data.value + remark;
		}
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