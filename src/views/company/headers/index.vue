<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
			<el-form-item label="关键字" prop="keyword" style="width: 240px">
				<el-input v-model="queryParams.keyword" placeholder="公司抬头, 税号, 备注" clearable
					@keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item label="公司类型" prop="company_type_id" style="width: 240px">
				<el-select v-model="queryParams.company_type_id" placeholder="请选择公司类型" clearable>
					<el-option v-for="item in company_type" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="业务员" prop="admin_user_id" style="width: 240px">
				<el-select v-model="queryParams.admin_user_id" placeholder="请选择业务员" clearable>
					<el-option v-for="item in admin_user" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="操作员" style="width: 300px" prop="operation_user_id">
				<el-select v-model="queryParams.operation_user_id" placeholder="请选择操作员" clearable>
					<el-option v-for="item in OPERATION_USER" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item label="单证员" style="width: 300px" prop="document_user_id">
				<el-select v-model="queryParams.document_user_id" placeholder="请选择单证员" clearable>
					<el-option v-for="item in DOCUMENT_USER" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
				<el-button icon="Refresh" @click="resetQuery">重置</el-button>
			</el-form-item>
		</el-form>

		<el-row :gutter="10" class="mb8" justify="end">
			<view-indicate :view-indicate-role-list="viewIndicateRoleList" :model-type="'company_header'"></view-indicate>
			<el-col :span="1.5" v-if="addBtnType.includes(userStore.userRoleCode)">
				<el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
			</el-col>
			<right-toolbar @queryTable="getList" :columns="columns"></right-toolbar>
		</el-row>

		<el-table v-loading="loading" :data="dataList">
			<!-- <el-table-column label="编号" align="center" prop="id" v-if="columns[0].visible" /> -->
			<el-table-column label="类型" align="center" prop="company_type.name" v-if="columns[0].visible" >
				<template #default="scope">
					<!-- {{scope.row.company_type_name}} -->
					<div v-for=" (item, index) in scope.row.company_type_name" key= "index">{{item.label}}</div>
				</template>
			</el-table-column>
			<el-table-column label="业务员" align="center" prop="admin_user.name" v-if="columns[1].visible" />
			<el-table-column label="公司名称" align="center" prop="company_name" v-if="columns[2].visible" />
			<el-table-column label="税号" align="center" prop="tax_number" v-if="columns[3].visible" />
			<el-table-column label="区分" align="center" prop="distinction" v-if="columns[4].visible" />
			<el-table-column label="联系人" align="center" prop="contact_person" v-if="columns[5].visible" />
			<el-table-column label="联系电话" align="center" prop="contact_phone" v-if="columns[6].visible" />
			<el-table-column label="开户行" align="center" prop="bank_name" v-if="columns[7].visible" />
			<el-table-column label="账户" align="center" prop="bank_account" v-if="columns[8].visible" />
			<el-table-column label="创建人" align="center" prop="admin_user.name" v-if="columns[9].visible" />
			<el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
				<template #default="scope">
					<el-button plain type="primary" icon="Edit" @click="handleUpdate(scope.row)">修改</el-button>
					<el-button v-if="deleteBtnType.includes(userStore.userRoleCode) || userStore.id=== scope.row.admin_user.id" plain type="danger" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" v-model:page="queryParams.page" v-model:limit="queryParams.pageSize"
			@pagination="getList" />

		<!-- 添加或修改对话框 -->
		<el-dialog :title="title" v-model="open" width="800px">
			<el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
				<el-row :gutter="10">
					<el-col :span="12">
						<el-form-item label="公司名称" prop="company_name">
							<el-input v-model="form.company_name" placeholder="请输入公司名称" />
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="税号" prop="tax_number">
							<el-input v-model="form.tax_number" placeholder="请输入税号" @input="handleInputTaxNumber" />
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="公司地址" prop="billing_address">
							<el-input v-model="form.billing_address" placeholder="请输入公司地址" />
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="座机" prop="company_phone">
							<el-input v-model="form.company_phone" placeholder="座机" />
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="开户行" prop="bank_name">
							<el-input v-model="form.bank_name" placeholder="请输入开户行" />
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="开户账户" prop="bank_account">
							<el-input v-model="form.bank_account" placeholder="请输入开户账户" />
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="交付手机号" prop="delivery_phone">
							<el-input v-model="form.delivery_phone" placeholder="请输入交付手机号" />
						</el-form-item>
					</el-col>


					<el-col :span="12">
						<el-form-item label="交付邮箱" prop="delivery_email">
							<el-input v-model="form.delivery_email" placeholder="请输入交付邮箱" />
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="联系人" prop="contact_person">
							<el-input v-model="form.contact_person" placeholder="请输入联系人" />
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="联系电话" prop="contact_phone">
							<el-input v-model="form.contact_phone" placeholder="请输入联系电话" />
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="QQ" prop="qq">
							<el-input v-model="form.qq" placeholder="请输入QQ" />
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="区分" prop="distinction">
							<el-input v-model="form.distinction" placeholder="请输入区分" />
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="寄件地址" prop="delivery_address">
							<el-input v-model="form.delivery_address" placeholder="请输入寄件地址" :rows="3" type="textarea" />
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="备注" prop="remark">
							<el-input v-model="form.remark" placeholder="请输入备注" :rows="3" type="textarea" />
						</el-form-item>
					</el-col>

					<el-col :span="12" v-if="userStore.userRoleCode !== 'BUSINESS'">
						<el-form-item label="业务员" prop="business_user_ids">
							<UserSelect :value="form.business_user_ids" @update:value="form.business_user_ids= $event" :user-type="'BUSINESS'" :btn-type="btnType" :role-type-user-id-list="roleTypeUserIdList"></UserSelect>
							<!-- <el-input v-model="form.admin_user_id" placeholder="请输入业务员" /> -->
							<!-- <el-select v-model="form.admin_user_id" placeholder="请选择业务员" clearable>
								<el-option v-for="item in admin_user" :key="item.value" :label="item.label"
									:value="item.value" />
							</el-select> -->
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="公司类型" prop="company_type">
							<!-- <el-input v-model="form.company_type_id" placeholder="请输入公司名称" /> -->
							<el-select v-model="form.company_type" placeholder="请选择公司类型" multiple>
								<el-option v-for="item in company_type" :key="item.value" :label="item.label"
									:value="item.value" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="操作员" prop="operation_user_ids">
							<UserSelect :value="form.operation_user_ids" @update:value="form.operation_user_ids= $event" :user-type="'OPERATE'" :btn-type="btnType" :role-type-user-id-list="roleTypeUserIdList"></UserSelect>
							<!-- <el-select v-model="form.operation_user_ids" placeholder="请选择操作员" filterable clearable multiple>
								<el-option v-for="item in OPERATION_USER" :key="item.id" :label="item.name" :value="item.id" :disabled="item.select"/>
							</el-select> -->
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="单证员" prop="document_user_ids">
							<UserSelect :value="form.document_user_ids" @update:value="form.document_user_ids= $event" :user-type="'DOCUMENT'" :btn-type="btnType" :role-type-user-id-list="roleTypeUserIdList"></UserSelect>
							<!-- <el-select v-model="form.document_user_ids" placeholder="请选择操作员" filterable clearable multiple>
								<el-option v-for="item in DOCUMENT_USER" :key="item.id" :label="item.name" :value="item.id" />
							</el-select> -->
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

<script setup name="CompanyHeaders">
	import {
		listData,
		getData,
		delByIds,
		addData,
		updateData
	} from "@/api/company/headers";

	import {
		getSelectOptions
	} from "@/api/other";
	
	import {
				listUser as userListData
			} from "@/api/system/user";
	import ViewIndicate from '@/components/ViewIndicate/index'
	import UserSelect from '@/components/UserSelect'
	import useUserStore from "@/store/modules/user";
	const userStore = useUserStore();  //vuex缓存的用户信息
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
	const btnType = ref("");  //新增/修改/查看  add/edit/view
	const addBtnType = ref(['OPERATE','DOCUMENT','BUSINESS','FINANCE','SUPER_ADMIN'])  //新增权限  SUPER_ADMIN 超管  OPERATE  操作  DOCUMENT  单证  COMMERCE 商务  BUSINESS  业务  FINANCE  财务  SCHEDULE  调度
	const deleteBtnType = ref(['SUPER_ADMIN'])  //可删除的角色
	const viewIndicateRoleList = ref(['SUPER_ADMIN']);  //页面标明组件可更改权限
	const roleTypeList= ref(['FINANCE','SCHEDULE','SUPER_ADMIN'])  //当前页面有所有人权限的角色
	const roleTypeUserIdList= ref([])  //当前共享人不能编辑的数组
	
	// 列显隐信息
	const columns = ref([{
			key: 0,
			label: `类型`,
			visible: true
		},
		{
			key: 1,
			label: `业务员`,
			visible: true
		},
		{
			key: 2,
			label: `公司名称`,
			visible: true
		},
		{
			key: 3,
			label: `税号`,
			visible: true
		},
		{
			key: 4,
			label: `区分`,
			visible: true
		},
		{
			key: 5,
			label: `联系人`,
			visible: true
		},
		{
			key: 6,
			label: `联系电话`,
			visible: true
		},
		{
			key: 7,
			label: `开户行`,
			visible: true
		},
		{
			key: 8,
			label: `账户`,
			visible: true
		},
		{
			key: 9,
			label: `创建人`,
			visible: true
		}
	]);

	const admin_user = ref([]);
	const company_type = ref([{
			label: '委托抬头',
			value: 0
		},
		{
			label: '应付抬头',
			value: 1
		},
		{
			label: '应收抬头',
			value: 2
		}
	]);
	// 操作员
	const OPERATION_USER = ref([])
	// 单证员
	const DOCUMENT_USER = ref([])

	function getSelect() {
		// ADMIN_USER ：业务员 COMPANY_TYPE: 公司类型 DEPARTMENT：部门
		// getSelectOptions("ADMIN_USER").then(response => {
		// 	// console.log();
		// 	let data = response.data;
		// 	data.forEach(item => {
		// 		admin_user.value.push({
		// 			label: item.name,
		// 			value: parseInt(item.id)
		// 		})
		// 	})
		// });

		// getSelectOptions("COMPANY_TYPE").then(response => {
		// 	let data = response.data;
		// 	data.forEach(item => {
		// 		company_type.value.push({
		// 			label: item.name,
		// 			value: item.id
		// 		})
		// 	})
		// });
		userListData({
			is_paginate: 0,
			code: 'BUSINESS'
		}).then(response => {
			admin_user.value = response.data
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
	}
	getSelect()

	// getDicts("sys_user_type").then(response => {
	// 	admin_user.value = response.data;
	// });

	const data = reactive({
		form: {},
		queryParams: {
			page: 1,
			pageSize: 15,
			keyword: null,
			company_type_id: null,
			admin_user_id: null,
			operation_user_id: null,
			document_user_id: null,
		},
		rules: {}
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
			response.data.forEach(item =>{
				item.company_type_name= company_type.value.filter(v => item.company_type.includes(v.value))
			})
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
			company_name: null,
			company_type: null,
			tax_number: null,
			billing_address: null,
			company_phone: null,
			bank_name: null,
			bank_account: null,
			delivery_phone: null,
			delivery_email: null,
			contact_person: null,
			contact_phone: null,
			qq: null,
			distinction: null,
			delivery_address: null,
			remark: null,
			business_user_ids: null,
			operation_user_ids: null,
			document_user_ids: null
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

	/** 新增按钮操作 */
	function handleAdd() {
		reset();
		open.value = true;
		title.value = "新增";
		btnType.value= 'add'
		form.value.company_type= [0]
		if(userStore.userRoleCode === 'BUSINESS'){
			form.value.business_user_ids= []
			form.value.business_user_ids.push(userStore.id)
		}
	}

	/** 修改按钮操作 */
	function handleUpdate(row) {
		reset();
		const _id = row.id || ids.value
		getData(_id).then(response => {
			console.log(response,'response')
			form.value = response;
			open.value = true;
			title.value = "修改";
			btnType.value= 'edit'
			if(!roleTypeList.value.includes(userStore.userRoleCode) && userStore.id !== row.admin_user.id){
				roleTypeUserIdList.value.push(row.admin_user.id)
			}else{
				roleTypeUserIdList.value= ''
			}
			
		});
	}

	/** 提交按钮 */
	function submitForm() {
		console.log(form.value,'form.value')
		if(!checkInfo()) return;
		proxy.$refs["formRef"].validate(valid => {
			if (valid) {
				let params = JSON.parse(JSON.stringify(form.value));
				params.business_user_ids = JSON.stringify(params.business_user_ids);
				params.operation_user_ids = JSON.stringify(params.operation_user_ids);
				params.document_user_ids = JSON.stringify(params.document_user_ids);
				params.company_type = JSON.stringify(params.company_type);
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
		proxy.$modal.confirm('是否确认删除编号为"' + _ids + '"的数据项？').then(function() {
			return delByIds(_ids);
		}).then(() => {
			getList();
			proxy.$modal.msgSuccess("删除成功");
		}).catch(() => {});
	}

	const handleInputTaxNumber = (value) => {
		// console.log(value, value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase());
		form.value.tax_number = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase(); // 转换为大写
	}

	getList();
	
	// 监听公司类型 判断必填
	watch(() => form.value.company_type, (newVal, oldVal) => {
		if(newVal=== '1' || newVal=== '2'){
			rules.value= {
						company_name: [{required: true,message: "公司名称不能为空",trigger: "blur"}],
						tax_number: [{required: true,message: "税号不能为空",trigger: "blur"},
						{
							pattern: /^[A-Z0-9]+$/, // 正则表达式：只允许大写字母和数字
							message: "税号只能包含大写字母和数字",
							trigger: "blur"
						}],
						billing_address: [{required: true,message: "公司地址不能为空",trigger: "blur"}],
						company_phone: [{required: true,message: "座机不能为空",trigger: "blur"}],
						bank_name: [{required: true,message: "开户行不能为空",trigger: "blur"}],
						bank_account: [{required: true,message: "开户账户不能为空",trigger: "blur"}],
						company_type: [{required: true,message: "公司类型不能为空",trigger: "change"}]
					}
		}else{
			rules.value= {
						company_name: [{required: true,message: "公司名称不能为空",trigger: "blur"}],
						tax_number: [{required: true,message: "税号不能为空",trigger: "blur"},
						{
							pattern: /^[A-Z0-9]+$/, // 正则表达式：只允许大写字母和数字
							message: "税号只能包含大写字母和数字",
							trigger: "blur"
						}],
						company_type: [{required: true,message: "公司类型不能为空",trigger: "change"}]
					}
		}
	})
	
	// 必填
	function checkInfo(){
		if((!form.value.business_user_ids || form.value.business_user_ids.length=== 0) && (!form.value.operation_user_ids || form.value.operation_user_ids.length=== 0) && (!form.value.document_user_ids || form.value.document_user_ids.length=== 0)){
			proxy.$modal.msgWarning("请选择至少一个共享人");
			return false;
		}
		return true;
	}
</script>