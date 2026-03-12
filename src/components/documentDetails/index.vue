<template>
	<!-- 单据详情 -->
	<el-dialog v-model="dialogFormVisible" title="详情" width="80%" :close-on-click-modal="false" append-to-body>
		<el-card>
			<common-form ref="commonForm" v-model:formList="formListNew" @confirm="confirmSubmit"
				@cancel="cancelForm" @itemChange="itemChange" @tabsChange="tabsChange" :btnShow="false">
				<!-- 订舱信息及备注 -->
				<template #remarkBtn="{formList,saveData}">
					<span style="font-weight: bold;padding-right: 10px;color: #606266;">订舱信息及备注</span>
					<el-button type="primary" @click="saveData.booking_info.push('')">订舱信息及备注</el-button>
				</template>
				<template #remarkList="{formList,saveData}">
					<el-row :gutter="20">
						<el-col class="p-r mb-1" v-for="(item,index) in saveData.booking_info" :key="index" :span="6">
							<el-icon class="p-a r_0 t_0 z-1000" style="margin: 5px 15px;"
								@click="saveData.booking_info.splice(index, 1)">
								<Close />
							</el-icon>
							<el-input v-model="saveData.booking_info[index]" :rows="4" type="textarea"
								placeholder="请输入" style="width: 100%" />
						</el-col>
					</el-row>
				</template>
	
				<!-- 委托抬头新增 -->
				<template #addHeader>
					<el-button type="primary" :icon="Refresh" circle style="margin-left: 10px;"
						@click="refreshCompanyHead" />
					<el-button type="danger" :icon="Plus" circle style="margin-left: 10px;"
						@click="addCompanyHead" />
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
								<el-input
									v-model="saveData['order_delegation_header.remark'][index]['contact_phone']"
									:rows="3" type="textarea" placeholder="请输入" />
							</el-col>
							<el-col class="p-r mt-1" :span="6">
								<el-icon class="p-a r_0 t_0 z-1000 hand" style="margin: 5px 15px;"
									@click="saveData['order_delegation_header.remark'].splice(index, 1)">
									<Close />
								</el-icon>
								<p class="pb">一代费用</p>
								<el-input v-model="saveData['order_delegation_header.remark'][index]['fee']"
									:rows="3" type="textarea" placeholder="请输入" />
							</el-col>
						</template>
					</el-row>
				</template>
	
				<!-- 应付款 -->
				<template #AccountsBtn="{saveData,formList}">
					<div>
						<span class="colorr pl-1">业务员请仔细核对费用内容，如有疑问，请与操作员确认！</span>
						<!-- <el-button :type="payment_status==1?'success':'danger'"
						@click="changePaymentStatus">费用{{payment_status==1?'已':'未'}}完结</el-button> -->
						<!-- <el-button type="success" plain>费用未完结</el-button>
						<el-button type="success" plain>账单未做</el-button>
						<el-button type="primary" plain >制作账单</el-button>
						<el-button type="primary" plain>添加明细</el-button> -->
					</div>
				</template>
				<template #AccountsPayable="{saveData,formList}">
					<table-list :tableConfig="tableConfigAccounts" :tableColumn="AccountsColumn" :multiple="false"
						:border="true" ref="accountTable" @tableItemChange="tableItemChangeAccounts">
						<template #table_company_header_id>
							<div style="display: flex;justify-content: space-between;">
								<div>费用明细</div>
								<!-- <el-button type="warning" size="small" plain @click="addAccountsPage">新增</el-button> -->
							</div>
						</template>
						<template #bottomCon="{tableData}">
							<el-row :gutter="20">
								<el-col class="p-r" v-for="(item,index) in tableData" :key="index" :span="6">
									<el-input v-model="tableData[index].remark" :rows="5" type="textarea"
										placeholder="请输入" class="mt-1" />
								</el-col>
							</el-row>
						</template>
					</table-list>
				</template>
				
				<!-- 应收款 -->
				<template #PaymentBtn="{saveData,formList}">
					<div>
						<!-- <el-button type="primary" @click="addPayment()">添加应收款</el-button> -->
					</div>
				</template>
				<template #PaymentPayable="{saveData,formList}">
					<table-list :tableConfig="tableConfigPayment" :tableColumn="PaymentColumns" :multiple="false" :border="true" ref="paymentTable"></table-list>
				</template>
				
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
					<box-info ref="boxInfo" :boxData="boxData" class="mt-2" @boxInfoChange="boxInfoChange"
						@containerInfo="containerInfo"></box-info>
				</template>
	
				<!-- 提单信息 -->
			<!-- 	<template #billInfo>
					<BillForm ref="billForm" @saveBill="saveBill"></BillForm>
				</template> -->
	
				<!-- 文件上传 -->
				<template #fileInfo>
					<file-Table ref="fileInfo" @uploadFile="uploadFile"></file-Table>
				</template>
	
			</common-form>
		</el-card>
	</el-dialog>
</template>

<script setup>
	import CommonForm from "@/components/commonForm/index";
	import TableList from "@/components/tableList/index";
	import DropBox from "@/components/document/dropBox";
	import BoxInfo from "@/components/document/boxInfo";
	import FileTable from "@/components/document/fileTable";
	import {
		ref,
		computed,
		reactive ,
		onMounted,
		nextTick
	} from 'vue'
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
		queryParams,
		formList,
		AccountsColumn,
		amountFormDoc,
		rulesInit,
		statistic,
		PaymentColumn,
		amountFormFin,
		paySureFromList,
		paySureList,
		paySureList1
	} from '@/utils/services';
	import {
		detailInfo,
		keyStatus,
		commonParam,
		getSelect
	} from '@/utils/common'
	import {
		getCZY,
		getSW,
		getTT,
		getCGS,
		getMT,
		optionsComm
	} from '@/api/commonList';
	import {
		applyOrderSnapshotDisplay,
		normalizeOrderSnapshotValue,
		resetOrderSnapshotState
	} from '@/utils/orderSnapshotSelect';
	import {
		ElButton
	} from 'element-plus'
	const {
		proxy
	} = getCurrentInstance();
	const props = defineProps({
		type: {  //0  业务默认展示  1  业务带参数战术
			type: [Number, String],
			default: 0,
		},
		editId: {  //传参id
			type: String,
			default: '',
		},
		visible: { 
			type: Boolean,
			default: false,
		}
	})
	
	const emit = defineEmits(['update:visible'])
	
	// 使用 watch 来监听 visible 变化并触发请求
	watch(() => props.visible, (newVal) => {
		console.log(props.editId,'props.editId')
		if (newVal) {
			handleEdit()
		}
	})
	
	const dialogFormVisible = computed({
		get() {
			return props.visible
		},
		set(value) {
			// 通过 emit 更新父组件的 visible
			emit('update:visible', value)
		}
	})
	
	// 编辑操作处理方法
	const handleEdit = async () => {
		const [res] = await Promise.all([
			httpGet(`/orders/${props.editId}`),
			refreshSnapshotSelectData(),
		]);
		if (!res) return;
		setTimeout(function() {
			saveDataShow(res, 1);
		}, 500)
	}
	const tabName= ref('2')
	// const dialogFormVisible = ref(false);
	const billVisible = ref(false)
	const editId = ref('');
	const formListNew = ref([]);
	const AccountsColumns = ref([]);
	const PaymentColumns = ref([]);
	const paySureLists = ref([]);
	const paySureList1s = ref([]);
	const loading = ref(true);
	const seletData = ref({});
	const snapshotSelectState = ref({});
	const buildNoCacheQuery = () => ({ _t: Date.now() });
	const invoiceType=ref(0)  //0  默认展示  1  带参数战术
	
	const containers = ref([]); //箱子信息
	const order_files = ref([]); //文件信息
	const paySureVisible = ref(false); //文件信息
	const YWY = ref([]);  //业务员
	const CZY = ref([]);  //操作员
	const YWLX = ref([]); //业务类型
	const TT = ref([]); //抬头/公司名称
	const CGS = ref([]); //船公司
	const DZY = ref([]); //单证员
	const SW = ref([]); //商务
	const XHDW = ref([]); //销货单位
	const MT = ref([]); //码头
	const refreshSnapshotSelectData = async () => {
		const [shippingCompanies, enteredPortWharves, companyHeaders] = await Promise.all([
			getCGS(buildNoCacheQuery()),
			getMT(buildNoCacheQuery()),
			getTT({ ...commonParam().WTTT_params, ...buildNoCacheQuery() }),
		]);
		seletData.value.CGS = shippingCompanies;
		seletData.value.MT = enteredPortWharves;
		seletData.value.WTTT = companyHeaders;
	}
	onMounted(async () => {
		statistic.value.forEach((item,index)=>{
			const source = ref(0)
			statistic.value[index].value = useTransition(source, {
				duration: 1000,
			})
			source.value = 102658.344 + index*1000000
		})
		CZY.value = await getCZY();
		SW.value = await getSW();
		queryParams.value[7].options = CZY.value;
		queryParams.value[8].options = SW.value;
		// queryParams.value[4].options = YWY.value;
		// 应收款
		PaymentColumns.value = JSON.parse(JSON.stringify(PaymentColumn.value));
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
		
		paySureLists.value = JSON.parse(JSON.stringify(paySureList.value));
		// paySureLists.value[paySureLists.value.length] = {
		// 	label: '操作',
		// 	prop: 'actions',
		// 	actions: [{
		// 		label: '增加',
		// 		type: 'danger',
		// 		onClick: (row, index) => paymentDelete(row, index)
		// 	},{
		// 		label: '删除',
		// 		type: 'danger',
		// 		onClick: (row, index) => paymentDelete(row, index)
		// 	}],
		// 	width: '70px'
		// }
		paySureList1s.value = JSON.parse(JSON.stringify(paySureList1.value));
		// paySureList1s.value[paySureList1s.value.length] = {
		// 	label: '操作',
		// 	prop: 'actions',
		// 	actions: [{
		// 		label: '删除',
		// 		type: 'danger',
		// 		onClick: (row, index) => paymentDelete(row, index)
		// 	}],
		// 	width: '70px'
		// }
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
		keyStatus(formList.value, '业务模块', function(form, options) {
			formListNew.value = form;
			// formListNew.value[5].formData[2].formItem = JSON.parse(JSON.stringify(amountFormDoc
			// .value));
			// formListNew.value[5].formData[1].noShow = true;
			loading.value = false;
			seletData.value = options;
			AccountsColumn.value[0].form.options = seletData.value.YFTT;
			// console.log('formListNew', formListNew, seletData.value)
		})
	})
	const payment_status = ref(0); //费用完结状态
	//应付款表格数据
	const tableConfigAccounts = ref({
		url: '/orders',
		requestMethod: httpGet,
		isQuery: false
	})
	
	//应付款表格数据
	const tableConfigPayment = ref({
		isQuery: false
	})
	const billInfo = ref({});
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
		const shipNameAndNo = data.ship_name && data.ship_no ? `${data.ship_name}/${data.ship_no}` : '';
		formListNew.value[2].formData[0].formItem[1].value = shipNameAndNo;
		formListNew.value[2].formData[0].formItem[1].remark = shipNameAndNo;
		if (data.shipping_company_id) {
			shipCompany.value = seletData.value.CGS.find(item => item.id === data.shipping_company_id) || {}; //船公司
		}
		applyOrderSnapshotDisplay({
			formList: formListNew.value,
			formData: data,
			sourceData: res,
			selectData: seletData.value,
			state: snapshotSelectState.value,
		});
		payment_status.value = res.payment_status || 0;
		proxy.$refs.boxInfo.updateSaveData(buildSnapshotNormalizedChildData(data), seletData.value);
		proxy.$refs.paymentTable.tableData = [];
		// addPayment();
		//提单信息
		billInfo.value = res.bl_info || {};
		if(type==2){
			['no','description','volume','gross_weight'].forEach((vv)=>{
				billInfo.value[vv] = '';
			})
		}
		// proxy.$refs.billForm.updateBill(billInfo.value, true) //装箱单
	
		proxy.$refs.commonForm.changeSave(data);
		
		if ((type == 2 && payment_status.value == 0) || type == 1) {
			var order_payments = res.order_payments;
			if (type == 2 && payment_status.value == 0) {
				order_payments.forEach((vv) => {
					vv.cny_invoice_number = '';
					vv.usd_invoice_number = '';
				})
			}
			proxy.$refs.accountTable.updateTableData(order_payments);
			countAccounts();
		}
	
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
	//船公司信息
	const shipCompany = ref({});
	function resetInfo() {
		resetOrderSnapshotState(snapshotSelectState.value);
		payment_status.value = 0;
		proxy.$refs.commonForm.activeName = '操作单据';
		containers.value = [];
		proxy.$refs.accountTable.state.tableData = [];
		order_files.value = [];
		proxy.$refs.fileInfo.dafultFile([]);
		billInfo.value = {};
		// proxy.$refs.billForm.updateBill({}, false)
		shipCompany.value = {};
	}
	//更新表单字段备注信息
	function updateKeyRemark(data) {
		var remarkList = {
			entered_port_wharf_id: [2, 10],
		}
		for (var key in remarkList) {
			var item = formListNew.value[remarkList[key][0]].formData[0].formItem[remarkList[key][1]];
			const fieldValue = normalizeOrderSnapshotValue(key, data[key], snapshotSelectState.value);
			var dataNew = item.options ? item.options.find(v => {
				return v.id == fieldValue
			}) : {};
			formListNew.value[remarkList[key][0]].formData[0].formItem[remarkList[key][1]].remark = dataNew ? dataNew
				.remark : '';
		}
	}
	function buildSnapshotNormalizedChildData(source) {
		const sourceData = source || {};
		return {
			...sourceData,
			shipping_company_id: normalizeOrderSnapshotValue('shipping_company_id', sourceData.shipping_company_id, snapshotSelectState.value),
			entered_port_wharf_id: normalizeOrderSnapshotValue('entered_port_wharf_id', sourceData.entered_port_wharf_id, snapshotSelectState.value),
			'order_delegation_header.company_header_id': normalizeOrderSnapshotValue(
				'order_delegation_header.company_header_id',
				sourceData['order_delegation_header.company_header_id'],
				snapshotSelectState.value
			),
		};
	}
	function countAccounts() {
		var tableData = proxy.$refs.accountTable.state.tableData;
		let cny_amount = tableData.reduce((accumulator, currentValue) => {
			return accumulator + parseFloat(currentValue.cny_amount) || 0;
		}, 0);
		let usd_amount = tableData.reduce((accumulator, currentValue) => {
			return accumulator + parseFloat(currentValue.usd_amount) || 0;
		}, 0);
		// console.log('计算', usd_amount, cny_amount)
		proxy.$refs.commonForm.changeSave({
			cny_amount_total: parseFloat(cny_amount).toFixed(2),
			usd_amount_total: parseFloat(usd_amount).toFixed(2),
		});
	}
	function toShipCompanyUrl() {
		if (shipCompany.value.tracking_url) {
			window.open(shipCompany.value.tracking_url)
		} else {
			proxy.$modal.msgWarning("暂无网址");
		}
	}
	//落箱数据生成
	function createDrop() {
		const normalizedSaveData = buildSnapshotNormalizedChildData(proxy.$refs.commonForm.saveData);
		var saveData = {
			...normalizedSaveData,
			boxInfo: containers.value
		};
		proxy.$refs.dropBox.openDrop(saveData, seletData.value);
	}
</script>

<style>
</style>
