<template>
	<el-select v-model="innerValue" placeholder="请选择" filterable clearable multiple>
		<el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" :disabled="item.select"/>
	</el-select>
</template>

<script setup>
	import useUserStore from "@/store/modules/user";
	import {
				listUser as userListData
			} from "@/api/system/user";
	const Emit = defineEmits(['update:value'])
	const options= ref([])
	const userStore = useUserStore();  //vuex缓存的用户信息
	// const innerValue = ref([])
	const props  = defineProps({
		userType: {  //角色  OPERATE 操作  DOCUMENT  单证
		  type: String,
		  default: ''
		},
		value: {
			type: Array,
			default: [],	
		},
		btnType: {
			type: String,
			default: '',	
		},
		// 共享人逻辑处理
		// userRoleType: {
		// 	type: Number
		// }
	}) 
	// 计算 props 的属性变化，同步本地值
	const innerValue = computed({
		get:()=>{return props.value},
		set:(val)=>{Emit("update:value", val)}
	});
	function userDataSelect(){
		userListData({
			is_paginate: 0,
			code: props.userType? props.userType: ''
		}).then(response => {
			options.value= response.data
			if(userStore.userRoleCode === props.userType && options.value && options.value.length>0){
				options.value.forEach(item =>{
					if(item.id=== userStore.id){
						if(props.btnType === 'add'){
							innerValue.value.push(item.id)
							console.log(item.id,'item.id')
						}
						item.select= true
					}else{
						item.select= false
					}
				})
				console.log(innerValue.value,'innerValue.value')
				console.log(options.value,'options.value')
			}
		}).catch(() =>{})
		.finally(()=>{})
	}
	userDataSelect()
</script>

<style>
</style>