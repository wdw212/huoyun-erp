<template>
	<div style="padding: 0 20px;">
		
		<search-top ref="searchTop" :queryParams="queryParamsPublic" @search="searchConfirm" :btnShow="false">
			<template #fromCon>
				<el-button type="primary" icon="Search" @click="">查询</el-button>
			</template>
		</search-top>
		
		<el-table :data="tableData3" border  size="small">
			<el-table-column prop="title" label="" />
			<el-table-column prop="number1" label="账户总余额" />
			<el-table-column prop="number1" label="截止总额" />
			<el-table-column prop="number1" label="截止2025-11-20 18:00:00总额" />
			<el-table-column prop="number1" label="至 2025-11-20 18:00:00应收总额" />
			<el-table-column prop="number1" label="至 2025-11-20 18:00:00应付总额" />
		</el-table>
		
		<div style="padding: 8px;background-color: #f5f5f5;margin-top: 20px">
			<el-button type="primary" icon="Plus" @click="">添加自定义私账</el-button>
		</div>
		<el-table :data="tableData" border style="margin: 10px 0;" size="small">
			<el-table-column prop="title" label="自定义私账" />
			<el-table-column prop="number1" label="应付人民币" />
			<el-table-column prop="number1" label="应付美金" />
			<el-table-column prop="number1" label="应收人民币" />
			<el-table-column prop="number1" label="应收美金" />
		</el-table>
		<table-list :tableConfig="tableConfig" :tableColumn="tableColumn" :toolbar="false" show-summary
		size="small" :multiple="false" :border="true" :number="true">
			<template #header>
				<el-col :span="1.5">
					<el-button type="primary" plain icon="Search" @click="">新增</el-button>
				</el-col>
			</template>
		</table-list>
		
		<el-tabs v-model="activeName" @tab-click="handleClick" style="margin: 20px 0 0;">
		    <el-tab-pane label="应付人民币" name="应付人民币"></el-tab-pane>
		    <el-tab-pane label="应付美金" name="应付美金"></el-tab-pane>
		    <el-tab-pane label="应收人民币" name="应收人民币"></el-tab-pane>
		    <el-tab-pane label="应收美金" name="应收美金"></el-tab-pane>
		</el-tabs>
		<el-table :data="tableData1" border size="small">
			<el-table-column prop="title" label="" />
			<el-table-column prop="date" label="截止日期" />
		</el-table>
		<h3 style="margin: 20px 0 10px;font-weight: bold;">{{activeName}}私账</h3>
		<!-- 表格 -->
		<table-list :tableConfig="tableConfig1" :tableColumn="tableColumn1" :toolbar="false"
		size="small" :multiple="false" :border="true" :number="true">
			<template #header>
				<el-col :span="1.5">
					<el-button type="primary" plain icon="Search" @click="">新增</el-button>
				</el-col>
			</template>
		</table-list>
		
	</div>
</template>

<script setup name="PrivateAccountingSystem">
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
	import { queryParamsPublic } from './finance'
	const { proxy } = getCurrentInstance();
	
	onMounted(() => {
		// console.log('onMounted', queryParams);
	})
	
	const searchConfirm = (val) => {
		console.log('searchConfirm', val)
	}
	
	const tableData3 = ref([
		{title: '私账人民币', number1: 0, number2: 0, total: 0},
		{title: '私账美金', number1: 0, number2: 0, total: 0},
	])
	
	const tableData = ref([
		{title: '截止2025-11-20 18:54:05', number1: 0, number2: 0, total: 0},
	])
	const tableColumn = ref([
		{label: '日期',prop: 'job_no'},
		{label: '名称',prop: 'job_no'},
		{label: '用途',prop: 'job_no'},
		{label: '账号',prop: 'job_no'},
		{label: '发票号',prop: 'job_no'},
		{label: '应付人民币',prop: 'job_no'},
		{label: '应收人民币',prop: 'job_no'},
		{label: '应付美金',prop: 'job_no'},
		{label: '应收美金',prop: 'job_no'},
		{label: '备注',prop: 'job_no'},
	]);
	const tableConfig = ref({
		url: '/orders',
		requestMethod: httpGet,
		isQuery: false
	})
	
	const activeName = ref('应付人民币')
	const handleClick = () => {
		
	}
	const tableData1 = ref([
		{title: '应付人民币', date: ''},
	])
	
	
	/** 查询列表 */
	const tableColumn1 = ref([
		{label: '日期',prop: 'job_no'},
		{label: '单据号',prop: 'job_no'},
		{label: '提单号',prop: 'job_no'},
		{label: '名称',prop: 'job_no'},
		{label: '发票号',prop: 'job_no'},
		{label: '应付人民币',prop: 'job_no'},
		{label: '备注',prop: 'job_no'},
	]);
	const tableConfig1 = ref({
		url: '/orders',
		requestMethod: httpGet,
		isQuery: false
	})
	// 操作处理方法
	const handleEdit = (row) => {
		console.log('编辑行:', row)
		// 这里可以打开编辑对话框等操作
	}
</script>

<style>
</style>