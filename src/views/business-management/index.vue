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
		<table-list :tableConfig="tableConfig" :tableColumn="tableColumn" :toolbar="true"
		class="px-2" :number="true">
			<template #headerLeft> </template>
			<template #headerRight>
				<el-button type="primary" plain icon="Plus" @click="addDocument()" class="mb-1">新增</el-button>
			</template>
		</table-list>
		
		<!-- 单据详情 -->
		<el-dialog v-model="dialogFormVisible" title="商务详情" width="80%" :close-on-click-modal="false">
			<el-card>
				<common-form ref="commonForm" :formList="formListNew" @confirm="confirmSubmit" 
				@cancel="dialogFormVisible = false;">
					<!-- 订舱信息及备注 -->
					<template #remarkBtn="{formList,saveData}">
						<span style="font-weight: bold;padding-right: 10px;color: #606266;">订舱信息及备注</span>
						<el-button type="primary" @click="saveData.booking_info.push('')">订舱信息及备注</el-button>
					</template>
					<template #remarkList="{formList,saveData}">
						<el-row :gutter="20">
							<el-col class="p-r" v-for="(item,index) in saveData.booking_info" :key="index" :span="6">
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
							<el-tooltip class="box-item" effect="dark"
								:content="shipCompany.phone ? shipCompany.phone :'暂无电话'"
								placement="top">
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
						<box-info ref="boxInfo" :boxData="boxData" class="mt-2" @boxInfoChange="boxInfoChange"></box-info>
					</template>
					
					<!-- 提单信息 -->
					<template #billInfo>
						<bill-form ref="billInfo"></bill-form>
					</template>
					
					<!-- 文件上传 -->
					<!-- <template #fileInfo>
						<file-Table ref="fileInfo" @uploadFile="uploadFile"></file-Table>
					</template> -->
				</common-form>
			</el-card>
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
	import { queryParamsBusiness, formList, statistic,rulesInit } from '@/utils/business';
	// import { queryParamsBusiness, formList, AccountsColumn, amountFormDoc, rulesInit } from '@/utils/business';
	import { detailInfo, keyStatus, commonParam } from '@/utils/common'
	import { getYWY, getCZY, getYWLX, getTT, getXHDW,optionsComm } from '@/api/commonList';
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
		queryParamsBusiness.value[3].options = CZY.value;
		queryParamsBusiness.value[4].options = YWY.value;
		queryParamsBusiness.value[9].options = XHDW.value;
		console.log(queryParamsBusiness.value[3],'queryParams.value[3]')
		// formListNew.value = JSON.parse(JSON.stringify(formList.value))
		// formListNew.value[0].formData[2].noShow = false;
		// formListNew.value[0].formData[0].formItem[0].options = YWLX.value;
		// formListNew.value[0].formData[0].formItem[4].options = YWY.value;
		
		keyStatus(formList.value, '商务详情', function(form, options){
			formListNew.value = form;
			formListNew.value[5].formData[2].formItem = JSON.parse(JSON.stringify(amountFormDoc.value));
			formListNew.value[5].formData[1].noShow = true;
			loading.value = false;
			seletData.value = options;
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
		{label: '是否提货',prop: 'is_delivery', formatter: (row)=> optionsComm['提货'].find(item =>item.value=== row.is_delivery)?.label},
		{label: '订舱信息',prop: 'booking_info'},
		{label: '备注',prop: 'order_remark'},
		{ 
			label: '操作',
			prop: 'actions',
			actions: [
				{
					label: '修改',
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
	// 请求列表
	const tableConfig = ref({
		url: '/orders',
		requestMethod: httpGet,
		isQuery: true
	})
	const addDocument = () => {
		dialogFormVisible.value = true;
		editId.value = '';
		containers.value = [];
		order_files.value = [];
		setTimeout(function(){
			proxy.$refs.commonForm.resetKey(formListNew.value, true);
			proxy.$refs.boxInfo.addBox(true);
			proxy.$refs.accountTable.tableData = [];
			proxy.$refs.commonForm.changeSave({
				'order_delegation_header.remark': []
			});
			addDelegation();
			addAccount();
		}, 200)
	}
	// 编辑操作处理方法
	const handleEdit = (row) => {
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
				
				proxy.$refs.fileInfo.dafultFile(res.order_files);
			}, 500)
		});
	}
	//单据删除
	const deleteIds = ref([]);
	function handleDelete(row) {
		const _ids = row.id || deleteIds.value;
		proxy.$modal.confirm('是否确认删除选中的的数据项？').then(function() {
			return httpDelete('/orders/'+_ids);
		}).then(() => {
			proxy.$refs.tableList.getList();
			proxy.$modal.msgSuccess("删除成功");
		}).catch(() => {});
	}
	
	// 委托抬头-一代联系人
	const router = useRouter();
	function addCompanyHead(){
		router.push({
			path: "/company/company-headers",
			query: {
				add: true
			},
		});
	}
	async function refreshCompanyHead(){
		var WTTT = await getTT(commonParam().WTTT_params); //委托公司抬头
		formListNew.value[1].formData[0].formItem[1].options = WTTT;
	}
	const addDelegation = () => {
		var data = proxy.$refs.commonForm.saveData['order_delegation_header.remark'];
		data.push({contact_phone: '', fee: ''})
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
	
	const addAccount = () => {
		proxy.$refs.accountTable.tableData.push({
			company_header_id: '',
			no_invoice_remark: '',
			cny_amount: '0.00',
			cny_invoice_number:'',
			usd_amount: '0.00',
			usd_invoice_number: '',
			contact_phone: '',
			contact_person: '',
		});
	}
	const accountsDelete = (row) => {
		const rowIndex = proxy.$refs.accountTable.tableData.findIndex(item => item === row);
		proxy.$refs.accountTable.tableData.splice(row.index, 1)
		// console.log('accountsDelete', row, rowIndex)
	}
	
	const containers = ref([]);
	// 箱子信息变更
	const boxInfoChange = (data) => {
		containers.value = data;
	}
	
	// 文件上传
	const order_files = ref([]);
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
			proxy.$modal.msgSuccess("暂无网址");
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
	//单独字段操作
	const itemChange = (data, val, item) => {
		var saveData = proxy.$refs.commonForm.saveData;
		var dataNew = item.options?item.options.find(v=>{return v.id == val}):{};
		var updateData = {};
		if(item.key=='shipping_company_id'){
			shipCompany.value = item.options.find(v=>{return v.id == val})
		}else if(item.key=='cutoff_status'){
			formListNew.value[0].formData[0].formItem[17].disabled = val==3?true:false;
			formListNew.value[2].formData[0].formItem[7].disabled = val==3?true:false;
			if(val==1){
				formListNew.value[0].formData[0].formItem[17].rules = rulesInit('请选择截单日期', 1);
				formListNew.value[2].formData[0].formItem[7].rules = rulesInit('请选择截单日期', 1);
			}else{
				delete formListNew.value[0].formData[0].formItem[17].rules;
				delete formListNew.value[2].formData[0].formItem[7].rules;
			}
			updateData.cutoff_at = '';
			if(val==3&&saveData.template2){
				updateData.cutoff_at = saveData.template2;
			}
		}else if(item.key=='order_type_id'){
			updateData.is_delivery = dataNew.name=='海运整柜'||dataNew.name=='拼箱空运'?'0':1;
		}else if(item.key=='order_delegation_header.company_header_id'){
			updateData['order_delegation_header.contact_person'] = dataNew.contact_person;
			updateData['order_delegation_header.contact_phone'] = dataNew.contact_phone;
		}else if(item.key=='ship_name'||item.key=='ship_no'){
			formListNew.value[2].formData[0].formItem[1].value = saveData.ship_name + '/' + saveData.ship_no;
			formListNew.value[2].formData[0].formItem[1].remark = saveData.ship_name + '/' + saveData.ship_no;
		}else if(item.key=='template8'){
			formListNew.value[2].formData[0].formItem[10].remark = dataNew?dataNew.remark:'';
		}else if(item.key=='template2'){
			updateData.cutoff_at = val;
		}
		proxy.$refs.boxInfo.updateSaveData(saveData, seletData.value);
		proxy.$refs.commonForm.changeSave(updateData);
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
			order_files: order_files.value,
		}
		params.order_delegation_header = JSON.stringify(params.order_delegation_header);
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
	// const tableConfigAccounts = ref({
	// 	url: '/orders',
	// 	requestMethod: httpGet,
	// 	isQuery: false
	// })
	
</script>

<style scoped>
	
</style>