<template>
	<div class="app-container">
		<div class="query-form-style">
			<el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
				<el-row :gutter="10">
					<el-col :span="4">
						<el-form-item label="业务员">
							<el-select v-model="queryParams.business_user_id" placeholder="请选择业务员" clearable>
								<el-option v-for="item in BUSINESS_USER" :key="item.id" :label="item.name"
									:value="item.id" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="4">
						<el-form-item label="操作员">
							<el-select v-model="queryParams.operation_user_id" placeholder="请选择操作员" clearable>
								<el-option v-for="item in OPERATION_USER" :key="item.id" :label="item.name"
									:value="item.id" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="4">
						<el-form-item label="单证员">
							<el-select v-model="queryParams.document_user_id" placeholder="请选择单证员" clearable>
								<el-option v-for="item in DOCUMENT_USER" :key="item.id" :label="item.name"
									:value="item.id" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="关键字">
							<el-input v-model="queryParams.keyword" placeholder="地址，联系人，联系地址，方便备注，备注" clearable
								@keyup.enter="handleQuery" />
						</el-form-item>
					</el-col>
					<el-col :span="4">
						<el-form-item>
							<el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
							<el-button icon="Refresh" @click="resetQuery">重置</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<el-row :gutter="10" class="mb8" justify="end">
			<view-indicate :view-indicate-role-list="viewIndicateRoleList"
				:model-type="'loading_address'"></view-indicate>
			<el-col :span="1.5" v-if="addBtnType.includes(userStore.userRoleCode)">
				<el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
			</el-col>
			<right-toolbar @queryTable="getList"></right-toolbar>
		</el-row>

		<el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
			<el-table-column label="省份" align="center" prop="region.name">
				<template #default="{ row }">
					<el-tag effect="dark" type="danger" size="small" >装</el-tag>
					<span style="padding-left: 5px;">{{row?.region?.name}}</span>
				</template>
			</el-table-column>
			<el-table-column label="地址" align="center" prop="address" />
			<el-table-column label="联系人" align="center" prop="contact_name" />
			<el-table-column label="联系方式" align="center" prop="phone" />
			<el-table-column label="业务员" align="center" prop="created_at" />
			<el-table-column label="创建人" align="center" prop="admin_user.name" />
			<el-table-column label="备注" align="center" prop="remark">
				<template #default="{ row }">
					<el-tooltip placement="top">
						<!-- 使用带样式的插槽内容 -->
						<template #content>
							<div class="tooltip-content">{{ row.remark }}</div>
						</template>
						<span class="ellipsis-text">{{ row.remark }}</span>
					</el-tooltip>
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
		<el-dialog :title="title" v-model="open" width="500px">
			<el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
				<el-form-item label="省份" prop="region_id">
					<!-- <el-input v-model="form.region_id" placeholder="请输入" /> -->
					<!-- <el-tree-select v-model="form.region_id" :data="REGION_OPTIONS"
						:props="{ value: 'id', label: 'name', children: 'children' }" value-key="id" placeholder="选择"
						:check-strictly="false"  @node-click='nodeClick'/> -->
					<el-tree-select filterable :data="REGION_OPTIONS"
						:props="{ value: 'id', label: 'pathLabel', children: 'children' }" @change="handleDeptData"
						node-key="id" class="w100" clearable placeholder="请选择/输入分组" check-strictly
						:render-after-expand="true" v-model="form.region_id">
						<template #default="{ data: { name } }">
							<span>{{ name }}</span>
						</template>
					</el-tree-select>
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
				<el-form-item label="运费">
					<el-input v-model="form.freight" placeholder="请输入" />
				</el-form-item>
				<el-form-item label="方便查询">
					<el-input v-model="form.keyword" placeholder="请输入" />
				</el-form-item>
				<el-form-item label="业务员" prop="business_user_ids">
					<UserSelect :value="form.business_user_ids" @update:value="form.business_user_ids= $event"
						:user-type="'BUSINESS'" :btn-type="btnType" :role-type-user-id-list="roleTypeUserIdList"></UserSelect>
					<!-- <el-input v-model="form.business_user_id" placeholder="请输入" /> -->
					<!-- <el-select v-model="form.business_user_ids" placeholder="请选择" clearable filterable>
						<el-option v-for="item in BUSINESS_USER" :key="item.id" :label="item.name" :value="item.id" />
					</el-select> -->
				</el-form-item>

				<el-form-item label="操作员" prop="operation_user_ids">
					<UserSelect :value="form.operation_user_ids" @update:value="form.operation_user_ids= $event"
						:user-type="'OPERATE'" :btn-type="btnType" :role-type-user-id-list="roleTypeUserIdList"></UserSelect>
					<!-- <el-input v-model="form.operation_user_id" placeholder="请输入" /> -->
					<!-- <el-select v-model="form.operation_user_ids" placeholder="请选择" clearable filterable>
						<el-option v-for="item in OPERATION_USER" :key="item.id" :label="item.name" :value="item.id" />
					</el-select> -->
				</el-form-item>

				<el-form-item label="单证员" prop="document_user_ids">
					<UserSelect :value="form.document_user_ids" @update:value="form.document_user_ids= $event"
						:user-type="'DOCUMENT'" :btn-type="btnType" :role-type-user-id-list="roleTypeUserIdList"></UserSelect>
					<!-- <el-input v-model="form.document_user_id" placeholder="请输入" /> -->
					<!-- <el-select v-model="form.document_user_ids" placeholder="请选择" clearable filterable>
						<el-option v-for="item in DOCUMENT_USER" :key="item.id" :label="item.name" :value="item.id" />
					</el-select> -->
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

<script setup name="CompanyLoadingAddress">
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
	import ViewIndicate from '@/components/ViewIndicate/index'
	import UserSelect from '@/components/UserSelect' //共享人组件
	const viewIndicateRoleList = ref(['SUPER_ADMIN']); //页面标明组件可更改权限
	const roleTypeList = ref(['FINANCE', 'SUPER_ADMIN']) //当前页面有所有人权限的角色
	const roleTypeUserIdList = ref([]) //当前共享人不能编辑的数组
	const addBtnType = ref(['OPERATE', 'DOCUMENT', 'BUSINESS', 'FINANCE', 'SCHEDULE',
		'SUPER_ADMIN']) //新增权限  SUPER_ADMIN 超管  OPERATE  操作  DOCUMENT  单证  COMMERCE 商务  BUSINESS  业务  FINANCE  财务  SCHEDULE  调度
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
	const btnType = ref("");
	import useUserStore from "@/store/modules/user";
	const userStore = useUserStore(); //vuex缓存的用户信息

	const data = reactive({
		form: {},
		queryParams: {
			page: 1,
			pageSize: 15,
			keyword: null,
			business_user_id: null,
			operation_user_id: null,
			document_user_id: null,
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
			// business_user_ids: [{
			// 	required: true,
			// 	message: "业务员不能为空",
			// 	trigger: "blur"
			// }],
			// operation_user_ids: [{
			// 	required: true,
			// 	message: "操作员不能为空",
			// 	trigger: "blur"
			// }],
			// document_user_ids: [{
			// 	required: true,
			// 	message: "单证员不能为空",
			// 	trigger: "blur"
			// }]
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
			business_user_ids: null,
			operation_user_ids: null,
			document_user_ids: null,
			remark: null
		};
		roleTypeUserIdList.value= []
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

	/** 新增按钮操作 */
	function handleAdd() {
		reset();
		open.value = true;
		title.value = "新增";
		btnType.value = 'add'
	}

	/** 修改按钮操作 */
	function handleUpdate(row) {
		reset();
		const _id = row.id || ids.value
		getData(_id).then(response => {
			form.value = response;
			handleDeptData(form.value.region_id)
			open.value = true;
			title.value = "修改";
			btnType.value = 'edit'
			if (!roleTypeList.value.includes(userStore.userRoleCode) && userStore.id !== row.admin_user.id) {
				roleTypeUserIdList.value.push(row.admin_user.id)
			} else {
				roleTypeUserIdList.value = []
			}
			console.log(roleTypeUserIdList.value,'roleTypeUserIdList.value')
		});
	}
	// 必填
	function checkInfo() {
		if ((!form.value.business_user_ids || form.value.business_user_ids.length === 0) && (!form.value
				.operation_user_ids || form.value.operation_user_ids.length === 0) && (!form.value.document_user_ids ||
				form.value.document_user_ids.length === 0)) {
			proxy.$modal.msgWarning("请选择至少一个共享人");
			return false;
		}
		return true;
	}
	/** 提交按钮 */
	function submitForm() {
		if (!checkInfo()) return;
		proxy.$refs["formRef"].validate(valid => {
			if (valid) {
				let params = JSON.parse(JSON.stringify(form.value));
				params.business_user_ids = JSON.stringify(params.business_user_ids);
				params.operation_user_ids = JSON.stringify(params.operation_user_ids);
				params.document_user_ids = JSON.stringify(params.document_user_ids);
				console.log(params, '560')
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

	const name = ref('')
	// 省市区展示
	const handleDeptData = (regionId) => {
		console.log(regionId,'regionId')
		findPath(REGION_OPTIONS.value, regionId);
	}
	// 根据分组id获取分组名
	function findPath(tree, targetId) {
		let path = [];
		let currentNode;
		// 查找节点
		function findNode(nodes, currentPath) {
			for (let node of nodes) {
				const newPath = [...currentPath, node.name];

				if (node.id === targetId) {
					currentNode = node;
					path = newPath;
					return true;
				}

				if (node.children && findNode(node.children, newPath)) {
					return true;
				}
			}
			return false;
		}
		findNode(tree, []);
		// 选中节点赋值 pathLabel
		if (currentNode) currentNode.pathLabel = path.length ? path.join('/') : null;
		return path.length ? path.join('/') : null;
	}
</script>
<style scoped lang="scss">
	.query-form-style {
		.el-form-item {
			width: 100%
		}
	}
</style>