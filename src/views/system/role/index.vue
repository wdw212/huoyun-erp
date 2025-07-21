<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryRef" v-show="showSearch" :inline="true" label-width="68px">
			<el-form-item label="角色名称" prop="name">
				<el-input v-model="queryParams.name" placeholder="请输入角色名称" clearable style="width: 240px"
					@keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
				<el-button icon="Refresh" @click="resetQuery">重置</el-button>
			</el-form-item>
		</el-form>
		<el-row :gutter="10" class="mb8" justify="end">
			<el-col :span="1.5">
				<el-button type="primary" plain icon="Plus" @click="handleAdd"
					v-hasPermi="['system:role:add']">新增</el-button>
			</el-col>

			<el-col :span="1.5">
				<el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
					v-hasPermi="['system:role:remove']">批量删除</el-button>
			</el-col>
			<right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
		</el-row>

		<!-- 表格数据 -->
		<el-table v-loading="loading" :data="roleList" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55" align="center" />
			<el-table-column label="角色名称" align="center" prop="name" :show-overflow-tooltip="true" />
			<el-table-column label="角色标识" align="center" prop="code" />
			<el-table-column label="创建时间" align="center" prop="created_at" />
			<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
				<template #default="scope">
					<el-button plain type="primary" icon="Edit" @click="handleUpdate(scope.row)"
						v-hasPermi="['system:role:edit']">修改</el-button>
					<el-button plain type="primary" icon="CircleCheck" @click="handleDataScope(scope.row)"
						v-if="scope.row.id !== 1" v-hasPermi="['system:role:edit']">分配权限</el-button>
					<el-button plain type="danger" icon="Delete" @click="handleDelete(scope.row)"
						v-hasPermi="['system:role:remove']">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total > 0" :total="total" v-model:page="queryParams.page"
			v-model:limit="queryParams.pageSize" @pagination="getList" />

		<!-- 添加或修改角色配置对话框 -->
		<el-dialog :title="title" v-model="open" width="500px" append-to-body>
			<el-form ref="roleRef" :model="form" :rules="rules" label-width="100px">
				<div v-if="!isMenu">
					<el-form-item label="角色名称" prop="name">
						<el-input v-model="form.name" placeholder="请输入角色名称" />
					</el-form-item>

					<el-form-item label="角色标识" prop="code">
						<el-input v-model="form.code" placeholder="请输入角色标识" />
					</el-form-item>

					<el-form-item label="角色描述" prop="description">
						<el-input v-model="form.description" placeholder="请输入角色描述" type="textarea" rows="3" />
					</el-form-item>
				</div>

				<el-form-item label="数据权限" prop="permission_ids" v-if="isMenu">
					<el-tree class="tree-border" v-model="form.permission_ids" :data="deptOptions" show-checkbox
						default-expand-all ref="deptRef" node-key="id" empty-text="加载中，请稍候"
						:props="{ label: 'name', children: 'children' }"></el-tree>
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

<script setup name="Role">
	import {
		addRole,
		changeRoleStatus,
		dataScope,
		delRole,
		getRole,
		listRole,
		updateRole,
		deptTreeSelect,
		authRole
	} from "@/api/system/role";
	import {
		listMenu as getMenuList
	} from "@/api/system/menu";

	const router = useRouter();
	const {
		proxy
	} = getCurrentInstance();

	const roleList = ref([]);
	const open = ref(false);
	const loading = ref(true);
	const showSearch = ref(true);
	const ids = ref([]);
	const single = ref(true);
	const multiple = ref(true);
	const total = ref(0);
	const title = ref("");
	const dateRange = ref([]);
	const menuOptions = ref([]);
	const menuExpand = ref(false);
	const menuNodeAll = ref(false);
	const deptExpand = ref(true);
	const deptNodeAll = ref(false);
	const deptOptions = ref([]);
	const menuRef = ref(null);
	const deptRef = ref(null);

	const isMenu = ref(false)


	const data = reactive({
		form: {},
		queryParams: {
			page: 1,
			pageSize: 15,
			name: undefined
		},
		rules: {
			name: [{
				required: true,
				message: "角色名称不能为空",
				trigger: "blur"
			}],
			code: [{
				required: true,
				message: "角色标识不能为空",
				trigger: "blur"
			}]
		},
	});

	const {
		queryParams,
		form,
		rules
	} = toRefs(data);

	/** 查询角色列表 */
	function getList() {
		loading.value = true;
		listRole(proxy.addDateRange(queryParams.value, dateRange.value)).then(response => {
			// console.log(response.data);
			roleList.value = response.data;
			total.value = response.meta.total;
			loading.value = false;
		});
	}

	/** 搜索按钮操作 */
	function handleQuery() {
		queryParams.value.page = 1;
		getList();
	}

	/** 重置按钮操作 */
	function resetQuery() {
		dateRange.value = [];
		proxy.resetForm("queryRef");
		handleQuery();
	}

	/** 重置新增的表单  */
	function reset() {
		form.value = {
			id: undefined,
			name: undefined,
			code: undefined,
			description: undefined,
			permission_ids: []
		};
		proxy.resetForm("roleRef");
	}

	/** 删除按钮操作 */
	function handleDelete(row) {
		const roleIds = row.id || ids.value;
		// console.log(roleIds);
		proxy.$modal.confirm('是否确认删除角色编号为"' + roleIds + '"的数据项?').then(function() {
			return delRole(roleIds);
		}).then(() => {
			getList();
			proxy.$modal.msgSuccess("删除成功");
		}).catch(() => {});
	}

	/** 导出按钮操作 */
	function handleExport() {
		proxy.download("system/role/export", {
			...queryParams.value,
		}, `role_${new Date().getTime()}.xlsx`);
	}

	/** 多选框选中数据 */
	function handleSelectionChange(selection) {
		ids.value = selection.map(item => item.id);
		single.value = selection.length != 1;
		multiple.value = !selection.length;
	}

	/** 角色状态修改 */
	function handleStatusChange(row) {
		let text = row.status === "0" ? "启用" : "停用";
		proxy.$modal.confirm('确认要"' + text + '""' + row.roleName + '"角色吗?').then(function() {
			return changeRoleStatus(row.id, row.status);
		}).then(() => {
			proxy.$modal.msgSuccess(text + "成功");
		}).catch(function() {
			row.status = row.status === "0" ? "1" : "0";
		});
	}

	/** 添加角色 */
	function handleAdd() {
		reset();
		isMenu.value = false;
		open.value = true;
		title.value = "添加角色";
	}

	/** 修改角色 */
	function handleUpdate(row) {
		reset();
		isMenu.value = false;
		const roleId = row.id || ids.value;
		// const roleMenu = getRoleMenuTreeselect(roleId);
		getRole(roleId).then(response => {
			// console.log(response);
			form.value = response;
			open.value = true;
		});
		title.value = "修改角色";
	}

	/** 提交按钮 */
	function submitForm() {
		console.log('isMenu', isMenu.value, form.value);
		if (!isMenu.value) {
			proxy.$refs["roleRef"].validate(valid => {
				if (valid) {
					if (form.value.id != undefined) {
						updateRole(form.value).then(response => {
							proxy.$modal.msgSuccess("修改成功");
							open.value = false;
							getList();
						});
					} else {
						addRole(form.value).then(response => {
							proxy.$modal.msgSuccess("新增成功");
							open.value = false;
							getList();
						});
					}
				}
			});
		} else {
			let checkedKeys = deptRef.value.getCheckedKeys();
			console.log(checkedKeys);
			authRole({
				id: form.value.id,
				permission_ids: JSON.stringify(checkedKeys)
			}).then(response => {
				proxy.$modal.msgSuccess("分配权限成功");
				open.value = false;
				getList();
			});
		}
	}

	/** 取消按钮 */
	function cancel() {
		open.value = false;
		reset();
	}

	/** 分配数据权限操作 */
	async function handleDataScope(row) {
		console.log(row);
		reset();
		const res1 = await getRole(row.id)
		form.value = res1;

		// const deptTreeSelect = getDeptTree(row.roleId);
		getMenuList().then(response => {
			// console.log(response);
			deptOptions.value = response.data;
			deptRef.value.setCheckedKeys(res1.permissions);
			// openDataScope.value = true;
			// nextTick(() => {
			// 	deptTreeSelect.then(res => {
			// 		nextTick(() => {
			// 			if (deptRef.value) {
			// 			}
			// 		});
			// 	});
			// });
		});
		isMenu.value = true;
		open.value = true;
		title.value = "分配数据权限";
	}

	getList();
</script>