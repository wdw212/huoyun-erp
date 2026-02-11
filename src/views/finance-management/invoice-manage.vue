<template>
	
	<div>
		<div>
			<!-- 顶部搜索 -->
			<search-top ref="searchTop" :queryParams="queryParamsInvoice" @search="searchConfirm" :showMaxNum="5"></search-top>
		</div>
		
		<!-- 表格 -->
		<table-list :tableConfig="tableConfig" :tableColumn="tableColumn" :toolbar="true"
		class="px-2" :number="true">
			<template #headerLeft> </template>
			<template #headerRight>
				<el-button type="primary" plain icon="Plus" @click="addDocument()" class="mb-1 mr-1">新增</el-button>
			</template>
		</table-list>
		
		<!-- 单据详情 -->
		<el-dialog v-model="dialogFormVisible" title="申请开票" width="80%" :close-on-click-modal="false"
		@close="closeInvoiceFormBtn">
			<InvoiceForm :invoiceForm="invoiceForm" :type="invoiceType" @close="closeInvoiceForm" ref="invoiceFormRef" :visible="dialogFormVisible" roleType="finance"/>
		</el-dialog>
		
	</div>
	
</template>

<script setup name="InvoiceManage">
	import SearchTop from "@/components/searchTop/searchTop";
	import TableList from "@/components/tableList/index";
	import { httpPost, httpGet, httpPut, httpDelete } from '@/api/apiCommon';
	import { queryParamsInvoice } from '@/utils/services';
	import InvoiceForm from '@/components/InvoiceForm.vue'
	import {
		ElTag
	} from 'element-plus'
	const { proxy } = getCurrentInstance();
	
	const dialogFormVisible = ref(false);
	
	onMounted(async ()=>{
		
	})
	
	const searchConfirm = (val) =>{
		console.log('searchConfirm', val)
		val.start_sailing_date= val.start_sailing_dates?.[0] ?? ''
		val.end_sailing_date= val.start_sailing_dates?.[1] ?? ''
		// httpGet('/invoice-templates',val).then(res =>{
		// 	console.log(res,'res')
		// 	tableConfig.value= res.data?.length>0?res.data: []
		// })
	}
	
	/** 查询列表 */
	const tableColumn = ref([
		{label: '开票单据',prop: 'order.job_no'},
		{label: '名称',prop: 'purchase_entity.name'},
		{label: '销货单位',prop: 'sale_entity.name'},
		{label: '发票类型',prop: 'invoice_type.name'},
		{label: '单子完结',
			render: (row) => {
				return [
					h(ElTag, {
							type: row?.order?.is_finish== 1? 'success' : 'danger',
							size: 'small',
							onClick: () => {},
							style: { margin: '0px' },
							key: row.id
						},
						() => (row?.order?.is_finish== 1?'已完结': '未完结')
					)
				]
			}
		},
		{label: '人民币金额',prop: 'total_cny_amount'},
		{label: '人民币发票',prop: 'cny_invoice_no'},
		{label: '美金金额',prop: 'total_usd_amount'},
		{label: '美金发票',prop: 'usd_invoice_no'},
		{label: '申请时间',prop: 'created_at'},
		{label: '需寄发票',prop: ''},
		{label: '寄件分类',prop: ''},
		{label: '快递单号',prop: ''},
		{label: '确认开票时间',prop: 'confirm_at'},
		{ 
			label: '操作',
			prop: 'actions',
			actions: [
				{
					label: '查看详情',
					onClick: (row) => handleEdit(row)
				},
				{
					label: '删除',
					type: 'danger',
					onClick: (row) => handleDelete(row)
				},
			],
			fixed: "right",
			width: '190px'
		}
	]);
	const tableConfig = ref({
		url: '/invoices',
		requestMethod: httpGet,
		isQuery: true
	})

	const handleEdit = (row) => {
		httpGet(`/invoices/${row.id}`).then(res => {
			invoiceType.value = 4;
			invoiceForm.value = {
			  ...res,
			  job_no: row.order.job_no,
			};
			dialogFormVisible.value = true;
		});
	}

	function handleDelete(row) {
		const _ids = row.id;
		proxy.$modal.confirm('是否确认删除选中的的数据项？').then(function() {
			return httpDelete('/invoices/' + _ids);
		}).then(() => {
			proxy.$refs.tableList.getList();
			proxy.$modal.msgSuccess("删除成功");
		}).catch(() => {});
	}

	const addDocument = () => {
		invoiceType.value = 3;
		invoiceForm.value= {}
		dialogFormVisible.value = true
	}
	
	// 发票详情组件
	const invoiceForm = ref({})
	const invoiceFormRef = ref(null);
	const invoiceType= ref(3)  //3.财务新增  4.财务查看详情
	const closeInvoiceForm = () =>{
		dialogFormVisible.value= false
		invoiceForm.value= {}
	}
	function closeInvoiceFormBtn(){
		dialogFormVisible.value= false
	}

</script>

<style scoped>
	
</style>