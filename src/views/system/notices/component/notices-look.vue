<template>
	<div>
		<el-dialog v-model="props.openView" :destroy-on-close='true' width="60%" @close='handleClose'>
			<div class="title">公告详情</div>
			<el-carousel indicator-position="outside" height="400px" :autoplay="false">
			    <el-carousel-item v-for="item in 4" :key="item">
			      <div style="height: 600px;overflow-y: auto">船舶定位应用升级公告</br>
船舶定位免费开放「船舶跟踪，功能，公众号实时推送靠离泊动态。
*核心功能优化1.船舶全轨迹追踪〇全球覆盖:接入AIS卫星数据，实时获取船舶位置、航速、航向〇全球覆盖:接入AIS卫星数据，实时获取船舶位置、航速、航向。〇全球覆盖:接入AIS卫星数据，实时获取船舶位置、航速、航向。〇全球覆盖:接入AIS卫星数据，实时获取船舶位置、航速、航向。
2.船舶全轨迹追踪
〇全球覆盖:接入AIS卫星数据，，实时获取船舶位置、、航速、航向。
〇全球覆盖:接入AIS卫星数据，，实时获取船舶位置、航速、航向。
实时获取船舶位置、航速、航向。〇全球覆盖:接入AIS卫星数据，〇全球覆盖:接入AIS卫星数据，，实时获取船舶位置、航速、航向。
*核心功能优化
1.船舶全轨迹追踪
〇全球覆盖:接入AIS卫星数据，，实时获取船舶位置、、航速、航向。
〇全球覆盖:接入AIS卫星数据，实时获取船舶位置、航速、航向。
〇全球覆盖:接入AIS卫星数据，实时获取船舶位置、航速、航向。
〇全球覆盖:接入AIS卫星数据，实时获取船舶位置、航速、航向。船舶定位应用升级公告</br>
船舶定位免费开放「船舶跟踪，功能，公众号实时推送靠离泊动态。
*核心功能优化1.船舶全轨迹追踪〇全球覆盖:接入AIS卫星数据，实时获取船舶位置、航速、航向〇全球覆盖:接入AIS卫星数据，实时获取船舶位置、航速、航向。〇全球覆盖:接入AIS卫星数据，实时获取船舶位置、航速、航向。〇全球覆盖:接入AIS卫星数据，实时获取船舶位置、航速、航向。
</div>
			    </el-carousel-item>
			  </el-carousel>
			  <div>
				 <div class="dialog-footer" style="text-align: right">
				 	<el-button type="primary" @click="handleClose">我知道了</el-button>
				 </div> 
			  </div>
		</el-dialog>
	</div>
</template>

<script setup>
	import {
		getData
	} from "@/api/company/send-and-receive";
	import {
		toRefs
	} from 'vue';
	const Emit= defineEmits(['update:openView'])
	const openView= ref(true)
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
		// listNotices().then(response => {
		// 	noticesList.value = response.data;
		// 	console.log(noticesList.value);
		// 	total.value = response.meta.total;
		// 	loading.value = false;
		// });
	}
	function handleClose(){
		Emit("update:openView", false);
	}
	
</script>

<style>
	.carousel-item::-webkit-scrollbar {
	  width: 0px !important;
	}
</style>
<style scoped>
	.title{
		font-size: 18px;
		text-align: center;
		color: #409EFF;
		padding: 10px 0;
		border-bottom: 1px solid #ccc;
		margin-bottom: 10px
	}
</style>
