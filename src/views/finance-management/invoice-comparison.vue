<template>
	<div style="padding: 0 20px;">
		
		<el-table :data="tableData" border style="margin: 10px 0;" size="small">
			<el-table-column prop="number1" label="系统总计" />
			<el-table-column prop="number1" label="真实总计" />
			<el-table-column prop="number1" label="系有真有(去重)" />
			<el-table-column prop="number1" label="系有真有(去重、金额不相等)" />
			<el-table-column prop="number1" label="系有真无" />
			<el-table-column prop="number1" label="系无真有" />
		</el-table>
		
		<search-top ref="searchTop" :queryParams="queryParamsComparison" @search="searchConfirm" :btnShow="false" styleInfo="padding: 20px 0 0">
			<template #fromCon>
				<el-button type="primary" icon="Search" @click=""></el-button>
			</template>
		</search-top>
		<el-tabs v-model="activeName" @tab-click="handleClick" >
		    <el-tab-pane label="系统发票有，真实发票有" name="系统发票有，真实发票有"></el-tab-pane>
		    <el-tab-pane label="系统发票有，真实发票无" name="系统发票有，真实发票无"></el-tab-pane>
		    <el-tab-pane label="系统发票无，真实发票有" name="系统发票无，真实发票有"></el-tab-pane>
		</el-tabs>
		<h4 style="margin: 20px 0 10px;font-weight: bold;">{{activeName}}</h4>
		<!-- 表格 -->
		<table-list :tableConfig="tableConfig" :tableColumn="tableColumn" :toolbar="false"
		size="small" :multiple="false" :border="true" :number="true">
		</table-list>
		
	</div>
</template>

<script setup name="InvoiceComparison">
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
	import { queryParamsComparison } from './finance'
	const { proxy } = getCurrentInstance();
	
	onMounted(() => {
		// console.log('onMounted', queryParams);
	})
	
	const tableData = ref([
		{title: '合计', number1: 0, number2: 0, total: 0},
	])
	
	const activeName = ref('系统发票有，真实发票有')
	const handleClick = () => {
		
	}
	
	const tableColumn = ref([
		{label: '发票抬头',prop: 'job_no'},
		{label: '发票号',prop: 'job_no'},
		{label: '发票类型',prop: 'job_no'},
		{label: '真实发票人民币',prop: 'job_no'},
		{label: '真实发票美金',prop: 'job_no'},
		{label: '系统金额',prop: 'job_no'},
		{label: '归属月',prop: 'job_no'},
		{label: '登记时间',prop: 'job_no'},
	]);
	const tableConfig = ref({
		url: '/orders',
		requestMethod: httpGet,
		isQuery: false
	})
	
</script>

<style>
</style>