<template>
	
	<!-- 顶部搜索 -->
	<search-top ref="searchTop" :queryParams="queryParams" @search="searchConfirm"></search-top>
	
	<!-- 表格 -->
	<table-list :tableConfig="tableConfig" :tableColumn="tableColumn" :toolbar="true">
		<template #header>
			<el-col :span="1.5">
				<el-button type="primary" plain icon="Plus" @click="">新增</el-button>
			</el-col>
		</template>
	</table-list>
	
</template>

<script setup>
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
			placeholder: '请输入单据编号',
			key: 'keyword'
		},
		{
			type: 'select',
			value: '',
			placeholder: '请选择类型',
			key: 'order_type_id',
			options: [
				{label: '类型一', value: '1'},
				{label: '类型二', value: '2'},
			]
		},
		{
			type: 'date',
			value: '',
			startPlaceholder: '开船开始时间',
			endPlaceholder: '开船结束时间',
			key: 'sailing_at'
		}
	])
	const searchConfirm = (val) =>{
		console.log('searchConfirm', val)
	}
	
	/** 查询列表 */
	const tableColumn = ref([
		{label: '工作编号', prop: 'job_no', formatter: (row)=> row.job_no || '无'},
		{label: '操作模式', prop: 'order_type.name'},
		{label: '状态', prop: 'bl_status', formatter: (row)=> row.bl_status === 1 ? '启用' : '禁用'},
		{ 
			label: '操作',
			prop: 'actions',
			actions: [
				{
					label: '编辑',
					type: 'primary',
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