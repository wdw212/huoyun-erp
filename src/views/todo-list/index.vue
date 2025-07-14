<template>
	<div class="flex flex-justify-around">
		<!-- <el-row :gutter="20"> -->
			<!-- <el-col :span="6" :xs="24"> -->
		   <el-card class="box-card">
			  <template v-slot:header>
				<div class="clearfix">
				  <span>待办事项列表</span>
				</div>
			  </template>
			  <el-form ref="formRef" :model="form" :inline="true" class="flex flex-align-center" :rules="rules">
				  <el-form-item style="flex:1" prop="title">
				  	<el-input v-model="form.title" placeholder="请输入待办事项" clearable  type="textarea"
							:rows="3" />
				  </el-form-item>
				  <el-form-item >
				  	<el-button type="primary" icon="Plus" @click="handleAdd" :loadingAddBtn="loadingAddBtn">添加</el-button>
				  </el-form-item>
			  </el-form>
			  <div>
				 <div v-loading="loading">
					 <div class="flex flex-align-center content" v-for="(item, index) in dataList" :key='index'>
						 <el-checkbox v-model="item.status" :true-label= 1 :false-label= 0 @change="getRowStatus($event,item)"></el-checkbox>
						 <div class="content-list">
							 <p v-if="item.isEditStatus===0" :class="item.status=== 1?'font-line-center':''">{{item.title}}</p>
							 <el-input v-else v-model="item.title" placeholder="请输入内容" @keyup.enter="handleEdit(item,1)"></el-input>
						 </div>
						 <el-button class="icon-color-black" icon="Edit" @click="handleEdit(item, 0)"></el-button>
						 <el-button class="icon-color-black" icon="Delete" @click="handleDelete(item)"></el-button>
					 </div>
				   </div> 
			  </div>
			</el-card>
			<el-card class="box-card">
				<template v-slot:header>
					<div class="clearfix">
					  <span>备注</span>
					</div>
				</template>
				<div class="btn-padding flex">
					<el-button style='margin-right: 10px' type="primary" icon="Plus" @click="handleAddRemarks">新增备注</el-button>
					<view-indicate :view-indicate-role-list="viewIndicateRoleList" :model-type="'remark'"></view-indicate>
				</div>
				<el-form ref="queryParamsRef" :model="queryParams" :inline="true" class="flex flex-align-center" :rules="rules">
				  <el-form-item style="flex:1">
					<el-input v-model="queryParams.keyword" placeholder="请输入备注关键字" clearable />
				  </el-form-item>
				  <el-form-item >
					<el-button type="primary" icon="search" @click="handleSearcRemarks" :loading="loadingRemarks">搜索</el-button>
				  </el-form-item>
				</el-form>
				<div class="flex flex-wrap">
					<span v-for="(item, index) in dataListRemarks" :key="index"
						class="input-wrapper mr20 mb20" style="width: 30%">
						<!-- 漂浮的 div -->
						<div class="floating-div flex flex-justify-between">
							<el-button class="icon-color-black" icon="Delete" @click="handleDeleteRemarks(item,index)"></el-button>
							<!-- <p @click="formRemark.remark.splice(index, 1);">×</p> -->
							<el-button type="primary" @click="submitFormRemarks(item)" :loading="loadingSaveBtn">保 存</el-button>
						</div>

						<!-- el-input -->
						<el-input v-model="item.content" placeholder="请输入" type="textarea"
							:rows="6" />
					</span>
				</div>
			</el-card>
			<!-- </el-col> -->
		<!-- </el-row> -->
	</div>
</template>

<script setup>
	import { toRefs } from 'vue';
	import {
		listData,
		delByIds,
		addData,
		updateData,
		listDataRemarks,
		addDataRemarks,
		updateDataRemarks,
		delByIdsRemarks
	} from "@/api/todo-list";
	const {proxy} = getCurrentInstance();
	import ViewIndicate from '@/components/ViewIndicate/index'
	const data = reactive({
		form: {
			title: '',  
		},
		rules: {
			title: [{required: true,message: "请输入具体内容",trigger: "blur"}]
		},
		queryParams: {
			keyword: ''
		}
	});
	const {
		form,
		rules,
		queryParams,
		// formRemark
	} = toRefs(data);
	 const radio1= ref("1")
	 const loading = ref(false)
	 const loadingAddBtn = ref(false)
	 const loadingRemarks = ref(false)
	 const loadingSaveBtn = ref(false)
	 const dataList = ref([]);
	 const dataListRemarks= ref([])
	 
	 // 新增
	 // 待办事项
	 function handleAdd() {
		 proxy.$refs["formRef"].validate(valid => {
		   if (valid) {
		       addDataForm()
		   }
		 });
	 	// open.value= true
	 	// title.value = "新增";
	 	
	 }
	 // 备注	
	 function handleAddRemarks(){
		 dataListRemarks.value.unshift({content:""})
	 }
	 // 编辑
	 function handleEdit(item,type){  //type 0 不修改内容  1 调接口修改内容
		 item.isEditStatus= item.isEditStatus=== 0? 1: 0
		 if(type=== 1){
			 if(item.title){
				 updateDataForm(item)
			 }else{
				 proxy.$modal.msgWarning("请输入代办事项");
			 }
		 }
	 }
	 // 改变当前已完成未完成状态
	 function getRowStatus(e,item){
		 // item.status= e=== true?1: 0
		 console.log(typeof e)
		 updateDataForm(item)
		 
	 }
	 // 模糊搜索
	 function handleSearcRemarks(){
		 dataListRemarks.value= []
		 getListRemarks()
	 }
	 // 保存备注
	 function submitFormRemarks(item){
		 console.log(item,'item.content')
		 if(!item.content){
			 proxy.$modal.msgWarning("请输入备注内容");
			 return false
		 }
		 if(item.id){
			 updateDataFormRemarks(item)
		 }else{
			 addDataFormRemarks(item)
		 }
	 }
	 /** 查询列表 */
	 // 待办事项
	 function getList() {
	 	loading.value = true;
	 	listData().then(response => {
	 		dataList.value = response.data.map(item => {
				return {
				...item,
				isEditStatus: 0 // 默认展示文字  编辑试为1
				}
			})
	 	}).catch((e) => proxy.$modal.msgError(e?.toString() ?? '未知错误'))
	 	.finally(()=>{ loading.value = false })
	 }
	 getList()
	 // 备注
	 function getListRemarks() {
	 	loadingRemarks.value = true;
	 	listDataRemarks(queryParams.value).then(response => {
	 		dataListRemarks.value = response.data
	 	}).catch((e) => proxy.$modal.msgError(e?.toString() ?? '未知错误'))
	 	.finally(()=>{ loadingRemarks.value = false })
	 }
	 getListRemarks()
	 // 待办事项
	 function addDataForm(){
		 loadingAddBtn.value= true
		addData(form.value).then(response => {
		  proxy.$modal.msgSuccess("新增成功");
		  getList()
		  // open.value = false;
		  // getList();
		}).catch((e) => proxy.$modal.msgError(e?.toString() ?? '未知错误'))
	 	.finally(()=>{ loadingAddBtn.value = false });
	}
	function updateDataForm(item){
		console.log(item,'item')
		loading.value= true
		let data={
			id: item.id,
			status: item.status,
			title: item.title,
		}
		updateData(data).then(response => {
		  proxy.$modal.msgSuccess("修改成功");
		  getList()
		  // open.value = false;
		  // getList();
		}).catch((e) => proxy.$modal.msgError(e?.toString() ?? '未知错误'))
	 	.finally(()=>{ loading.value = false });
	}
	// 备注
	function addDataFormRemarks(item){
		 loadingSaveBtn.value= true
		 console.log(item,'209')
		addDataRemarks(item).then(response => {
		  proxy.$modal.msgSuccess("新增成功");
		  getListRemarks()
		  // open.value = false;
		  // getList();
		}).catch((e) => proxy.$modal.msgError(e?.toString() ?? '未知错误'))
	 	.finally(()=>{ loadingSaveBtn.value = false });
	}
	function updateDataFormRemarks(item){
		console.log(item,'item')
		loadingSaveBtn.value= true
		let data={
			id: item.id,
			content: item.content
		}
		updateDataRemarks(data).then(response => {
		  proxy.$modal.msgSuccess("修改成功");
		  getListRemarks()
		  // open.value = false;
		  // getList();
		}).catch((e) => proxy.$modal.msgError(e?.toString() ?? '未知错误'))
	 	.finally(()=>{ loadingSaveBtn.value = false });
	}
	/** 删除按钮操作 */
	function handleDelete(item) {
		proxy.$modal.confirm('是否确认删除此条待办事项？').then(function() {
			return delByIds(item.id);
		}).then(() => {
			getList();
			proxy.$modal.msgSuccess("删除成功");
		}).catch(() => {});
	}
	function handleDeleteRemarks(item,index){
		if(item.id){
			proxy.$modal.confirm('是否确认删除此条备注？').then(function() {
				return delByIdsRemarks(item.id);
			}).then(() => {
				getListRemarks();
				proxy.$modal.msgSuccess("删除成功");
			}).catch(() => {});
		}else{
			dataListRemarks.value.splice(index,1)
		}
		
	}
</script>

<style lang="scss">
	.flex{
		display: flex;
	}
	.flex-align-center{
		align-items: center
	}
	.flex-justify-around{
		justify-content: space-around
	}
	.flex-justify-between{
		justify-content: space-between
	}
	.box-card{
		width: 48%;
		margin: 20px 0;
	}
	.content{
		width: 100%;
		.el-checkbox__inner{
			border-radius: 0
		}
	}
	.content .el-checkbox__label,{
		display: flex;
		align-items: center
	}
	.el-checkbox__label{
		flex: 1;
	}
	.content-list{
		flex: 1;
		padding: 0 10px
	}
	.icon-color-black{
	  color: #333;
	  font-size: 20px;
	  border: none
	}
	.font-line-center{
		text-decoration: line-through
	}
	.btn-padding{
		padding: 10px 0
	}
	.flex-wrap{
		flex-wrap: wrap;
	}
</style>
<style lang="scss" scoped>
	.floating-div{
		margin-bottom: 10px
	}
	.box-card{
		height: 800px
	}
</style>