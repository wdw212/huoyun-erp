<template>
	<div>

		<el-dialog v-model="dialogFormVisible" title="单据详情" width="80%" :close-on-click-modal="false">
			<el-card>
				<el-form :model="saveData" :inline="true" label-width="auto" ref="formRef">
					<el-tabs v-model="activeName" @tab-click="tabsClick" v-if="tabsList.length>0">
						<el-tab-pane v-for="(item,index) in tabsList" :key="index" :label="item.label"
							:name="item.label"> </el-tab-pane>
					</el-tabs>
					<div v-for="(list,listIndex) in formList" :key="listIndex" v-show="activeName==list.tabName">
						<el-card v-for="(item,index) in list.formData" :key="index"
							:style="index==0?'':'margin-top: 20px'">
							<div style="padding-bottom: 10px;" v-if="item.label">{{item.label}}</div>
							<el-row :gutter="20">
								<el-col v-for="(vv,ii) in item.formItem" :key="vv.key" :span="vv.span||6">
									<el-form-item style="width: 100%;" :rules="vv.rules" :label="vv.label"
										:prop="vv.key" :label-width="vv.labelWidth">
										<common-form-item :item="vv" @changeValue="itemChange"></common-form-item>
									</el-form-item>
								</el-col>
							</el-row>
						</el-card>
					</div>
				</el-form>
			</el-card>
			<template #footer>
				<el-button type="primary" @click="handleClick">确认</el-button>
				<el-button @click="cancelClick">取消</el-button>
			</template>
		</el-dialog>

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
		btnShow: {
			type: Boolean,
			default: true
		},
	})

	const dialogFormVisible = ref(false);

	const activeName = ref('');
	const tabsList = ref([]);

	const saveData = ref({});
	watch(props.formList, (newVal) => {
		console.log('props.formList', newVal)
		resetKey();
	}, {
		deep: true
	})

	const resetKey = (reset) => {
		tabsList.value = [];
		props.formList.forEach((item, index) => {
			if (index == 0) {
				activeName.value = item.tabName;
			}
			tabsList.value.push({
				label: item.tabName,
				name: item.tabName
			})
			item.formData && item.formData.forEach((v, i) => {
				if (v.formItem && v.formItem.length > 0) {
					// console.log('v.formItem', v.formItem)
					v.formItem.forEach((vv, ii) => {
						if (saveData.value[vv.key] && !reset) {
							saveData.value[vv.key] = saveData.value[vv.key];
						} else {
							saveData.value[vv.key] = vv.defaultValue || vv.value || '';
						}
					})
				}
			})
		})
		// if(tabsList.value.length>1){
		// 	activeName.value = 1;
		// }
		console.log('saveData', saveData.value);
	}

	const tabsClick = (tab, val) => {
		activeName.value = val;
	}

	const handleClick = () => {
		proxy.$refs.formRef.validate((valid, fields) => {
			if (valid) {
				console.log('submit!')
				emit('confirm', saveData.value);
			} else {
				console.log('error submit!', fields)
			}
		})
	}

	const cancelClick = (val) => {
		resetKey(true);
		dialogFormVisible.value = false;
		emit('cancel', saveData.value);
	}

	const itemChange = (item, val) => {
		// console.log('itemChange', item, val);
		saveData.value[item.key] = val;
	}

	onMounted(() => {
		resetKey()
	})

	const emit = defineEmits(['confirm', 'cancel'])
	defineExpose({
		saveData,
		dialogFormVisible,
		resetKey
	})
</script>

<style>
</style>