<template>
	<div>

		<el-form :model="saveData" :inline="true" label-width="auto" ref="formRef">
			<el-tabs v-model="activeName" @tab-click="tabsClick" v-if="tabsList.length>0&&tabShow">
				<el-tab-pane v-for="(item,index) in tabsList" :key="index" :label="item.label"
					:name="item.label"> </el-tab-pane>
			</el-tabs>
			<div v-for="(list,listIndex) in formList" :key="listIndex" v-show="activeName==list.tabName">
				<template v-for="(item,index) in list.formData" :key="index">
					<slot :name="item.soltName" :saveData="saveData" :formList="formList" 
					v-if="item.noCard&&!item.noShow"></slot>
					<el-card :style="index==0?'':'margin-top: 20px'" v-if="!item.noCard&&!item.noShow">
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
										
										<!-- {{saveData[vv.key]}} -->
										<!-- <common-form-item :ref="'formItem_'+index+ii" :item="vv"
										:formValue="saveData[vv.key]"
										@changeValue="(val) => changeValue(val, item)"></common-form-item> -->
										
										<el-popover placement="top-start" width="auto" :content="showContent"
										:disabled="saveData[vv.key]&&vv.popover?false:true" >
											<template #reference>
												<template v-if="vv.type=='input'">
													<el-input v-model="saveData[vv.key]" 
													:style="vv.style||'width:100%'"
													:placeholder="vv.placeholder||'请输入'"
													:clearable="vv.clearable"
													@input="changeValue($event, vv)" :disabled="vv.disabled"/>
												</template>
												<template v-if="vv.type=='textarea'">
													<el-input v-model="saveData[vv.key]" type="textarea"
													:style="vv.style" :rows="4"
													:placeholder="vv.placeholder||'请输入'"
													@input="changeValue($event, vv)" :disabled="vv.disabled"/>
												</template>
												<template v-if="vv.type=='date'">
													<el-date-picker v-model="saveData[vv.key]" :style="vv.style||'width:100%'"
													:placeholder="vv.placeholder" 
													:clearable="vv.clearable"
													:value-format="vv.valueFormat||'YYYY-MM-DD'" 
													:type="vv.dateType||'daterange'" :disabled="vv.disabled"
													:start-placeholder="vv.startPlaceholder||'开始时间'" 
													:end-placeholder="vv.endPlaceholder||'结束时间'" 
													:range-separator="vv.rangeSeparator||'-'"  
													@change="changeValue($event, vv)"/>
												</template>
												<template v-if="vv.type=='dateTime'">
													<el-date-picker v-model="saveData[vv.key]" :style="vv.style||'width:100%'"
													:placeholder="vv.placeholder" 
													:clearable="vv.clearable"
													:value-format="vv.valueFormat||'YYYY-MM-DD h:m:s'" 
													:format="vv.format||'YYYY-MM-DD HH:mm:ss'" 
													:type="vv.dateType||'datetime'" :disabled="vv.disabled"
													:start-placeholder="vv.startPlaceholder||'开始时间'" 
													:end-placeholder="vv.endPlaceholder||'结束时间'" 
													:range-separator="vv.rangeSeparator||'-'"  
													@change="changeValue($event, vv)"/>
												</template>
												<template v-if="vv.type=='select'">
													<el-select v-model="saveData[vv.key]" :style="vv.style||'width:100%'"
													:placeholder="vv.placeholder||'请选择'"
													:clearable="vv.clearable"
													:disabled="vv.disabled"
													@change="changeValue($event, vv)">
														<el-option v-for="v in vv.options" 
														:key="vv.keyName?v[vv.keyName]:'id'"
														:label="vv.labelName?v[vv.labelName]:v.label"
														:value="vv.valueName?v[vv.valueName]:v.value" />
													</el-select>
												</template>
												<template v-if="vv.type=='selectSearch'">
													<el-select v-model="saveData[vv.key]" filterable
													:style="vv.style||'width:100%'"
													:disabled="vv.disabled"
													:clearable="vv.clearable"
													:multiple="vv.multiple" remote
													:placeholder="vv.placeholder||'请选择'"
													:reserve-keyword="vv.reserveKeyword"
													:remote-show-suffix="vv.remoteShowSuffix"
													:remote-method="remoteMethod"
													:loading="vv.loading"
													@change="changeValue($event, vv)">
														<el-option v-for="v in vv.options"
														:key="vv.keyName?v[vv.keyName]:'id'"
														:label="vv.labelName?v[vv.labelName]:v.label"
														:value="vv.valueName?v[vv.valueName]:v.value" />
													</el-select>
												</template>
											</template>
										</el-popover>
										
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
	watch(props.formList, (newVal) => {
		console.log('props.formList', newVal)
		resetKey(newVal, false, true);
	}, {
		deep: true
	})

	const activeName = ref('');
	const tabsList = ref([]);

	const saveData = reactive([]);
	watch(saveData, (newVal) => {
		console.log('watch-saveData', newVal)
	}, {
		deep: true
	})

	const resetKey = (formList, reset, isTab) => {
		if(!isTab){
			tabsList.value = [];
		}
		var data = JSON.parse(JSON.stringify(saveData));
		formList.forEach((item, index) => {
			if(!isTab){
				if (index == 0) {
					activeName.value = item.tabName;
				}
				tabsList.value.push({
					label: item.tabName,
					name: item.tabName
				})
			}
			
			item.formData && item.formData.forEach((v, i) => {
				if(v.key){
					data[v.key] = {};
				}
				if (v.formItem && v.formItem.length > 0) {
					v.formItem.forEach((vv, ii) => {
						if(!vv.key) return;
						if (saveData[vv.key]&&JSON.stringify(saveData[vv.key])!='[]'&&!reset) {
							data[vv.key] = saveData[vv.key];
						} else {
							data[vv.key] = vv.defaultValue || vv.value || '';
						}
					})
				}
			})
		})
		Object.assign(saveData, data);
		console.log('saveData', saveData);
	}

	const tabsClick = (tab, val) => {
		activeName.value = val;
	}
	
	const remoteMethod = async (val, vv) => {
		console.log('val, vv', val, vv)
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
				var data = {}
				for(var key in saveData){
					if(key.indexOf('.')>-1){
						var keys = key.split('.');
						if(!data[keys[0]]){
							data[keys[0]] = {};
						}
						data[keys[0]][keys[1]] = saveData[key];
					}else{
						data[key] = saveData[key];
					}
				}
				delete data['undefined'];
				emit('confirm', data);
			} else {
				console.log('error submit!', fields)
				proxy.$modal.msgWarning("请完善必填信息！");
			}
		})
	}

	const cancelClick = (val) => {
		resetKey(props.formList, true);
		var data = JSON.parse(JSON.stringify(saveData));
		delete data['undefined'];
		emit('cancel', data);
	}

	const changeValue = (val, item) => {
		var data = JSON.parse(JSON.stringify(saveData));
		data[item.key] = val;
		Object.assign(saveData, data);
		// console.log('itemChange', val, saveData);
		emit('itemChange', data);
	}

	const changeSave = (val) => {
		var data = JSON.parse(JSON.stringify(saveData));
		for(var key in val){
			if(key&&key!=undefined){
				data[key] = val[key];
			}
		}
		Object.assign(saveData, data);
		console.log('changeSave-回显', saveData);
	}

	onMounted(() => {
		console.log('commonForm', props);
		resetKey(props.formList)
	})

	const emit = defineEmits(['confirm', 'cancel', 'itemChange'])
	defineExpose({
		saveData,
		resetKey,
		changeSave
	})
</script>

<style>
</style>