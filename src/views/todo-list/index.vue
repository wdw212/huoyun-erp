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
				  	<el-input v-model="form.title" placeholder="请输入待办事项" clearable />
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
				<div class="btn-padding">
					<el-button type="primary" icon="Plus" @click="formRemark.remark.push('')">新增备注</el-button>
				</div>
				<el-form ref="queryParamsRef" :model="queryParams" :inline="true" class="flex flex-align-center" :rules="rules">
				  <el-form-item style="flex:1">
					<el-input v-model="queryParams.keyword" placeholder="请输入备注关键字" clearable />
				  </el-form-item>
				  <el-form-item >
					<el-button type="primary" icon="search" @click="handleSearch">搜索</el-button>
				  </el-form-item>
				</el-form>
				<div>
					<span v-for="(item, index) in formRemark.remark" :key="index"
						class="input-wrapper mr20 mb20" style="width: 300px; position: relative;">
						<!-- 漂浮的 div -->
						<div class="floating-div" @click="formRemark.remark.splice(index, 1);">×</div>

						<!-- el-input -->
						<el-input v-model="formRemark.remark[index]" placeholder="请输入" type="textarea"
							:rows="4" />
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
		updateData
	} from "@/api/todo-list";
	const {proxy} = getCurrentInstance();
	const data = reactive({
		form: {
			title: '',  
		},
		rules: {
			title: [{required: true,message: "请输入具体内容",trigger: "blur"}]
		},
		queryParams: {
			keyword: ''
		},
		formRemark: {
			remark: []
		}
	});
	const {
		form,
		rules,
		queryParams,
		formRemark
	} = toRefs(data);
	 const radio1= ref("1")
	 const loading = ref(false)
	 const loadingAddBtn = ref(false)
	 const dataList = ref([]);
	 
	 // 新增
	 function handleAdd() {
		 proxy.$refs["formRef"].validate(valid => {
		   if (valid) {
		       addDataForm()
		   }
		 });
	 	// open.value= true
	 	// title.value = "新增";
	 	
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
	 /** 查询列表 */
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
	/** 删除按钮操作 */
	function handleDelete(item) {
		proxy.$modal.confirm('是否确认删除此条待办事项？').then(function() {
			return delByIds(item.id);
		}).then(() => {
			getList();
			proxy.$modal.msgSuccess("删除成功");
		}).catch(() => {});
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
</style>