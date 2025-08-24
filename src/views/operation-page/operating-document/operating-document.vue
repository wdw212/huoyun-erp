<template>
	
	<div class="p-r">
		<!-- 顶部搜索 -->
		<search-top ref="searchTop" :queryParams="queryParamsDocu" @search="searchConfirm"></search-top>
		
		<!-- 表格 -->
		<table-list :tableConfig="tableConfig" :tableColumn="tableColumn" :toolbar="true"
		class="px-2" ref="tableList">
			<template #headerCon></template>
			<template #headerLeft> </template>
			<template #headerRight>
				<el-button type="primary" plain icon="Plus" @click="addDocument()" class="mb-1">新增</el-button>
				<el-button type="danger" plain icon="Delete" @click="" class="mb-1 mr-1"
				disabled>批量删除</el-button>
			</template>
		</table-list>
		
		<!-- 单据详情 -->
		<el-dialog v-model="dialogFormVisible" title="单据详情" width="90%" :close-on-click-modal="false">
			<el-card>
				<common-form ref="commonForm" v-model:formList="formListNew" @confirm="confirmSubmit"
				@cancel="cancelForm">
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
								<el-input v-model="saveData.booking_info[index]" :rows="3" type="textarea" placeholder="请输入" style="width: 100%" resize="none"/>
							</el-col>
						</el-row>
					</template>
					<!-- 一代联系方式/费用 -->
					<template #order_delegationBtn="{formList,saveData}">
						<el-button type="primary" @click="addDelegation(saveData)">增加</el-button>
					</template>
					<template #order_delegationList="{formList,saveData}">
						<el-row :gutter="20">
							<template v-for="(item,index) in saveData['order_delegation_header.remark']" :key="index">
								<el-col :span="6">
									<p class="pb">一代联系方式</p>
									<el-input v-model="saveData['order_delegation_header.remark'][index]['contact_phone']" :rows="3" type="textarea" placeholder="请输入" resize="none" />
								</el-col>
								<el-col class="p-r" :span="6">
									<el-icon class="p-a r_0 t_0 z-1000" style="margin: 5px 15px;"
									@click="saveData['order_delegation_header.remark'].splice(index, 1)"><Close /></el-icon>
									<p class="pb">一代费用</p>
									<el-input v-model="saveData['order_delegation_header.remark'][index]['fee']" :rows="3" type="textarea" placeholder="请输入" resize="none"/>
								</el-col>
							</template>
						</el-row>
					</template>
					
					<!-- 应付款 -->
					<template #AccountsBtn="{saveData,formList}">
						<div>
							<span class="colorr pl-1">业务员请仔细核对费用内容，如有疑问，请与操作员确认！</span>
							<el-button type="danger" plain>费用未完结</el-button>
							<el-button type="primary" plain @click="addAccount()">添加明细</el-button>
						</div>
					</template>
					<template #AccountsPayable="{saveData,formList}">
						<table-list :tableConfig="tableConfigAccounts" :tableColumn="AccountsColumn" :multiple="false" :border="true" ref="accountTable">
							<template #bottomCon="{tableData}">
								<el-row :gutter="20">
									<el-col class="p-r" v-for="(item,index) in tableData" :key="index" :span="6">
										<el-input v-model="tableData[index].remark" :rows="3" type="textarea" placeholder="请输入" resize="none" class="mt-1"/>
									</el-col>
								</el-row>
							</template>
						</table-list>
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

<script setup name="OperatingDocuments">
	import { ref, onMounted, h, getCurrentInstance } from "vue";
	import SearchTop from "@/components/searchTop/index";
	import TableList from "@/components/tableList/index";
	import CommonForm from "@/components/commonForm/index";
	import BoxInfo from "@/components/document/boxInfo";
	import FileTable from "@/components/document/fileTable";
	import BillForm from '@/components/BillForm.vue'
	import { httpPost, httpGet, httpPut, httpDelete } from '@/api/apiCommon';
	import { Close } from '@element-plus/icons-vue'
	import { useTransition } from '@vueuse/core'
	import { getYWY, getCZY, getYWLX, getTT, getCGS, getDZY, getSW, getXHDW, getMT } from '@/api/commonList';
	import { queryParamsDocu, formList, AccountsColumn, amountFormDoc } from '@/utils/documents';
	import { detailInfo } from '@/utils/common'
	const { proxy } = getCurrentInstance();
	
	const dialogFormVisible = ref(false);
	const editId = ref('');
	const formListNew = ref([]);
	
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
		YWY.value = await getYWY();
		CZY.value = await getCZY();
		YWLX.value = await getYWLX();
		TT.value = await getTT();
		CGS.value = await getCGS();
		DZY.value = await getDZY();
		SW.value = await getSW();
		XHDW.value = await getXHDW();
		MT.value = await getMT();
		
		
		// queryParamsDocu.value[11].options = YWY.value;
		// queryParamsDocu.value[12].options = CZY.value;
		AccountsColumn.value[4].noShow = true;
		AccountsColumn.value[7].noShow = true;
		AccountsColumn.value[AccountsColumn.value.length] = {
			label: '操作',
			prop: 'actions',
			actions: [{
				label: '删除',
				type: 'danger',
				onClick: (row, index) => accountsDelete(row, index)
			}],
			width: '70px'
		}
		
		formListNew.value = JSON.parse(JSON.stringify(formList.value));
		formListNew.value[0].formData[0].formItem[0].options = YWLX.value;
		formListNew.value[0].formData[0].formItem[4].options = YWY.value;
		formListNew.value[0].formData[0].formItem[5].options = CZY.value;
		formListNew.value[0].formData[0].formItem[6].options = DZY.value;
		formListNew.value[0].formData[0].formItem[7].options = SW.value;
		formListNew.value[0].formData[0].formItem[8].options = CGS.value;
		formListNew.value[1].formData[0].formItem[0].options = XHDW.value;
		formListNew.value[1].formData[0].formItem[1].options = TT.value;
		formListNew.value[2].formData[0].formItem[10].options = MT.value;
		
		formListNew.value[5].formData[2].formItem = JSON.parse(JSON.stringify(amountFormDoc.value));
		formListNew.value[5].formData[1].noShow = true;
		console.log('formListNew', formListNew)
	})
	
	const searchConfirm = (val) =>{
		console.log('searchConfirm', val)
	}
	
	/** 查询列表 */
	const tableColumn = ref([
		{label: '工作编号', prop: 'job_no', formatter: (row)=> row.job_no || '无'},
		{label: '委托抬头', prop: 'propcolumn'},
		{label: '操作模式', prop: 'order_type.name'},
		{label: '提单号', prop: 'bl_no'},
		{label: '柜型', prop: 'container_type'},
		{label: '目的港', prop: 'destination_port'},
		{label: '开船日期', prop: 'sailing_at'},
		{label: '到港日期', prop: 'arrival_at'},
		{label: '业务员', prop: 'business_user.name'},
		{label: '提货', prop: 'is_delivery', formatter: (row)=> row.is_delivery === 1 ? '已提货' : '未提货'},
		{label: '文件', prop: 'propcolumn'},
		{label: '费用完结', prop: 'propcolumn'},
		{label: '创建时间', prop: 'created_at'},
		{label: '备注', prop: 'remark'},
		
		{ 
			label: '操作',
			prop: 'actions',
			actions: [
				{
					label: '修改',
					onClick: (row) => handleEdit(row)
				},
				{
					label: '复制',
					onClick: (row) => handleCopy(row)
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
		url: '/orders',
		requestMethod: httpGet,
		isQuery: true
	})
	const addDocument = () => {
		dialogFormVisible.value = true;
		editId.value = '';
		setTimeout(function(){
			proxy.$refs.boxInfo.addBox(true);
			proxy.$refs.accountTable.tableData = [];
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
	//单据复制
	function handleCopy(row) {
		httpGet(`/orders/${row.id}`).then(res => {
			dialogFormVisible.value = true;
			editId.value = '';
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
			cny_amount: '',
			cny_invoice_number:'',
			usd_amount: '',
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
	const tableConfigAccounts = ref({
		url: '/orders',
		requestMethod: httpGet,
		isQuery: false
	})
	
</script>

<style scoped>
	
</style>