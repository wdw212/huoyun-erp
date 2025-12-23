<template>
	<!-- 截单 -->
	<div class="p-r" v-loading="loading">
		<!-- 顶部搜索 -->
		<search-top ref="searchTop" :queryParams="queryParamsOrderCutOff" @search="searchConfirm"></search-top>
		
		<!-- 表格 -->
		<table-list :tableConfig="tableConfig" :tableColumn="tableColumn" :toolbar="true" class="px-2" ref="tableList" :number="true" :multiple="false">
			<template #headerCon></template>
			<template #headerLeft> </template>
			<template #headerRight>
				<!-- <el-button type="primary" plain icon="Plus" @click="addDocument()" class="mb-1 mr-1">新增</el-button> -->
				<!-- <el-button type="danger" plain icon="Delete" @click="" class="mb-1 mr-1" disabled>批量删除</el-button> -->
			</template>
		</table-list>
	</div>
</template>

<script setup name="OrderCutOff">
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
		queryParamsOrderCutOff,
		formList,
		AccountsColumn,
		amountFormDoc,
		rulesInit
	} from '@/utils/platform';
	import {
		detailInfo,
		keyStatus,
		commonParam
	} from '@/utils/common'
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
		// 	// formListNew.value[5].formData[2].formItem = JSON.parse(JSON.stringify(amountFormDoc
		// 	// .value));
		// 	// formListNew.value[5].formData[1].noShow = true;
		// 	// loading.value = false;
		// 	// seletData.value = options;
		// 	// console.log(seletData.value,'seletData.value')
		// 	// AccountsColumn.value[0].form.options = seletData.value.YFTT;
		// 	// console.log('formListNew', formListNew, seletData.value)
		// })
	})
	/** 查询列表 */
	const tableColumn = ref([{
			label: '工作编号',
			prop: 'job_no',
			formatter: (row) => row.job_no || '无'
		},
		{
			label: '委托客户',
			prop: 'company_name',
			formatter: (row) => {
				var company_name = row?.orderDelegationHeader?.company_header?.company_name || ''
				return company_name
			}
		},
		{
			label: '操作模式',
			prop: 'order_type.name'
		},
		{
			label: '提单号',
			prop: 'bl_no'
		},
		{
			label: '合同号',
			prop: 'bl_no'
		},
		{
			label: '起运港',
			prop: 'container_type'
		},
		{
			label: '目的港',
			prop: 'destination_port'
		},
		{
			label: '截单状态',
			prop: 'sailing_at'
		},
		{
			label: '截单时间',
			prop: 'arrival_at'
		},
		{
			label: '舱单网址',
			prop: 'business_user.name'
		},
		{
			label: '结单状态',
			prop: 'business_user.name'
		},
		{
			label: '备注',
			prop: 'order_remark',
			render: (row, index) => {
				return [
					h('div', {
						class: 'avoidOverflow2',
						style: {
							margin: '0px',
							cursor: 'pointer',
							color: row.order_remark?'#000':'#888',
							width: '50px',
						},
						onClick: () => {
							remarkVisible.value = true;
							editId.value = row.id;
							remark.value = row.order_remark;
						},
					}, row.order_remark||'暂无')
				]
			}
		},
		{
			label: '操作',
			prop: 'actions',
			actions: [{
					label: '查看',
					onClick: (row, index) => handleEdit(row, index)
				},
			],
			fixed: "right",
			width: '190px'
		}
	]);
	const tableConfig = ref({
		url: '/orders',
		requestMethod: httpGet,
		isQuery: false,
		// tableRowClassName: (row, rowIndex) => {
		// 	console.log('列表类名', row.id, rowIndex)
		// 	// if(row.is_delivery===2){
		// 	// 	return 'danger-row'
		// 	// }
		// 	return '';
		// }
	})
</script>

<style>
</style>