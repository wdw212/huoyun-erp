<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
			<el-form-item label="是否已读" prop="name">
				<el-select v-model="queryParams.configType" placeholder="是否已读" clearable style="width: 240px">
				   <el-option
				      v-for="item in is_look_list"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value"
				   />
				</el-select>
			</el-form-item>
			<el-form-item label="消息来源" prop="title">
				<el-select v-model="queryParams.configType" placeholder="消息来源" clearable style="width: 240px">
				   <el-option
					  v-for="item in data_Lource_list"
					  :key="item.value"
					  :label="item.label"
					  :value="item.value"
				   />
				</el-select>
				<!-- <el-input v-model="queryParams.title" placeholder="请输入标题" clearable @keyup.enter="handleQuery" /> -->
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
				<el-button icon="Refresh" @click="resetQuery">重置</el-button>
			</el-form-item>
		</el-form>

		<el-row :gutter="10" class="mb8" justify="end">
			<el-col :span="1.5">
				<el-button type="danger" plain @click="handleLookAll" v-hasPermi="['system:messages:edit']">清除全部未读</el-button>
			</el-col>

			<right-toolbar @queryTable="getList"></right-toolbar>
		</el-row>

		<el-table v-loading="loading" :data="noticesList" @selection-change="handleSelectionChange">
			<!-- <el-table-column type="selection" width="55" align="center" /> -->
			<!-- <el-table-column label="编号" align="center" prop="id" /> -->
			<el-table-column label="消息" align="center" prop="data.content" />
			<el-table-column label="消息来源" align="center" prop="title" width="100">
				<template #default="scope">
					{{ scope.row.read_at?'已读': '未读' }}
				</template>
			</el-table-column>
			<el-table-column label="是否已读" align="center" prop="title"  width="100"/>
			<el-table-column label="操作" align="center" class-name="small-padding fixed-width"  width="200">
				<template #default="scope">
					<el-button v-if="!scope.row.read_at" type="primary" plain @click="handleRead(scope.row)"
						v-hasPermi="['system:messages:edit']">清除未读</el-button>
					<el-button type="danger" plain @click="handleUpdate(scope.row)"
						v-hasPermi="['system:messages:delete']">删除</el-button>
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
		getData,
		markAsRead,
		read,
		destroy
	} from "@/api/system/message";

	const {
		proxy
	} = getCurrentInstance();
	const is_look_list = ref([  //是否已读
		{
			value: 1,
			label: '已读'
		},
		{
			value: 0,
			label: '未读'
		}
	]);
	const data_Lource_list = ref([  //是否已读
			{
				value: 1,
				label: '操作平台'
			},
			{
				value: 2,
				label: '分享'
			},
			{
				value: 3,
				label: '系统'
			}
		]);

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
			// name: null,
			// title: null,
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
		getData(queryParams.value).then(response => {
			noticesList.value = response.data;
			// console.log(noticesList.value);
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
	// 单条已读
	function handleRead(row){
		const _ids = row.id || ids.value;
		read(_ids).then(response => {
			getList();
		});
	}
	// 全部已读
	function handleLookAll(){
		proxy.$modal.confirm('确定要全部已读').then(function() {
			return markAsRead();
		}).then(() => {
			getList();
			proxy.$modal.msgSuccess("已全部已读");
		}).catch(() => {});
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


	getList();
</script>