<template>
	
	<div>
		<div>
			<!-- 顶部搜索 -->
			<search-top ref="searchTop" :queryParams="queryParamsBusiness" @search="searchConfirm" :showMaxNum="5"></search-top>
			
			<!-- <div style="display: flex;align-items: center;justify-content: flex-end;position: relative;top: -71px">
				<span style="margin-right: 10px">操作票数：0票</span>
				<search-top ref="searchTop" :queryParams="queryParamsTotal" @search="searchConfirm" :btnShow="false"></search-top>
			</div> -->
		</div>
		
		<!-- <el-select v-model="queryParams.document_user_id" placeholder="请选择操作费" clearable>
			<el-option v-for="item in DOCUMENT_USER" :key="item.id" :label="item.name" :value="item.id" />
		</el-select> -->
		<!-- 表格 -->
		<<table-list :tableConfig="tableConfig" :tableColumn="tableColumn" :toolbar="true" class="px-2" ref="tableList" :number="true" :multiple="false">
			<template #headerCon></template>
			<template #headerLeft> </template>
			<template #headerRight>
				<el-button type="primary" plain icon="Plus" @click="addDocument()" class="mb-1 mr-1">新增</el-button>
				<!-- <el-button type="danger" plain icon="Delete" @click="" class="mb-1 mr-1" disabled>批量删除</el-button> -->
			</template>
		</table-list>
		
		<!-- 单据详情 -->
		<el-dialog v-model="dialogFormVisible" title="商务详情" width="80%" :close-on-click-modal="false">
			<el-card>
				<common-form ref="commonForm" v-model:formList="formListNew" @confirm="confirmSubmit"
					@cancel="cancelForm" @itemChange="itemChange" @tabsChange="tabsChange">
					<!-- 订舱信息及备注 -->
					<template #remarkBtn="{formList,saveData}">
						<span style="font-weight: bold;padding-right: 10px;color: #606266;">订舱信息及备注</span>
						<el-button type="primary" @click="saveData.booking_info.push('')">订舱信息及备注</el-button>
					</template>
					<template #remarkList="{formList,saveData}">
						<el-row :gutter="20">
							<el-col class="p-r mb-1" v-for="(item,index) in saveData.booking_info" :key="index" :span="6">
								<el-icon class="p-a r_0 t_0 z-1000" style="margin: 5px 15px;"
								@click="saveData.booking_info.splice(index, 1)"><Close /></el-icon>
								<el-input v-model="saveData.booking_info[index]" :rows="4" type="textarea" placeholder="请输入" style="width: 100%" resize="none"/>
							</el-col>
						</el-row>
					</template>
					<!-- 委托抬头新增 -->
					<template #addHeader>
						<el-button type="primary" :icon="Refresh" circle style="margin-left: 10px;"
						@click="refreshCompanyHead"/>
						<el-button type="danger" :icon="Plus" circle style="margin-left: 10px;"
						@click="addCompanyHead"/>
					</template>
					
					<!-- 一代联系方式/费用 -->
					<template #order_delegationBtn="{formList,saveData}">
						<el-button type="primary" @click="addDelegation(saveData)">增加</el-button>
					</template>
					<template #order_delegationList="{formList,saveData}">
						<el-row :gutter="20">
							<template v-for="(item,index) in saveData['order_delegation_header.remark']" :key="index">
								<el-col class="mt-1" :span="6">
									<p class="pb">一代联系方式</p>
									<el-input v-model="saveData['order_delegation_header.remark'][index]['contact_phone']" :rows="3" type="textarea" placeholder="请输入" resize="none" />
								</el-col>
								<el-col class="p-r mt-1" :span="6">
									<el-icon class="p-a r_0 t_0 z-1000 hand" style="margin: 5px 15px;"
									@click="saveData['order_delegation_header.remark'].splice(index, 1)"><Close /></el-icon>
									<p class="pb">一代费用</p>
									<el-input v-model="saveData['order_delegation_header.remark'][index]['fee']" :rows="3" type="textarea" placeholder="请输入" resize="none"/>
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
					
					<!-- 落箱数据 -->
					<template #shoppingCompany>
						<div style="margin-left: 100px;">
							<el-tooltip placement="top">
							  <!-- 使用带样式的插槽内容 -->
							  <template #content>
								<div class="tooltip-content multiline-text">{{ shipCompany.phone ? shipCompany.phone :'暂无电话' }}</div>
							  </template>
							  <el-button type="text" @click="toShipCompanyUrl">船公司网址</el-button>
							</el-tooltip>
						</div>
					</template>
					<template #template11="{saveData,formList}">
						<el-form-item style="width: 100%;" label="落箱数据" label-width="100px">
							<el-button type="primary" @click="createDrop">生成</el-button>
						</el-form-item>
						<drop-box ref="dropBox"></drop-box>
					</template>
					<template #boxInfo>
						<box-info ref="boxInfo" :boxData="boxData" class="mt-2" @boxInfoChange="boxInfoChange" :isShow="userStore.userRoleCode === 'COMMERCE'?false: true"></box-info>
					</template>
					
					<!-- 提单信息 -->
					<template #billInfo>
						<BillForm ref="billForm" @saveBill="saveBill"></BillForm>
					</template>
					
					<!-- 文件上传 -->
					<!-- <template #fileInfo>
						<file-Table ref="fileInfo" @uploadFile="uploadFile"></file-Table>
					</template> -->
				</common-form>
			</el-card>
		</el-dialog>
		<el-dialog v-model="remarkVisible" title="备注信息" width="500px" :close-on-click-modal="false">
			<el-input v-model="remark" :rows="5" type="textarea" placeholder="备注内容" />
			<template #footer>
				<div class="dialog-footer">
					<el-button type="primary" @click="updateRemark()"> 确认 </el-button>
				</div>
			</template>
		</el-dialog>
	</div>
	
</template>

<script setup>
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
	import { queryParamsBusiness, formList, rulesInit,statistic } from '@/utils/business';
	import { detailInfo, keyStatus, commonParam } from '@/utils/common'
	import { getYWY, getCZY, getYWLX, getTT, getXHDW,optionsComm } from '@/api/commonList';
	import useUserStore from '@/store/modules/user'
	import {
		ElButton
	} from 'element-plus'
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
	const userStore = useUserStore()
	const btnShow= ref(true)  //是否显示确认按钮
	
	onMounted(async ()=>{
		// console.log('onMounted', queryParams);
		// statistic.value.forEach((item,index)=>{
		// 	const source = ref(0)
		// 	statistic.value[index].value = useTransition(source, {
		// 		duration: 1000,
		// 	})
		// 	source.value = 102658.344 + index*1000000
		// })
		YWY.value = await getYWY();
		CZY.value = await getCZY();
		YWLX.value = await getYWLX();
		TT.value = await getTT();
		XHDW.value = await getXHDW();
		queryParamsBusiness.value[3].options = CZY.value;
		queryParamsBusiness.value[4].options = YWY.value;
		queryParamsBusiness.value[9].options = XHDW.value;
		// console.log(queryParamsBusiness.value[3],'queryParams.value[3]')
		// formListNew.value = JSON.parse(JSON.stringify(formList.value))
		// formListNew.value[0].formData[2].noShow = false;
		// formListNew.value[0].formData[0].formItem[0].options = YWLX.value;
		// formListNew.value[0].formData[0].formItem[4].options = YWY.value;
		
		keyStatus(formList.value, '商务详情', function(form, options){
			formListNew.value = form;
			// formListNew.value[5].formData[2].formItem = JSON.parse(JSON.stringify(amountFormDoc.value));
			// formListNew.value[5].formData[1].noShow = true;
			loading.value = false;
			seletData.value = options;
			console.log(options,'options')
			console.log(seletData.value,'seletData.value')
			// console.log('formListNew', formListNew, seletData.value)
		})
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
	const remarkVisible = ref(false); //备注弹框
	const remark = ref(''); //备注信息
	function updateRemark(){
		httpPut(`/orders/${editId.value}/update-remark`, {
			remark: remark.value
		}).then(res => {
			remarkVisible.value = false;
			editId.value = '';
			proxy.$modal.msgSuccess("备注成功!");
			proxy.$refs.tableList.getList();
		});
	}
	
	/** 查询列表 */
	const tableColumn = ref([
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
		{
			label: '是否提货',
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
		{label: '订舱信息',prop: 'booking_info'},
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
			actions: [
				{
					label: '查看',
					onClick: (row) => handleLook(row),
					style: (row) => ({
					        display: row.is_claimed === 1 ? 'block' : 'none'
					    })
				},
				{
					label: '修改',
					onClick: (row) => handleEdit(row),
					style: (row) => ({
					        display: row.is_claimed === 1 ? 'none' : 'block'
					    })
				},
				{
					label: '复制',
					onClick: (row, index) => handleCopy(row, index),
					style: () => ({
					        display: userStore.userRoleCode === 'COMMERCE' ? 'block' : 'none'
					    })
				},
				{
					label: '删除',
					type: 'danger',
					onClick: (row) => handleDelete(row),
					style: (row) => ({
					        display: row.is_claimed === 1 ? 'none' : 'block'
					    })
				},
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
		// 	if(row.is_delivery===2){
		// 		return 'danger-row'
		// 	}
		// 	return '';
		// }
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
		btnShow.value= true
		setTimeout(function() {
			resetInfo();
	
			proxy.$refs.commonForm.resetKey(formListNew.value, true);
			proxy.$refs.commonForm.changeSave({
				'order_delegation_header.remark': [],
			});
			formListNew.value[2].formData[0].formItem[1].value = '';
			formListNew.value[2].formData[0].formItem[1].value = '';
			console.log(userStore,312)
			formListNew.value[0].formData[0].formItem[7].value = userStore.userRoleCode=== 'COMMERCE'?userStore.id: '';
			proxy.$refs.boxInfo.addBox(true); //箱子数据
			updateKeyRemark(proxy.$refs.commonForm.saveData);
	
			addDelegation();
		}, 200)
	}
	// 查看操作处理方法
	const handleLook = (row) => {
		btnShow.value= false
		getDataDetails(row)
		// httpGet(`/orders/${row.id}`).then(res => {
		// 	dialogFormVisible.value = true;
		// 	editId.value = row.id;
		// 	btnShow.value= true
		// 	setTimeout(function() {
		// 		saveDataShow(res, 1);
		// 	}, 500)
		// });
	}
	// 编辑操作处理方法
	const handleEdit = (row) => {
		btnShow.value= true
		getDataDetails(row)
	}
	const getDataDetails= (row) =>{
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
		formListNew.value[2].formData[0].formItem[1].value = '';
		formListNew.value[2].formData[0].formItem[1].remark = '';
		formListNew.value[0].formData[0].formItem[17].disabled = false;
		formListNew.value[0].formData[0].formItem[20].disabled = false;
		formListNew.value[0].formData[0].formItem[21].disabled = false;
		formListNew.value[2].formData[0].formItem[7].disabled = false;
		formListNew.value[0].formData[0].formItem[17].rules = rulesInit('请选择截单日期', 1);
		formListNew.value[2].formData[0].formItem[7].rules = rulesInit('请选择截单日期', 1);
		
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
			}else{
				data['insurance']= '0'
				data['is_finish']= '0'
				data['is_allowed']= '0'
				if(res['order_type_id']=== 3 || res['order_type_id']=== 4){
					data['is_delivery']= 0
				}else{
					data['is_delivery']= 1
				}
				data['job_no']= ''
				data['contract_no']= ''
				data['finish_at']= ''
				data['container_type']= ''
				data['order_delegation_header.seller_id']= null
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
		if(data.actual_sailing_at){
			formListNew.value[0].formData[0].formItem[20].disabled = true;
		}
		if(data.actual_arrival_at){
			formListNew.value[0].formData[0].formItem[21].disabled = true;
		}
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