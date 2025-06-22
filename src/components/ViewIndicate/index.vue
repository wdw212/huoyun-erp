<template>
	<div>
		<div>
			<el-button type="primary" @click="openViewIndicate">页面注明</el-button>
		</div>
		<el-dialog title="页面注明" v-model="openView" :destroy-on-close='true' width="30%" @close="cancel">
			<el-input v-model="viewIndicateInfo" placeholder="请输入页面注明信息" :rows="3" type="textarea" id="myTextarea" :readonly="!props.viewIndicateRoleList.includes(userStore.userRoleCode)"/>
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
	const props  = defineProps({
		viewIndicateRoleList: { ////页面标明组件可更改权限
			type: Array,
			default: [],	
		}
	}) 
	// 打开页面标明弹框
	function openViewIndicate() {
		openView.value= true
	}
	function cancel() {
		openView.value= false
	}
</script>

<style scoped>
	.dialog-footer{
		text-align: right;
		margin-top: 10px
	}
</style>