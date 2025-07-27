<template>
	<div class="flex flex-justify-around" id="todoList">
		<!-- <el-row :gutter="20"> -->
			<!-- <el-col :span="6" :xs="24"> -->
		   <el-card class="box-card input-" style="">
			  <template v-slot:header>
				<div class="clearfix">
				  <span>待办事项列表</span>
				</div>
			  </template>
			  <div style="padding: 30px 50px">
			  <el-form ref="formRef" :model="form" :inline="true" class="flex flex-align-center" :rules="rules"@submit.prevent>
				  <!-- <el-form-item style="flex:1;color: #000;margin-right: 10px" prop="title" :class="inputStyleTodoListStyle=== 1?'form-item-height no-border-input focus-style':'form-item-height no-border-input'"> -->
				  <el-form-item style="flex:1;color: #000;margin-right: 10px" prop="title" class="form-item-height focus-border-color form-item-style">
				  	<el-input  v-model="form.title" @keyup.enter.native="handleAdd" placeholder="今天需要做什么？" clearable @focus="inputStyleTodoListStyle= 1" @blur="inputStyleTodoListStyle= 0"/>
				  </el-form-item>
				  <el-form-item  class="form-item-height form-item-style">
				  	<el-button type="primary" icon="Plus" @click="handleAdd" :loadingAddBtn="loadingAddBtn">添加</el-button>
				  </el-form-item>
			  </el-form>
			  <div>
				 <div v-loading="loading">
					 <div class="flex flex-align-center content" v-for="(item, index) in dataList" :key='index'>
						 <el-checkbox v-model="item.status" :true-label= 1 :false-label= 0 @change="getRowStatus($event,item)"></el-checkbox>
						 <div class="content-list">
							 <p v-if="item.isEditStatus===0" @click="handleEdit(item, 0, index)">
								 <span :class="item.status=== 1?'font-line-center':''">{{item.title}}</span>
							 </p>
							 <el-input :ref="el => { if (el) inputRefs[index] = el }" v-else v-model="item.title" placeholder="请输入内容" @keyup.enter="handleEdit(item,1, index)" @blur="item.isEditStatus= 0"></el-input>
						 </div>
						 <!-- <el-button class="icon-color-black" icon="Edit" @click="handleEdit(item, 0)"></el-button> -->
						 <el-button class="icon-color-black" icon="Delete" @click="handleDelete(item)"></el-button>
					 </div>
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
					<el-button class="btn-margin" type="primary" icon="Plus" @click="handleAddRemarks">新增备注</el-button>
					<view-indicate class="btn-margin" :view-indicate-role-list="viewIndicateRoleList" :model-type="'remark'"></view-indicate>
					<el-button class="btn-margin" type="primary" @click="submitFormRemarks" :loading="loadingSaveBtn">保 存</el-button>
					<el-button type="primary" @click="handleSearcRemarks(1)" :loading="loadingRemarks"  icon="Refresh">刷 新</el-button>
				</div>
				<el-form ref="queryParamsRef" :model="queryParams" :inline="true" class="flex flex-align-center" :rules="rules">
				  <el-form-item style="flex:1;">
					<el-input v-model="queryParams.keyword" placeholder="请输入备注关键字" clearable style="color: #000!important" />
				  </el-form-item>
				  <el-form-item >
					<el-button type="primary" icon="search" @click="handleSearcRemarks" :loading="loadingRemarks">搜索</el-button>
				  </el-form-item>
				</el-form>
				<div class="flex flex-wrap">
					<div v-for="(item, index) in dataListRemarks" :key="index"
						:class="['color-2','p-r','input-wrapper','mr20','mb20','border','no-border-input',item.inputStyleremarksStyle=== 1?'focus-style':'']" style="width: 30%">
						<!-- 漂浮的 div -->
						<div class="p-a r_0 z-10">
							<el-button class="icon-color-black" icon="Delete" @click="handleDeleteRemarks(item,index)"></el-button>
							<!-- <p @click="formRemark.remark.splice(index, 1);">×</p> -->
							<!-- <el-button type="primary" @click="submitFormRemarks(item)" :loading="loadingSaveBtn">保 存</el-button> -->
						</div>

						<!-- el-input -->
						<el-input v-model="item.content" placeholder="请输入" type="textarea"
							:rows="6" @focus="item.inputStyleremarksStyle= 1"  @blur="item.inputStyleremarksStyle= 0"/>
					</div>
				</div>
			</el-card>
			<!-- </el-col> -->
		<!-- </el-row> -->
	</div>
</template>

<script setup>
	import { toRefs,ref,nextTick } from 'vue';
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
	 const inputStyleTodoListStyle = ref(0)
	 const inputStyleremarksStyle = ref(0)
	 
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
	 const inputRefs=([])
	 // 编辑
	 function handleEdit(item,type,index){  //type 0 不修改内容  1 调接口修改内容
		 item.isEditStatus= item.isEditStatus=== 0? 1: 0
		 nextTick(()=>{
			 if(item.isEditStatus=== 1){
			 	 inputRefs[index]?.focus()
			 }
		 })
		 
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
	 function handleSearcRemarks(type){
		 if(type=== 1){
			 queryParams.value.keyword= ''
		 }
		 dataListRemarks.value= []
		 getListRemarks()
	 }
	 // 保存备注
	 function submitFormRemarks(){
		 if(dataListRemarks.value.some(item => !item.content)){
			 proxy.$modal.msgWarning("每一项备注不能为空，请检查");
			 return false
		 }
		 updateDataFormRemarks()
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
		  form.value.title=""
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
	function updateDataFormRemarks(){
		loadingSaveBtn.value= true
		let data = {
			items: JSON.stringify(dataListRemarks.value)
		}
		console.log(typeof data)
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
	#todoList .el-input__inner{
		color: #000;
	}
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
	.flex-end{
		justify-content: flex-end
	}
	.box-card{
		box-sizing: border-box;
		margin: 20px 10px;
		flex: 1
	}
	.box-card:nth-child(1){
		// padding: 30px 50px
	}
	// .box-card:nth-child(2){
	// }
	.content{
		width: 100%;
		border-bottom: 1px solid #ddd;
		padding: 6px 0;
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
		padding: 0 10px;
		p{
			width: 100%;
			margin: 5px 0;
			color: #000;
		}
	}
	.icon-color-black{
	  color: #333;
	  font-size: 20px;
	  border: none
	}
	.font-line-center{
		// text-decoration: line-through;
		// text-decoration-color: red
		position: relative;
	}
	.font-line-center::after {
	  content: "";
	  position: absolute;
	  left: 0;
	  top: 50%;
	  width: 100%;
	  height: 3px; /* 控制线条粗细 */
	  background: red;
	  transform: translateY(-50%);
	}
	.btn-padding{
		padding: 10px 0
	}
	.flex-wrap{
		flex-wrap: wrap;
	}
	.no-border-input{
		.el-input,.el-textarea{
			border: 1px solid #fff !important;
			outline: none !important;
			box-shadow: none !important;
			.el-input__wrapper{
				border: 1px solid #fff !important;
				outline: none !important;
				box-shadow: none !important
			}
			.el-input__inner,.el-textarea__inner{
				border: 1px solid #fff !important;
				outline: none !important;
				box-shadow: none !important;
				color: #000;
			}
		}
	}
	.focus-border-color{
		.el-input{
			height: 100% !important;
			// transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out
		}
		.el-input__wrapper{
		}
		.is-focus{
			padding: 0;
			.el-input__inner{
				width: 100%;
				height: 100% !important;
				box-shadow: 0px 0px 4px #409EFF !important;
				padding: 0 10px
				// box-shadow .15s ease-in-out
			}
		}
		
	}
	.border{
		border: 1px solid #dcdfe6;
		border-radius: 5px;
	}
</style>
<style lang="scss" scoped>
	.floating-div{
		margin-bottom: 10px
	}
	.box-card{
		height: 800px;
		overflow-y: scroll;
		.form-item-height{
			height: 60px;
			
			.el-button{
				height: 100%
			}
		}
		.form-item-style{
			border: 1px solid #dcdfe6;
			border-radius: 5px;
			font-size: 16px;
		}
		.btn-margin{
			margin-right: 10px
		}
		.focus-style{
			border: 1px solid #409EFF
		}
	}
</style>