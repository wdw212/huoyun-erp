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
			<el-table-column label="名称" align="center" prop="name" min-width="180" />
			<el-table-column label="发票类型" align="center" min-width="120">
				<template #default="{ row }">
					<el-tag v-if="row.type === 0" type="success">普通发票</el-tag>
					<el-tag v-else-if="row.type === 1" type="danger">专用发票</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="税点" align="center" prop="tax_rate" min-width="100">
				<template #default="{ row }">
					{{ renderRate(row.tax_rate) }}
				</template>
			</el-table-column>
			<el-table-column label="特定业务类型" align="center" prop="specific_business_type" min-width="180" />
			<el-table-column label="展示销售方信息" align="center" prop="display_sales_info_items" min-width="220" />
			<el-table-column label="优惠政策类型" align="center" prop="preferential_policy_type" min-width="180" />
			<el-table-column label="备注" align="center" prop="remark" min-width="180" />
			<el-table-column label="排序" align="center" prop="sort" width="90" />
			<el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="170">
				<template #default="scope">
					<el-button plain type="primary" icon="Edit" @click="handleUpdate(scope.row)">修改</el-button>
					<el-button plain type="danger" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-dialog :title="title" v-model="open" width="900px">
			<el-form ref="formRef" :model="form" :rules="rules" label-width="150px" class="invoice-type-form">
				<el-form-item label="名称" prop="name">
					<el-input v-model="form.name" placeholder="请输入" />
				</el-form-item>
				<el-form-item label="发票类型" prop="type">
					<el-select v-model="form.type" placeholder="请选择发票类型">
						<el-option v-for="item in NAME_LIST" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item label="税点(%)">
					<el-input v-model="form.tax_rate" placeholder="请输入" />
				</el-form-item>
				<el-row :gutter="16">
					<el-col :span="12">
						<el-form-item label="是否含税">
							<el-radio-group v-model="form.is_tax_included">
								<el-radio :label="true">是</el-radio>
								<el-radio :label="false">否</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="特定业务类型">
							<el-input v-model="form.specific_business_type" placeholder="请输入" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label="是否展示销售方地址电话银行账号" class="invoice-type-form__full">
					<el-input v-model="form.display_sales_info_items" placeholder="请输入" />
				</el-form-item>
				<el-row :gutter="16">
					<el-col :span="12">
						<el-form-item label="商品和服务税收编码">
							<el-input v-model="form.goods_tax_classification_code" placeholder="请输入" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="16">
					<el-col :span="12">
						<el-form-item label="优惠政策类型">
							<el-input v-model="form.preferential_policy_type" placeholder="请输入" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="16">
					<el-col :span="12">
						<el-form-item label="收款人">
							<el-input v-model="form.payee" placeholder="请输入" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="复核人">
							<el-input v-model="form.reviewer" placeholder="请输入" />
						</el-form-item>
					</el-col>
				</el-row>
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

const { proxy } = getCurrentInstance();

const NAME_LIST = [
	{ label: '普通发票', value: 0 },
	{ label: '专用发票', value: 1 }
]

const dataList = ref([]);
const open = ref(false);
const loading = ref(true);
const ids = ref([]);
const multiple = ref(true);
const title = ref("");

const data = reactive({
	form: {},
	queryParams: {
		page: 1,
		pageSize: 15,
		title: null
	},
	rules: {
		name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
		type: [{ required: true, message: "发票类型不能为空", trigger: "change" }]
	}
});

const { queryParams, form, rules } = toRefs(data);

const normalizeYesNoText = (value) => {
	if (value === true || value === 1 || value === '1') {
		return '是'
	}
	if (value === false || value === 0 || value === '0') {
		return '否'
	}
	const text = `${value ?? ''}`.trim()
	return text
}

const normalizeYesNoValue = (value) => {
	const normalized = `${value ?? ''}`.trim().toLowerCase()
	if (['是', 'true', '1', 'y', 'yes'].includes(normalized)) {
		return true
	}
	if (['否', 'false', '0', 'n', 'no', ''].includes(normalized)) {
		return false
	}
	return false
}

const normalizeForm = (row = {}) => {
	return {
		id: row.id ?? null,
		name: row.name ?? '',
		type: row.type ?? null,
		tax_rate: row.tax_rate !== null && row.tax_rate !== undefined && row.tax_rate !== '' ? Number(row.tax_rate) * 100 : '',
		is_tax_included: row.is_tax_included ?? true,
		specific_business_type: row.specific_business_type ?? '',
		display_sales_info_items: row.display_sales_info_items ?? '',
		goods_tax_classification_code: row.goods_tax_classification_code ?? '',
			use_preferential_policy: false,
		preferential_policy_type: row.preferential_policy_type ?? '',
		payee: row.payee ?? '',
		reviewer: row.reviewer ?? '',
		remark: row.remark ?? '',
		sort: row.sort ?? 0,
	}
}

const buildSubmitPayload = () => {
	const payload = {
		...form.value,
		tax_rate: form.value.tax_rate !== '' && form.value.tax_rate !== null && form.value.tax_rate !== undefined
			? Number(form.value.tax_rate) / 100
			: '',
		display_sales_info_items: `${form.value.display_sales_info_items ?? ''}`.trim(),
		use_preferential_policy: false,
		preferential_policy_type: `${form.value.preferential_policy_type ?? ''}`.trim(),
	}

	return payload
}

function renderRate(rate) {
	if (rate === null || rate === undefined || rate === '') {
		return ''
	}
	return `${Number(rate) * 100}%`
}

function renderYesNo(value) {
	return value ? '是' : '否'
}

function getList() {
	loading.value = true;
	listData(queryParams.value).then(response => {
		dataList.value = response.data;
		loading.value = false;
	});
}

function cancel() {
	open.value = false;
	reset();
}

function reset() {
	form.value = normalizeForm();
	proxy.resetForm("formRef");
}

function handleSelectionChange(selection) {
	ids.value = selection.map(item => item.id);
	multiple.value = !selection.length;
}

function handleAdd() {
	reset();
	open.value = true;
	title.value = "新增";
}

function handleUpdate(row) {
	reset();
	const _id = row.id || ids.value;
	getData(_id).then(response => {
		form.value = normalizeForm(response);
		open.value = true;
		title.value = "修改";
	});
}

function submitForm() {
	proxy.$refs["formRef"].validate(valid => {
		if (!valid) {
			return;
		}

		const params = buildSubmitPayload()
		const request = form.value.id != null ? updateData(params) : addData(params)
		request.then(() => {
			proxy.$modal.msgSuccess(form.value.id != null ? "修改成功" : "新增成功");
			open.value = false;
			getList();
		});
	});
}

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

<style scoped>
.invoice-type-form :deep(.el-select),
.invoice-type-form :deep(.el-input),
.invoice-type-form :deep(.el-textarea) {
	width: 100%;
}

.invoice-type-form__full :deep(.el-form-item__content) {
	display: block;
}

.invoice-type-form :deep(.el-checkbox-group),
.invoice-type-form :deep(.el-radio-group) {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}

.tag-list {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
}

.mr4 {
	margin-right: 4px;
}

.mb4 {
	margin-bottom: 4px;
}
</style>
