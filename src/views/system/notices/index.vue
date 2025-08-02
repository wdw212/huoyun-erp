<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
			<el-form-item label="发布人" prop="name">
				<el-input v-model="queryParams.name" placeholder="请输入发布人" clearable @keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="标题" prop="title">
				<el-input v-model="queryParams.title" placeholder="请输入标题" clearable @keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
				<el-button icon="Refresh" @click="resetQuery">重置</el-button>
			</el-form-item>
		</el-form>

		<el-row :gutter="10" class="mb8" justify="end">
			<el-col :span="1.5">
				<el-button type="primary" plain icon="Plus" @click="handleAdd"
					v-hasPermi="['system:notices:add']">新增</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
					v-hasPermi="['system:notices:remove']">批量删除</el-button>
			</el-col>

			<right-toolbar @queryTable="getList"></right-toolbar>
		</el-row>

		<el-table v-loading="loading" :data="noticesList" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55" align="center" />
			<!-- <el-table-column label="编号" align="center" prop="id" /> -->
			<el-table-column label="发布人" align="center" prop="adminUser.name" />
			<el-table-column label="标题" align="center" prop="title" />
			<el-table-column label="排序" align="center" prop="title" />
			<el-table-column label="公告类型" align="center" prop="title" />
			<!-- <el-table-column label="内容" align="center" prop="content" /> -->
			<el-table-column label="创建时间" align="center" prop="created_at" />
			<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
				<template #default="scope">
					<el-button type="primary" plain @click="handleUpdate(scope.row)"
						v-hasPermi="['system:notices:edit']">修改</el-button>
					<el-button type="danger" plain @click="handleDelete(scope.row)"
						v-hasPermi="['system:notices:remove']">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" v-model:page="queryParams.page" v-model:limit="queryParams.pageSize"
			@pagination="getList" />

		<!-- 添加或修改公告对话框 -->
		<el-dialog :title="title" v-model="open" width="800px">
			<el-form ref="noticesRef" :model="form" :rules="rules" label-width="100px">
				<el-form-item label="标题" prop="title">
					<el-input v-model="form.title" placeholder="请输入标题" />
				</el-form-item>
				<el-form-item label="排序" prop="title">
					<el-input v-model="form.title" placeholder="请输入排序" type="Number"/>
				</el-form-item>
				<el-form-item label="公告类型" prop="company_type_id">
					<el-select v-model="queryParams.notices_type_id" placeholder="请选择公告类型" clearable>
						<el-option v-for="item in notices_type" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item label="内容">
					<editor v-model="form.content" :min-height="300" />
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

<script setup name="Notices">
	import {
		listNotices,
		getNotices,
		delNotices,
		addNotices,
		updateNotices
	} from "@/api/system/notices";

	const {
		proxy
	} = getCurrentInstance();

	const noticesList = ref([]);
	const open = ref(false);
	const loading = ref(true);
	const showSearch = ref(true);
	const ids = ref([]);
	const single = ref(true);
	const multiple = ref(true);
	const total = ref(0);
	const title = ref("");
	const notices_type = ref([
		{
			value: 1,
			label: '公司公告'
		},
		{
			value: 2,
			label: '操作公告'
		},
		{
			value: 3,
			label: '业务公告'
		},
		{
			value: 4,
			label: '单证公告'
		},
		{
			value: 5,
			label: '财务公告'
		},
		{
			code: 6,
			value: '商务公告'
		}
	]);  //公告类型

	const data = reactive({
		form: {},
		queryParams: {
			page: 1,
			pageSize: 15,
			name: null,
			title: null,
		},
		rules: {}
	});

	const {
		queryParams,
		form,
		rules
	} = toRefs(data);

	/** 查询公告列表 */
	function getList() {
		loading.value = true;
		listNotices(queryParams.value).then(response => {
			noticesList.value = response.data;
			console.log(noticesList.value);
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
			title: null,
			content: null
		};
		proxy.resetForm("noticesRef");
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
		title.value = "添加公告";
	}

	/** 修改按钮操作 */
	function handleUpdate(row) {
		reset();
		const _id = row.id || ids.value
		getNotices(_id).then(response => {
			form.value = response;
			open.value = true;
			title.value = "修改公告";
		});
	}

	/** 提交按钮 */
	function submitForm() {
		proxy.$refs["noticesRef"].validate(valid => {
			if (valid) {
				if (form.value.id != null) {
					updateNotices(form.value).then(response => {
						proxy.$modal.msgSuccess("修改成功");
						open.value = false;
						getList();
					});
				} else {
					addNotices({
						title: form.value.title,
						content: form.value.content
					}).then(response => {
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
		proxy.$modal.confirm('是否确认删除公告编号为"' + _ids + '"的数据项？').then(function() {
			return delNotices(_ids);
		}).then(() => {
			getList();
			proxy.$modal.msgSuccess("删除成功");
		}).catch(() => {});
	}

	/** 导出按钮操作 */
	function handleExport() {
		proxy.download('system/notices/export', {
			...queryParams.value
		}, `notices_${new Date().getTime()}.xlsx`)
	}

	getList();
</script>