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
			<el-table-column label="月份" align="center" prop="month_code" />
			<el-table-column label="利润调整" align="center" prop="profit_adjustment_amount" />
			<el-table-column label="" align="center" prop="items">
				<template #default="scope">
					<div v-for="(item, index) in scope.row.items" :key="item.id" class="mt10">
						<el-tag>{{ item.order_type.name + ": " + item.price }}</el-tag>
					</div>
				</template>
			</el-table-column>
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
				<el-form-item label="月份" prop="month_code">
					<el-date-picker v-model="form.month_code" placeholder="请输入月份" value-format="YYYY-MM"
						type="month"></el-date-picker>
				</el-form-item>
				<el-form-item label="利润调整" prop="profit_adjustment_amount">
					<el-input v-model="form.profit_adjustment_amount" placeholder="请输入">
						<template #append>/票</template>
					</el-input>
				</el-form-item>

				<el-form-item v-for="(item, index) in orderTypesList" :key="item.id" :label="item.name"
					prop="orderTypesItems">
					<el-input v-model="orderTypesList[index].value" placeholder="请输入">
						<template #append>/票</template>
					</el-input>
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
	} from "@/api/system/system-parameter/operation-fees";
	import {
		listData as listOrderTypes
	} from "@/api/system/system-parameter/order-types";


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

	const orderTypesList = ref([])

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
			profit_adjustment_amount: [{
				required: true,
				message: "利润调整不能为空",
				trigger: "blur"
			}],
			orderTypesItems: [{
				required: true,
				message: "价格不能为空",
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

	/** 属性列表 */
	async function getListOrderTypes() {
		orderTypesList.value = []
		let res = await listOrderTypes()
		// console.log(res.data);
		orderTypesList.value = res.data
	}
	getListOrderTypes()

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
			profit_adjustment_amount: null,
			remark: null
		};
		proxy.resetForm("formRef");
		for (let i = 0; i < orderTypesList.value.length; i++) {
			orderTypesList.value[i].value = null
		};
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
	async function handleAdd() {
		reset();
		// await getListOrderTypes()
		open.value = true;
		title.value = "新增";
	}

	/** 修改按钮操作 */
	async function handleUpdate(row) {
		reset();
		const _id = row.id || ids.value
		// await getListOrderTypes()
		getData(_id).then(response => {
			form.value = response;
			orderTypesList.value.forEach(item => {
				item.value = form.value.items.find(i => i.order_type_id == item.id).price
			})
			open.value = true;
			title.value = "修改";
		});
	}

	/** 提交按钮 */
	function submitForm() {
		proxy.$refs["formRef"].validate(valid => {
			if (valid) {
				let items = orderTypesList.value.map(item => {
					return {
						order_type_id: item.id,
						price: item.value
					}
				})
				form.value.items = JSON.stringify(items)

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

	function getItemValue(row, id) {
		return row.items.find(item => item.order_type.id == id).price
	}

	getList();
</script>