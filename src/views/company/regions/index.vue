<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
			<el-form-item label="名称" prop="name">
				<el-input v-model="queryParams.name" placeholder="请输入名称" clearable @keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
				<el-button icon="Refresh" @click="resetQuery">重置</el-button>
			</el-form-item>
		</el-form>

		<el-row :gutter="10" class="mb8" justify="end">
			<view-indicate :view-indicate-role-list="viewIndicateRoleList" :model-type="'region'"></view-indicate>
			<el-col :span="1.5" v-if="editALLBtnType.includes(userStore.userRoleCode)">
				<el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
			</el-col>
			<!-- <el-col :span="1.5">
				<el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete">批量删除</el-button>
			</el-col> -->
			<right-toolbar @queryTable="getList"></right-toolbar>
		</el-row>

		<el-table v-loading="loading" row-key="id" :data="dataList" :default-expand-all="true"
			:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
			@selection-change="handleSelectionChange">
			<!-- <el-table-column type="selection" width="55" align="center" /> -->
			<el-table-column label="名称" align="center" prop="name" />
			<el-table-column label="宁波20GP" align="center" prop="nb_20_gp" />
			<el-table-column label="宁波40HQ" align="center" prop="nb_40_hq" />
			<el-table-column label="上海20GP" align="center" prop="sh_20_gp" />
			<el-table-column label="上海40HQ" align="center" prop="sh_40_hq" />
			<el-table-column label="备注" align="center" prop="remark" />
			<el-table-column label="操作" align="center" class-name="small-padding fixed-width"  v-if="editALLBtnType.includes(userStore.userRoleCode)">
				<template #default="scope">
					<el-button plain type="primary" icon="Edit" @click="handleUpdate(scope.row)">修改</el-button>
					<el-button plain type="danger" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" v-model:page="queryParams.page" v-model:limit="queryParams.pageSize"
			@pagination="getList" />

		<!-- 添加或修改对话框 -->
		<el-dialog :title="title" v-model="open" width="60%" append-to-body>
			<el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
				<el-row :gutter="10">
					<el-col :span="12">
						<el-form-item label="上级" prop="parent_id">
							<el-tree-select v-model="form.parent_id" :data="parentList"
								:props="{ value: 'id', label: 'name', children: 'children' }" value-key="id" placeholder="选择"
								check-strictly />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="名称" prop="name">
							<el-input v-model="form.name" placeholder="请输入" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="宁波20GP">
							<el-input v-model="form.nb_20_gp" placeholder="请输入" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="宁波40HQ">
							<el-input v-model="form.nb_40_hq" placeholder="请输入" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="上海20GP">
							<el-input v-model="form.sh_20_gp" placeholder="请输入" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="上海40HQ">
							<el-input v-model="form.sh_40_hq" placeholder="请输入" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="备注" prop="remark">
							<el-input v-model="form.remark" placeholder="请输入备注" :rows="7" type="textarea" :disabled="disabled?true:false"/>
						</el-form-item>
					</el-col>
				</el-row>
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
	} from "@/api/company/regions";

	const {
		proxy
	} = getCurrentInstance();
	import useUserStore from "@/store/modules/user";
	const userStore = useUserStore();  //vuex缓存的用户信息
	const dataList = ref([]);
	const open = ref(false);
	const loading = ref(true);
	const ids = ref([]);
	const single = ref(true);
	const multiple = ref(true);
	const total = ref(0);
	const title = ref("");
	const editALLBtnType = ref(['FINANCE','SCHEDULE','SUPER_ADMIN'])  //新增权限  SUPER_ADMIN 超管  OPERATE  操作  DOCUMENT  单证  COMMERCE 商务  BUSINESS  业务  FINANCE  财务  SCHEDULE  调度
    import ViewIndicate from '@/components/ViewIndicate/index'
	const viewIndicateRoleList = ref(['SUPER_ADMIN','FINANCE','SCHEDULE']);  //页面标明组件可更改权限
	const data = reactive({
		form: {},
		queryParams: {
			page: 1,
			pageSize: 15,
			name: null
		},
		rules: {
			parent_id: [{
				required: true,
				message: "父级不能为空",
				trigger: "blur"
			}],
			name: [{
				required: true,
				message: "名称不能为空",
				trigger: "blur"
			}]
		}
	});

	const {
		queryParams,
		form,
		rules
	} = toRefs(data);

	const parentList = ref([])

	/** 查询列表 */
	function getList() {
		loading.value = true;
		listData(queryParams.value).then(response => {
			dataList.value = response.data;
			console.log(response);
			// parentList只嵌套dataList的两层数组
			parentList.value = dataList.value.map(item => {
				return {
					id: item.id,
					name: item.name,
					children: item.children.map(child => {
						return {
							id: child.id,
							name: child.name
						}
					})
				}
			})

			parentList.value.unshift({
				id: 0,
				name: '顶级'
			})
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
			parent_id: null
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