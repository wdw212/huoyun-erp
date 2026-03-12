<template>
	<!-- 查开港 -->
	<div class="p-r" v-loading="loading">
		<!-- 顶部搜索 -->
		<search-top ref="searchTop" :queryParams="queryParamsCheckOpenPort" @search="searchConfirm"></search-top>
		
		<!-- 表格 -->
		<table-list :tableConfig="tableConfig" :tableColumn="tableColumn" :toolbar="true" class="px-2" ref="tableList" :number="true" :multiple="false">
			<template #headerCon></template>
			<template #headerLeft> </template>
			<template #headerRight>
				<!-- <el-button type="primary" plain icon="Plus" @click="addDocument()" class="mb-1 mr-1">新增</el-button> -->
				<!-- <el-button type="danger" plain icon="Delete" @click="" class="mb-1 mr-1" disabled>批量删除</el-button> -->
			</template>
		</table-list>
		<!-- 单据详情 -->
		<el-dialog v-model="dialogFormVisible" title="查开港详情" width="80%" :close-on-click-modal="false">
			<el-card>
				<common-form ref="commonForm" v-model:formList="formListNew" @confirm="confirmSubmit"
					@cancel="cancelForm" :tabShow="false">
					<!-- 订舱信息及备注 -->
					<template #remarkBtn="{formList,saveData}">
						<span style="font-weight: bold;padding-left: 60px; padding-right: 10px;color: #606266;">生成</span>
						<el-button type="primary" @click="saveData.booking_info.push('')">生成</el-button>
					</template>
					<!-- 表格 -->
					<template #remarkList="{formList,saveData}">
						<table-list :tableConfig="tableConfig" :tableColumn="tableColumnSelect" :toolbar="false" class="px-2" ref="tableList" :number="true" :multiple="true">
							<template #headerCon></template>
							<template #headerLeft> </template>
						</table-list>
					</template>
					
				</common-form>
				
			</el-card>
		</el-dialog>
	</div>
</template>

<script setup name="CheckOpenPort">
	import {
		ref,
		onMounted,
		h,
		getCurrentInstance
	} from "vue";
	import SearchTop from "@/components/searchTop/searchTop";
	import TableList from "@/components/tableList/index";
	import CommonForm from "@/components/commonForm/index";
	import DropBox from "@/components/document/dropBox";
	import BoxInfo from "@/components/document/boxInfo";
	import FileTable from "@/components/document/fileTable";
	import BillForm from '@/components/document/BillForm.vue'
	import {
		httpPost,
		httpGet,
		httpPut,
		httpDelete
	} from '@/api/apiCommon';
	import {
		Close,
		Plus,
		Refresh
	} from '@element-plus/icons-vue'
	import {
		useTransition
	} from '@vueuse/core'
	import {
		queryParamsCheckOpenPort,
		formList,
		AccountsColumn,
		amountFormDoc,
		rulesInit
	} from '@/utils/platform';
	// import {
	// 	detailInfo,
	// 	// keyStatus,
	// 	commonParam
	// } from '@/utils/common'
	import {
		getTT
	} from '@/api/commonList';
	import {
		ElButton
	} from 'element-plus'
	const {
		proxy
	} = getCurrentInstance();
	const dialogFormVisible = ref(false);
	const editId = ref('');
	const formListNew = ref([]);
	const loading = ref(false);
	const seletData = ref({});
	
	const containers = ref([]); //箱子信息
	const order_files = ref([]); //文件信息
	const searchConfirm = (val) => {
		val.start_sailing_date= val.start_sailing_dates?.[0] ?? ''
		val.end_sailing_date= val.start_sailing_dates?.[1] ?? ''
		tableConfig.value.data= val
		tableConfig.value.isQuery= true
		
	}
	onMounted(async () => {
		// queryParamsDocu.value[11].options = YWY.value;
		// queryParamsDocu.value[12].options = CZY.value;
		formListNew.value = formList.value;
		// keyStatus(formList.value, '操作平台', function(form, options) {
		// 	formListNew.value = form;
		// 	// seletData.value = options;
		// 	console.log(seletData.value,'seletData.value')
		// 	// console.log('formListNew', formListNew, seletData.value)
		// })
		tableConfig.value.isQuery = true
	})
	/** 查询列表 */
	const tableColumn = ref([{
			label: '查开港',
			prop: 'job_no',
			formatter: (row) => row.job_no || '无'
		},
		{
			label: '起运港',
			prop: 'container_type'
		},
		{
			label: '船名',
			prop: 'order_type.name'
		},
		{
			label: '船次',
			prop: 'bl_no'
		},
		{
			label: '开港时间',
			prop: 'bl_no'
		},
		{
			label: '截港时间',
			prop: 'container_type'
		},
		{
			label: '目的港',
			prop: 'destination_port'
		},
		{
			label: '开港状态',
			prop: 'sailing_at'
		},
		{
			label: '是否进港',
			prop: 'arrival_at'
		},
		{
			label: '操作',
			prop: 'actions',
			actions: [{
					label: '查看',
					onClick: (row, index) => handleEdit(row, index)
				}
			],
			fixed: "right",
			width: '190px'
		}
	]);
	const tableConfig = ref({
		url: '/orders',
		requestMethod: httpGet,
		isQuery: true,
		// tableRowClassName: (row, rowIndex) => {
		// 	console.log('列表类名', row.id, rowIndex)
		// 	// if(row.is_delivery===2){
		// 	// 	return 'danger-row'
		// 	// }
		// 	return '';
		// }
	})
	
	const tableColumnSelect=  ref([{
			label: '提单号',
			prop: 'job_no',
			formatter: (row) => row.job_no || '无'
		},
		{
			label: '船公司',
			prop: 'container_type'
		},
		{
			label: '船名',
			prop: 'order_type.name'
		},
		{
			label: '船次',
			prop: 'bl_no'
		},
		{
			label: '开港时间',
			prop: 'bl_no'
		},
		{
			label: '截港时间',
			prop: 'container_type'
		},
		{
			label: '大柜型',
			prop: 'destination_port'
		},
		{
			label: '是否进港',
			prop: 'sailing_at'
		},
		{
			label: '是否放行',
			prop: 'arrival_at'
		}
	]);
	const addDocument = () => {
		dialogFormVisible.value = true;
		editId.value = '';
	}
</script>

<style>
</style>
