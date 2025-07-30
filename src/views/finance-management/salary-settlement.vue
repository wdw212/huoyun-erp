<template>
	
	<div>
		<!-- 顶部搜索 -->
		<search-top ref="searchTop" :queryParams="queryParams" @search="searchConfirm"
		:btnShow="false">
			<template #fromCon>
				<el-button type="primary" icon="Plus" @click="">添加月份工资结算</el-button>
			</template>
		</search-top>
		
		<!-- 表格 -->
		<table-list :tableConfig="tableConfig" :tableColumn="tableColumn" :toolbar="false">
			<template #header>
				<el-col :span="1.5">
					<el-button type="primary" plain icon="Plus" @click="">新增</el-button>
				</el-col>
			</template>
		</table-list>
	</div>
	
</template>

<script setup name="SalarySettlement">
	import { ref, onMounted, h } from "vue";
	import SearchTop from "@/components/searchTop/index";
	import TableList from "@/components/tableList/index";
	import { httpPost, httpGet } from '@/api/apiCommon'
	
	onMounted(()=>{
		// console.log('onMounted', queryParams);
	})
	
	const queryParams = ref([
		{
			type: 'input',
			value: '',
			placeholder: '请输入月份',
			key: 'keyword'
		}
	])
	const searchConfirm = (val) =>{
		console.log('searchConfirm', val)
	}
	
	/** 查询列表 */
	const tableColumn = ref([
		{label: '月份', prop: 'job_no'},
		{label: '预计工资', prop: 'job_no'},
		{label: '其他杂费', prop: 'job_no'},
		{label: '个人所得税', prop: 'job_no'},
		{label: '杂费扣除', prop: 'job_no'},
		{label: '实际金额', prop: 'job_no'},
		{label: '现结', prop: 'job_no'},
		{label: '提成', prop: 'job_no'},
		{label: '提成兑付情况', prop: 'job_no'},
		{ 
			label: '操作',
			prop: 'actions',
			width: '208px',
			actions: [
				{
					label: '工资结算',
					type: 'primary',
					size: 'small',
					onClick: (row) => handleEdit(row)
				},
				{
					label: '日志记录',
					type: 'success',
					size: 'small',
					onClick: (row) => handleEdit(row)
				},
			]
		}
	]);
	const tableConfig = ref({
		url: '/orders',
		requestMethod: httpGet,
		isQuery: true
	})
	// 操作处理方法
	const handleEdit = (row) => {
	  console.log('编辑行:', row)
	  // 这里可以打开编辑对话框等操作
	}
	
</script>

<style>
</style>