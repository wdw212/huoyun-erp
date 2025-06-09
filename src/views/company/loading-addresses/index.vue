<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
			<el-form-item label="关键字" prop="keyword">
				<el-input v-model="queryParams.keyword" placeholder="请输入" clearable @keyup.enter="handleQuery" />
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
			<el-col :span="1.5">
				<el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete">批量删除</el-button>
			</el-col>
			<right-toolbar @queryTable="getList"></right-toolbar>
		</el-row>

		<el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55" align="center" />
			<el-table-column label="省份" align="center" prop="region.name" />
			<el-table-column label="地址" align="center" prop="address" />
			<el-table-column label="联系人" align="center" prop="contact_name" />
			<el-table-column label="联系方式" align="center" prop="phone" />
			<el-table-column label="创建时间" align="center" prop="created_at" />
			<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
				<template #default="scope">
					<el-button plain type="primary" icon="Edit" @click="handleUpdate(scope.row)">修改</el-button>
					<el-button plain type="danger" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" v-model:page="queryParams.page" v-model:limit="queryParams.pageSize"
			@pagination="getList" />

		<!-- 添加或修改对话框 -->
		<el-dialog :title="title" v-model="open" width="500px" append-to-body>
			<el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
				<el-form-item label="省份" prop="region_id">
					<!-- <el-input v-model="form.region_id" placeholder="请输入" /> -->
					<el-tree-select v-model="form.region_id" :data="REGION_OPTIONS"
						:props="{ value: 'id', label: 'name', children: 'children' }" value-key="id" placeholder="选择"
						check-strictly />
				</el-form-item>

				<el-form-item label="地址" prop="address">
					<el-input v-model="form.address" placeholder="请输入" />
				</el-form-item>

				<el-form-item label="联系人" prop="contact_name">
					<el-input v-model="form.contact_name" placeholder="请输入" />
				</el-form-item>

				<el-form-item label="联系方式" prop="phone">
					<el-input v-model="form.phone" placeholder="请输入" />
				</el-form-item>

				<el-form-item label="业务员" prop="business_user_id">
					<!-- <el-input v-model="form.business_user_id" placeholder="请输入" /> -->
					<el-select v-model="form.business_user_id" placeholder="请选择" clearable filterable>
						<el-option v-for="item in BUSINESS_USER" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
				</el-form-item>

				<el-form-item label="操作员" prop="operation_user_id">
					<!-- <el-input v-model="form.operation_user_id" placeholder="请输入" /> -->
					<el-select v-model="form.operation_user_id" placeholder="请选择" clearable filterable>
						<el-option v-for="item in OPERATION_USER" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
				</el-form-item>

				<el-form-item label="单证员" prop="document_user_id">
					<!-- <el-input v-model="form.document_user_id" placeholder="请输入" /> -->
					<el-select v-model="form.document_user_id" placeholder="请选择" clearable filterable>
						<el-option v-for="item in DOCUMENT_USER" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
				</el-form-item>

				<el-form-item label="备注" prop="remark">
					<el-input v-model="form.remark" type="textarea" rows="3" placeholder="请输入" />
				</el-form-item>

			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button type="primary" @click="submitForm">保 存</el-button>
					<el-button @click="cancel">取 消</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup>
	import {
		listData,
		getData,
		delByIds,
		addData,
		updateData
	} from "@/api/company/loading-addresses";
	import {
		listUser as userListData
	} from "@/api/system/user";
	import {
		listData as regionsListData
	} from "@/api/company/regions";

	const {
		proxy
	} = getCurrentInstance();

	const dataList = ref([]);
	const open = ref(false);
	const loading = ref(true);
	const ids = ref([]);
	const single = ref(true);
	const multiple = ref(true);
	const total = ref(0);
	const title = ref("");

	const data = reactive({
		form: {},
		queryParams: {
			page: 1,
			pageSize: 15,
			keyword: null
		},
		rules: {
			region_id: [{
				required: true,
				message: "省份不能为空",
				trigger: "blur"
			}],
			address: [{
				required: true,
				message: "地址不能为空",
				trigger: "blur"
			}],
			contact_name: [{
				required: true,
				message: "联系人不能为空",
				trigger: "blur"
			}],
			phone: [{
				required: true,
				message: "联系方式不能为空",
				trigger: "blur"
			}],
			business_user_id: [{
				required: true,
				message: "业务员不能为空",
				trigger: "blur"
			}],
			operation_user_id: [{
				required: true,
				message: "操作员不能为空",
				trigger: "blur"
			}],
			document_user_id: [{
				required: true,
				message: "单证员不能为空",
				trigger: "blur"
			}]
		}
	});

	const {
		queryParams,
		form,
		rules
	} = toRefs(data);

	// 业务员
	const BUSINESS_USER = ref([])
	// 操作员
	const OPERATION_USER = ref([])
	// 单证员
	const DOCUMENT_USER = ref([])
	// 省份
	const REGION_OPTIONS = ref([])

	function getSelectOption() {
		userListData({
			is_paginate: 0,
			code: 'BUSINESS'
		}).then(response => {
			BUSINESS_USER.value = response.data
		})
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
		regionsListData({
			is_paginate: 0
		}).then(response => {
			REGION_OPTIONS.value = response.data
		})
	}
	getSelectOption()


	/** 查询列表 */
	function getList() {
		loading.value = true;
		listData(queryParams.value).then(response => {
			dataList.value = response.data;
			total.value = response.meta.total;
			loading.value = false;
		});
	}

	// 取消按钮
	function cancel() {
		open.value = false;
		reset();
	}

	// 表单重置
	function reset() {
		form.value = {
			id: null,
			region_id: null,
			address: null,
			contact_name: null,
			phone: null,
			business_user_id: null,
			operation_user_id: null,
			document_user_id: null,
			remark: null
		};
		proxy.resetForm("formRef");
	}

	/** 搜索按钮操作 */
	function handleQuery() {
		queryParams.value.page = 1;
		getList();
	}

	/** 重置按钮操作 */
	function resetQuery() {
		proxy.resetForm("queryRef");
		handleQuery();
	}

	// 多选框选中数据
	function handleSelectionChange(selection) {
		ids.value = selection.map(item => item.id);
		single.value = selection.length != 1;
		multiple.value = !selection.length;
	}

	/** 新增按钮操作 */
	function handleAdd() {
		reset();
		open.value = true;
		title.value = "新增";
	}

	/** 修改按钮操作 */
	function handleUpdate(row) {
		reset();
		const _id = row.id || ids.value
		getData(_id).then(response => {
			form.value = response;
			open.value = true;
			title.value = "修改";
		});
	}

	/** 提交按钮 */
	function submitForm() {
		proxy.$refs["formRef"].validate(valid => {
			if (valid) {
				if (form.value.id != null) {
					updateData(form.value).then(response => {
						proxy.$modal.msgSuccess("修改成功");
						open.value = false;
						getList();
					});
				} else {
					addData(form.value).then(response => {
						proxy.$modal.msgSuccess("新增成功");
						open.value = false;
						getList();
					});
				}
			}
		});
	}

	/** 删除按钮操作 */
	function handleDelete(row) {
		const _ids = row.id || ids.value;
		proxy.$modal.confirm('是否确认删除选中的的数据项？').then(function() {
			return delByIds(_ids);
		}).then(() => {
			getList();
			proxy.$modal.msgSuccess("删除成功");
		}).catch(() => {});
	}

	getList();
</script>