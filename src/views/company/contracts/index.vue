<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
			<el-form-item label="关键字" prop="keyword" style="width: 300px">
				<el-input v-model="queryParams.keyword" placeholder="搜索合作单位,合同号,电话,备注内容" clearable
					@keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="合作抬头" prop="company_header_id" style="width: 300px">
				<el-select v-model="queryParams.company_header_id" filterable placeholder="请选择合作单位"
					:loading="loadingHeaders">
					<el-option v-for="item in COMPANY_HEADER" :key="item.id" :label="item.company_name"
						:value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item label="合同类型" prop="type" style="width: 300px">
				<el-select v-model="queryParams.type" placeholder="请选择合作类型" clearable>
					<el-option v-for="item in TYPE" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>
			<!-- <el-form-item label="是否有效" prop="keyword" style="width: 300px">
				<el-input v-model="queryParams.keyword" placeholder="是否有效" clearable
					@keyup.enter="handleQuery" />
			</el-form-item> -->
			<el-form-item label="销货单位" prop="seller_id" style="width: 300px">
				<el-select v-model="queryParams.seller_id" placeholder="请选择销货单位" clearable>
					<el-option v-for="item in SELLER" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item label="有效期" prop="time_at" style="width: 300px">
				<el-date-picker v-model="queryParams.time_at" value-format="YYYY-MM-DD" type="daterange"
					range-separator="-" start-placeholder="开始时间" end-placeholder="到期时间" />
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
			<el-table-column label="合同编号" align="center" prop="no" />
			<el-table-column label="合作单位" align="center" prop="company_header.company_name" />
			<el-table-column label="销货单位" align="center" prop="seller.name" />
			<el-table-column label="类型" align="center" prop="type">
				<template #default="scope">
					{{ TYPE.find(item => item.value == scope.row.type)?.label }}
				</template>
			</el-table-column>
			<el-table-column label="电话" align="center" prop="phone" />
			<el-table-column label="开始时间" align="center" prop="start_at" />
			<el-table-column label="到期时间" align="center" prop="expire_at" />
			<el-table-column label="有效期" align="center" prop="yxq">
				<template #default="scope">
					<el-tag :type="comparisonTime(scope.row.expire_at) ? 'danger' : 'success'">
						{{ comparisonTime(scope.row.expire_at) ? '无效' : '有效' }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="备注" align="center" prop="remark" />
			<el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200">
				<template #default="scope">
					<el-button plain type="primary" icon="Edit" @click="handleUpdate(scope.row)">修改</el-button>
					<el-button plain type="danger" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" v-model:page="queryParams.page" v-model:limit="queryParams.pageSize"
			@pagination="getList" />

		<!-- 添加或修改对话框 -->
		<el-dialog :title="title" v-model="open" width="500px">
			<el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
				<el-form-item label="合同编号" prop="no">
					<el-input v-model="form.no" placeholder="请输入合同编号" />
				</el-form-item>
				<el-form-item label="合作单位" prop="company_header_id">
					<!-- <el-input v-model="form.company_header_id" placeholder="请输入合作单位" /> -->
					<el-select v-model="form.company_header_id" filterable placeholder="请选择合作单位"
						:remote-method="getListHeadersData" :loading="loadingHeaders">
						<el-option v-for="item in COMPANY_HEADER" :key="item.id" :label="item.company_name"
							:value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item label="类型" prop="type">
					<!-- <el-input v-model="form.type" placeholder="请输入类型" /> -->
					<el-select v-model="form.type" placeholder="请选择合作类型" clearable>
						<el-option v-for="item in TYPE" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item label="电话" prop="phone">
					<el-input v-model="form.phone" placeholder="请输入电话" />
				</el-form-item>
				<el-form-item label="开始时间" prop="start_at">
					<!-- <el-input v-model="form.start_at" placeholder="请输入开始时间" /> -->
					<el-date-picker v-model="form.start_at" placeholder="请输入开始时间" value-format="YYYY-MM-DD"
						type="date"></el-date-picker>
				</el-form-item>
				<el-form-item label="到期时间" prop="expire_at">
					<!-- <el-input v-model="form.expire_at" placeholder="请输入到期时间" /> -->
					<el-date-picker v-model="form.expire_at" placeholder="请输入到期时间" value-format="YYYY-MM-DD"
						type="date"></el-date-picker>
				</el-form-item>
				<el-form-item label="销货单位" prop="seller_id">
					<!-- <el-input v-model="form.seller_id" placeholder="请输入销货单位" /> -->
					<el-select v-model="form.seller_id" placeholder="请选择销货单位" clearable>
						<el-option v-for="item in SELLER" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="form.remark" placeholder="请输入备注" :rows="3" type="textarea" />
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

<script setup name="CompanyContracts">
	import {
		listData
	} from "@/api/company/send-and-receive";
	import {
		listData as listHeadersData
	} from "@/api/company/headers";
	import {
		listData as listSellersData
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
			pageSize: 15,
			keyword: null,
			company_header_id: null,
			type: null,
			seller_id: null,
			start_at: null,
			expire_at: null,
			time_at: []
		},
		rules: {
			no: [{
				required: true,
				message: "合同编号不能为空",
				trigger: "blur"
			}],
			start_at: [{
				required: true,
				message: "开始时间不能为空",
				trigger: "blur"
			}],
			expire_at: [{
				required: true,
				message: "到期时间不能为空",
				trigger: "blur"
			}]
		}
	});
	const COMPANY_HEADER = ref([]);
	const loadingHeaders = ref(false);
	const SELLER = ref([]);
	//  1一代月结 2同行买单 3直客合同 4公司员工
	const TYPE = ref([{
			label: "一代月结",
			value: 1
		},
		{
			label: "同行买单",
			value: 2
		},
		{
			label: "直客合同",
			value: 3
		},
		{
			label: "公司员工",
			value: 4
		}
	])

	const {
		queryParams,
		form,
		rules
	} = toRefs(data);

	async function getListHeadersData(keyword) {
		loadingHeaders.value = true
		const res = await listHeadersData({
			keyword: keyword
		})
		COMPANY_HEADER.value = res.data
		loadingHeaders.value = false
	}
	getListHeadersData('')

	async function getListSellersData() {
		const res = await listSellersData()
		SELLER.value = res.data
		// console.log(res, "getListSellersData");
	}
	getListSellersData()

	/** 查询列表 */
	function getList() {
		loading.value = true;

		if (queryParams.value.time_at.length > 0) {
			queryParams.value.start_at = queryParams.value.time_at[0]
			queryParams.value.expire_at = queryParams.value.time_at[1]
		}
		// console.log(queryParams.value.time_at);

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
			no: null,
			company_header_id: null,
			type: null,
			phone: null,
			start_at: null,
			expire_at: null,
			seller_id: null,
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

	const comparisonTime = (expire_at) => {
		const today = new Date();
		const year = today.getFullYear();
		const month = today.getMonth() + 1; // 注意：月份从 0 开始，所以需要加 1
		const day = today.getDate();
		// const todayStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
		const arr1 = expire_at?.split(" ");
		const arr2 = arr1? arr1[0].split("-"): [];

		if (year > parseInt(arr2[0])) {
			return true;
		} else if (year == parseInt(arr2[0])) {
			if (month > parseInt(arr2[1])) {
				return true;
			} else if (month == parseInt(arr2[1])) {
				if (day > parseInt(arr2[2])) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	getList();
</script>