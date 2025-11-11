<template>
	<div>
		<!-- 顶部搜索 -->
		<search-top ref="searchTop" :queryParams="queryParams" @search="searchConfirm" :btnShow="false">
			<template #fromCon>
				<el-button type="primary" icon="Plus" @click="monthShow=true">添加月份利润计算</el-button>
				<el-button style="color: red;margin-left: 20px;">当月毛利润：0</el-button>
				<el-button style="color: red;">去除当月：0</el-button>
				<el-button style="color: red;">总毛利润：0</el-button>
				<el-button type="primary" @click="">利润统计</el-button>
			</template>
		</search-top>

		<!-- 表格 -->
		<table-list :tableConfig="tableConfig" :tableColumn="tableColumn" :toolbar="false" :number="true">
			<template #header>
				<el-col :span="1.5">
					<el-button type="primary" plain icon="Plus" @click="">新增</el-button>
				</el-col>
			</template>
		</table-list>

		<!-- 月利润计算 -->
		<el-dialog v-model="monthShow" title="月利润计算" width="90%" :close-on-click-modal="false">
			<el-tabs v-model="monthProfit" type="card" @tab-click="">
				<el-tab-pane label="凌亚" name="凌亚"></el-tab-pane>
				<el-tab-pane label="华奇" name="华奇"></el-tab-pane>
			</el-tabs>
			<table-list :tableConfig="tableConfigMonth" :tableColumn="tablemMonthProfit" :toolbar="false"
			:multiple="false" ref="MonthProfit" :showSummary="true" :border="true"
			@cellClick="cellClick"> </table-list>
		</el-dialog>
		<model-form ref="modelForm" :formInfo="formInfo"></model-form>
		
		<!-- 日志记录 -->
		<el-dialog v-model="logShow" title="历史记录" width="90%" :close-on-click-modal="false">
			<table-list :tableConfig="tableConfigLog" :tableColumn="tablemLogColumn" :toolbar="false"
			:number="true" :multiple="false" ref="LogTable" :border="true"> </table-list>
		</el-dialog>

	</div>
</template>

<script setup name="ProfitStatistics">
	import {
		ref,
		onMounted,
		h
	} from "vue";
	import SearchTop from "@/components/searchTop/searchTop";
	import TableList from "@/components/tableList/index";
	import ModelForm from "@/components/commonForm/modelForm";
	import {
		httpPost,
		httpGet
	} from '@/api/apiCommon'
	import { tablemMonthProfit, bxfForm, tablemLogColumn } from './finance'
	const { proxy } = getCurrentInstance();
	
	var formInfo = ref({});
	onMounted(() => {
		formInfo.value = JSON.parse(JSON.stringify(bxfForm.value));
		// console.log('onMounted', queryParams);
	})

	const queryParams = ref([{
		type: 'input',
		value: '',
		placeholder: '请输入月份',
		key: 'keyword'
	}])
	const searchConfirm = (val) => {
		console.log('searchConfirm', val)
	}
	
	// 月利润计算
	const monthProfit = ref('凌亚');
	const monthShow = ref(false);
	const disMonth = ref(['ID','名字','毛利润','小计','净利润']);
	const tableConfigMonth = ref({
		url: '/orders',
		requestMethod: httpGet,
		isQuery: true,
		cellClassName: (row,column,rowIndex,columnIndex) => {
			if(disMonth.value.indexOf(column.label)>-1){
				return 'disabled-cell'
			}
			return '';
		}
	})
	function cellClick(val){
		// console.log('cellClick', val.column.label)
		if(disMonth.value.indexOf(val.column.label)>-1){
			return;
		}
		formInfo.value.title = val.column.label;
		if(val.column.label=='备注'){
			formInfo.value.formData[0].hide = true;
			formInfo.value.formData[1].placeholder = '备注';
		}else{
			formInfo.value.formData[0].hide = false;
			formInfo.value.formData[0].placeholder = val.column.label;
			formInfo.value.formData[1].placeholder = val.column.label+'备注';
		}
		proxy.$refs.modelForm.open();
	}
	
	//历史记录
	const logShow = ref(false);
	const tableConfigLog = ref({
		url: '/orders',
		requestMethod: httpGet,
		isQuery: true
	})

	/** 查询列表 */
	const tableColumn = ref([
		{ label: '月份', prop: 'job_no' },
		{ label: '毛利润', prop: 'job_no' },
		{ label: '基本业绩', prop: 'job_no' },
		{ label: '报销费', prop: 'job_no' },
		{ label: '电话费', prop: 'job_no' },
		{ label: '公积金', prop: 'job_no' },
		{ label: '社保费', prop: 'job_no' },
		{ label: '小计', prop: 'job_no' },
		{ label: '操作费', prop: 'job_no' },
		{ label: '利润调整', prop: 'job_no' },
		{ label: '净利润', prop: 'job_no' },
		{ label: '当月利润', prop: 'job_no' },
		{ label: '除当月利润', prop: 'job_no' },
		{ label: '总计利润', prop: 'job_no' },
		{
			label: '操作',
			prop: 'actions',
			width: '208px',
			actions: [{
					label: '利润计算',
					type: 'primary',
					size: 'small',
					onClick: (row) => handleEdit(row)
				},
				{
					label: '日志记录',
					type: 'success',
					size: 'small',
					onClick: (row) => {
						logShow.value = true;
					}
				},
			]
		}
	]);
	const tableConfig = ref({
		url: '/orders',
		requestMethod: httpGet,
		isQuery: true,
	})
	// 操作处理方法
	const handleEdit = (row) => {
		console.log('编辑行:', row)
		// 这里可以打开编辑对话框等操作
		monthShow.value = true;
	}
</script>

<style scoped>
	
</style>