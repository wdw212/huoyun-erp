<template>
	<div style="padding: 0 20px;">
		
		<div style="padding: 8px;background-color: #f5f5f5;margin-top: 20px;display: flex;justify-content: space-between;">
			<div style="display: flex;">
				<el-input placeholder="月份" clearable size="default"/>
				<el-input placeholder="记账税率" clearable size="default" style="margin: 0 10px"/>
				<el-button type="primary" icon="Plus" @click="">添加/编辑月份</el-button>
			</div>
			<div style="display: flex;">
				<el-button type="primary" @click="">模版下载</el-button>
				<el-button type="primary" @click="">应收发票导入</el-button>
			</div>
		</div>
		<el-table :data="tableData" border style="margin: 10px 0;" size="small">
			<el-table-column prop="title" label="" />
			<el-table-column prop="number1" label="主营业务收入总和" />
			<el-table-column prop="number1" label="税额差额总和" />
			<el-table-column prop="number1" label="含税发票差额总和" />
		</el-table>
		<table-list :tableConfig="tableConfig" :tableColumn="tableColumn" :toolbar="false" show-summary
		size="small" :multiple="false" :border="true" :number="true">
		</table-list>
		
		<search-top ref="searchTop" :queryParams="queryParamsReal" @search="searchConfirm" :btnShow="false" styleInfo="padding: 0">
			<template #fromCon>
				<el-button type="primary" icon="Search" @click=""></el-button>
				<el-button type="primary" @click="">应收发票</el-button>
				<el-button type="primary" @click="">应付发票</el-button>
				<el-button type="primary" @click="">报销发票</el-button>
			</template>
		</search-top>
		<el-table :data="tableData" border style="margin: 10px 0;" size="small">
			<el-table-column prop="title" label="" />
			<el-table-column prop="number1" label="不含税金额" />
			<el-table-column prop="number1" label="税额" />
			<el-table-column prop="number1" label="含税金额" />
			<el-table-column prop="number1" label="美金" />
		</el-table>
		<table-list :tableConfig="tableConfig1" :tableColumn="tableColumn1" :toolbar="false" show-summary
		size="small" :multiple="false" :border="true" :number="true">
		</table-list>
		
	</div>
</template>

<script setup name="RealInvoice">
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
	import { queryParamsReal } from './finance'
	const { proxy } = getCurrentInstance();
	
	onMounted(() => {
		// console.log('onMounted', queryParams);
	})
	
	const tableData = ref([
		{title: '合计', number1: 0, number2: 0, total: 0},
	])
	const tableColumn = ref([
		{label: '月份',prop: 'job_no'},
		{label: '记账汇率',prop: 'job_no'},
		{label: '应收不含税金额',prop: 'job_no'},
		{label: '税额',prop: 'job_no'},
		{label: '含税金额',prop: 'job_no'},
		{label: '查看详情',prop: 'job_no'},
		{label: '应付不含税金额',prop: 'job_no'},
		{label: '税额',prop: 'job_no'},
		{label: '含税金额',prop: 'job_no'},
		{label: '查看详情',prop: 'job_no'},
		{label: '报销不含税金额',prop: 'job_no'},
		{label: '税额',prop: 'job_no'},
		{label: '含税金额',prop: 'job_no'},
		{label: '查看详情',prop: 'job_no'},
		{label: '主营业务收入',prop: 'job_no'},
		{label: '税额差额',prop: 'job_no'},
		{label: '含税发票差额',prop: 'job_no'},
	]);
	const tableConfig = ref({
		url: '/orders',
		requestMethod: httpGet,
		isQuery: false
	})
	
	const tableColumn1 = ref([
		{label: '发票抬头',prop: 'job_no'},
		{label: '发票号',prop: 'job_no'},
		{label: '收款类型',prop: 'job_no'},
		{label: '不含税金额',prop: 'job_no'},
		{label: '税率',prop: 'job_no'},
		{label: '税额',prop: 'job_no'},
		{label: '含税金额',prop: 'job_no'},
		{label: '美金',prop: 'job_no'},
		{label: '记账汇率',prop: 'job_no'},
		{label: '归属月',prop: 'job_no'},
		{label: '登记时间',prop: 'job_no'},
		{label: '操作',prop: 'job_no'},
		{label: '备注',prop: 'job_no'},
	]);
	const tableConfig1 = ref({
		url: '/orders',
		requestMethod: httpGet,
		isQuery: false
	})
	
</script>

<style>
</style>