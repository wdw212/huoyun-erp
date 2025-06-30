<template>
	<div>
		<div>
			<el-button type="primary" @click="openViewIndicate">页面注明</el-button>
		</div>
		<el-dialog title="页面注明" v-model="openView" :destroy-on-close='true' width="30%" @close="cancel">
			<el-input v-model="viewIndicateInfo" placeholder="请输入页面注明信息" :rows="12" type="textarea" id="myTextarea" :readonly="!props.viewIndicateRoleList.includes(userStore.userRoleCode)"/>
			<div v-if='props.viewIndicateRoleList.includes(userStore.userRoleCode)'>
				<!-- <template name='footer'> -->
					<div class="dialog-footer">
						<el-button type="primary" @click="submitForm">保 存</el-button>
						<el-button @click="cancel">取 消</el-button>
					</div>
				<!-- </template> -->
			</div>
		</el-dialog>
	</div>
</template>

<script setup>
	import useUserStore from "@/store/modules/user";
	const userStore = useUserStore();  //vuex缓存的用户信息
	const openView = ref(false)
	const viewIndicateInfo = ref('')
	const modelTypeId = ref('')  //当前页面注明id
	const props  = defineProps({
		// SUPER_ADMIN 超管  OPERATE  操作  DOCUMENT  单证  COMMERCE 商务  BUSINESS  业务  FINANCE  财务  SCHEDULE  调度
		viewIndicateRoleList: { ////页面标明组件可更改权限
			type: Array,
			default: [],	
		},
		modelType: {
			type: String,
			default: ''
		}
	}) 
	import {
		getData,
		updateData
	} from "@/api/common/index";
	// 打开页面标明弹框
	function openViewIndicate() {
		openView.value= true
		getDataList()
	}
	function cancel() {
		viewIndicateInfo.value= ''
		modelTypeId.value= ''
		openView.value= false
	}
	// 提交
	function submitForm(){
		updateDataForm()
	}
	// -----------------------接口------------------
	/** 查询列表 */
	function getDataList() {
		getData({model_type: props.modelType}).then(response => {
					viewIndicateInfo.value= response.content
					modelTypeId.value= response.id
				});
	}
	// 提交列表
	function updateDataForm(){
		let data={
			id: modelTypeId.value,
			model_type: props.modelType,
			content: viewIndicateInfo.value
		}
		updateData(data).then(response => {
		  proxy.$modal.msgSuccess("提交成功")
		  cancel()
		  // open.value = false;
		  // getList();
		});
	}
	
	
</script>

<style scoped>
	.dialog-footer{
		text-align: right;
		margin-top: 10px
	}
</style>