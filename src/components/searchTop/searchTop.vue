<template>
	<div :style="styleInfo||'padding: 20px 20px 0;'">
		<el-form :model="searchQuery" :inline="true" label-width="auto">
			<el-form-item v-for="(item,index) in queryParams" :key="item.key"
			:label="item.label" :prop="item.key" :label-width="item.labelWidth"
			v-show="!(item.noShow||!moreShow||(moreShow&&!moreShowType&&index>showMaxNum -1))">
				<template v-if="item.type=='input'">
					<el-input v-model="searchQuery[item.key]" 
					:style="item.style||'width:180px'"
					:placeholder="item.placeholder" clearable :size="item.size||'default'"
					@keyup.enter="handleQuery" :disabled="item.disabled"/>
				</template>
				<template v-if="item.type=='date'">
					<el-date-picker v-model="searchQuery[item.key]" 
					:style="item.style||''" :size="item.size||'default'"
					:placeholder="item.placeholder" :value-format="item.valueFormat||'YYYY-MM-DD'" 
					:type="item.dateType||'daterange'" :disabled="item.disabled"
					:start-placeholder="item.startPlaceholder||'开始时间'" 
					:end-placeholder="item.endPlaceholder||'结束时间'" 
					:range-separator="item.rangeSeparator||'-'"  />
				</template>
				<template v-if="item.type=='select'">
					<el-select v-model="searchQuery[item.key]" 
					:style="item.style||'width:180px'"
					:placeholder="item.placeholder||'请选择'" clearable
					:disabled="item.disabled" :size="item.size||'default'">
						<el-option v-for="vv in item.options" 
						:key="item.keyName?vv[item.keyName]:'id'"
						:label="item.labelName?vv[item.labelName]:vv.label"
						:value="item.valueName?vv[item.valueName]:vv.value" />
					</el-select>
				</template>
				<template v-if="item.type=='selectSearch'">
					<el-select v-model="searchQuery[item.key]" 
					:style="item.style||'width:180px'" filterable
					:disabled="item.disabled" :suffix-icon="Search"
					:multiple="item.multiple" remote
					:placeholder="item.placeholder||'请选择'"
					:reserve-keyword="item.reserveKeyword"
					:remote-show-suffix="item.remoteShowSuffix"
					:remote-method="item.remoteMethod"
					:loading="item.loading" :size="item.size||'default'"
					>
						<el-option v-for="vv in item.options"
						:key="item.keyName?vv[item.keyName]:'id'"
						:label="item.labelName?vv[item.labelName]:vv.label"
						:value="item.valueName?vv[item.valueName]:vv.value" />
					</el-select>
				</template>
			</el-form-item>
		
			<el-form-item v-show="btnShow">
				<el-button type="primary" plain 
				:icon="moreShowType?CaretTop:CaretBottom"
				v-if="moreShow&&queryParams.length>showMaxNum"
				@click="moreShowType=!moreShowType">{{moreShowType?'收起':'展开更多'}}</el-button>
				<el-button type="primary" icon="Search" @click="handleQuery" v-if="searchBtnShow"
				:size="btnSize||'default'">搜索</el-button>
				<el-button icon="Refresh" @click="resetQuery" v-if="resetBtnShow"
				:size="btnSize||'default'">重置</el-button>
			</el-form-item>
			
			<el-form-item>
				<slot name="fromCon"></slot>
			</el-form-item>
		</el-form>
		
		<!-- <el-divider content-position="center">
			展开更多 <el-icon><CaretBottom /></el-icon>
		</el-divider> -->
	</div>
</template>

<script setup>
	import { CaretBottom, CaretTop, Search } from '@element-plus/icons-vue'
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
			default: true
		},
		btnShow: {
			type: Boolean,
			default: true
		},
		btnSize: {
			type: String,
			default: 'mini'
		},
		moreShow: {
			type: Boolean,
			default: true
		},
		showMaxNum: {   //最大默认显示数量
			type: Number,
			default: 10
		},
		styleInfo: {
			type: String,
			default: ''
		},
	})
	
	// 搜索项展开状态
	const moreShowType = ref(false);
	
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
		console.log('Search', Search)
	})
	
	const emit = defineEmits(['search', 'reset'])
	defineExpose({
		searchQuery
	})
	
</script>

<style scoped>
	.el-divider--horizontal{
		margin: 10px 0 20px;
	}
</style>