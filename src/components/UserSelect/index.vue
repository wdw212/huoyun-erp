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
import { watch,onMounted} from "vue";
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
		// 1.新增-创建人在共享下拉中，默认创建人为共享人；创建人不在共享下拉中，共享下拉校验必填
		// 2.修改   1.通用：创建人或者其他权限者（有所有人权限的部门例如：超管/财务）可以编辑创建人的共享权限，其他共享人任意编辑其他的共享权限，但至少保留一人 
		//          2. 收发通-未确认-共享人可以删除全部共享权限，但最少保留一人
		//             确认人-最高权限和确认人可以删除确认人共享权限，其他人可操作除确认人之外的其他人
		// 当前默认选中并且不可编辑的人员id数组
		roleTypeUserIdList: {
			type: Array,
			validator: (value) => value == null
		}
	}) 
	const { roleTypeUserIdList } = toRefs(props)
	// 计算 props 的属性变化，同步本地值
	// const innerValue = computed({
	// 	get:()=>{return props.value?props.value: []},
	// 	set:(val)=>{Emit("update:value", val)}
	// });
	const innerValue = ref(props.value || []);
	watch(() => props.value, (newVal) => {
	  innerValue.value = newVal || [];
	});
	
	watch(innerValue, (newVal) => {
	  Emit("update:value", newVal);
	}, { deep: true });
	watchEffect(() => {
	  if (props.btnType !== 'add'){
		  if (props.roleTypeUserIdList && options.value) {
		    options.value = options.value.map(item => ({
		      ...item,
		      select: props.roleTypeUserIdList.includes(item.id)
		    }))
		  }
	  }else{
		  // console.log(options.value.find(item =>item.id=== userStore.id).id,'options.value.find(item =>item.id=== userStore.id).id')
		  // if(options.value && options.value.length>0){
		  		if(userStore.userRoleCode === props.userType && props.btnType === 'add'){
		  			if(options.value.find(item =>item.id=== userStore.id)){
						console.log(options.value.find(item =>item.id=== userStore.id).id,'options.value.find(item =>item.id=== userStore.id).id')
		  				innerValue.value[0]= options.value.find(item =>item.id=== userStore.id).id
		  				options.value.find(item =>item.id=== userStore.id).select= true
		  			}
		  		}		
		  	// }
	  }
	  console.log(props.btnType,'props.btnType')
	  
	})
	function userDataSelect(){
		userListData({
			is_paginate: 0,
			code: props.userType? props.userType: ''
		}).then(response => {
			console.log(1111)
			options.value= response.data
		}).catch(() =>{})
		.finally(()=>{})
	}
	onMounted(()=>{
		userDataSelect()
	})
</script>

<style>
</style>