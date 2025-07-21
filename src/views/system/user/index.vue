<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
			<el-form-item label="用户名称" prop="username">
				<el-input v-model="queryParams.username" placeholder="请输入用户名称" clearable style="width: 240px"
					@keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="用户昵称" prop="name">
				<el-input v-model="queryParams.name" placeholder="请输入用户昵称" clearable style="width: 240px"
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
					v-hasPermi="['system:user:add']">新增</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
					v-hasPermi="['system:user:remove']">批量删除</el-button>
			</el-col>

			<right-toolbar @queryTable="getList"></right-toolbar>
			<!-- <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar> -->
		</el-row>

		<el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="50" align="center" />
			<el-table-column label="用户名称" align="center" key="username" prop="username" />
			<el-table-column label="用户昵称" align="center" key="name" prop="name" />
			<el-table-column label="角色" align="center" prop="roles[0].name" />
			<el-table-column label="创建时间" align="center" prop="created_at">
				<template #default="scope">
					<span>{{ parseTime(scope.row.created_at) }}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
				<template #default="scope">
					<el-button plain type="primary" icon="Edit" @click="handleUpdate(scope.row)"
						v-hasPermi="['system:user:edit']">修改</el-button>

					<el-button plain type="danger" icon="Delete" @click="handleDelete(scope.row)"
						v-hasPermi="['system:user:remove']">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<pagination v-show="total > 0" :total="total" v-model:page="queryParams.page"
			v-model:limit="queryParams.pageSize" @pagination="getList" />


		<!-- 添加或修改用户配置对话框 -->
		<el-dialog :title="title" v-model="open" width="1000px" append-to-body>
			<el-form :model="form" :rules="btnType==='add'?rules:[]" ref="userRef" label-width="100px">
				<el-row>
					<el-form-item label="用户昵称" prop="name" style="width: 300px">
						<el-input v-model="form.name" placeholder="请输入" maxlength="30" />
					</el-form-item>

					<el-form-item v-if="form.id == undefined" label="用户名称" prop="username" style="width: 300px">
						<el-input v-model="form.username" placeholder="请输入" maxlength="30" />
					</el-form-item>

					<el-form-item label="用户密码" prop="password" style="width: 300px">
						<el-input v-model="form.password" 
						:placeholder="btnType==='add'?'请输入':'不修改请留空'" 
						type="password" maxlength="20" show-password />
					</el-form-item>

					<el-form-item label="角色" prop="role_id" style="width: 300px">
						<el-select v-model="form.role_id" placeholder="请选择" clearable>
							<el-option v-for="item in ROLE_TYPE" :key="item.id" :label="item.name" :value="item.id" />
						</el-select>
					</el-form-item>

					<el-form-item label="部门" prop="department_id" style="width: 300px">
						<el-tree-select v-model="form.department_id" :data="DEPT_TYPE"
							:props="{ value: 'id', label: 'name', children: 'children' }" value-key="id"
							placeholder="选择" check-strictly />
					</el-form-item>

					<el-form-item label="手机号" prop="phone" style="width: 300px">
						<el-input v-model="form.phone" placeholder="请输入" />
					</el-form-item>

					<el-form-item label="座机" prop="landline" style="width: 300px">
						<el-input v-model="form.landline" placeholder="请输入" />
					</el-form-item>

					<el-form-item label="入职时间" prop="hire_date" style="width: 300px">
						<el-date-picker v-model="form.hire_date" placeholder="请选择" 
						format="YYYY-MM-DD" value-format="YYYY-MM-DD" type="date"></el-date-picker>
					</el-form-item>

					<el-form-item label="离职时间" prop="leave_date" style="width: 300px">
						<el-date-picker v-model="form.leave_date" placeholder="请选择" format="YYYY-MM-DD"
						value-format="YYYY-MM-DD" type="date"></el-date-picker>
					</el-form-item>
					<el-form-item label="提成比例" prop="base_rate" style="width: 300px"  v-if="btnType==='add'">
						<el-input v-model="form.base_rate" type="number" placeholder="≤1万时的提成比例(%)" />
					</el-form-item>

					<el-form-item label="提成比例" prop="higher_rate" style="width: 300px" v-if="btnType==='add'">
						<el-input v-model="form.higher_rate" type="number" placeholder="＞1万时的提成比例(%)" />
					</el-form-item>

					<el-form-item label="提成票数" prop="tickets" style="width: 300px" v-if="btnType==='add'">
						<el-input v-model="form.tickets" type="number" placeholder="请输入" />
					</el-form-item>

					<el-form-item label="提成单价" prop="unit_price" style="width: 300px" v-if="btnType==='add'">
						<el-input v-model="form.unit_price" type="number" placeholder="请输入" />
					</el-form-item>

					<el-form-item label="底薪工资" prop="basic_salary" style="width: 300px" v-if="btnType==='add'">
						<el-input v-model="form.basic_salary" type="number" placeholder="请输入" />
					</el-form-item>

					<el-form-item label="状态" prop="status" style="width: 300px">
						<el-radio-group v-model="form.status">
							<el-radio :label="0">禁用</el-radio>
							<el-radio :label="1">启用</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-row>
				<el-form-item label="入职单位" prop="seller_ids" style="width: 300px">
					<el-select v-model="form.seller_ids" placeholder="请选择" clearable multiple>
						<el-option v-for="item in SELLERS_LIST" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item label="备注" prop="remark" style="width: 300px">
					<el-input v-model="form.remark" type="textarea" rows="3" placeholder="请输入" />
				</el-form-item>

				<div v-if="title != '添加用户'">
					<el-button type="primary" @click="handleAdd2">新增</el-button>

					<el-table :data="salariesList" style="margin-bottom: 20px;">
						<el-table-column label="月份" align="center" prop="month_code"></el-table-column>
						<el-table-column label="基本工资" align="center" prop="basic_salary"></el-table-column>
						<el-table-column label="≤1万时的提成比例(%)" align="center" prop="base_rate"></el-table-column>
						<el-table-column label="＞1万时的提成比例(%)" align="center" prop="higher_rate"></el-table-column>
						<el-table-column label="提成票数" align="center" prop="tickets"></el-table-column>
						<el-table-column label="提成单价" align="center" prop="unit_price"></el-table-column>
						<el-table-column label="备注" align="center" prop="remark"></el-table-column>

						<el-table-column label="操作" align="center" style="width: 80px;">
							<template #default="scope">
								<el-button plain type="primary" icon="Edit" @click="handleUpdate2(scope.row)"
									v-hasPermi="['system:user:edit']">修改</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>

			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button type="primary" @click="submitForm">保 存</el-button>
					<el-button @click="cancel">取 消</el-button>
				</div>
			</template>
		</el-dialog>

		<!-- 添加或修改用户配置对话框 -->
		<el-dialog :title="title2" v-model="open2" width="700px" append-to-body>
			<el-form :model="form2" :rules="rules2" ref="userRef2" label-width="100px">
				<el-row>
					<el-form-item label="月份" prop="month_code" style="width: 300px">
						<el-date-picker v-model="form2.month_code" placeholder="请选择" format="YYYY-MM"
							type="date"></el-date-picker>
					</el-form-item>

					<el-form-item label="基本工资" prop="basic_salary" style="width: 300px">
						<el-input v-model="form2.basic_salary" type="number" placeholder="请输入" />
					</el-form-item>

					<el-form-item label="提成比例" prop="base_rate" style="width: 300px">
						<el-input v-model="form2.base_rate" type="number" placeholder="≤1万时的提成比例(%)" />
					</el-form-item>

					<el-form-item label="提成比例" prop="higher_rate" style="width: 300px">
						<el-input v-model="form2.higher_rate" type="number" placeholder="＞1万时的提成比例(%)" />
					</el-form-item>

					<el-form-item label="提成票数" prop="tickets" style="width: 300px">
						<el-input v-model="form2.tickets" type="number" placeholder="请输入" />
					</el-form-item>

					<el-form-item label="提成单价" prop="unit_price" style="width: 300px">
						<el-input v-model="form2.unit_price" type="number" placeholder="请输入" />
					</el-form-item>
				</el-row>
				<el-form-item label="备注" prop="remark" style="width: 300px">
					<el-input v-model="form2.remark" type="textarea" rows="3" placeholder="请输入" />
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button type="primary" @click="submitForm2">保 存</el-button>
					<el-button @click="cancel2">取 消</el-button>
				</div>
			</template>
		</el-dialog>

	</div>
</template>

<script setup name="User">
	import {
		getToken
	} from "@/utils/auth";
	import useAppStore from '@/store/modules/app'
	import {
		listUser,
		delUser,
		getUser,
		updateUser,
		addUser
	} from "@/api/system/user";
	import {
		listData as adminUserSalariesListData,
		getData as adminUserSalariesGetData,
		delByIds as adminUserSalariesDelByidsData,
		addData as adminUserSalariesAddData,
		updateData as adminUserSalariesUpdateData
	} from "@/api/system/admin-user-salaries";

	import {
		listRole,
	} from "@/api/system/role";
	import {
		listData as deptListData
	} from "@/api/system/dept";
	import {
		listData as listSellersData
	} from "@/api/system/system-parameter/sellers";
	
	import {
		Splitpanes,
		Pane
	} from "splitpanes"
	import "splitpanes/dist/splitpanes.css"

	const router = useRouter();
	const appStore = useAppStore()
	const {
		proxy
	} = getCurrentInstance();

	const userList = ref([]);
	const open = ref(false);
	const open2 = ref(false);
	const loading = ref(true);
	const loading2 = ref(true);
	const showSearch = ref(true);
	const ids = ref([]);
	const single = ref(true);
	const multiple = ref(true);
	const total = ref(0);
	const title = ref("");
	const title2 = ref("");
	const dateRange = ref([]);
	const deptName = ref("");
	const deptOptions = ref(undefined);
	const enabledDeptOptions = ref(undefined);
	const initPassword = ref(undefined);
	const postOptions = ref([]);
	const roleOptions = ref([]);
	const btnType = ref('');
	/*** 用户导入参数 */
	const upload = reactive({
		// 是否显示弹出层（用户导入）
		open: false,
		// 弹出层标题（用户导入）
		title: "",
		// 是否禁用上传
		isUploading: false,
		// 是否更新已经存在的用户数据
		updateSupport: 0,
		// 设置上传的请求头部
		headers: {
			Authorization: "Bearer " + getToken()
		},
		// 上传的地址
		url: import.meta.env.VITE_APP_BASE_API + "/system/user/importData"
	});

	const data = reactive({
		form: {},
		form2: {},
		queryParams: {
			page: 1,
			pageSize: 15,
			username: undefined,
			name: undefined,
		},
		rules: {
			username: [{
				required: true,
				message: "用户名称不能为空",
				trigger: "blur"
			}, {
				min: 2,
				max: 20,
				message: "用户名称长度必须介于 2 和 20 之间",
				trigger: "blur"
			}],
			name: [{
				required: true,
				message: "用户昵称不能为空",
				trigger: "blur"
			}],
			password: [{
				required: true,
				message: "用户密码不能为空",
				trigger: "blur"
			}, {
				min: 5,
				max: 20,
				message: "用户密码长度必须介于 5 和 20 之间",
				trigger: "blur"
			}, {
				pattern: /^[^<>"'|\\]+$/,
				message: "不能包含非法字符：< > \" ' \\\ |",
				trigger: "blur"
			}],
			role_id: [{
				required: true,
				message: "角色不能为空",
				trigger: "change"
			}],
			hire_date: [{
				required: true,
				message: "入职时间不能为空",
				trigger: "change"
			}],
			seller_ids: [{
				required: true,
				message: "入职单位不能为空",
				trigger: "change"
			}]
		},
		rules2: []
	});

	const salariesList = ref([])

	const {
		queryParams,
		form,
		form2,
		rules,
		rules2
	} = toRefs(data);

	const ROLE_TYPE = ref([])
	const DEPT_TYPE = ref([])

	function getSelectionList() {
		listRole({
			is_paginate: 0
		}).then(res => {
			// console.log(res);
			ROLE_TYPE.value = res.data
		})

		deptListData().then(res => {
			DEPT_TYPE.value = res.data
			DEPT_TYPE.value.unshift({
				id: 0,
				name: "无"
			})
		})
	}
	getSelectionList()
	
	const SELLERS_LIST = ref([])
	// 入职单位下拉框
	function getListSellersData() {
		listSellersData({
			is_paginate: 0
		}).then(response => {
			SELLERS_LIST.value = response.data
		})
	}
	getListSellersData()

	/** 查询用户列表 */
	function getList() {
		loading.value = true;
		listUser(proxy.addDateRange(queryParams.value, dateRange.value)).then(res => {
			// console.log(res, "用户列表数据");
			loading.value = false;
			userList.value = res.data;
			total.value = res.meta.total;
		});
	};

	function getList2(admin_user_id) {
		salariesList.value = []
		loading2.value = true;
		adminUserSalariesListData({
			admin_user_id: admin_user_id
		}).then(res => {
			// console.log(res, "用户列表数据");
			loading2.value = false;
			salariesList.value = res.data;
		});
	};

	/** 搜索按钮操作 */
	function handleQuery() {
		queryParams.value.page = 1;
		getList();
	};

	/** 重置按钮操作 */
	function resetQuery() {
		dateRange.value = [];
		proxy.resetForm("queryRef");
		queryParams.value.deptId = undefined;
		proxy.$refs.deptTreeRef.setCurrentKey(null);
		handleQuery();
	};

	/** 删除按钮操作 */
	function handleDelete(row) {
		const userIds = row.id || ids.value;
		proxy.$modal.confirm('是否确认删除用户编号为"' + userIds + '"的数据项？').then(function() {
			return delUser(userIds);
		}).then(() => {
			getList();
			proxy.$modal.msgSuccess("删除成功");
		}).catch(() => {});
	};

	/** 用户状态修改  */
	function handleStatusChange(row) {
		console.log(row);
		let text = row.status === "0" ? "启用" : "停用";
		proxy.$modal.confirm('确认要"' + text + '""' + row.userName + '"用户吗?').then(function() {
			return changeUserStatus(row.id, row.status);
		}).then(() => {
			proxy.$modal.msgSuccess(text + "成功");
		}).catch(function() {
			row.status = row.status === "0" ? "1" : "0";
		});
	};

	/** 更多操作 */
	function handleCommand(command, row) {
		switch (command) {
			case "handleResetPwd":
				handleResetPwd(row);
				break;
			case "handleAuthRole":
				handleAuthRole(row);
				break;
			default:
				break;
		}
	};

	/** 跳转角色分配 */
	function handleAuthRole(row) {
		const userId = row.id;
		router.push("/system/user-auth/role/" + userId);
	};

	/** 重置密码按钮操作 */
	function handleResetPwd(row) {
		proxy.$prompt('请输入"' + row.userName + '"的新密码', "提示", {
			confirmButtonText: "确定",
			cancelButtonText: "取消",
			closeOnClickModal: false,
			inputPattern: /^.{5,20}$/,
			inputErrorMessage: "用户密码长度必须介于 5 和 20 之间",
			inputValidator: (value) => {
				if (/<|>|"|'|\||\\/.test(value)) {
					return "不能包含非法字符：< > \" ' \\\ |"
				}
			},
		}).then(({
			value
		}) => {
			resetUserPwd(row.id, value).then(response => {
				proxy.$modal.msgSuccess("修改成功，新密码是：" + value);
			});
		}).catch(() => {});
	};

	/** 选择条数  */
	function handleSelectionChange(selection) {
		ids.value = selection.map(item => item.id);
		single.value = selection.length != 1;
		multiple.value = !selection.length;
	};

	/** 重置操作表单 */
	function reset() {
		form.value = {
			id: undefined,
			username: undefined,
			name: undefined,
			password: undefined,
			role_id: undefined,
			department_id: undefined,
			phone: undefined,
			landline: undefined,
			hire_date: undefined,
			leave_date: undefined,
			base_rate: undefined,
			higher_rate: undefined,
			tickets: undefined,
			unit_price: undefined,
			basic_salary: undefined,
			status: 1,
			remark: undefined,
			seller_ids:null
		};
		proxy.resetForm("userRef");
	};

	function reset2() {
		form2.value = {
			id: undefined,
			admin_user_id: undefined,
			month_code: undefined,
			basic_salary: undefined,
			base_rate: undefined,
			higher_rate: undefined,
			tickets: undefined,
			unit_price: undefined,
			remark: undefined
		};
		proxy.resetForm("userRef2");
	};

	/** 取消按钮 */
	function cancel() {
		open.value = false;
		reset();
	};

	function cancel2() {
		open2.value = false;
		reset2();
	};

	/** 新增按钮操作 */
	function handleAdd() {
		reset();
		open.value = true;
		title.value = "添加用户";
		btnType.value="add"
		form.value.password = initPassword.value;
	};

	function handleAdd2() {
		reset2();
		open2.value = true;
		title2.value = "添加";
	};

	/** 修改按钮操作 */
	function handleUpdate(row) {
		btnType.value="edit"
		reset();
		const userId = row.id || ids.value;
		getUser(userId).then(response => {
			// console.log(response, "数据");
			form.value = response;
			// postOptions.value = response.posts;
			// roleOptions.value = response.roles;
			// form.value.postIds = response.postIds;
			form.value.role_id = response.roles;
			open.value = true;
			title.value = "修改用户";
			form.password = "";
		});
		getList2(row.id);
	};

	function handleUpdate2(row) {
		reset2();
		adminUserSalariesGetData(row.id).then(response => {
			form2.value = response;
			open2.value = true;
			title2.value = "修改";
		});
	};

	/** 提交按钮 */
	function submitForm() {
		proxy.$refs["userRef"].validate(valid => {
			if (valid) {
				let params = JSON.parse(JSON.stringify(form.value));
				params.seller_ids = JSON.stringify(params.seller_ids);
				if (form.value.id != undefined) {
					updateUser(params).then(response => {
						proxy.$modal.msgSuccess("修改成功");
						open.value = false;
						getList();
					});
				} else {
					addUser(params).then(response => {
						proxy.$modal.msgSuccess("新增成功");
						open.value = false;
						getList();
					});
				}
			}
		});
	};

	function submitForm2() {
		proxy.$refs["userRef2"].validate(valid => {
			if (valid) {
				form2.value.admin_user_id = form.value.id;
				if (form2.value.id != undefined) {
					adminUserSalariesUpdateData(form2.value).then(response => {
						proxy.$modal.msgSuccess("修改成功");
						open2.value = false;
						getList2(form.value.id);
					});
				} else {
					adminUserSalariesAddData(form2.value).then(response => {
						proxy.$modal.msgSuccess("新增成功");
						open2.value = false;
						getList2(form.value.id);
					});
				}
			}
		});
	};

	// getDeptTree();
	getList();
</script>