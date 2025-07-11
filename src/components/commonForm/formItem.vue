<template>
	<div style="width: 100%;">
		<template v-if="item.type=='input'">
			<el-input v-model="saveData" 
			:style="item.style||'width:100%'"
			:placeholder="item.placeholder" clearable
			@input="changeValue" :disabled="item.disabled"/>
		</template>
		<template v-if="item.type=='textarea'">
			<el-input v-model="saveData" type="textarea"
			:style="item.style" :rows="4"
			:placeholder="item.placeholder" clearable
			@input="changeValue" :disabled="item.disabled"/>
		</template>
		<template v-if="item.type=='date'">
			<el-date-picker v-model="saveData" :style="item.style||'width:100%'"
			:placeholder="item.placeholder" 
			:value-format="item.valueFormat||'YYYY-MM-DD'" 
			:type="item.dateType||'daterange'" :disabled="item.disabled"
			:start-placeholder="item.startPlaceholder||'开始时间'" 
			:end-placeholder="item.endPlaceholder||'结束时间'" 
			:range-separator="item.rangeSeparator||'-'"  
			@change="changeValue"/>
		</template>
		<template v-if="item.type=='dateTime'">
			<el-date-picker v-model="saveData" :style="item.style||'width:100%'"
			:placeholder="item.placeholder" 
			:value-format="item.valueFormat||'YYYY-MM-DD h:m:s'" 
			:format="item.format||'YYYY-MM-DD HH:mm:ss'" 
			:type="item.dateType||'datetime'" :disabled="item.disabled"
			:start-placeholder="item.startPlaceholder||'开始时间'" 
			:end-placeholder="item.endPlaceholder||'结束时间'" 
			:range-separator="item.rangeSeparator||'-'"  
			@change="changeValue"/>
		</template>
		<template v-if="item.type=='select'">
			<el-select v-model="saveData" :style="item.style||'width:100%'"
			:placeholder="item.placeholder||'请选择'" clearable
			:disabled="item.disabled"
			@change="changeValue">
				<el-option v-for="vv in item.options" 
				:key="item.keyName?vv[item.keyName]:'id'"
				:label="item.labelName?vv[item.labelName]:vv.label"
				:value="item.valueName?vv[item.valueName]:vv.value" />
			</el-select>
		</template>
		<template v-if="item.type=='selectSearch'">
			<el-select v-model="saveData" filterable
			:style="item.style||'width:100%'"
			:disabled="item.disabled" :suffix-icon="Search"
			:multiple="item.multiple" remote
			:placeholder="item.placeholder||'请选择'"
			:reserve-keyword="item.reserveKeyword"
			:remote-show-suffix="item.remoteShowSuffix"
			:remote-method="item.remoteMethod"
			:loading="item.loading"
			@change="changeValue">
				<el-option v-for="vv in item.options"
				:key="item.keyName?vv[item.keyName]:'id'"
				:label="item.labelName?vv[item.labelName]:vv.label"
				:value="item.valueName?vv[item.valueName]:vv.value" />
			</el-select>
		</template>
	</div>
</template>

<script setup>
	import { Calendar, Search } from '@element-plus/icons-vue'
	import { ref, defineProps, watch, defineExpose, defineEmits, onMounted } from "vue";
	
	const props = defineProps({
		item: {
			type: Object,
			default: () => {
				return {}
			}
		}
	})
	
	const saveData = ref(null);
	watch(props.item, (newVal)=>{
		resetKey();
	}, {deep: true})
	
	const resetKey = (reset) => {
		saveData.value = props.item.defaultValue || props.item.value || '';
	}
	
	const changeValue = (val) => {
		var newItem = {
			...props.item
		};
		newItem.value = val;
		// console.log('newItem', newItem);
		emit('changeValue', newItem, val);
	}
	
	onMounted(() => {
		resetKey()
	})
	
	const emit = defineEmits(['changeValue'])
	defineExpose({
		
	})
	
</script>

<style>
</style>