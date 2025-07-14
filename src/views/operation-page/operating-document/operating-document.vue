<template>
	
	<!-- 顶部搜索 -->
	<search-top ref="searchTop" :queryParams="queryParams" @search="searchConfirm"></search-top>
	
	<!-- 表格 -->
	<table-list :tableConfig="tableConfig" :tableColumn="tableColumn" :toolbar="true"
	class="px-2">
		<template #headerCon></template>
		<template #headerLeft> </template>
		<template #headerRight>
			<el-button type="primary" plain icon="Plus" @click="handleEdit()" class="mb-1">新增</el-button>
			<el-button type="danger" plain icon="Delete" @click="" class="mb-1 mr-1"
			disabled>批量删除</el-button>
		</template>
	</table-list>
	
	<!-- 单据详情 -->
	<common-form ref="commonForm" v-model:formList="formListNew" @confirm="confirmSubmit"> 
		<!-- 订舱信息及备注 -->
		<template #remarkBtn="{formList,saveData}">
			<span style="font-weight: bold;padding-right: 10px;color: #606266;">订舱信息及备注</span>
			<el-button type="primary" @click="saveData.remark.push('')">订舱信息及备注</el-button>
		</template>
		<template #remarkList="{formList,saveData}">
			<el-row :gutter="20">
				<el-col class="p-r" v-for="(item,index) in saveData.remark" :key="index" :span="6">
					<el-icon class="p-a r_0 t_0 z-1000" style="margin: 5px 15px;"
					@click="saveData.remark.splice(index, 1)"><Close /></el-icon>
					<el-input v-model="saveData.remark[index]" :rows="3" type="textarea" placeholder="请输入" style="width: 100%" resize="none"/>
				</el-col>
			</el-row>
		</template>
		<!-- 一代联系方式/费用 -->
		<template #order_delegationBtn="{formList,saveData}">
			<el-button type="primary" @click="saveData.order_delegation_header.remark.push({contact_phone: '', fee: ''})">增加</el-button>
		</template>
		<template #order_delegationList="{formList,saveData}">
			<el-row :gutter="20">
				<template v-for="(item,index) in saveData.order_delegation_header.remark" :key="index">
					<el-col :span="6">
						<p class="pb">一代联系方式</p>
						<el-input v-model="saveData.order_delegation_header.remark[index]['contact_phone']" :rows="3" type="textarea" placeholder="请输入" style="width: 100%" resize="none"/>
					</el-col>
					<el-col class="p-r" :span="6">
						<el-icon class="p-a r_0 t_0 z-1000" style="margin: 5px 15px;"
						@click="saveData.order_delegation_header.remark.splice(index, 1)"><Close /></el-icon>
						<p class="pb">一代费用</p>
						<el-input v-model="saveData.order_delegation_header.remark[index]['fee']" :rows="3" type="textarea" placeholder="请输入" style="width: 100%" resize="none"/>
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
	</common-form>
	
</template>

<script setup>
	import { ref, onMounted, h, getCurrentInstance } from "vue";
	import SearchTop from "@/components/searchTop/index";
	import TableList from "@/components/tableList/index";
	import CommonForm from "@/components/commonForm/index";
	import { httpPost, httpGet } from '@/api/apiCommon';
	import { Close } from '@element-plus/icons-vue'
	import { useTransition } from '@vueuse/core'
	import { getYWY, getCZY } from '@/api/commonList';
	import { queryParams, formList, AccountsColumn } from '@/utils/documents';
	const { proxy } = getCurrentInstance();
	
	const formListNew = JSON.parse(JSON.stringify(formList.value));
	
	onMounted(async ()=>{
		// console.log('onMounted', queryParams);
		queryParams.value[11].options = await getYWY();
		queryParams.value[12].options = await getCZY();
		AccountsColumn.value[10] = {
			label: '操作',
			prop: 'actions',
			actions: [{
				label: '删除',
				type: 'danger',
				onClick: (row, index) => accountsDelete(row, index)
			}],
			width: '70px'
		}
		console.log('formListNew', formListNew)
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
		{label: '应付人民币', prop: 'propcolumn'},
		{label: '兑付情况', prop: 'propcolumn'},
		{label: '应付美金', prop: 'propcolumn'},
		{label: '兑付情况', prop: 'propcolumn'},
		{label: '应收人民币', prop: 'propcolumn'},
		{label: '兑付情况', prop: 'propcolumn'},
		{label: '应收美金', prop: 'propcolumn'},
		{label: '利润归属月份', prop: 'propcolumn'},
		{label: '总利润', prop: 'propcolumn'},
		{label: '税后折扣', prop: 'propcolumn'},
		{label: '兑付情况', prop: 'propcolumn'},
		{label: '是否开票', prop: 'bl_status', formatter: (row)=> row.bl_status === 1 ? '未开票' : '已开票'},
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
					onClick: (row) => handleEdit(row)
				},
				{
					label: '删除',
					type: 'danger',
					onClick: (row) => handleEdit(row)
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
	// 操作处理方法
	const handleEdit = (row) => {
		formListNew.value = JSON.parse(JSON.stringify(formList.value));
		proxy.$refs.commonForm.dialogFormVisible = true;
		setTimeout(function(){
			proxy.$refs.accountTable.tableData = [];
			addAccount();
		}, 200)
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
	
	// 单据信息提交
	const confirmSubmit = (data) => {
		// console.log('编辑行:', row)
		console.log('确认提交', data);
		var order_payments = proxy.$refs.accountTable.tableData;
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