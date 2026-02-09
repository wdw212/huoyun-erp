<template>
	<div style="padding: 0 20px;" v-loading="loading">
		
		<search-top ref="searchTop" :queryParams="queryParamsPublic" @search="searchConfirm" :btnShow="false">
			<template #fromCon>
				<el-button type="primary" icon="Search" @click="">查询</el-button>
				<el-button type="primary" icon="Refresh" @click="init()"></el-button>
			</template>
		</search-top>
		
		<el-table :data="accountTable" border  size="small">
			<el-table-column prop="title" label="" />
			<el-table-column prop="total_amount" label="账户总余额" />
			<el-table-column prop="cut_off_amount" :label="'截止 '+currTime+'总额'" />
			<el-table-column prop="cut_off_income_amount" :label="'至 '+currTime+'应收总额'" />
			<el-table-column prop="cut_off_expense_amount" :label="'至 '+currTime+'应付总额'" />
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
			<el-table-column prop="money" :label="'截止'+currTime" />
		</el-table>
		<h4 style="margin: 20px 0 10px;font-weight: bold;">{{activeName}}私账</h4>
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
	import { getOptions } from './finance'
	import { formatChinaTime } from '@/utils/utils'
	const { proxy } = getCurrentInstance();
	
	const accountTable = ref([]);
	const currTime = ref('');
	const loading = ref(false);
	const queryParamsPublic = ref([]);
	
	onMounted(async () => {
		// console.log('onMounted', queryParams);
		queryParamsPublic.value = await getOptions();
		if(queryParamsPublic.value[4].options.length>0){
			queryParamsPublic.value[4].value = queryParamsPublic.value[4].options[0].id;
			init();
		}
	})

	function init(){
		loading.value = true;
		currTime.value = formatChinaTime(new Date().getTime(),'yyyy-MM-dd HH:mm:ss');
		tableConfig.value.isQuery = true;
		getTotal();
	}

	function getTotal(){
		httpGet(`/transactions/private-account`, {}).then(res => {
			accountTable.value = [
				{title: '私账人民币', ...res.cny},
				{title: '私账美金', ...res.usd},
			];
			tableData1.value[0].money = res.cny.cut_off_expense_amount;
			loading.value = false;
		});
	}
	
	const searchConfirm = (val) => {
		console.log('searchConfirm', val)
	}
	
	const tableData = ref([
		{title: '截止'+currTime.value, number1: 0, number2: 0, total: 0},
	])
	const tableColumn = ref([
		{label: '日期',prop: 'created_at'},
		{label: '名称',prop: 'title'},
		{label: '用途',prop: 'category'},
		{label: '账号', formatter: (row)=> row.seller.name || row.seller.id || '--'},
		{label: '发票号',prop: 'invoice_no'},
		{label: '应付人民币',prop: 'expense_cny'},
		{label: '应收人民币',prop: 'income_cny'},
		{label: '应付美金',prop: 'expense_usd'},
		{label: '应收美金',prop: 'income_usd'},
		{label: '备注',prop: 'remark'},
	]);
	const tableConfig = ref({
		url: '/transactions?type=private',
		requestMethod: httpGet,
		isQuery: true
	})
	
	const activeName = ref('应付人民币')
	const handleClick = () => {
		var arr = ['应付人民币', '应付美金', '应收人民币', '应收美金'];
		var index = arr.indexOf(activeName.value);
		var key1 = index == 0 || index == 2 ? 'cny' : 'usd';
		var key2 = index == 0 || index == 1 ? 'cut_off_expense_amount' : 'cut_off_income_amount';
		tableData1.value[0].money = res[key1][key2];
	}
	const tableData1 = ref([
		{title: activeName.value, money: ''},
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