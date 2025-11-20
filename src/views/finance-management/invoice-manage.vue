<template>
	
	<div>
		<div>
			<!-- 顶部搜索 -->
			<search-top ref="searchTop" :queryParams="queryParamsInvoice" @search="searchConfirm" :showMaxNum="5"></search-top>
			
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
		class="px-2" :number="true">
			<template #headerLeft> </template>
			<template #headerRight>
				<el-button type="primary" plain icon="Plus" @click="addDocument()" class="mb-1">新增</el-button>
			</template>
		</table-list>
		
		<!-- 单据详情 -->
		<el-dialog v-model="dialogFormVisible" title="申请开票" width="80%" :close-on-click-modal="false">
			<!-- <el-card> -->
				<InvoiceForm />
			<!-- </el-card> -->
		</el-dialog>
		
	</div>
	
</template>

<script setup name="InvoiceManage">
	import SearchTop from "@/components/searchTop/searchTop";
	import TableList from "@/components/tableList/index";
	import CommonForm from "@/components/commonForm/index";
	import DropBox from "@/components/document/dropBox";
	import BoxInfo from "@/components/document/boxInfo";
	import FileTable from "@/components/document/fileTable";
	import BillForm from '@/components/document/BillForm.vue'
	import { httpPost, httpGet, httpPut, httpDelete } from '@/api/apiCommon';
	import { Close, Plus, Refresh } from '@element-plus/icons-vue'
	import { useTransition } from '@vueuse/core'
	// import { queryParamsBusiness, formList, statistic,rulesInit } from '@/utils/business';
	import { queryParamsInvoice, formList, rulesInit,statistic } from '@/utils/services';
	import { detailInfo, keyStatus, commonParam } from '@/utils/common'
	import { getYWY, getCZY, getYWLX, getTT, getXHDW,optionsComm } from '@/api/commonList';
	import InvoiceForm from '@/components/InvoiceForm.vue'
	const { proxy } = getCurrentInstance();
	
	const dialogFormVisible = ref(false);
	const editId = ref('');
	const formListNew = ref([]);
	const loading = ref(true);
	const seletData = ref({});
	
	const YWY = ref([]);  //业务员
	const CZY = ref([]);  //操作员
	const YWLX = ref([]); //业务类型
	const TT = ref([]); //抬头/公司名称
	const XHDW = ref([]); //销货单位
	const containers = ref([]); //箱子信息
	
	onMounted(async ()=>{
		// // console.log('onMounted', queryParams);
		// statistic.value.forEach((item,index)=>{
		// 	const source = ref(0)
		// 	statistic.value[index].value = useTransition(source, {
		// 		duration: 1000,
		// 	})
		// 	source.value = 102658.344 + index*1000000
		// })
		// YWY.value = await getYWY();
		// CZY.value = await getCZY();
		// YWLX.value = await getYWLX();
		// TT.value = await getTT();
		// XHDW.value = await getXHDW();
		// queryParamsBusiness.value[3].options = CZY.value;
		// queryParamsBusiness.value[4].options = YWY.value;
		// queryParamsBusiness.value[9].options = XHDW.value;
		// console.log(queryParamsBusiness.value[3],'queryParams.value[3]')
		// // formListNew.value = JSON.parse(JSON.stringify(formList.value))
		// // formListNew.value[0].formData[2].noShow = false;
		// // formListNew.value[0].formData[0].formItem[0].options = YWLX.value;
		// // formListNew.value[0].formData[0].formItem[4].options = YWY.value;
		
		// keyStatus(formList.value, '申请开票', function(form, options){
		// 	formListNew.value = form;
		// 	// formListNew.value[5].formData[2].formItem = JSON.parse(JSON.stringify(amountFormDoc.value));
		// 	formListNew.value[5].formData[1].noShow = true;
		// 	loading.value = false;
		// 	seletData.value = options;
		// 	// console.log('formListNew', formListNew, seletData.value)
		// })
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
		{label: '开票数据',prop: 'job_no'},
		{label: '名称',prop: 'origin_port'},
		{label: '销货单位',prop: 'destination_port'},
		{label: '发票类型',prop: 'shipping_company'},
		{label: '单子完结',prop: 'bl_no'},
		{label: '人民币金额',prop: 'container_type'},
		{label: '人民币发票',prop: 'sailing_schedule'},
		{label: '美金金额',prop: 'sailing_at'},
		{label: '美金发票',prop: 'arrival_at'},
		{label: '申请时间',prop: 'finish_at'},
		{label: '需寄发票',prop: 'operation_user.name'},
		{label: '寄件分类',prop: 'business_user.name'},
		{label: '快递单号',prop: 'business_user.name'},
		{label: '确认开票时间',prop: 'business_user.name'},
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
	const payment_status = ref(0); //费用完结状态
	const changePaymentStatus = () => {   //修改费用完结状态
		if(payment_status.value==1){
			payment_status.value = 0;
			proxy.$refs.commonForm.changeSave({
				'finish_at': '',
			});
		}else{
			httpPut(`/orders/${editId.value}/payment-finish`).then(res => {
				payment_status.value = 1;
				proxy.$refs.commonForm.changeSave({
					'finish_at': res?.finish_at||''
				});
			});
		}
	}
	const addDocument = () => {
		dialogFormVisible.value = true;
		editId.value = '';
		setTimeout(function() {
			resetInfo();
	
			proxy.$refs.commonForm.resetKey(formListNew.value, true);
			proxy.$refs.commonForm.changeSave({
				'order_delegation_header.remark': [],
			});
			formListNew.value[2].formData[0].formItem[1].value = '';
			formListNew.value[2].formData[0].formItem[1].remark = '';
			proxy.$refs.boxInfo.addBox(true); //箱子数据
			updateKeyRemark(proxy.$refs.commonForm.saveData);
	
			addDelegation();
		}, 200)
	}
	// 编辑操作处理方法
	const handleEdit = (row) => {
		httpGet(`/orders/${row.id}`).then(res => {
			dialogFormVisible.value = true;
			editId.value = row.id;
			setTimeout(function() {
				saveDataShow(res, 1);
			}, 500)
		});
	}
	//单据复制
	function handleCopy(row) {
		httpGet(`/orders/${row.id}`).then(res => {
			dialogFormVisible.value = true;
			editId.value = '';
			setTimeout(function() {
				saveDataShow(res, 2);
			}, 500)
		});
	}
	
	function resetInfo() {
		payment_status.value = 0;
		proxy.$refs.commonForm.activeName = '操作单据';
		containers.value = [];
		// proxy.$refs.accountTable.state.tableData = [];
		// order_files.value = [];
		// proxy.$refs.fileInfo.dafultFile([]);
		billInfo.value = {};
		proxy.$refs.billForm.updateBill({}, false)
		shipCompany.value = {};
	}
	
	function saveDataShow(res, type) {
		resetInfo();
	
		var data = {};
		var nullKey = ['job_no', 'contract_no', 'finish_at', 'commerce_user_id', 'container_type'];
		var defaultKey = ['insurance', 'is_delivery', 'is_finish', 'is_allowed'];  //保持默认不变的值
		for (var key in proxy.$refs.commonForm.saveData) {
			if(!(type==2&&defaultKey.indexOf(key) > -1)){
				if (key.indexOf('.') > -1) {
					var keys = key.split('.');
					var keyData = res[keys[0]]?.[keys[1]] || '';
					data[key] = keyData === 0 ? '0' : (keys[1] == 'remark' ? keyData || [] : keyData || '');
				} else {
					data[key] = res[key] === 0 ? '0' : res[key];
				}
				if (type == 2 && nullKey.indexOf(key) > -1) {
					data[key] = '';
				}
			}
		}
		// console.log('单据数据', data)
		formListNew.value[2].formData[0].formItem[1].value = data.ship_name + '/' + data.ship_no;
		formListNew.value[2].formData[0].formItem[1].remark = data.ship_name + '/' + data.ship_no;
		if (data.shipping_company_id) {
			shipCompany.value = seletData.value.CGS.find(item => item.id === data.shipping_company_id) || {}; //船公司
		}
		payment_status.value = res.payment_status || 0;
		proxy.$refs.boxInfo.updateSaveData(data, seletData.value);
		
		//提单信息
		billInfo.value = res.bl_info || {};
		if(type==2){
			['no','description','volume','gross_weight'].forEach((vv)=>{
				billInfo.value[vv] = '';
			})
		}
		proxy.$refs.billForm.updateBill(billInfo.value, true) //装箱单
	
		proxy.$refs.commonForm.changeSave(data);
		// if ((type == 2 && payment_status.value == 0) || type == 1) {
		// 	var order_payments = res.order_payments;
		// 	if (type == 2 && payment_status.value == 0) {
		// 		order_payments.forEach((vv) => {
		// 			vv.cny_invoice_number = '';
		// 			vv.usd_invoice_number = '';
		// 		})
		// 	}
		// 	proxy.$refs.accountTable.updateTableData(order_payments);
		// 	countAccounts();
		// }
	
		if (type == 1) {
			containers.value = res.containers; //箱子信息
			proxy.$refs.boxInfo.defaultBox(res.containers);
			order_files.value = res.order_files; //文件
			proxy.$refs.fileInfo.dafultFile(res.order_files);
		} else {
			payment_status.value = 0;
			proxy.$refs.boxInfo.addBox(true); //箱子数据
		}
		updateKeyRemark(data);
	}
	//更新表单字段备注信息
	function updateKeyRemark(data) {
		var remarkList = {
			entered_port_wharf_id: [2, 10],
		}
		for (var key in remarkList) {
			var item = formListNew.value[remarkList[key][0]].formData[0].formItem[remarkList[key][1]];
			var dataNew = item.options ? item.options.find(v => {
				return v.id == data[key]
			}) : {};
			formListNew.value[remarkList[key][0]].formData[0].formItem[remarkList[key][1]].remark = dataNew ? dataNew
				.remark : '';
		}
	}
	//单据删除
	const deleteIds = ref([]);
	
	function handleDelete(row, index) {
		const _ids = row.id || deleteIds.value;
		proxy.$modal.confirm('是否确认删除选中的的数据项？').then(function() {
			return httpDelete('/orders/' + _ids);
		}).then(() => {
			proxy.$refs.tableList.getList();
			proxy.$modal.msgSuccess("删除成功");
		}).catch(() => {});
	}
	
	// 委托抬头-一代联系人
	const router = useRouter();
	
	function addCompanyHead() {
		router.push({
			path: "/company/company-headers",
			query: {
				add: true
			},
		});
	}
	async function refreshCompanyHead() {
		var WTTT = await getTT(commonParam().WTTT_params); //委托公司抬头
		formListNew.value[1].formData[0].formItem[1].options = WTTT;
	}
	const addDelegation = () => {
		var data = proxy.$refs.commonForm.saveData['order_delegation_header.remark'];
		data.push({
			contact_phone: '',
			fee: ''
		})
		proxy.$refs.commonForm.changeSave({
			'order_delegation_header.remark': data
		});
	}
	const deleteDelegation = (index) => {
		var data = proxy.$refs.commonForm.saveData['order_delegation_header.remark'];
		data.splice(index, 1);
		proxy.$refs.commonForm.changeSave({
			'order_delegation_header.remark': data
		});
	}
	
	//新增费用明细
	// function addAccountsPage() {
	// 	router.push({
	// 		path: "/company/company-headers",
	// 		query: {
	// 			add: true
	// 		},
	// 	});
	// }
	// const addAccount = () => {
	// 	var tableData = proxy.$refs.accountTable.state.tableData;
	// 	var data = {
	// 		company_header_id: null,
	// 		no_invoice_remark: null,
	// 		cny_amount: 0.00,
	// 		cny_invoice_number: null,
	// 		usd_amount: 0.00,
	// 		usd_invoice_number: null,
	// 		// contact_phone: null,
	// 		// contact_person: null,
	// 	}
	// 	tableData.push(data);
	// 	proxy.$refs.accountTable.updateTableData(tableData);
	// }
	// const accountsDelete = (row) => {
	// 	const rowIndex = proxy.$refs.accountTable.state.tableData.findIndex(item => item === row);
	// 	proxy.$refs.accountTable.state.tableData.splice(row.index, 1);
	// 	countAccounts();
	// 	// console.log('accountsDelete', row, rowIndex)
	// }
	
	// function tableItemChangeAccounts(item, index) {
	// 	// console.log('tableItemChangeAccounts', item, index)
	// 	var tableData = proxy.$refs.accountTable.state.tableData[index];
	// 	var dataNew = item.options ? item.options.find(v => {
	// 		return v.id == tableData[item.key]
	// 	}) : {};
	// 	if (item.key == 'company_header_id') {
	// 		tableData.remark = dataNew.remark || ''
	// 	}
	// 	tableData[item.key] = item.value;
	// 	proxy.$refs.accountTable.state.tableData[index] = tableData;
	// 	// console.log('tableItemChangeAccounts-tableData', tableData)
	// 	countAccounts();
	// }
	
	// function countAccounts() {
	// 	var tableData = proxy.$refs.accountTable.state.tableData;
	// 	let cny_amount = tableData.reduce((accumulator, currentValue) => {
	// 		return accumulator + parseFloat(currentValue.cny_amount) || 0;
	// 	}, 0);
	// 	let usd_amount = tableData.reduce((accumulator, currentValue) => {
	// 		return accumulator + parseFloat(currentValue.usd_amount) || 0;
	// 	}, 0);
	// 	// console.log('计算', usd_amount, cny_amount)
	// 	proxy.$refs.commonForm.changeSave({
	// 		cny_amount_total: parseFloat(cny_amount).toFixed(2),
	// 		usd_amount_total: parseFloat(usd_amount).toFixed(2),
	// 	});
	// }
	
	// 箱子信息变更
	const boxInfoChange = (data) => {
		containers.value = data;
		// console.log('箱子信息变更', containers.value)
	}
	//箱子柜型数据统计
	function containerInfo(info) {
		proxy.$refs.commonForm.changeSave({
			container_type: info
		});
	}
	
	// 文件上传
	const uploadFile = (file) => {
		order_files.value = file;
		// console.log('uploadFile', file);
	}
	
	//船公司信息
	const shipCompany = ref({});
	
	function toShipCompanyUrl() {
		if (shipCompany.value.tracking_url) {
			window.open(shipCompany.value.tracking_url)
		} else {
			proxy.$modal.msgWarning("暂无网址");
		}
	}
	//落箱数据生成
	function createDrop() {
		var saveData = {
			...proxy.$refs.commonForm.saveData,
			boxInfo: containers.value
		};
		proxy.$refs.dropBox.openDrop(saveData, seletData.value);
	}
	//tab变更
	const tabsChange = (tab) => {
		if (tab == '提单信息') {
			setTimeout(function() {
				var saveData = {
					...proxy.$refs.commonForm.saveData,
					boxInfo: containers.value,
					shipCompany: shipCompany.setTime
				};
				// console.log('tab变化', tab=='提单信息', proxy.$refs.billForm);
				proxy.$refs.billForm.openBill(false, saveData, seletData.value);
			}, 300)
		}
	}
	//提单信息变更
	const billInfo = ref({});
	const saveBill = (val) => {
		billInfo.value = val;
	}
	//单独字段操作
	const itemChange = (data, val, item) => {
		var saveData = proxy.$refs.commonForm.saveData;
		var dataNew = item.options ? item.options.find(v => {
			return v.id == val
		}) : {};
		var updateData = {};
		if (item.key == 'shipping_company_id') {
			shipCompany.value = item.options.find(v => {
				return v.id == val
			})
		} else if (item.key == 'cutoff_status') {
			formListNew.value[0].formData[0].formItem[17].disabled = val == 3 ? true : false;
			formListNew.value[2].formData[0].formItem[7].disabled = val == 3 ? true : false;
			if (val == 1) {
				formListNew.value[0].formData[0].formItem[17].rules = rulesInit('请选择截单日期', 1);
				formListNew.value[2].formData[0].formItem[7].rules = rulesInit('请选择截单日期', 1);
			} else {
				delete formListNew.value[0].formData[0].formItem[17].rules;
				delete formListNew.value[2].formData[0].formItem[7].rules;
			}
			updateData.cutoff_at = '';
			if (val == 3 && saveData.port_open_at) {
				updateData.cutoff_at = saveData.port_open_at;
			}
		} else if (item.key == 'order_type_id') {
			updateData.is_delivery = dataNew.name == '海运整柜' || dataNew.name == '拼箱空运' ? '0' : 1;
			updateData.bl_status = dataNew.name == '海运整柜' || dataNew.name == '拼箱空运' ? 1 : '0';
		} else if (item.key == 'order_delegation_header.company_header_id') {
			updateData['order_delegation_header.contact_person'] = dataNew.contact_person;
			updateData['order_delegation_header.contact_phone'] = dataNew.contact_phone;
		} else if (item.key == 'ship_name' || item.key == 'ship_no') {
			formListNew.value[2].formData[0].formItem[1].value = saveData.ship_name + '/' + saveData.ship_no;
			formListNew.value[2].formData[0].formItem[1].remark = saveData.ship_name + '/' + saveData.ship_no;
		} else if (item.key == 'entered_port_wharf_id') { //进港码头
			formListNew.value[2].formData[0].formItem[10].remark = dataNew ? dataNew.remark : '';
		} else if (item.key == 'port_open_at') { //开港时间
			if (saveData.cutoff_status == 3) updateData.cutoff_at = val;
		} else if (item.key == 'actual_sailing_at') { //实际开船时间
			formListNew.value[0].formData[0].formItem[20].disabled = val ? true : false;
			updateData.sailing_at = val ? val : saveData.sailing_at;
		} else if (item.key == 'actual_arrival_at') { //实际到港时间
			formListNew.value[0].formData[0].formItem[21].disabled = val ? true : false;
			updateData.arrival_at = val ? val : saveData.arrival_at;
		}
		proxy.$refs.boxInfo.updateSaveData(saveData, seletData.value);
		proxy.$refs.commonForm.changeSave(updateData);
		// console.log('编辑字段:cutoff_at', data, proxy.$refs.commonForm.saveData)
	}
	
	// 单据信息提交
	const confirmSubmit = (data) => {
		// console.log('单据信息提交:', data)
		if(containers.value.findIndex(v=>{return !v.container_type_id})>-1){
			proxy.$modal.msgWarning("请完善箱子信息!");
			return;
		}
		// var order_payments = proxy.$refs.accountTable.state.tableData
		var params = {
			...data,
			containers: containers.value,
			// order_payments: order_payments,
			// order_files: order_files.value,
			bl_info: proxy.$refs.billForm.save(2),
			payment_status: payment_status.value
		}
		var strKey = ['booking_info', 'order_delegation_header', 'order_payments', 'containers', 'order_files',
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
		console.log('确认提交', params);
		// return;
		if (editId.value) {
			httpPut(`/orders/${editId.value}`, params).then(res => {
				dialogFormVisible.value = false;
				proxy.$modal.msgSuccess("修改成功!");
				proxy.$refs.tableList.getList();
			});
		} else {
			httpPost(`/orders`, params).then(res => {
				dialogFormVisible.value = false;
				proxy.$modal.msgSuccess("新增成功!");
				proxy.$refs.tableList.getList();
			});
		}
	}
	// 单据取消
	const cancelForm = (data) => {
		// console.log('取消:', data)
		dialogFormVisible.value = false;
	}
	
	//应付款表格数据
	const tableConfigAccounts = ref({
		url: '/orders',
		requestMethod: httpGet,
		isQuery: false
	})
	
</script>

<style scoped>
	
</style>