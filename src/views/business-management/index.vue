<template>
	
	<div>
		<div>
			<!-- 顶部搜索 -->
			<search-top ref="searchTop" :queryParams="queryParams" @search="searchConfirm" :showMaxNum="5"></search-top>
			
			<!-- <div style="display: flex;align-items: center;justify-content: flex-end;position: relative;top: -71px">
				<span style="margin-right: 10px">操作票数：0票</span>
				<search-top ref="searchTop" :queryParams="queryParamsTotal" @search="searchConfirm" :btnShow="false"></search-top>
			</div> -->
		</div>
		
		<!-- <el-select v-model="queryParams.document_user_id" placeholder="请选择操作费" clearable>
			<el-option v-for="item in DOCUMENT_USER" :key="item.id" :label="item.name" :value="item.id" />
		</el-select> -->
		<!-- 表格 -->
		<table-list :tableConfig="tableConfig" :tableColumn="tableColumn" :toolbar="true"
		class="px-2">
			<template #headerLeft> </template>
			<template #headerRight>
				<!-- <el-button type="primary" plain icon="Plus" @click="dialogFormVisible=true" style="margin-right: 10px;">新增</el-button> -->
			</template>
		</table-list>
		
		<!-- 单据详情 -->
		<el-dialog v-model="dialogFormVisible" title="单据详情" width="80%" :close-on-click-modal="false">
			<el-card>
				<common-form ref="commonForm" :formList="formListNew" @confirm="confirmSubmit" 
				@cancel="dialogFormVisible = false;">
					<!-- 订舱信息及备注 -->
					<template #remarkList="{formList,saveData}">
						<el-row :gutter="20">
							<el-col v-for="(item,index) in saveData.remark" :key="index" :span="6">
								<el-input v-model="saveData.remark[index]" :rows="3" type="textarea" placeholder="请输入" resize="none" disabled/>
							</el-col>
						</el-row>
					</template>
					<!-- 一代联系方式/费用 -->
					<template #order_delegationList="{formList,saveData}">
						<el-row :gutter="20">
							<template v-for="(item,index) in saveData['order_delegation_header.remark']" :key="index">
								<el-col :span="6">
									<p class="pb">一代联系方式</p>
									<el-input v-model="saveData['order_delegation_header.remark'][index]['contact_phone']" :rows="3" type="textarea" placeholder="请输入" disabled resize="none" />
								</el-col>
								<el-col class="p-r" :span="6">
									<p class="pb">一代费用</p>
									<el-input v-model="saveData['order_delegation_header.remark'][index]['fee']" :rows="3" type="textarea" placeholder="请输入" disabled resize="none"/>
								</el-col>
							</template>
						</el-row>
					</template>
					
					<!-- 应付款 -->
					<!-- <template #AccountsBtn="{saveData,formList}">
						<div>
							<el-button type="primary">费用已完结</el-button>
							<span class="colorr pl-1">业务员请仔细核对费用内容，如有疑问，请与操作确认！</span>
						</div>
					</template>
					<template #AccountsPayable="{saveData,formList}">
						<table-list :tableConfig="tableConfigAccounts" :tableColumn="AccountsColumns" :multiple="false" :border="true" ref="accountTable">
							<template #bottomCon="{tableData}">
								<el-row :gutter="20">
									<el-col class="p-r" v-for="(item,index) in tableData" :key="index" :span="6">
										<el-input v-model="tableData[index].remark" :rows="3" type="textarea" placeholder="请输入" resize="none" class="mt-1" disabled/>
									</el-col>
								</el-row>
							</template>
						</table-list>
					</template> -->
					
					<!-- 应收款 -->
					<!-- <template #PaymentBtn="{saveData,formList}">
						<div>
							<el-button type="primary" @click="addPayment()">添加应收款</el-button>
						</div>
					</template>
					<template #PaymentPayable="{saveData,formList}">
						<table-list :tableConfig="tableConfigPayment" :tableColumn="PaymentColumns" :multiple="false" :border="true" ref="paymentTable"></table-list>
					</template> -->
					
					<!-- 船公司网址 -->
					<template #shoppingCompany="{saveData,formList}">
						<el-form-item style="width: 100%;" label="" label-width="auto">
							<el-tooltip class="box-item" effect="dark"
								:content="saveData.phone ? saveData.phone :'暂无电话'"
								placement="top">
								<el-button type="primary" @click="">添加船公司网址</el-button>
							</el-tooltip>
						</el-form-item>
					</template>
					
					<!-- 落箱数据 -->
					<template #template11="{saveData,formList}">
						<el-form-item style="width: 100%;" label="落箱数据" label-width="auto">
							<el-button type="primary" @click="">生成</el-button>
						</el-form-item>
					</template>
					<template #boxInfo>
						<box-info :boxData="boxData" class="mt-2 "></box-info>
					</template>
					
				</common-form>
			</el-card>
		</el-dialog>
		
	</div>
	
</template>

<script setup>
	import { ref, onMounted, h, getCurrentInstance } from "vue";
	import SearchTop from "@/components/searchTop/index";
	import TableList from "@/components/tableList/index";
	import CommonForm from "@/components/commonForm/index";
	import BoxInfo from "@/components/document/boxInfo";
	import { httpPost, httpGet } from '@/api/apiCommon';
	import { Close } from '@element-plus/icons-vue'
	import { useTransition } from '@vueuse/core'
	import { getYWY, getCZY, getYWLX, getTT, getXHDW } from '@/api/commonList';
	import { queryParams,queryParamsTotal, formList, statistic } from '@/utils/business';
	import { optionsComm } from '@/api/commonList';
	const { proxy } = getCurrentInstance();
	
	const formListNew = ref([]);
	const AccountsColumns = ref([]);
	const PaymentColumns = ref([]);
	
	const YWY = ref([]);  //业务员
	const CZY = ref([]);  //操作员
	const YWLX = ref([]); //业务类型
	const TT = ref([]); //抬头/公司名称
	const XHDW = ref([]); //销货单位
	
	onMounted(async ()=>{
		// console.log('onMounted', queryParams);
		statistic.value.forEach((item,index)=>{
			const source = ref(0)
			statistic.value[index].value = useTransition(source, {
				duration: 1000,
			})
			source.value = 102658.344 + index*1000000
		})
		YWY.value = await getYWY();
		CZY.value = await getCZY();
		YWLX.value = await getYWLX();
		TT.value = await getTT();
		XHDW.value = await getXHDW();
		queryParams.value[3].options = CZY.value;
		queryParams.value[4].options = YWY.value;
		queryParams.value[9].options = XHDW.value;
		console.log(queryParams.value[3],'queryParams.value[3]')
		formListNew.value = JSON.parse(JSON.stringify(formList.value))
		formListNew.value[0].formData[2].noShow = false;
		formListNew.value[0].formData[0].formItem[0].options = YWLX.value;
		formListNew.value[0].formData[0].formItem[4].options = YWY.value;
		
		// 应付款
		AccountsColumns.value = JSON.parse(JSON.stringify(AccountsColumn.value));
		AccountsColumns.value.forEach((item,index)=>{
			if(['cny_invoice_number','cny_is_cashed','usd_invoice_number','usd_is_cashed'].indexOf(item.prop)==-1){
				AccountsColumns.value[index].form.disabled = true;
			}
		})
		
		// 应收款
		// PaymentColumns.value = JSON.parse(JSON.stringify(PaymentColumn.value));
		// PaymentColumns.value[PaymentColumns.value.length] = {
		// 	label: '操作',
		// 	prop: 'actions',
		// 	actions: [{
		// 		label: '删除',
		// 		type: 'danger',
		// 		onClick: (row, index) => paymentDelete(row, index)
		// 	}],
		// 	width: '70px'
		// }
		// console.log('formListNew', formListNew)
	})
	
	const searchConfirm = (val) =>{
		console.log('searchConfirm', val)
		val.start_sailing_date= val.start_sailing_dates?.[0] ?? ''
		val.end_sailing_date= val.start_sailing_dates?.[1] ?? ''
		httpGet('/orders/commerce-index',val).then(res =>{
			console.log(res,'res')
			tableConfig.value= res.data?.length>0?res.data: []
		})
	}
	
	
	/** 查询列表 */
	const tableColumn = ref([
		{label: '序号',prop: 'index'},
		{label: '工作编号',prop: 'job_no'},
		{label: '起运港',prop: 'origin_port'},
		{label: '目的港',prop: 'destination_port'},
		{label: '船公司',prop: 'shipping_company'},
		{label: '提单号',prop: 'bl_no'},
		{label: '箱型',prop: 'container_type'},
		{label: '船期',prop: 'sailing_schedule'},
		{label: '开船日期',prop: 'sailing_at'},
		{label: '到港日期',prop: 'arrival_at'},
		{label: '船舰/归属月份',prop: 'finish_at'},
		{label: '操作员',prop: 'operation_user.name'},
		{label: '业务员',prop: 'business_user.name'},
		{label: '是否提货',prop: 'is_delivery', formatter: (row)=> optionsComm['提货'].find(item =>item.value=== row.is_delivery)?.label},
		{label: '订舱信息',prop: 'booking_info'},
		{label: '备注',prop: 'order_remark'},
		{ 
			label: '操作',
			prop: 'actions',
			actions: [
				{
					label: '编辑',
					onClick: (row) => handleEdit(row)
				},
				{
					label: '删除',
					onClick: (row) => handleEdit(row)
				},
			],
			fixed: "right"
		}
	]);
	// 请求列表
	const tableConfig = ref({
		url: '/orders/commerce-index',
		requestMethod: httpGet,
		isQuery: true
	})
	const dialogFormVisible = ref(false);
	// 操作处理方法
	const handleEdit = (row) => {
		// console.log('编辑行:', row)
		console.log('proxy', proxy.$refs)
		httpGet(`/orders/${row.id}`).then(res => {
			// for(var key in proxy.$refs.commonForm.saveData){
			// 	proxy.$refs.commonForm.saveData[key] = res[key];
			// }
			dialogFormVisible.value = true;
			var formLists = JSON.parse(JSON.stringify(formList.value));
			formListNew.value = detailInfo(formLists, res);
			formListNew.value[0].formData[0].formItem[0].options = YWLX.value;
			formListNew.value[0].formData[0].formItem[4].options = YWY.value;
			console.log('编辑行', formListNew.value)
			
			// setTimeout(function(){
			// 	proxy.$refs.commonForm.resetKey(formListNew.value);
			// 	console.log('应付款信息', res.order_payments)
			// 	proxy.$refs.accountTable.updateTableData(res.order_payments);
				
			// 	proxy.$refs.paymentTable.tableData = [];
			// 	addPayment();
			// }, 500)
		});
	}
	
	const detailInfo = (formList, data) => {
		formList.forEach((item, index) => {
			item.formData && item.formData.forEach((v, i) => {
				if (v.formItem && v.formItem.length > 0) {
					v.formItem.forEach((vv, ii) => {
						if(!vv.key) return;
						if (vv.key.indexOf('.')>-1){
							var key = vv.key.split('.');
							formList[index].formData[i].formItem[ii].defaultValue = data[key[0]][key[1]];
						} else {
							formList[index].formData[i].formItem[ii].defaultValue = data[vv.key];
						}
						formList[index].formData[i].formItem[ii].disabled = true;
					})
				}
			})
		})
		return formList;
	}
	
	// 单据信息提交
	const confirmSubmit = (data) => {
		// console.log('编辑行:', row)
		var saveData = {
			...data,
			order_payments: proxy.$refs.accountTable.tableData,
			order_receipts: proxy.$refs.paymentTable.tableData
		};
		console.log('确认提交', data)
	}
	
	// //应付款表格数据
	// const tableConfigAccounts = ref({
	// 	url: '/orders',
	// 	requestMethod: httpGet,
	// 	isQuery: false
	// })
	
	// //应付款表格数据
	// const tableConfigPayment = ref({
	// 	url: '/orders',
	// 	requestMethod: httpGet,
	// 	isQuery: false
	// })
	const addPayment = () => {
		proxy.$refs.paymentTable.tableData.push({
			company_header_id: '',
			no_invoice_remark: '',
			cny_amount: '',
			cny_invoice_number:'',
			cny_is_cashed: 0,
			usd_amount: '',
			usd_invoice_number: '',
			usd_is_cashed: 0
		});
	}
	const paymentDelete = (row) => {
		const rowIndex = proxy.$refs.paymentTable.tableData.findIndex(item => item === row);
		proxy.$refs.paymentTable.tableData.splice(row.index, 1)
		// console.log('paymentDelete', row, rowIndex)
	}
	
</script>

<style scoped>
	
</style>