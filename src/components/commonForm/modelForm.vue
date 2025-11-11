<template>
	<div>
		
		<el-dialog v-model="modelShow" :title="formInfo.title||'新增'" :width="formInfo.width||'500px'" :close-on-click-modal="false">
			<el-form :model="state.saveData" label-width="auto">
				<template v-for="(item,index) in formInfo.formData">
					<el-form-item v-if="!item.hide" :label="item.label">
						<common-form-item :item="item" v-model:formValue="state.saveData[item.key]"
							@changeValue="(val)=>itemChange(val, index)"></common-form-item>
					</el-form-item>
				</template>
			</el-form>
			<template #footer>
			    <div class="dialog-footer">
					<el-button @click="cancel()">{{formInfo.cancelText||'取消'}}</el-button>
					<el-button type="primary" @click="confirm()">{{formInfo.confirmText||'确认'}}</el-button>
			    </div>
			</template>
		</el-dialog>
		
	</div>
</template>

<script setup>
	import {ref,defineProps,watch,defineExpose,defineEmits,onMounted,computed,defineComponent,nextTick} from "vue";
	import commonFormItem from "@/components/commonForm/formItem";
	
	const props = defineProps({
		formInfo: {
			type: Array,
			default: () => {
				return { }
			}
		}
	})
	
	//变量信息
	const modelShow = ref(false);
	const state = reactive({
		saveData: {},
	});
	
	const formInfo = ref({});
	watch(()=>props.formInfo, (newVal) => {
		// console.log('newVal', newVal);
		formInfo.value = newVal;
		resetKey();
	}, {
		deep: true, immediate: true
	})
	onMounted(() => {
		
	})
	
	function open(){
		modelShow.value = true;
	}
	function close(){
		modelShow.value = false;
	}
	
	//表单数据重置
	function resetKey() {
		var formData = formInfo.value.formData;
		// formData.forEach((item:any,index:number)=>{
		// 	state.saveData[item.key] = item.form.value||item.form.defaultValue;
		// })
		console.log('state.saveData', state.saveData);
	}
	
	//表单数据更新
	const itemChange = (item, index) => {
		state.saveData[item.key] = item.value
		emit('modelFormChange', item, index)
	}
	
	const cancel = () => {
		modelShow.value = false;
		emit('cancel', state.saveData);
	}
	
	const confirm = () => {
		modelShow.value = false;
		emit('confirm', state.saveData);
	}
	
	const emit = defineEmits(['modelFormChange'])
	defineExpose({
		state,
		modelShow,
		open,
		close
	})
</script>

<style>
</style>