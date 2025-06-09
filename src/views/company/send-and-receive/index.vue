<template>
	<div class="app-container">
		<el-form ref="queryRef" :model="queryParams" :inline="true" label-width="68px">
			<el-form-item label="关键字" style="width: 300px" prop="keyword">
				<el-input v-model="queryParams.keyword" placeholder="搜索代码,名称,备注,收发通具体信息" clearable />
			</el-form-item>
			<el-form-item label="收发通类型" style="width: 300px" prop="type">
				<el-select v-model="queryParams.type" filterable placeholder="请选择收发通类型">
					<el-option v-for="item in TYPE_LIST" :key="item.value" :label="item.label"
						:value="item.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="是否确认" style="width: 300px" prop="is_confirm">
				<el-select v-model="queryParams.is_confirm" placeholder="请选择是否确认" clearable>
					<el-option v-for="item in IS_CONFIRM_LIST" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="操作员" style="width: 300px" prop="operation_user_id">
				<el-select v-model="queryParams.operation_user_id" placeholder="请选择操作员" clearable>
					<el-option v-for="item in OPERATION_USER" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item label="单证员" style="width: 300px" prop="document_user_id">
				<el-select v-model="queryParams.document_user_id" placeholder="请选择单证员" clearable>
					<el-option v-for="item in DOCUMENT_USER" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item label="商务" style="width: 300px" prop="commerce_user_id">
				<el-select v-model="queryParams.commerce_user_id" placeholder="请选择商务" clearable>
					<el-option v-for="item in COMMERCE_USER" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
				<el-button icon="Refresh" @click="resetQuery">重置</el-button>
			</el-form-item>
		</el-form>

		<el-row :gutter="10" class="mb8" justify="end">
			<el-col :span="1.5">
				<el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
			</el-col>
			<right-toolbar @queryTable="getList"></right-toolbar>
		</el-row>

		<el-table v-loading="loading" :data="dataList" show-overflow-tooltip>
			<!-- <el-table-column type="selection" width="55" align="center" /> -->
			<el-table-column label="收发通类型" align="center" prop="type" >
				<template #default="scope">
					{{ TYPE_LIST.find(item => item.value === scope.row.type).label }}
				</template>
			</el-table-column>
			<el-table-column label="名称" align="center" prop="name" />
			<el-table-column label="舱单网址" align="center" prop="url" >
				<template #default="scope">
					<el-button v-if="scope.row.url" plain type="success" @click="handleUrl(scope.row)">有舱单</el-button>
					<div v-else class="font-color-gray">无舱单</div>
					</template>
				</el-table-column>
			<el-table-column label="是否确认" align="center" prop="is_confirm">
				<template #default="scope">
					{{ scope.row.is_confirm==1?'已确认':'未确认' }}
				</template>
			</el-table-column>
			<el-table-column label="确认人" align="center" prop="confirm_user" >
				<template #default="scope">
					<div :class="scope.row.confirm_user?'font-color-green':''">{{scope.row.confirm_user&&scope.row.confirm_user.name}}</div>
				</template>
			</el-table-column>
			<el-table-column label="生成信息" align="center" prop="generate_information" >
				<template #default="scope">
					<el-button  plain type="success" @click="handleInformation(scope.row)">生成信息</el-button>
				</template>
			</el-table-column>
			<el-table-column label="备注" align="center" prop="remark" />
			<el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="300">
				<template #default="scope">
					<div v-if="scope.row.is_confirm==0 || userStore.userRole === 1 || (scope.row.confirm_user && scope.row.confirm_user.name=== userStore.name)">
						<el-button plain type="primary" icon="Edit" @click="handleUpdate(scope.row)">修改</el-button>
						<el-button plain type="danger" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
					</div>
					<div v-else>
						<el-button plain type="primary" @click="handleView(scope.row)">查看详情</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<el-dialog class="generate_dialog" title="生成信息" v-model="openInformation" :destroy-on-close='true' width="30%">
			<el-input v-model="generate_information" placeholder="请输入生成信息" :rows="8" type="textarea" id="myTextarea"/>
		</el-dialog>
		<pagination v-show="total>0" :total="total" v-model:page="queryParams.page" v-model:limit="queryParams.pageSize"
			@pagination="getList" />
		
		<view-or-dialog ref="viewOrDialogDom" :openView.sync='openView' :btnType.sync='btnType' :model.sync='modalModel' @refresh='refresh' @cancel="cancel" :title='dialogTitle'></view-or-dialog>
	</div>
</template>

<script setup name="sendAndReceive">
	import { onMounted, toRefs } from 'vue';
	import {
		listData,
		getData,
		delByIds,
		addData,
		updateData
	} from "@/api/company/send-and-receive";
	import {
			listUser as userListData
		} from "@/api/system/user";
	import {
		listData as listSellersData
	} from "@/api/system/system-parameter/sellers";
	import viewOrDialog from './component/view-or-dialog'
	import Cookies from "js-cookie";
	import useUserStore from "@/store/modules/user";
	
	const userStore = useUserStore();  //vuex缓存的用户信息
	const {proxy} = getCurrentInstance();
	const queryParams = reactive({
		page: 1,
		pageSize: 15,
		keyword: null,
		type: null,
		is_confirm: null,
		operation_user_id: null,
		document_user_id: null,
		commerce_user_id: null
	});
	// const {
	// 	queryParams
	// } = toRefs(data);
	const dataList = ref([]);
	const openView = ref(false)
	const dialogTitle = ref('')
	const loading = ref(false);
	const modalModel = ref(null);
	const btnType = ref(null);
	const total = ref(0);
	const openInformation= ref(0)  //生成信息界面
	const generate_information= ref('')  //生成信息参数
	const username = ref(Cookies.get("username"));
	console.log('username', username)
	// 收发通类型
	const TYPE_LIST = ref([{
			label: '发货人',
			value: 'sender'
		},
		{
			label: '收货人',
			value: 'receiver'
		},
		{
			label: '通知人',
			value: 'notifier'
		}
	])
	// 是否确认
	const IS_CONFIRM_LIST = ref([{
			label: '未确认',
			value: 0
		},
		{
			label: '已确认',
			value: 1
		}
	])
	// 操作员
	const OPERATION_USER = ref([])
	// 单证员
	const DOCUMENT_USER = ref([])
	// 商务
	const COMMERCE_USER = ref([])
	
	function getSelectOption() {
		userListData({
			is_paginate: 0,
			code: 'OPERATE'
		}).then(response => {
			OPERATION_USER.value = response.data
		})
		userListData({
			is_paginate: 0,
			code: 'DOCUMENT'
		}).then(response => {
			DOCUMENT_USER.value = response.data
		})
		userListData({
			is_paginate: 0,
			code: 'COMMERCE'
		}).then(response => {
			COMMERCE_USER.value = response.data
		})
	}
	getSelectOption()
	// 新增弹框
	function handleAdd() {
		btnType.value= 'add'
		dialogTitle.value= '新增'
		openView.value= true
		// open.value= true
		// title.value = "新增";
		
	}
	// 修改弹框
	function handleUpdate(row){
		btnType.value= 'edit'
		dialogTitle.value= '修改'
		openView.value= true
		modalModel.value= row
	}
	// 无编辑权限时 查看详情页
	function handleView(row){
		btnType.value= 'view'
		dialogTitle.value= '查看详情'
		openView.value= true
		modalModel.value= row
	}
	getList();
	/** 搜索按钮操作 */
	function handleQuery() {
		console.log('queryParams', queryParams)
		queryParams.page = 1;
		getList();
	}
	/** 重置按钮操作 */
	function resetQuery() {
		proxy.$refs.queryRef.resetFields()
		handleQuery();
	}
	/** 删除按钮操作 */
	function handleDelete(row) {
		const _ids = row.id || ids.value;
		proxy.$modal.confirm('是否确认删除编号为"' + _ids + '"的数据项？').then(function() {
			return delByIds(_ids);
		}).then(() => {
			getList();
			proxy.$modal.msgSuccess("删除成功");
		}).catch(() => {});
	}
	
	// 关闭弹框
	const cancel = () =>{
		openView.value= false
		modalModel.value= null
		dialogTitle.value= ''
	}
	// 更新列表
	function refresh(){
		getList();
	}
	function handleUrl(row){
		window.open(row.url, "_blank");
	}
	// 点击生成信息
	function handleInformation(row){
		openInformation.value= true
		let typeLabel= TYPE_LIST.value.find(item =>item.value=== row.type)?TYPE_LIST.value.find(item =>item.value=== row.type).label : ''
		generate_information.value= `收发通类型:${typeLabel}\r\n代码:${row.code}\r\n名称:${row.name}\r\n地址:${row.address}\r\n国家/地区代码:${row.country}\r\nAEO企业编码:${row.aeo_company_code}\r\n具体联系人:${row.contact_name}\r\n联系人电话:${row.contact_phone}`
	}
	// -----------------------接口------------------
	/** 查询列表 */
	function getList() {
		loading.value = true;
		listData(queryParams).then(response => {
			dataList.value = response.data;
			total.value = response.meta.total;
			loading.value = false
		}).catch((e) => proxy.$modal.msgError(e?.toString() ?? '未知错误'))
		.finally(()=>{ loading.value = false })
	}
</script>
<style>
	.font-color-green{
		color: green
	}
	.font-color-gray{
		color: gray
	}
</style>
