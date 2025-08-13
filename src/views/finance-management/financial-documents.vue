<template>
	
	<div>
		<!-- 顶部搜索 -->
		<search-top ref="searchTop" :queryParams="queryParams" @search="searchConfirm"></search-top>
		
		<!-- 表格 -->
		<table-list :tableConfig="tableConfig" :tableColumn="tableColumn" :toolbar="true"
		class="px-2">
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
					<template #AccountsBtn="{saveData,formList}">
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
					</template>
					
					<!-- 应收款 -->
					<template #PaymentBtn="{saveData,formList}">
						<div>
							<el-button type="primary" @click="addPayment()">添加应收款</el-button>
						</div>
					</template>
					<template #PaymentPayable="{saveData,formList}">
						<table-list :tableConfig="tableConfigPayment" :tableColumn="PaymentColumns" :multiple="false" :border="true" ref="paymentTable"></table-list>
					</template>
					
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
						<el-form-item style="width: 100%;" label="落箱数据" label-width="120px">
							<el-button type="primary" @click="">生成</el-button>
						</el-form-item>
					</template>
					<template #boxInfo>
						<box-info ref="boxInfo" :boxData="boxData" class="mt-2" @boxInfoChange="boxInfoChange"></box-info>
					</template>
					
					<!-- 提单信息 -->
					<template #billInfo>
						<bill-form ref="billInfo"></bill-form>
					</template>
					
					<!-- 文件上传 -->
					<template #fileInfo>
						<file-Table ref="fileInfo" @uploadFile="uploadFile"></file-Table>
					</template>
					
				</common-form>
			</el-card>
		</el-dialog>
		
	</div>
	
</template>

<script setup name="FinancialDocuments">
	import { ref, onMounted, h, getCurrentInstance } from "vue";
	import SearchTop from "@/components/searchTop/index";
	import TableList from "@/components/tableList/index";
	import CommonForm from "@/components/commonForm/index";
	import BoxInfo from "@/components/document/boxInfo";
	import FileTable from "@/components/document/fileTable";
	import BillForm from '@/components/BillForm.vue'
	import { httpPost, httpGet } from '@/api/apiCommon';
	import { Close } from '@element-plus/icons-vue'
	import { useTransition } from '@vueuse/core'
	import { getYWY, getCZY, getYWLX, getTT, getCGS, getDZY, getSW, getXHDW, getMT } from '@/api/commonList';
	import { queryParams, formList, statistic, AccountsColumn, PaymentColumn, amountFormFin } from '@/utils/documents';
	const { proxy } = getCurrentInstance();
	
	const formListNew = ref([]);
	const AccountsColumns = ref([]);
	const PaymentColumns = ref([]);
	
	const YWY = ref([]);  //业务员
	const CZY = ref([]);  //操作员
	const YWLX = ref([]); //业务类型
	const TT = ref([]); //抬头/公司名称
	const CGS = ref([]); //船公司
	const DZY = ref([]); //单证员
	const SW = ref([]); //商务
	const XHDW = ref([]); //销货单位
	const MT = ref([]); //码头
	
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
		CGS.value = await getCGS();
		DZY.value = await getDZY();
		SW.value = await getSW();
		XHDW.value = await getXHDW();
		MT.value = await getMT();
		
		queryParams.value[11].options = YWY.value;
		queryParams.value[12].options = CZY.value;
		
		formListNew.value = JSON.parse(JSON.stringify(formList.value))
		formListNew.value[0].formData[0].formItem[0].options = YWLX.value;
		formListNew.value[0].formData[0].formItem[4].options = YWY.value;
		formListNew.value[0].formData[0].formItem[5].options = CZY.value;
		formListNew.value[0].formData[0].formItem[6].options = DZY.value;
		formListNew.value[0].formData[0].formItem[7].options = SW.value;
		formListNew.value[0].formData[0].formItem[8].options = CGS.value;
		formListNew.value[1].formData[0].formItem[0].options = XHDW.value;
		formListNew.value[1].formData[0].formItem[1].options = TT.value;
		formListNew.value[2].formData[0].formItem[10].options = MT.value;
		formListNew.value[5].formData[2].formItem = JSON.parse(JSON.stringify(amountFormFin.value));
		
		// 应付款
		AccountsColumns.value = JSON.parse(JSON.stringify(AccountsColumn.value));
		AccountsColumns.value.forEach((item,index)=>{
			if(['cny_invoice_number','cny_is_cashed','usd_invoice_number','usd_is_cashed'].indexOf(item.prop)==-1){
				AccountsColumns.value[index].form.disabled = true;
			}
			AccountsColumns.value[index].noShow = false;
		})
		
		// 应收款
		PaymentColumns.value = JSON.parse(JSON.stringify(PaymentColumn.value));
		PaymentColumns.value[PaymentColumns.value.length] = {
			label: '操作',
			prop: 'actions',
			actions: [{
				label: '删除',
				type: 'danger',
				onClick: (row, index) => paymentDelete(row, index)
			}],
			width: '70px'
		}
		// console.log('formListNew', formListNew)
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
		{label: '应付人民币', prop: 'payment_total_cny_amount'},
		{label: '兑付情况', prop: 'payment_cny_cashed_status'},
		{label: '应付美金', prop: 'payment_total_usd_amount'},
		{label: '兑付情况', prop: 'payment_usd_cashed_status'},
		{label: '应收人民币', prop: 'receipt_total_cny_amount'},
		{label: '兑付情况', prop: 'receipt_cny_cashed_status'},
		{label: '应收美金', prop: 'receipt_total_usd_amount'},
		{label: '利润归属月份', prop: 'receipt_usd_cashed_status'},
		{label: '总利润', prop: 'propcolumn'},
		{label: '税后折扣', prop: 'propcolumn'},
		{label: '兑付情况', prop: 'propcolumn'},
		{label: '是否开票', prop: 'invoice_status', formatter: (row)=> row.invoice_status === 1 ? '已开票' : '未开票'},
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
					// onClick: (row) => handleEdit(row)
				},
			],
			fixed: "right"
		}
	]);
	const tableConfig = ref({
		url: '/orders/finance-index',
		requestMethod: httpGet,
		isQuery: true
	})
	
	const editId = ref('');
	const dialogFormVisible = ref(false);
	// 单据编辑
	const handleEdit = (row) => {
		// console.log('编辑行:', row)
		console.log('proxy', proxy.$refs)
		httpGet(`/orders/${row.id}`).then(res => {
			dialogFormVisible.value = true;
			editId.value = row.id;
			setTimeout(function(){
				var data = {};
				for(var key in proxy.$refs.commonForm.saveData){
					data[key] = res[key];
				}
				proxy.$refs.boxInfo.defaultBox(res.containers);
				proxy.$refs.commonForm.changeSave(data);
				proxy.$refs.accountTable.updateTableData(res.order_payments);
				proxy.$refs.fileInfo.dafultFile(res.order_files);  //文件
				proxy.$refs.paymentTable.tableData = [];
				addPayment();
			}, 500)
		});
	}
	
	// 箱子信息变更
	const containers = ref([]);
	const boxInfoChange = (data) => {
		containers.value = data;
	}
	
	// 文件上传
	const order_files = ref([]);
	const uploadFile = (file) => {
		order_files.value = file;
		// console.log('uploadFile', file);
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
		var order_payments = proxy.$refs.accountTable.tableData
		var params = {
			...data,
			containers: containers.value,
			orderPaymentsList: order_payments,
			order_payments: JSON.stringify(order_payments),
			order_receipts: proxy.$refs.paymentTable.tableData,
			order_files: order_files.value,
		}
		params.order_delegation_header = JSON.stringify(params.order_delegation_header);
		delete params['undefined'];
		console.log('确认提交', params)
		httpPut(`/orders/${editId.value}`, params).then(res => {
			dialogFormVisible.value = false;
			proxy.$modal.msgSuccess("保存成功!");
			proxy.$refs.tableList.getList();
		});
	}
	
	
	//应付款表格数据
	const tableConfigAccounts = ref({
		isQuery: false
	})
	
	//应付款表格数据
	const tableConfigPayment = ref({
		isQuery: false
	})
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