<template>
	<div style="width: 100%;">
		<el-popover placement="top-start" width="auto" :content="showContent"
		:disabled="saveData&&newItem.popover?false:true" >
			<template #reference>
				<template v-if="newItem.type=='input'">
					<el-input v-model="saveData" 
					:style="newItem.style||'width:100%'"
					:placeholder="newItem.placeholder||'请输入'"
					:clearable="newItem.clearable"
					@input="changeValue" :disabled="newItem.disabled"/>
				</template>
				<template v-if="newItem.type=='textarea'">
					<el-input v-model="saveData" type="textarea"
					:style="newItem.style" :rows="4"
					:placeholder="newItem.placeholder||'请输入'"
					@input="changeValue" :disabled="newItem.disabled"/>
				</template>
				<template v-if="newItem.type=='date'">
					<el-date-picker v-model="saveData" :style="newItem.style||'width:100%'"
					:placeholder="newItem.placeholder" 
					:clearable="newItem.clearable"
					:value-format="newItem.valueFormat||'YYYY-MM-DD'" 
					:type="newItem.dateType||'daterange'" :disabled="newItem.disabled"
					:start-placeholder="newItem.startPlaceholder||'开始时间'" 
					:end-placeholder="newItem.endPlaceholder||'结束时间'" 
					:range-separator="newItem.rangeSeparator||'-'"  
					@change="changeValue"/>
				</template>
				<template v-if="newItem.type=='dateTime'">
					<el-date-picker v-model="saveData" :style="newItem.style||'width:100%'"
					:placeholder="newItem.placeholder" 
					:clearable="newItem.clearable"
					:value-format="newItem.valueFormat||'YYYY-MM-DD h:m:s'" 
					:format="newItem.format||'YYYY-MM-DD HH:mm:ss'" 
					:type="newItem.dateType||'datetime'" :disabled="newItem.disabled"
					:start-placeholder="newItem.startPlaceholder||'开始时间'" 
					:end-placeholder="newItem.endPlaceholder||'结束时间'" 
					:range-separator="newItem.rangeSeparator||'-'"  
					@change="changeValue"/>
				</template>
				<template v-if="newItem.type=='select'">
					<el-select v-model="saveData" :style="newItem.style||'width:100%'"
					:placeholder="newItem.placeholder||'请选择'"
					:clearable="newItem.clearable"
					:disabled="newItem.disabled"
					@change="changeValue">
						<el-option v-for="vv in newItem.options" 
						:key="newItem.keyName?vv[newItem.keyName]:'id'"
						:label="newItem.labelName?vv[newItem.labelName]:vv.label"
						:value="newItem.valueName?vv[newItem.valueName]:vv.value" />
					</el-select>
				</template>
				<template v-if="newItem.type=='selectSearch'">
					<el-select v-model="saveData" filterable
					:style="newItem.style||'width:100%'"
					:disabled="newItem.disabled"
					:clearable="newItem.clearable"
					:multiple="newItem.multiple" remote
					:placeholder="newItem.placeholder||'请选择'"
					:reserve-keyword="newItem.reserveKeyword"
					:remote-show-suffix="newItem.remoteShowSuffix"
					:remote-method="remoteMethod"
					:loading="newItem.loading"
					@change="changeValue">
						<el-option v-for="vv in newItem.options"
						:key="newItem.keyName?vv[newItem.keyName]:'id'"
						:label="newItem.labelName?vv[newItem.labelName]:vv.label"
						:value="newItem.valueName?vv[newItem.valueName]:vv.value" />
					</el-select>
				</template>
			</template>
		</el-popover>
	</div>
</template>

<script setup>
	import {
		ref,
		defineProps,
		watch,
		defineExpose,
		defineEmits,
		onMounted
	} from "vue";
	import {
		Calendar,
		Search
	} from '@element-plus/icons-vue'
	import {
		httpPost,
		httpGet
	} from '@/api/apiCommon';

	const props = defineProps({
		item: {
			type: Object,
			default: () => {
				return {}
			}
		},
		formValue: ''
	})

	const saveData = ref(null);
	const newItem = ref({});
	watch(props.item, (newVal) => {
		console.log('formItem.item', newVal);
		newItem.value = newVal;
		newItem.value.clearable = newVal.clearable != '' ? newVal.clearable : true;
		resetKey();
	}, {
		deep: true
	})
	watch(props.formValue, (newVal) => {
		console.log('formItem.formValue', newVal);
		saveData.value = props.formValue;
	}, {
		deep: true
	})
	
	const updateValue = (val) => {
		saveData.value = val;
		console.log('updateValue-formItem数据回显', saveData.value);
	}

	const updateItem = (item) => {
		newItem.value = item;
		resetKey();
		// console.log('updateItem', newItem.value);
	}

	const resetKey = (reset) => {
		// saveData.value = newItem.value.defaultValue || newItem.value.value || '';
		saveData.value = props.formValue;
		// console.log('formItem', saveData.value);
	}

	const remoteMethod = async (val) => {
		if (val) {
			var methodType = newItem.value.method == 'get' ? httpGet : httpPost;
			let res = await methodType(newItem.value.url, {
				keyword: val
			});
			newItem.value.options = res.data || [];
		} else {
			newItem.value.options = [];
		}
	}

	const showContent = ref('');
	const changeValue = (val) => {
		var newItems = {
			...newItem.value
		};
		newItems.value = val;
		
		if(newItem.value.type=='select'||newItem.value.type=='selectSearch'){
			var data = newItem.value.options.find((vv)=>{
				if(newItem.value.valueName){
					return val==vv[newItem.value.valueName]
				}else{
					return val==vv.value
				}
			})
			showContent.value = newItem.value.labelName?data[newItem.value.labelName]:data.label;
		}else{
			showContent.value = saveData.value;
		}
		// console.log('newItems', newItems);
		emit('changeValue', newItems);
	}

	onMounted(() => {
		newItem.value = props.item;
		// console.log('formItem', props);
		resetKey()
	})

	const emit = defineEmits(['changeValue'])
	defineExpose({
		updateItem,
		updateValue
	})
</script>

<style>
</style>