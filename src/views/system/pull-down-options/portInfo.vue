<template>
	<div class="app-container">
		<!-- <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
			<el-form-item label="名称" prop="neme">
				<el-input v-model="queryParams.title" placeholder="请输入标题" clearable @keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
				<el-button icon="Refresh" @click="resetQuery">重置</el-button>
			</el-form-item>
		</el-form> -->

		<el-row :gutter="10" class="mb8" justify="end">
			<el-col :span="1.5">
				<el-button type="primary" plain @click="handleDownload">模板下载</el-button>
				<!-- <el-button type="primary" plain @click="handleAdd">批量导入</el-button> -->
				<el-upload
				  ref="upload"
				  :action="baseUrl + '/uploads/file'"
				  accept=".xls,.xlsx"
				  :show-file-list="false"
				  :on-success="handleUploadSuccess"
				  style="display: inline-block; margin-left: 8px"
				>
				  <el-button type="primary">批量导入</el-button>
				</el-upload>
				<el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
			</el-col>
			<right-toolbar @queryTable="getList"></right-toolbar>
		</el-row>

		<el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
			<el-table-column label="港口代码" align="center" prop="code" />
			<el-table-column label="港口" align="center" prop="name" />
			<el-table-column label="港口(英文)" align="center" prop="en_name" />
			<el-table-column label="国家" align="center" prop="country" />
			<el-table-column label="国家(英文)" align="center" prop="en_country" />
			<el-table-column label="航线" align="center" prop="route" />
			<el-table-column label="备注" align="center" prop="remark" />
			<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
				<template #default="scope">
					<el-button plain type="primary" icon="Edit" @click="handleUpdate(scope.row)">修改</el-button>
					<el-button plain type="danger" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- <pagination v-show="total>0" :total="total" v-model:page="queryParams.page" v-model:limit="queryParams.pageSize"
			@pagination="getList" /> -->

		<!-- 添加或修改对话框 -->
		<!-- <el-dialog :title="title" v-model="open" width="80%">
			<InvoiceForm />
		</el-dialog> -->
		<el-dialog :title="title" v-model="open" width="600px">
			<el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
				<el-form-item label="港口代码">
					
					<el-input v-model="form.code" placeholder="请输入" />
				</el-form-item>
				<el-form-item label="港口名称" prop="name">
					
					<el-input v-model="form.name" placeholder="请输入" />
				</el-form-item>
				<el-form-item label="港口名称(英文)" prop="en_name">
					
					<el-input v-model="form.en_name" placeholder="请输入" />
				</el-form-item>
				<el-form-item label="国家" prop="country">
					<el-input v-model="form.country" placeholder="请输入" />
				</el-form-item>
				<el-form-item label="国家(英文)" prop="en_country">
					<el-input v-model="form.en_country" placeholder="请输入" />
				</el-form-item>
				<el-form-item label="航线">
					<el-input v-model="form.route" placeholder="请输入" />
				</el-form-item>
				<el-form-item label="备注">
					<el-input v-model="form.remark" placeholder="请输入" type="textarea" rows="4" />
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
		updateData,
		downLoadTemplate,
		batchImport
	} from "@/api/system/pull-down-options/port-info";

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
	const file = ref("");
	const baseUrl = import.meta.env.VITE_APP_BASE_API;
	

	const data = reactive({
		form: {},
		queryParams: {
			page: 1,
			pageSize: 15,
			title: null
		},
		rules: {
			name: [{
				required: true,
				message: "港口名称不能为空",
				trigger: "blur"
			}],
			en_name: [{
				required: true,
				message: "港口名称(英文)不能为空",
				trigger: "blur"
			}],
			country: [{
				required: true,
				message: "国家不能为空",
				trigger: "blur"
			}],
			en_country: [{
				required: true,
				message: "国家(英文)不能为空",
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
			code: null,
			name: null,
			en_name: null,
			country: null,
			en_country: null,
			route: null,
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

	getList();
	
	function handleDownload(){
		downLoadTemplate().then(response => {
			console.log(response, 'response');
			    
			// 创建隐藏的 a 标签
			const a = document.createElement('a');
			a.href = response.url;
			
			// 设置 download 属性可以指定下载的文件名
			// 如果后端返回了文件名，可以使用 response.filename
			a.download = response.filename || 'template.xlsx'; // 设置默认文件名
			
			// 将 a 标签添加到页面（隐藏）
			document.body.appendChild(a);
			
			// 模拟点击
			a.click();
			
			// 移除 a 标签
			document.body.removeChild(a);
		});
	}
	
	// 批量上传
	const handleUploadSuccess = (response) => {
		console.log('上传成功:', response);
		file.value= response.url
		console.log(response.url,'response.url')
		if(response.url){
			let formData= new FormData()
			formData.append('file', response.url)
			batchImport(formData).then(res => {
				proxy.$modal.msgSuccess("上传成功");
				getList();
			});
		}
		
	};
</script>