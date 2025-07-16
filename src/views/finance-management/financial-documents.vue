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
		<common-form ref="commonForm" :formList="formListNew" @confirm="confirmSubmit"> 
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
		</common-form>
	</div>
	
</template>

<script setup>
	import { ref, onMounted, h, getCurrentInstance } from "vue";
	import SearchTop from "@/components/searchTop/index";
	import TableList from "@/components/tableList/index";
	import CommonForm from "@/components/commonForm/index";
	import { httpPost, httpGet } from '@/api/apiCommon';
	import { Close } from '@element-plus/icons-vue'
	import { useTransition } from '@vueuse/core'
	import { getYWY, getCZY, getYWLX } from '@/api/commonList';
	import { queryParams, formList, statistic, AccountsColumn } from '@/utils/documents';
	const { proxy } = getCurrentInstance();
	
	const formListNew = ref([]);
	const AccountsColumns = ref([]);
	
	const YWY = ref([]);  //业务员
	const CZY = ref([]);  //操作员
	const YWLX = ref([]); //业务类型
	
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
		queryParams.value[11].options = YWY.value;
		queryParams.value[12].options = CZY.value;
		formListNew.value = JSON.parse(JSON.stringify(formList.value))
		formListNew.value[0].formData[0].formItem[0].options = YWLX.value;
		formListNew.value[0].formData[0].formItem[4].options = YWY.value;
		
		AccountsColumns.value = JSON.parse(JSON.stringify(AccountsColumn.value));
		AccountsColumns.value.forEach((item,index)=>{
			if(['cny_invoice_number','cny_is_cashed','usd_invoice_number','usd_is_cashed'].indexOf(item.prop)==-1){
				AccountsColumns.value[index].form.disabled = true;
			}
		})
		// AccountsColumns.value[7].noShow = false;
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
		url: '/orders',
		requestMethod: httpGet,
		isQuery: true
	})
	// 操作处理方法
	const handleEdit = (row) => {
		// console.log('编辑行:', row)
		console.log('proxy', proxy.$refs)
		httpGet(`/orders/${row.id}`).then(res => {
			// for(var key in proxy.$refs.commonForm.saveData){
			// 	proxy.$refs.commonForm.saveData[key] = res[key];
			// }
			proxy.$refs.commonForm.dialogFormVisible = true;
			var formLists = JSON.parse(JSON.stringify(formList.value));
			formListNew.value = detailInfo(formLists, res);
			formListNew.value[0].formData[0].formItem[0].options = YWLX.value;
			formListNew.value[0].formData[0].formItem[4].options = YWY.value;
			console.log('编辑行', formListNew.value)
			
			setTimeout(function(){
				proxy.$refs.commonForm.resetKey(formListNew.value);
				console.log('应付款信息', res.order_payments)
				proxy.$refs.accountTable.updateTableData(res.order_payments);
			}, 500)
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
					})
				}
			})
		})
		return formList;
	}
	
	// 单据信息提交
	const confirmSubmit = (data) => {
		// console.log('编辑行:', row)
		console.log('确认提交', data)
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