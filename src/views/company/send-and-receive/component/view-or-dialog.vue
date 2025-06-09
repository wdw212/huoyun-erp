<template>
	<div>
		<el-dialog :title="props.title" v-model="openView" :destroy-on-close='true' width="60%" @close='handleClose'>
			<edit ref="editDom" :btnType.sync='props.btnType' :model.sync='modalModel' @handleCancle='handleCancle'></edit>
			<!-- <crontab ref="crontabRef" @hide="openCron=false" @fill="crontabFill" :expression="expression"></crontab> -->
		</el-dialog>
	</div>
</template>

<script setup>
	import Edit from './edit'
	import {
		getData
	} from "@/api/company/send-and-receive";
	import {
		toRefs
	} from 'vue';
	const Emit= defineEmits(['refresh','cancel'])
	const {
		proxy
	} = getCurrentInstance()
	const props  = defineProps({
		btnType: {
		  type: String,
		  default: 'add'
		},
		openView: {
			type: Boolean,
			default: false,	
		},
		model: {
			type: Object,
			validator: (value) => value == null
		},
		// 弹框名称
		title: {
		  type: String,
		  default: ''
		},
	})
	const modalModel = ref(null);
	watch(()=>props.model,(newValue,oldValue)=>{
		if(newValue){
			if(props.btnType !== 'add'){
				getDataList(newValue.id)
			}
		}
		console.log('workOrder变化了',newValue,oldValue)
	},{immediate:true,deep:true})
	
	
	function getDataList(id){
		getData(id).then(response => {
			modalModel.value= response
		});
	}
	
	// 关闭弹框
	function handleClose(){
		modalModel.value= null
		Emit('cancel')
	}
	const cancel = () =>{
		modalModel.value= null
	    Emit('cancel')
	  // openView.value= false
	}
	const handleCancle = () =>{
		modalModel.value= null
		Emit('cancel')
		Emit('refresh')
	}
	const { openView } = toRefs(props);
</script>

<style>
</style>
