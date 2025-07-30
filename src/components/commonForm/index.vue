<template>
	<div>

		<el-form :model="saveData" :inline="true" label-width="auto" ref="formRef">
			<el-tabs v-model="activeName" @tab-click="tabsClick" v-if="tabsList.length>0&&tabShow">
				<el-tab-pane v-for="(item,index) in tabsList" :key="index" :label="item.label"
					:name="item.label"> </el-tab-pane>
			</el-tabs>
			<div v-for="(list,listIndex) in formList" :key="listIndex" v-show="activeName==list.tabName">
				<template v-for="(item,index) in list.formData" :key="index">
					<slot :name="item.soltName" :saveData="saveData" :formList="formList" v-if="item.noCard"></slot>
					<el-card :style="index==0?'':'margin-top: 20px'" v-if="!item.noCard">
						<div class="pb-1 flex1" v-if="item.label||item.soltLabel">
							<div v-if="item.label">{{item.label}}</div>
							<slot :name="item.soltLabel" :saveData="saveData" :formList="formList"></slot>
						</div>
						<slot :name="item.soltName" :saveData="saveData" :formList="formList"></slot>
						<el-row :gutter="20">
							<el-col v-for="(vv,ii) in item.formItem" :key="vv.key" :span="vv.span||6">
								<template v-if="vv.soltName">
									<slot :name="vv.soltName" :saveData="saveData" :formList="formList"></slot>
								</template>
								<template v-else>
									<el-form-item style="width: 100%;" :rules="vv.rules" :label="vv.label"
										:prop="vv.key" :label-width="vv.labelWidth||'auto'">
										
										<common-form-item :ref="'formItem_'+index+ii" :item="vv"
										:formValue="saveData[vv.key]"
										@changeValue="(val) => changeValue(val, item)"></common-form-item>
										
									</el-form-item>
								</template>
							</el-col>
						</el-row>
					</el-card>
				</template>
			</div>
			<el-row justify="end" class="pt-2" v-if="btnShow">
				<el-button type="primary" @click="handleClick">确认</el-button>
				<el-button @click="cancelClick">取消</el-button>
			</el-row>
		</el-form>

	</div>
</template>

<script setup>
	import commonFormItem from "@/components/commonForm/formItem";
	import {
		ref,
		defineProps,
		watch,
		defineExpose,
		defineEmits,
		onMounted
	} from "vue";
	
	const { proxy } = getCurrentInstance();

	const props = defineProps({
		formList: {
			type: Array,
			default: () => {
				return []
			}
		},
		tabShow: {
			type: Boolean,
			default: true
		},
		btnShow: {
			type: Boolean,
			default: true
		},
	})

	const activeName = ref('');
	const tabsList = ref([]);

	const saveData = ref({});
	watch(props.formList, (newVal) => {
		console.log('props.formList', newVal)
		resetKey(newVal);
	}, {
		deep: true
	})

	const resetKey = (formList, reset) => {
		tabsList.value = [];
		formList.forEach((item, index) => {
			if (index == 0) {
				activeName.value = item.tabName;
			}
			tabsList.value.push({
				label: item.tabName,
				name: item.tabName
			})
			item.formData && item.formData.forEach((v, i) => {
				if(v.key){
					saveData.value[v.key] = {};
				}
				if (v.formItem && v.formItem.length > 0) {
					v.formItem.forEach((vv, ii) => {
						if(!vv.key) return;
						if (saveData.value[vv.key]&&JSON.stringify(saveData.value[vv.key])!='[]'&&!reset) {
							saveData.value[vv.key] = saveData.value[vv.key];
						} else {
							saveData.value[vv.key] = vv.defaultValue || vv.value || '';
						}
						// console.log(vv.key, saveData.value[vv.key], vv.defaultValue)
					})
				}
			})
		})
		console.log('saveData', saveData.value);
	}

	const tabsClick = (tab, val) => {
		activeName.value = val;
	}
	
	const remoteMethod = async (val, vv) => {
		if(val){
			var methodType = vv.method=='get'?httpGet:httpPost;
			let res = await methodType(vv.url, {
				keyword: val
			});
			vv.options = res.data||[];
		}else{
			vv.options = [];
		}
	}

	const handleClick = () => {
		proxy.$refs.formRef.validate((valid, fields) => {
			if (valid) {
				emit('confirm', saveData.value);
			} else {
				console.log('error submit!', fields)
			}
		})
	}

	const cancelClick = (val) => {
		resetKey(props.formList, true);
		emit('cancel', saveData.value);
	}

	const changeValue = (val, item) => {
		saveData.value[val.key] = val.value;
		// console.log('itemChange', val, saveData.value);
		emit('itemChange', saveData.value);
	}

	onMounted(() => {
		console.log('commonForm', props);
		resetKey(props.formList)
	})

	const emit = defineEmits(['confirm', 'cancel', 'itemChange'])
	defineExpose({
		saveData,
		resetKey
	})
</script>

<style>
</style>