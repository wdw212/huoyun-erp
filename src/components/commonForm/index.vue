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
											<!-- <common-form-item :ref="'formItem_'+index+ii" :item="vv"
											@changeValue="(val) => itemChange(val, item)"></common-form-item> -->
		
											<template v-if="vv.type=='input'">
												<el-input 
												v-model="saveData[vv.key]" 
												:style="vv.style||'width:100%'"
												:placeholder="vv.placeholder||'请输入'" clearable
												@input="changeValue" :disabled="vv.disabled"/>
											</template>
											<template v-if="vv.type=='textarea'">
												<el-input v-model="saveData[vv.key]" 
												type="textarea"
												:style="vv.style" :rows="4"
												:placeholder="vv.placeholder||'请输入'" clearable
												@input="changeValue" :disabled="vv.disabled"/>
											</template>
											<template v-if="vv.type=='date'">
												<el-date-picker v-model="saveData[vv.key]" 
												:style="vv.style||'width:100%'"
												:placeholder="vv.placeholder" 
												:value-format="vv.valueFormat||'YYYY-MM-DD'" 
												:type="vv.dateType||'daterange'" :disabled="vv.disabled"
												:start-placeholder="vv.startPlaceholder||'开始时间'" 
												:end-placeholder="vv.endPlaceholder||'结束时间'" 
												:range-separator="vv.rangeSeparator||'-'"  
												@change="changeValue"/>
											</template>
											<template v-if="vv.type=='dateTime'">
												<el-date-picker v-model="saveData[vv.key]" 
												:style="vv.style||'width:100%'"
												:placeholder="vv.placeholder" 
												:value-format="vv.valueFormat||'YYYY-MM-DD h:m:s'" 
												:format="vv.format||'YYYY-MM-DD HH:mm:ss'" 
												:type="vv.dateType||'datetime'" :disabled="vv.disabled"
												:start-placeholder="vv.startPlaceholder||'开始时间'" 
												:end-placeholder="vv.endPlaceholder||'结束时间'" 
												:range-separator="vv.rangeSeparator||'-'"  
												@change="changeValue"/>
											</template>
											<template v-if="vv.type=='select'">
												<el-select v-model="saveData[vv.key]" 
												:style="vv.style||'width:100%'"
												:placeholder="vv.placeholder||'请选择'" clearable
												:disabled="vv.disabled"
												@change="changeValue">
													<el-option v-for="vvv in vv.options" 
													:key="vv.keyName?vvv[vv.keyName]:'id'"
													:label="vv.labelName?vvv[vv.labelName]:vvv.label"
													:value="vv.valueName?vvv[vv.valueName]:vvv.value" />
												</el-select>
											</template>
											<template v-if="vv.type=='selectSearch'">
												<el-select v-model="saveData[vv.key]" 
												filterable
												:style="vv.style||'width:100%'"
												:disabled="vv.disabled"
												:multiple="vv.multiple" remote
												:placeholder="vv.placeholder||'请选择'"
												:reserve-keyword="vv.reserveKeyword"
												:remote-show-suffix="vv.remoteShowSuffix"
												:remote-method="(val)=>remoteMethod(val, vv)"
												:loading="vv.loading"
												@change="changeValue">
													<el-option v-for="vvv in vv.options"
													:key="vv.keyName?vvv[vv.keyName]:'id'"
													:label="vv.labelName?vvv[vv.labelName]:vvv.label"
													:value="vv.valueName?vvv[vv.valueName]:vvv.value" />
												</el-select>
											</template>
											
										</el-form-item>
									</template>
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
		dialogFormVisible.value = false;
		emit('cancel', saveData.value);
	}

	const changeValue = (val) => {
		// saveData.value[val.key] = val.value;
		console.log('itemChange', val, saveData.value);
	}

	onMounted(() => {
		resetKey(props.formList)
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