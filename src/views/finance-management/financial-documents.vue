<template>
	
	<!-- 顶部搜索 -->
	<search-top ref="searchTop" :queryParams="queryParams" @search="searchConfirm"></search-top>
	
	<!-- 表格 -->
	<table-list :tableConfig="tableConfig" :tableColumn="tableColumn" :toolbar="true">
		<template #headerCon>
			<div style="display: flex;flex-wrap: wrap;text-align: center!important;">
				<div style="width: 20%;margin-top: 10px;" v-for="(item,index) in statistic" :key="index">
					<el-statistic :value="item.value" :precision="2" :prefix="item.prefix"
					value-style="font-weight: bold;">
						<template #title>
							<span style="font-size: 15px;">{{item.title}}</span>
						</template>
					</el-statistic>
				</div>
			</div>
			<el-divider />
		</template>
		<template #headerLeft> </template>
		<template #headerRight>
			<!-- <el-button type="primary" plain icon="Plus" @click="dialogFormVisible=true" style="margin-right: 10px;">新增</el-button> -->
		</template>
	</table-list>
	
	<!-- 单据详情 -->
	<common-form ref="commonForm" v-model:formList="formListNew" @confirm="confirmSubmit"> </common-form>
	
</template>

<script setup>
	import { ref, onMounted, h, getCurrentInstance } from "vue";
	import SearchTop from "@/components/searchTop/index";
	import TableList from "@/components/tableList/index";
	import CommonForm from "@/components/commonForm/index";
	import { httpPost, httpGet } from '@/api/apiCommon';
	import { Delete, Edit, View } from '@element-plus/icons-vue'
	import { useTransition } from '@vueuse/core'
	import { getYWY, getCZY } from '@/api/commonList';
	import { queryParams, formList, statistic } from '@/views/finance-management/documents';
	const { proxy } = getCurrentInstance();
	
	const formListNew = JSON.parse(JSON.stringify(formList.value));
	
	onMounted(async ()=>{
		// console.log('onMounted', queryParams);
		statistic.value.forEach((item,index)=>{
			const source = ref(0)
			statistic.value[index].value = useTransition(source, {
				duration: 1000,
			})
			source.value = 102658.344 + index*1000000
		})
		queryParams.value[11].options = await getYWY();
		queryParams.value[12].options = await getCZY();
		console.log('formListNew', formListNew)
	})
	
	const searchConfirm = (val) =>{
		console.log('searchConfirm', val)
	}
	
	/** 查询列表 */
	const tableColumn = ref([
		{label: '工作编号', prop: 'job_no', formatter: (row)=> row.job_no || '无'},
		{label: '操作模式', prop: 'order_type.name'},
		{label: '提单号', prop: 'bl_no'},
		{label: '操作', prop: 'propcolumn'},
		{label: '业务员', prop: 'business_user.name'},
		{label: '合作单位', prop: 'propcolumn'},
		{label: '柜型', prop: 'container_type'},
		{label: '开船日期', prop: 'sailing_at'},
		{label: '提货', prop: 'is_delivery', formatter: (row)=> row.is_delivery === 1 ? '已提货' : '未提货'},
		{label: '应付人民币', prop: 'propcolumn'},
		{label: '兑付情况', prop: 'propcolumn'},
		{label: '应付美金', prop: 'propcolumn'},
		{label: '兑付情况', prop: 'propcolumn'},
		{label: '应收人民币', prop: 'propcolumn'},
		{label: '兑付情况', prop: 'propcolumn'},
		{label: '应收美金', prop: 'propcolumn'},
		{label: '利润归属月份', prop: 'propcolumn'},
		{label: '总利润', prop: 'propcolumn'},
		{label: '税后折扣', prop: 'propcolumn'},
		{label: '兑付情况', prop: 'propcolumn'},
		{label: '是否开票', prop: 'bl_status', formatter: (row)=> row.bl_status === 1 ? '未开票' : '已开票'},
		{ 
			label: '操作',
			prop: 'actions',
			actions: [
				{
					label: '查看详情',
					onClick: (row) => handleEdit(row)
				},
			],
			fixed: "right"
		},
		{
			label: '开票管理',
			prop: 'actions',
			actions: [
				{
					label: '开票管理',
					onClick: (row) => handleEdit(row)
				},
			],
			fixed: "right"
		}
	]);
	const tableConfig = ref({
		url: '/orders',
		requestMethod: httpGet,
		isQuery: true
	})
	// 操作处理方法
	const handleEdit = (row) => {
		// console.log('编辑行:', row)
		console.log('proxy', proxy.$refs.commonForm)
		formListNew.value = JSON.parse(JSON.stringify(formList.value));
		// proxy.$refs.commonForm.resetKey(true);
		proxy.$refs.commonForm.dialogFormVisible = true;
	}
	
	// 单据信息提交
	const confirmSubmit = (data) => {
		// console.log('编辑行:', row)
		console.log('确认提交', data)
	}
	
</script>

<style scoped>
	
</style>