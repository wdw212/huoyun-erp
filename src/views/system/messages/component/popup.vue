<template>
	<div class="message-popup shadow overflow-h"  @click="cancelPop($event)">
		<div class="content" v-loading="loading">
			<el-tabs v-model="activeName" @tab-click="handleClick">
			 <el-tab-pane label="操作平台通知" name="0">
				 <div class="color6 px-2 pb-2" v-for="(item,index) in tableDataNolook" :key="index">
					<div class="flex mb-1">
						<div class=" color6 mr-1" style="font-size: 12px; border: 1px solid #666; border-radius: 4px;padding: 2px 4px;">{{item.read_at?'已读':'未读'}}</div>
						<div>{{item.data.content}}</div> 
					</div>
					 
					<div>{{item.created_at}}</div> 
				 </div>
			 </el-tab-pane>
			 <el-tab-pane label="分享通知" name="1">
				 <div class="color6 px-2 pb-2" v-for="(item,index) in tableDataNolook" :key="index">
					<div class="mb-1">{{item.data.content}}</div> 
					<div>{{item.created_at}}</div> 
				 </div>
			 </el-tab-pane>
			</el-tabs>
			<div class="flex p-a b_0 bg-w py-2 w-100 t-c" style="color: rgb(64, 158, 255);">
				<div class="flex-1" @click="handleNoLook">消除未读</div>
				<div style="width: 1px;height: 16px;background-color: #f1f1f1;"></div>
				<div class="flex-1" @click="toPageMore">查看更多</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import {
		unreadIndex,
		markAsRead
	} from "@/api/system/message";
	import {
		toRefs
	} from 'vue';
	const Emit= defineEmits(['update:openView'])
	const openView= ref(true)
	const loading= ref(false)
	const activeName= ref('0')
	const tableDataNolook= ref([])  //未读
	const props  = defineProps({
		openView: {
			type: Boolean,
			default: false,	
		}
	})
	const {
		proxy
	} = getCurrentInstance()
	/** 查询公告列表 */
	function getList() {
		loading.value = true;
		unreadIndex().then(response => {
			console.log(response,'response')
			tableDataNolook.value= response
		}).catch((e) => proxy.$modal.msgError(e?.toString() ?? '未知错误'))
	 	.finally(()=>{ loading.value = false });
	}
	getList()
	function handleClick(tab, event) {
        console.log(tab.props.name, event);
      }
	function handleClose(){
		Emit("update:openView", false);
	}
	function handleNoLook() {
		markAsRead().then(response => {
			proxy.$modal.msgSucess('已全部已读')
		}).catch((e) => proxy.$modal.msgError(e?.toString() ?? '未知错误'))
		.finally(()=>{});
	}
	function toPageMore() {
		proxy.$router.push('/system/messages');
	}
	// 点击 .test_pop 以外的地方隐藏弹窗
	function cancelPop(event) {
		console.log(1111)
	  let tp = document.querySelector(".content");
	  if (tp) {
		if (!tp.contains(event.target)) {
			console.log(2222)
		  Emit("update:openView", false);
		}
	  }
	}
</script>

<style lang="scss">
	.message-popup{
		position: fixed;
		z-index: 999999;
		width: 100%;
		height: 100%;
		right: 20px;
		top: 60px;
		border-radius: 20px;
		.content{
			width: 600px;
			height: 700px;
			background-color: #f5f5f5;
			position: absolute;	
			right: 0px;
			top: 0px;
		}
		.el-tabs{
			height: 80%;
			.el-tabs__content{
				height: 100%;
				overflow-y: scroll;
			}
		}
		.el-tabs__nav{
			width: 100%;
			.el-tabs__header{
			}
			.el-tabs__item{
				flex: 1;
				background-color: #fff;
				height: 60px;
			}
			
		}
	}
</style>
