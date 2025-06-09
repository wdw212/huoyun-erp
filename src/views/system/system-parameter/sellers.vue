<template>
	<div class="app-container">
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
			<el-table-column label="名称" align="center" prop="name" />
			<el-table-column label="纳税人识别号" align="center" prop="tax_number" />
			<el-table-column label="手机号" align="center" prop="phone" />
			<el-table-column label="地址" align="center" prop="address" />
			<el-table-column label="开户行" align="center" prop="bank_name" />
			<el-table-column label="开户账号" align="center" prop="bank_account" />
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
			<el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
				<el-form-item label="名称" prop="name">
					<el-input v-model="form.name" placeholder="请输入名称" />
				</el-form-item>
				<el-form-item label="纳税人识别号" prop="tax_number">
					<el-input v-model="form.tax_number" placeholder="请输入纳税人识别号" />
				</el-form-item>
				<el-form-item label="手机号" prop="phone">
					<el-input v-model="form.phone" placeholder="请输入手机号" />
				</el-form-item>
				<el-form-item label="地址" prop="address">
					<el-input v-model="form.address" placeholder="请输入地址" />
				</el-form-item>
				<el-form-item label="开户行" prop="bank_name">
					<el-input v-model="form.bank_name" placeholder="请输入开户行" />
				</el-form-item>
				<el-form-item label="开户账号" prop="bank_account">
					<el-input v-model="form.bank_account" placeholder="请输入开户账号" />
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
	} from "@/api/system/system-parameter/sellers";

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
			pageSize: 15
		},
		rules: {
			title: [{
				required: true,
				message: "标题不能为空",
				trigger: "blur"
			}]
		}
	});

	const {
		queryParams,
		form,
		rules
	} = toRefs(data);

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
			name: null,
			tax_number: null,
			phone: null,
			address: null,
			bank_name: null,
			bank_account: null
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