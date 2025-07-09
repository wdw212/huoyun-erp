<template>
	<div style="padding: 20px;">
		<el-form :model="searchQuery" :inline="true" label-width="auto">
			<el-form-item v-for="(item,index) in queryParams" :key="item.key"
			:label="item.label" :prop="item.key" :label-width="item.labelWidth">
				<template v-if="item.type=='input'">
					<el-input v-model="searchQuery[item.key]" 
					:placeholder="item.placeholder" clearable
					@keyup.enter="handleQuery" :disabled="item.disabled"/>
				</template>
				<template v-if="item.type=='date'">
					<el-date-picker v-model="searchQuery[item.key]" 
					:placeholder="item.placeholder" :value-format="item.valueFormat||'YYYY-MM-DD'" 
					:type="item.dateType||'daterange'" :disabled="item.disabled"
					:start-placeholder="item.startPlaceholder||'开始时间'" 
					:end-placeholder="item.endPlaceholder||'结束时间'" 
					:range-separator="item.rangeSeparator||'-'"  />
				</template>
				<template v-if="item.type=='select'">
					<el-select v-model="searchQuery[item.key]" :style="item.style||'width:180px'"
					:placeholder="item.placeholder||'请选择'" clearable
					:disabled="item.disabled">
						<el-option v-for="vv in item.options" 
						:key="vv[item.keyName||'id']" 
						:label="vv[item.labelName||'label']"
						:value="vv[item.valueName||'value']" />
					</el-select>
				</template>
				<template v-if="item.type=='selectSearch'">
					<el-select v-model="searchQuery[item.key]" filterable
					:disabled="item.disabled"
					:multiple="item.multiple" remote
					:placeholder="item.placeholder||'请选择'"
					:reserve-keyword="item.reserveKeyword"
					:remote-show-suffix="item.remoteShowSuffix"
					:remote-method="item.remoteMethod"
					:loading="item.loading" :style="item.style"
					>
						<el-option v-for="vv in item.options"
						:key="vv[item.keyName||'id']" 
						:label="vv[item.labelName||'label']"
						:value="vv[item.valueName||'value']" />
					</el-select>
				</template>
			</el-form-item>
		
			<el-form-item v-show="btnShow">
				<el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
				<el-button icon="Refresh" @click="resetQuery">重置</el-button>
			</el-form-item>
			
			<el-form-item>
				<slot name="fromCon"></slot>
			</el-form-item>
		</el-form>
	</div>
</template>

<script setup>
	import { ref, defineProps, watch, defineExpose, defineEmits, onMounted } from "vue";
	
	const props = defineProps({
		queryParams: {
			type: Array,
			default: () => {
				return []
			}
		},
		searchBtnShow: {
			type: Boolean,
			default: true
		},
		resetBtnShow: {
			type: Boolean,
			default: false
		},
		btnShow: {
			type: Boolean,
			default: true
		},
	})
	
	const searchQuery = ref({});
	watch(props.queryParams, (newVal)=>{
		resetKey();
	}, {deep: true})
	
	const resetKey = (reset) => {
		props.queryParams.forEach((item)=>{
			if(searchQuery.value[item.key]&&!reset){
				searchQuery.value[item.key] = searchQuery.value[item.key];
			}else{
				searchQuery.value[item.key] = item.defaultValue || item.value || '';
			}
		})
		// console.log('searchQuery', searchQuery.value);
	}
	
	const handleQuery = (val) => {
		emit('search', searchQuery.value);
	}
	
	const resetQuery = (val) => {
		resetKey(true);
		emit('reset', searchQuery.value);
	}
	
	onMounted(() => {
		resetKey()
	})
	
	const emit = defineEmits(['search', 'reset'])
	defineExpose({
		searchQuery
	})
	
</script>

<style>
</style>