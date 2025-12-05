<template>
	<div class="app-container">
		<!-- <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
			<el-form-item label="名称" prop="neme">
				<el-input v-model="queryParams.title" placeholder="请输入标题" clearable @keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
				<el-button icon="Refresh" @click="resetQuery">重置</el-button>
			</el-form-item>
		</el-form> -->

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
			<el-table-column label="发票类型" align="center" >
				<template v-slot="{row}">
					<el-button v-if="row.type === 0 ||  row.type === 1" :type="row.type== 1?'danger':'success'">{{NAME_LIST.filter(item =>item.value == row.type)[0].label}}</el-button>
				</template>
			</el-table-column>
			<el-table-column label="税点" align="center" prop="tax_rate" >
				<template v-slot="{row}">
					{{row.tax_rate?row.tax_rate * 100 + '%': ''}}
				</template>
			</el-table-column>
			<el-table-column label="备注" align="center" prop="remark" />
			<el-table-column label="排序" align="center" prop="sort" />
			<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
				<template #default="scope">
					<el-button plain type="primary" icon="Edit" @click="handleUpdate(scope.row)">修改</el-button>
					<el-button plain type="danger" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- <pagination v-show="total>0" :total="total" v-model:page="queryParams.page" v-model:limit="queryParams.pageSize"
			@pagination="getList" /> -->

		<!-- 添加或修改对话框 -->
		<el-dialog :title="title" v-model="open" width="500px">
			<el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
				<el-form-item label="名称" prop="name">
					<!-- <el-select v-model="form.name" placeholder="请选择发票类型" @click="getTypeContentLabel(form.type)" :disabled="disabled?true:false">
						<el-option v-for="item in NAME_LIST" :key="item.value" :label="item.label"
							:value="item.value" />
					</el-select> -->
					<el-input v-model="form.name" placeholder="请输入" />
				</el-form-item>
				<el-form-item label="发票类型" prop="type">
					<el-select v-model="form.type" placeholder="请选择发票类型">
						<el-option v-for="item in NAME_LIST" :key="item.value" :label="item.label"
							:value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item label="税点(%)">
					<el-input v-model="form.tax_rate" placeholder="请输入" />
				</el-form-item>

				<el-form-item label="备注" prop="remark">
					<el-input v-model="form.remark" placeholder="请输入" type="textarea" rows="4" />
				</el-form-item>

				<el-form-item label="排序" prop="sort">
					<el-input v-model="form.sort" placeholder="请输入" type="number" />
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
	} from "@/api/system/pull-down-options/invoice-type";

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
			title: null
		},
		rules: {
			name: [{
				required: true,
				message: "名称不能为空",
				trigger: "blur"
			}],
			type: [{
				required: true,
				message: "发票类型不能为空",
				trigger: "change"
			}]
		}
	});

	const {
		queryParams,
		form,
		rules
	} = toRefs(data);
	
	// 发票类型
	const NAME_LIST = ref([{
			label: '普通发票',
			value: 0
		},
		{
			label: '专用发票',
			value: 1
		}
	])
	/** 查询列表 */
	function getList() {
		loading.value = true;
		listData(queryParams.value).then(response => {
			dataList.value = response.data;
			// total.value = response.meta.total;
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
			type: null,
			tax_rate: null,
			remark: null,
			sort: 0
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
			form.value.tax_rate= form.value.tax_rate?form.value.tax_rate * 100: ''
			open.value = true;
			title.value = "修改";
		});
	}

	/** 提交按钮 */
	function submitForm() {
		proxy.$refs["formRef"].validate(valid => {
			if (valid) {
				let params= JSON.parse(JSON.stringify(form.value))
				params.tax_rate= form.value.tax_rate?form.value.tax_rate/100: ''
				if (form.value.id != null) {
					updateData(params).then(response => {
						proxy.$modal.msgSuccess("修改成功");
						open.value = false;
						getList();
					});
				} else {
					addData(params).then(response => {
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