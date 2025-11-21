<template>
	<div>

		<!-- 顶部搜索 -->
		<search-top ref="searchTop" :queryParams="queryParamsBill" @search="searchConfirm" :btnShow="false">
			<template #fromCon>
				<el-button type="primary" icon="Search" @click="">查询</el-button>
				<el-button type="primary" @click="">导出</el-button>
			</template>
		</search-top>

		<el-table :data="tableData" border style="margin: 0 20px;" size="small" :row-class-name="tableRowClassName">
			<el-table-column prop="title" label="" />
			<el-table-column prop="number1" label="已兑付" width="300" />
			<el-table-column prop="number2" label="未兑付" width="300" />
			<el-table-column prop="total" label="合计" width="300" />
		</el-table>
		
		
		<el-tabs v-model="activeName" @tab-click="handleClick" style="margin: 20px 20px 0;">
		    <el-tab-pane label="应付人民币" name="应付人民币"></el-tab-pane>
		    <el-tab-pane label="应付美金" name="应付美金"></el-tab-pane>
		    <el-tab-pane label="应收人民币" name="应收人民币"></el-tab-pane>
		    <el-tab-pane label="应收美金" name="应收美金"></el-tab-pane>
		</el-tabs>
		<search-top ref="searchTop" :queryParams="queryParamsBill1" @search="searchConfirm" :btnShow="false" styleInfo="padding: 0 20px">
			<template #fromCon>
				<el-button type="primary" icon="Search" @click="">查询</el-button>
			</template>
		</search-top>
		<el-table :data="tableData1" border style="margin: 0 20px;" size="small" :row-class-name="tableRowClassName">
			<el-table-column prop="title" label="" />
			<el-table-column prop="number1" label="已兑付" width="300" />
			<el-table-column prop="number2" label="未兑付" width="300" />
			<el-table-column prop="total" label="合计" width="300" />
		</el-table>
		<h4 style="margin: 20px 20px 10px;font-weight: bold;">{{activeName}}发票</h4>
		<!-- 表格 -->
		<table-list :tableConfig="tableConfig" :tableColumn="tableColumn" :toolbar="false"
		style="margin: 0 20px;" size="small" :multiple="false" :border="true" :number="true"
		@cellClick="cellClick">
			<template #header>
				<el-col :span="1.5">
					<el-button type="primary" plain icon="Search" @click="">新增</el-button>
				</el-col>
			</template>
		</table-list>
		<model-form ref="modelForm" :formInfo="formInfo"></model-form>

	</div>
</template>

<script setup name="BillManage">
	import {
		ref,
		onMounted,
		h
	} from "vue";
	import SearchTop from "@/components/searchTop/searchTop";
	import TableList from "@/components/tableList/index";
	import {
		httpPost,
		httpGet
	} from '@/api/apiCommon'
	import ModelForm from "@/components/commonForm/modelForm";
	import { bxfForm, queryParamsBill, queryParamsBill1 } from './finance'
	const { proxy } = getCurrentInstance();

	var formInfo = ref({});
	onMounted(() => {
		formInfo.value = JSON.parse(JSON.stringify(bxfForm.value));
		// console.log('onMounted', queryParams);
	})

	const searchConfirm = (val) => {
		console.log('searchConfirm', val)
	}
	
	const tableData = ref([
		{title: '应付人民币开票', number1: 0, number2: 0, total: 0},
		{title: '应付人民币不开票', number1: 0, number2: 0, total: 0},
		{title: '合计', number1: 0, number2: 0, total: 0},
		{title: '应付美金开票', number1: 0, number2: 0, total: 0},
		{title: '应付美金不开票', number1: 0, number2: 0, total: 0},
		{title: '合计', number1: 0, number2: 0, total: 0},
		{title: '应收人民币开票', number1: 0, number2: 0, total: 0},
		{title: '应收人民币不开票', number1: 0, number2: 0, total: 0},
		{title: '合计', number1: 0, number2: 0, total: 0},
		{title: '应收美金开票', number1: 0, number2: 0, total: 0},
		{title: '应收美金不开票', number1: 0, number2: 0, total: 0},
		{title: '合计', number1: 0, number2: 0, total: 0},
	])
	const tableRowClassName = ({row,rowIndex}) => {
		if (row.title === '合计') {
			return 'bg-f5'
		}
		return ''
	}
	
	const activeName = ref('应付人民币')
	const handleClick = () => {
		
	}
	const tableData1 = ref([
		{title: '应付人民币开票', number1: 0, number2: 0, total: 0},
		{title: '应付人民币不开票', number1: 0, number2: 0, total: 0},
		{title: '合计', number1: 0, number2: 0, total: 0},
	])

	/** 查询列表 */
	const tableColumn = ref([
		{label: '开船日期',prop: 'job_no'},
		{label: '提单号',prop: 'job_no'},
		{label: '船名航次',prop: 'job_no'},
		{label: '单据号',prop: 'job_no'},
		{label: '发票单位',prop: 'job_no'},
		{label: '起运港',prop: 'job_no'},
		{label: '目的港',prop: 'job_no'},
		{label: '箱型',prop: 'job_no'},
		{label: '发票号',prop: 'job_no',cellClick: true},
		{label: '人民币金额',prop: 'job_no'},
		{label: '兑付情况',prop: 'job_no'},
		{label: '兑付时间',prop: 'job_no'},
		{label: '备注',prop: 'job_no',cellClick: true},
		{label: '兑付',prop: 'job_no'},
		{label: '全兑付',prop: 'job_no'},
	]);
	const tableConfig = ref({
		url: '/orders',
		requestMethod: httpGet,
		isQuery: false
	})
	function cellClick(val){
		// console.log('cellClick', val.column)
		if('发票号','备注'.indexOf(val.column.label)>-1){
			formInfo.value.title = val.column.label;
			formInfo.value.formData[0].hide = true;
			formInfo.value.formData[1].placeholder = val.column.label;
			proxy.$refs.modelForm.open();
		}
	}
	// 操作处理方法
	const handleEdit = (row) => {
		console.log('编辑行:', row)
		// 这里可以打开编辑对话框等操作
	}
</script>

<style>
	.bg-f5{background-color: #f5f5f5!important;}
</style>