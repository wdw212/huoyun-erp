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

		<view style="color: #999;">
			这里的特殊费用显示税后的费用，是根据每票单子里面的特殊费用*下面的税点 比如单子里面的特殊金额是1500，显示为1500*0.92-5
			如果单子里的金额是3000，显示为2000*0.92+(3000-2000)*0.88-5
		</view>

		<el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55" align="center" />
			<el-table-column label="月份" align="center" prop="month_code" />
			<el-table-column label="金额" align="center" prop="one_amount" />
			<el-table-column label="税点" align="center" prop="one_tax_rate" />
			<el-table-column label="手续费" align="center" prop="one_handling_fee" />
			<el-table-column label="金额" align="center" prop="two_amount" />
			<el-table-column label="税点" align="center" prop="two_tax_rate" />
			<el-table-column label="手续费" align="center" prop="two_handling_fee" />
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
			<el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
				<el-form-item label="月份" prop="month_code">
					<el-date-picker v-model="form.month_code" placeholder="请输入月份" value-format="YYYY-MM"
						type="month"></el-date-picker>
				</el-form-item>

				<el-form-item label="金额小于等于" prop="one_amount">
					<el-input v-model="form.one_amount" type="number" placeholder="请输入" />
				</el-form-item>

				<el-form-item label="税点" prop="one_tax_rate">
					<el-input v-model="form.one_tax_rate" type="number" placeholder="请输入" />
				</el-form-item>

				<el-form-item label="手续费" prop="one_handling_fee">
					<el-input v-model="form.one_handling_fee" type="number" placeholder="请输入" />
				</el-form-item>

				<el-form-item label="金额小于等于" prop="two_amount">
					<el-input v-model="form.two_amount" type="number" placeholder="请输入" />
				</el-form-item>

				<el-form-item label="税点" prop="two_tax_rate">
					<el-input v-model="form.two_tax_rate" type="number" placeholder="请输入" />
				</el-form-item>

				<el-form-item label="手续费" prop="two_handling_fee">
					<el-input v-model="form.two_handling_fee" type="number" placeholder="请输入" />
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
	} from "@/api/system/system-parameter/special-tax-rates";

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
			month_code: [{
				required: true,
				message: "月份不能为空",
				trigger: "blur"
			}],
			one_amount: [{
				required: true,
				message: "金额不能为空",
				trigger: "blur"
			}],
			one_tax_rate: [{
				required: true,
				message: "税点不能为空",
				trigger: "blur"
			}],
			one_handling_fee: [{
				required: true,
				message: "手续费不能为空",
				trigger: "blur"
			}],
			two_amount: [{
				required: true,
				message: "金额不能为空",
				trigger: "blur"
			}],
			two_tax_rate: [{
				required: true,
				message: "税点不能为空",
				trigger: "blur"
			}],
			two_handling_fee: [{
				required: true,
				message: "手续费不能为空",
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
			month_code: null,
			one_amount: null,
			one_tax_rate: null,
			one_handling_fee: null,
			two_amount: null,
			two_tax_rate: null,
			two_handling_fee: null
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