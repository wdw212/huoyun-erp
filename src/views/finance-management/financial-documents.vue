<template>
	
	<div v-loading="loading">
		<!-- 顶部搜索 -->
		<search-top ref="searchTop" :queryParams="queryParams" @search="searchConfirm"></search-top>
		
		<!-- 表格 -->
		<table-list :tableConfig="tableConfig" :tableColumn="tableColumn" :toolbar="true"
		class="px-2" ref="tableList">
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
							<el-button :type="payment_status==1?'success':'danger'" disabled
							>费用{{payment_status==1?'已':'未'}}完结</el-button>
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
						<bill-form ref="billForm"></bill-form>
					</template>
					
					<!-- 文件上传 -->
					<template #fileInfo>
						<file-Table ref="fileInfo" @uploadFile="uploadFile" :isEdit="false"></file-Table>
					</template>
					
					<!-- 开票合计 -->
					<!-- <template #invoiceTotal>
						<table-list :tableConfig="tableConfigInvoiceTot" :tableColumn="tableColumnInvoiceTot"
						:toolbar="false" :multiple="false" ref="invoiceTotal" border>
						</table-list>
					</template> -->
					
					<!-- 合计结算 -->
					<template #settlement>
						<div style="display: flex;justify-content: end">
							<el-button style="width: 120px;" @click="totelSettlement"
							type="danger">未结算</el-button>
						</div>
					</template>
					
				</common-form>
			</el-card>
		</el-dialog>
		
		<!-- 开票管理 -->
		<el-dialog v-model="invoiceShow" title="开票管理" width="90%" :close-on-click-modal="false">
			<table-list :tableConfig="tableConfigInvoice" :tableColumn="tableColumnInvoice" 
			:toolbar="false" :number="true" :multiple="false" ref="invoiceTable">
				<template #headerLeft>
					<el-col :span="1.5" style="padding-bottom: 10px;">
						<el-button type="primary" plain icon="Plus" >新增</el-button>
					</el-col>
				</template>
			</table-list>
			<!-- <InvoiceForm></InvoiceForm> -->
		</el-dialog>
		
	</div>
	
</template>

<script setup name="FinancialDocuments">
	import { ref, onMounted, h, getCurrentInstance } from "vue";
	import SearchTop from "@/components/searchTop/searchTop";
	import TableList from "@/components/tableList/index";
	import CommonForm from "@/components/commonForm/index";
	import BoxInfo from "@/components/document/boxInfo";
	import FileTable from "@/components/document/fileTable";
	import BillForm from '@/components/document/BillForm.vue'
	import { httpPost, httpPut, httpGet } from '@/api/apiCommon';
	import { useTransition } from '@vueuse/core'
	import { keyStatus,commonParam } from '@/utils/common'
	import { queryParams, formList, statistic, AccountsColumn, PaymentColumn, amountFormFin } from '@/utils/documents';
	import { ElButton } from 'element-plus'
	import { tableColumnInvoice, tableColumnInvoiceTot } from './finance'
	import InvoiceForm from '@/components/InvoiceForm.vue'
	import { formatChinaTime } from '@/utils/utils'
	const { proxy } = getCurrentInstance();
	
	const formListNew = ref([]);
	const AccountsColumns = ref([]);
	const PaymentColumns = ref([]);
	const loading = ref(true);
	const seletData = ref({});
	
	function accountInit() {
		AccountsColumn.value[4].noShow = true;
		AccountsColumn.value[7].noShow = true;
		AccountsColumn.value[3].form.disabled = false;
		AccountsColumn.value[6].form.disabled = false;
		AccountsColumn.value[8].noShow = true;
		
		PaymentColumn.value[3].noShow = false;
		PaymentColumn.value[6].noShow = false;
	}
	
	onMounted(async ()=>{
		// console.log('onMounted', queryParams);
		keyStatus(formList.value, '操作单据', function(form, options) {
			formListNew.value = form;
			formListNew.value.forEach((item, index)=>{
				formListNew.value[index].formData[0].disabled = true;
				if(formListNew.value[index].formData[0].formItem){
					formListNew.value[index].formData[0].formItem.forEach((vv,ii)=>{
						delete formListNew.value[index].formData[0].formItem[ii].rules;
					})
				}
			})
			formListNew.value[5].formData[2].formItem = JSON.parse(JSON.stringify(amountFormFin.value));
			// formListNew.value[5].formData[3] = {
			// 	label: '开票合计 ( 以下单位均为人民币 )',
			// 	soltName: 'invoiceTotal',
			// };
			loading.value = false;
			seletData.value = options;
			// console.log('seletData.value', seletData.value)
			AccountsColumn.value[0].form.options = seletData.value.YFTT;
			console.log('formListNew', formListNew, seletData.value)
			
			getStatistic(); //统计数据
			// getDollerRate(); //获取当月美金税率
		})
		
		accountInit();
		// 应付款
		AccountsColumns.value = JSON.parse(JSON.stringify(AccountsColumn.value));
		AccountsColumns.value.splice(AccountsColumns.value.length-1, 1)
		AccountsColumns.value.forEach((item,index)=>{
			if(['cny_invoice_number','cny_is_cashed','usd_invoice_number','usd_is_cashed','no_invoice_remark'].indexOf(item.prop)==-1){
				AccountsColumns.value[index].form.disabled = true;
			}
			AccountsColumns.value[index].noShow = false;
		})
		
		// 应收款
		PaymentColumns.value = JSON.parse(JSON.stringify(PaymentColumn.value));
		PaymentColumns.value[7] = {
			label: '操作',
			prop: 'actions',
			actions: [{
				label: '删除',
				type: 'danger',
				onClick: (row, index) => paymentDelete(row, index)
			}],
			width: '70px'
		};
		console.log('PaymentColumns', PaymentColumns.value)
	})
	
	//统计数据
	function getStatistic(){
		httpGet(`/orders/finance-statistics`).then(res => {
			statistic.value.forEach((item,index)=>{
				const source = ref(res[item.key])
				statistic.value[index].value = useTransition(source, {
					duration: 1000,
				})
			})
		});
	}
	
	//开票管理
	const invoiceShow = ref(false);
	const invoiceTable = ref(null);
	const tableConfigInvoice = ref({
		url: '/orders/finance-index',
		requestMethod: httpGet,
		isQuery: false
	})
	
	//开票合计
	const tableConfigInvoiceTot = ref({
		url: '/orders/finance-index',
		requestMethod: httpGet,
		isQuery: false
	})
	const invoiceData = ref([
		{title: '应付开票人民币金额', number1: 0, number2: 0, total: 0},
		{title: '应收开票人民币金额', number1: 0, number2: 0, total: 0},
		{title: '应付开票美金金额', number1: 0, number2: 0, total: 0},
		{title: '应收开票美金金额', number1: 0, number2: 0, total: 0},
		{title: '应付未开票人民币金额', number1: 0, number2: 0, total: 0},
		{title: '应收未开票人民币金额', number1: 0, number2: 0, total: 0},
		{title: '应付未开票美金金额', number1: 0, number2: 0, total: 0},
		{title: '应收未开票美金金额', number1: 0, number2: 0, total: 0},
		{title: '特殊费用总和', number1: 0, number2: 0, total: 0},
		{title: '总利润金额', number1: 0, number2: 0, total: 0},
	])
	
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
		{
			label: '提货',
			prop: 'is_delivery',
			render: (row, index) => {
				return [
					h(ElButton, {
							type: row.is_delivery == 1 ?'success' : (row.is_delivery == 2 ?'danger':'warning'),
							size: 'small',
							onClick: () => {},
							style: {
								margin: '0px'
							},
							key: row.id
						},
						() => (row.is_delivery == 1 ? '已提货' : (row.is_delivery == 2 ?'超期未提货':'未提货'))
					)
				]
			}
		},
		{label: '应付人民币', prop: 'payment_total_cny_amount'},
		{label: '兑付情况', formatter: (row)=> row.payment_cny_cashed_status === 1 ? '已兑付' : '未兑付'},
		{label: '应付美金', prop: 'payment_total_usd_amount'},
		{label: '兑付情况', formatter: (row)=> row.payment_usd_cashed_status === 1 ? '已兑付' : '未兑付'},
		{label: '应收人民币', prop: 'receipt_total_cny_amount'},
		{label: '兑付情况', formatter: (row)=> row.receipt_total_cny_amount === 1 ? '已兑付' : '未兑付'},
		{label: '应收美金', prop: 'receipt_total_usd_amount'},
		{label: '兑付情况', formatter: (row)=> row.receipt_usd_cashed_status === 1 ? '已兑付' : '未兑付'},
		{label: '利润归属月份', prop: 'receipt_usd_cashed_status'},
		{label: '总利润', prop: 'total_profit'},
		{label: '税后折扣', prop: 'after_tax_discount'},
		{label: '兑付情况', formatter: (row)=> row.cashed_status === 1 ? '已兑付' : '未兑付'},
		{label: '是否开票', prop: 'invoice_status',
			render: (row, index) => {
				return [
					h(ElButton, {
							type: row.invoice_status == 2 ?'success' : (row.invoice_status == 1 ?'warning':'danger'),
							size: 'small',
							onClick: () => {},
							style: {margin: '0px'},
							key: row.id
						},
						() => (row.invoice_status == 2 ? '已开票' : (row.invoice_status == 1 ?'部分开票':'未开票'))
					)
				]
			}
		},
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
					onClick: (row) => {
						invoiceShow.value = true;
					}
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
		httpGet(`/orders/${row.id}`).then(res => {
			dialogFormVisible.value = true;
			editId.value = row.id;
			setTimeout(function(){
				// proxy.$refs.invoiceTotal.updateTableData(invoiceData.value);
				resetInfo(); //清空之前数据
				
				// console.log('proxy', proxy.$refs.commonForm.saveData)
				var data = {};
				for(var key in proxy.$refs.commonForm.saveData){
					data[key] = res[key]||proxy.$refs.commonForm.saveData[key];
				}
				formListNew.value[5].formData[2].formItem[11].placeholder = '当月美金汇率：'+res.usd_exchange_rate;
				proxy.$refs.boxInfo.defaultBox(res.containers||[]);
				proxy.$refs.commonForm.changeSave(data);
				proxy.$refs.accountTable.updateTableData(res.order_payments||[]);
				proxy.$refs.fileInfo.dafultFile(res.order_files||[]);  //文件
				proxy.$refs.paymentTable.updateTableData(res.order_receipts||[]);
				
				payment_status.value = res.payment_status || 0;
				// addPayment();
			}, 500)
		});
	}
	var payment_status = ref(0);
	function resetInfo() {
		proxy.$refs.commonForm.activeName = '操作单据';
		payment_status.value = 0;
		containers.value = [];
		proxy.$refs.accountTable.state.tableData = [];
		proxy.$refs.paymentTable.state.tableData = [];
		order_files.value = [];
		proxy.$refs.fileInfo.dafultFile([]);
		formListNew.value[5].formData[2].formItem[11].placeholder = '当月美金汇率：0';
	}
	
	// 当月美金汇率
	var dollerRate = ref(0);
	function getDollerRate(){
		var month = formatChinaTime(new Date().getTime(), 'yyyy-MM')
		httpGet(`/special-cost-rates`, {
			pageSize: 1,
			page: 1,
			month: month
		}).then(res => {
			dollerRate.value = res.data[0].k_value;
			formListNew.value[5].formData[2].formItem[11].placeholder = '当月美金汇率：'+dollerRate.value;
			console.log('dollerRate.value', formListNew.value)
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
		var params = {
			...data,
			containers: containers.value,
			order_payments: proxy.$refs.accountTable.state.tableData,
			order_receipts: proxy.$refs.paymentTable.state.tableData,
			order_files: order_files.value,
			bl_info: proxy.$refs.billForm.save(2),
			payment_status: payment_status.value
		}
		var strKey = ['booking_info', 'order_delegation_header', 'order_payments', 'order_receipts', 'containers', 'order_files',
			'bl_info'
		];
		strKey.forEach((item) => {
			if (params[item] && JSON.stringify(params[item]) != '[]' && JSON.stringify(params[item]) != '{}') {
				params[item] = JSON.stringify(params[item]);
			} else {
				delete params[item];
			}
		})
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
		var tableData = proxy.$refs.paymentTable.state.tableData;
		var data = {
			company_header_id: '',
			cny_amount: '',
			cny_invoice_number:'',
			cny_is_cashed: 0,
			usd_amount: '',
			usd_invoice_number: '',
			usd_is_cashed: 0
		}
		tableData.push(data);
		proxy.$refs.paymentTable.updateTableData(tableData);
	}
	const paymentDelete = (row, index) => {
		proxy.$refs.paymentTable.state.tableData.splice(index, 1);
		// console.log('paymentDelete', row, rowIndex)
	}
	
	//财务合计结算
	const totelSettlement = () => {
		proxy.$modal.confirm('确认结算当前单据合计？').then(function() {
			httpPut(`/orders/${editId.value}/finish`, {}).then(() => {
				httpGet(`/orders/${editId.value}`).then(res => {
					var data = {
						special_fee: res.special_fee,
						special_fee_cashed_status: res.special_fee_cashed_status,
						receipt_total_cny_amount: res.receipt_total_cny_amount,
						receipt_total_usd_amount: res.receipt_total_usd_amount,
						// receipt_total_usd_amount: '2500.00',
					};
					proxy.$refs.commonForm.changeSave(data);
				});
			});
		}).catch(() => {});
	}
	
</script>

<style scoped>
	
</style>