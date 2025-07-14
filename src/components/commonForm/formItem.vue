<template>
	<div style="width: 100%;">
		<template v-if="newItem.type=='input'">
			<el-input v-model="saveData" 
			:style="newItem.style||'width:100%'"
			:placeholder="newItem.placeholder||'请输入'" clearable
			@input="changeValue" :disabled="newItem.disabled"/>
		</template>
		<template v-if="newItem.type=='textarea'">
			<el-input v-model="saveData" type="textarea"
			:style="newItem.style" :rows="4"
			:placeholder="newItem.placeholder||'请输入'" clearable
			@input="changeValue" :disabled="newItem.disabled"/>
		</template>
		<template v-if="newItem.type=='date'">
			<el-date-picker v-model="saveData" :style="newItem.style||'width:100%'"
			:placeholder="newItem.placeholder" 
			:value-format="newItem.valueFormat||'YYYY-MM-DD'" 
			:type="newItem.dateType||'daterange'" :disabled="newItem.disabled"
			:start-placeholder="newItem.startPlaceholder||'开始时间'" 
			:end-placeholder="newItem.endPlaceholder||'结束时间'" 
			:range-separator="newItem.rangeSeparator||'-'"  
			@change="changeValue"/>
		</template>
		<template v-if="newItem.type=='dateTime'">
			<el-date-picker v-model="saveData" :style="newItem.style||'width:100%'"
			:placeholder="newItem.placeholder" 
			:value-format="newItem.valueFormat||'YYYY-MM-DD h:m:s'" 
			:format="newItem.format||'YYYY-MM-DD HH:mm:ss'" 
			:type="newItem.dateType||'datetime'" :disabled="newItem.disabled"
			:start-placeholder="newItem.startPlaceholder||'开始时间'" 
			:end-placeholder="newItem.endPlaceholder||'结束时间'" 
			:range-separator="newItem.rangeSeparator||'-'"  
			@change="changeValue"/>
		</template>
		<template v-if="newItem.type=='select'">
			<el-select v-model="saveData" :style="newItem.style||'width:100%'"
			:placeholder="newItem.placeholder||'请选择'" clearable
			:disabled="newItem.disabled"
			@change="changeValue">
				<el-option v-for="vv in newItem.options" 
				:key="newItem.keyName?vv[newItem.keyName]:'id'"
				:label="newItem.labelName?vv[newItem.labelName]:vv.label"
				:value="newItem.valueName?vv[newItem.valueName]:vv.value" />
			</el-select>
		</template>
		<template v-if="newItem.type=='selectSearch'">
			<el-select v-model="saveData" filterable
			:style="newItem.style||'width:100%'"
			:disabled="newItem.disabled"
			:multiple="newItem.multiple" remote
			:placeholder="newItem.placeholder||'请选择'"
			:reserve-keyword="newItem.reserveKeyword"
			:remote-show-suffix="newItem.remoteShowSuffix"
			:remote-method="remoteMethod"
			:loading="newItem.loading"
			@change="changeValue">
				<el-option v-for="vv in newItem.options"
				:key="newItem.keyName?vv[newItem.keyName]:'id'"
				:label="newItem.labelName?vv[newItem.labelName]:vv.label"
				:value="newItem.valueName?vv[newItem.valueName]:vv.value" />
			</el-select>
		</template>
	</div>
</template>

<script setup>
	import { ref, defineProps, watch, defineExpose, defineEmits, onMounted } from "vue";
	import { Calendar, Search } from '@element-plus/icons-vue'
	
	const props = defineProps({
		item: {
			type: Object,
			default: () => {
				return {}
			}
		},
		formValue: ''
	})
	
	const saveData = ref(null);
	const newItem = ref({});
	watch(props.item, (newVal)=>{
		console.log('formItem.item', newVal);
		newItem.value = newVal;
		resetKey();
	}, {deep: true})
	watch(props.formValue, (newVal)=>{
		console.log('formItem.formValue', newVal);
		saveData.value = props.formValue;
	}, {deep: true})
	
	const updateItem = (item) => {
		newItem.value = item;
		resetKey();
		console.log('updateItem', newItem.value);
	}
	
	const resetKey = (reset) => {
		// saveData.value = newItem.value.defaultValue || newItem.value.value || '';
		saveData.value = props.formValue;
		console.log('formItem', saveData.value);
	}
	
	const remoteMethod = async (val) => {
		if(val){
			var methodType = newItem.value.method=='get'?httpGet:httpPost;
			let res = await methodType(newItem.value.url, {
				keyword: val
			});
			newItem.value.options = res.data||[];
		}else{
			newItem.value.options = [];
		}
	}
	
	const changeValue = (val) => {
		var newItems = {
			...newItem.value
		};
		newItems.value = val;
		// console.log('newItems', newItems);
		emit('changeValue', newItems);
	}
	
	onMounted(() => {
		newItem.value = props.item;
		console.log('formItem', props);
		resetKey()
	})
	
	const emit = defineEmits(['changeValue'])
	defineExpose({
		updateItem
	})
	
</script>

<style>
</style>