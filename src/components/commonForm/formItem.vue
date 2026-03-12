<template>
	<div style="width: 100%;">
		<el-popover placement="top" width="auto" effect="dark"
		:disabled="saveData!== null&&saveData!=''&&newItem.popover?false:true"  >
			<template #default>
				<pre>{{ showContent || normalizeSelectSnapshotValue(saveData) }}</pre>
			</template>
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
					:resize="newItem.resize||'vertical'"
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
					:filterable="newItem.filterable"
					:value-key="newItem.keyName || newItem.valueName || 'id'"
					@visible-change="handleSelectVisibleChange"
					@change="changeValue">
						<template #label="{ label, value }">
					        <span v-if="newItem.showLabel&&newItem.showLabel=='label'">{{ label }}</span>
					        <span v-else>{{ value }}</span>
					    </template>
						<el-option v-for="(vv, vIndex) in newItem.options" 
						:key="newItem.keyName ? vv[newItem.keyName] : (newItem.valueName ? vv[newItem.valueName] : (vv.value ?? vIndex))"
						:label="newItem.labelName?vv[newItem.labelName]:vv.label"
						:value="newItem.valueName?vv[newItem.valueName]:vv.value">
							<div :class="['snapshot-select-option', { 'is-snapshot': vv.__snapshotOption }]">
								<span class="snapshot-select-option__name">
									{{ newItem.labelName ? vv[newItem.labelName] : vv.label }}
								</span>
								<span
									v-if="vv.__snapshotOption"
									class="snapshot-select-option__tag is-snapshot"
								>
									{{ vv.__snapshotTagLabel || '历史快照' }}
								</span>
							</div>
						</el-option>
					</el-select>
				</template>
				<template v-if="newItem.type=='button'">
					<div style="display: flex;justify-content: center;">
						<block v-for="(vv, ii) in newItem.options" :key="newItem.valueName?vv[newItem.valueName]:vv.value" >
							<el-button v-show="(newItem.valueName&&saveData==vv[newItem.valueName])||saveData==vv.value"
							:disabled="newItem.disabled||vv.disabled" 
							:type="vv.btnType" :size="vv.size||'small'"
							@click="changeButton(ii)" >{{ newItem.labelName?vv[newItem.labelName]:vv.label }}</el-button>
						</block>
					</div>
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
					@visible-change="handleSelectVisibleChange"
					@change="changeValue">
						<template #label="{ label, value }">
					        <span v-if="newItem.showLabel&&newItem.showLabel=='label'">{{ label }}</span>
					        <span v-else>{{ value }}</span>
					    </template>
						<el-option v-for="(vv, vIndex) in newItem.options"
						:key="newItem.keyName ? vv[newItem.keyName] : (newItem.valueName ? vv[newItem.valueName] : (vv.value ?? vIndex))"
						:label="newItem.labelName?vv[newItem.labelName]:vv.label"
						:value="newItem.valueName?vv[newItem.valueName]:vv.value">
							<div :class="['snapshot-select-option', { 'is-snapshot': vv.__snapshotOption }]">
								<span class="snapshot-select-option__name">
									{{ newItem.labelName ? vv[newItem.labelName] : vv.label }}
								</span>
								<span
									v-if="vv.__snapshotOption"
									class="snapshot-select-option__tag is-snapshot"
								>
									{{ vv.__snapshotTagLabel || '历史快照' }}
								</span>
							</div>
						</el-option>
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
	import {
		buildSelectSnapshotOption,
		isSelectSnapshotToken,
		normalizeSelectSnapshotValue,
	snapshotToComparable
} from '@/utils/selectSnapshot';

	const props = defineProps({
		item: {
			type: Object,
			default: () => {
				return {}
			}
		},
		formValue: {
			type: String,
			default: () => {
				return ''
			}
		},
		rowData: {
			type: Object,
			default: () => {
				return {}
			}
		},
	})

	const saveData = ref(null);
	const newItem = ref({});
	const showContent = ref('');
	const snapshotState = ref({
		token: '',
		originValue: '',
		label: '',
		rowIdentity: '',
		dismissed: false,
	});
	const buildItemClone = (item = {}) => ({
		...item,
		options: Array.isArray(item.options) ? [...item.options] : [],
	});
	const getOptionValue = (option) => {
		if (!option) return undefined;
		return newItem.value.valueName ? option[newItem.value.valueName] : option.value;
	};
	const getOptionLabel = (option) => {
		if (!option) return '';
		return newItem.value.labelName ? option[newItem.value.labelName] : option.label;
	};
	const getRowSnapshotLabel = () => {
		const snapshotLabelKey = newItem.value.snapshotLabelKey;
		if (!snapshotLabelKey) return '';
		return (props.rowData?.[snapshotLabelKey] ?? '').toString().trim();
	};
	const getRowIdentity = () => {
		if (props.rowData?.id !== undefined && props.rowData?.id !== null) {
			return String(props.rowData.id);
		}
		return `${newItem.value.key || 'snapshot'}::${getRowSnapshotLabel()}`;
	};
	const syncDisplayContent = (rawValue = saveData.value, options = newItem.value.options) => {
		if (newItem.value.type === 'select' || newItem.value.type === 'selectSearch') {
			const normalizedValue = normalizeSelectSnapshotValue(rawValue);
			const displayOptions = Array.isArray(options) ? options : [];
			const matchedOption = displayOptions.find((option) => (
				snapshotToComparable(getOptionValue(option)) === snapshotToComparable(rawValue)
			)) || displayOptions.find((option) => (
				snapshotToComparable(getOptionValue(option)) === snapshotToComparable(normalizedValue)
			));
			if (matchedOption) {
				showContent.value = getOptionLabel(matchedOption) || '';
				return;
			}
			if (isSelectSnapshotToken(rawValue)) {
				showContent.value = getRowSnapshotLabel() || normalizedValue || '';
				return;
			}
			showContent.value = normalizedValue || '';
			return;
		}
		showContent.value = rawValue || '';
	};
	const syncSelectSnapshotDisplay = () => {
		if (!['select', 'selectSearch'].includes(newItem.value.type)) {
			return;
		}
		const snapshotLabel = getRowSnapshotLabel();
		const normalizedValue = normalizeSelectSnapshotValue(props.formValue);
		const rowIdentity = getRowIdentity();
		if (
			rowIdentity !== snapshotState.value.rowIdentity ||
			snapshotLabel !== snapshotState.value.label
		) {
			snapshotState.value = {
				token: '',
				originValue: normalizedValue,
				label: snapshotLabel,
				rowIdentity,
				dismissed: false,
			};
		}
		const sourceOriginValue = snapshotState.value.originValue;
		const displayOptions = Array.isArray(newItem.value.options) ? [...newItem.value.options] : [];
		if (
			!snapshotLabel ||
			snapshotState.value.dismissed ||
			snapshotToComparable(normalizedValue) !== snapshotToComparable(sourceOriginValue)
		) {
			saveData.value = props.formValue;
			newItem.value.options = displayOptions.filter((option) => !option?.__snapshotOption);
			syncDisplayContent(saveData.value, newItem.value.options);
			return;
		}
		const snapshotMeta = buildSelectSnapshotOption({
			fieldKey: newItem.value.key || 'snapshot',
			originValue: sourceOriginValue,
			snapshotLabel,
			options: displayOptions.filter((option) => !option?.__snapshotOption),
			valueKey: newItem.value.valueName || 'value',
			labelKey: newItem.value.labelName || 'label',
		});
		if (!snapshotMeta) {
			saveData.value = props.formValue;
			newItem.value.options = displayOptions.filter((option) => !option?.__snapshotOption);
			syncDisplayContent(saveData.value, newItem.value.options);
			return;
		}
		newItem.value.options = [
			snapshotMeta.option,
			...displayOptions.filter((option) => !option?.__snapshotOption),
		];
		snapshotState.value.token = snapshotMeta.token;
		saveData.value = snapshotMeta.token;
		syncDisplayContent(saveData.value, newItem.value.options);
	};
	watch(props.item, (newVal) => {
		// console.log('formItem.item', newVal);
		newItem.value = buildItemClone(newVal);
		newItem.value.clearable = newVal.clearable != '' ? newVal.clearable : true;
		resetKey();
		syncSelectSnapshotDisplay();
	}, {
		deep: true
	})
	watch(()=>props.formValue, (newVal) => {
		// console.log('formItem.formValue', newVal);
		saveData.value = props.formValue;
		syncSelectSnapshotDisplay();
	}, {
		deep: true, immediate: true
	})
	watch(() => props.rowData, () => {
		syncSelectSnapshotDisplay();
	}, {
		deep: true
	})
	
	const updateValue = (val) => {
		saveData.value = val;
		syncSelectSnapshotDisplay();
		// console.log('updateValue-formItem数据回显', saveData.value);
	}

	const updateItem = (item) => {
		newItem.value = buildItemClone(item);
		resetKey();
		syncSelectSnapshotDisplay();
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
			syncSelectSnapshotDisplay();
		} else {
			newItem.value.options = [];
			syncSelectSnapshotDisplay();
		}
	}
	const handleSelectVisibleChange = async (visible) => {
		if (typeof newItem.value.onVisibleChange === 'function') {
			await newItem.value.onVisibleChange(visible, newItem.value, props.rowData);
		}
		if (!visible || !newItem.value.snapshotLoadOnVisible || !newItem.value.url) {
			syncSelectSnapshotDisplay();
			return;
		}
		var methodType = newItem.value.method == 'get' ? httpGet : httpPost;
		let res = await methodType(newItem.value.url, {
			is_paginate: 0
		});
		newItem.value.options = res.data || [];
		syncSelectSnapshotDisplay();
	}
	
	const changeButton = (index) => {
		var newItems = {
			...newItem.value
		};
		var key = newItems.valueName||'value';
		if(index==newItems.options.length-1){
			newItems.value = newItems.options[0][key];
		}else{
			newItems.value = newItems.options[index+1][key];
		}
		saveData.value = newItems.value
		console.log('按钮数据', saveData.value, index)
		emit('changeButton', newItems);
	}

	const changeValue = (val) => {
		var newItems = {
			...newItem.value
		};
		if(newItems.inputType){  //输入框禁止输入类型
			if (newItems.inputType == 1) {  //英文自动大写，不要输入中文
				newItems.value = val.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
			} else if (newItems.inputType == 2) {   //英文自动大写，+-*/空格，不要输入中文
				newItems.value = val.replace(/[^a-zA-Z0-9\+\-\*\s]/g, "").toUpperCase();
			} else if (newItems.inputType == 3) {   //只能输入数字和.
				newItems.value = val.replace(/[^0-9\.]/g, "").toUpperCase();
			}
		}else{
			newItems.value = ['select', 'selectSearch'].includes(newItem.value.type)
				? normalizeSelectSnapshotValue(val)
				: val;
		}
		if (['select', 'selectSearch'].includes(newItem.value.type)) {
			if (isSelectSnapshotToken(val)) {
				snapshotState.value.dismissed = false;
			} else {
				snapshotState.value.dismissed = snapshotToComparable(newItems.value) === snapshotToComparable(snapshotState.value.originValue);
			}
		}
		saveData.value = val
		
		syncDisplayContent(saveData.value, newItem.value.options);
		// console.log('newItems', newItems);
		emit('changeValue', newItems);
	}

	onMounted(() => {
		newItem.value = buildItemClone(props.item);
		// console.log('formItem', props);
		resetKey()
		syncSelectSnapshotDisplay();
	})

	const emit = defineEmits(['changeValue','changeButton'])
	defineExpose({
		updateItem,
		updateValue
	})
</script>

<style>
	pre{margin: 0;}
	.snapshot-select-option {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		width: 100%;
	}
	.snapshot-select-option__name {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.snapshot-select-option__tag {
		flex: none;
		padding: 2px 8px;
		border-radius: 999px;
		background: #fff3cd;
		color: #c67a00;
		font-size: 12px;
		line-height: 1.2;
	}
	.snapshot-select-option.is-snapshot {
		color: #c67a00;
		font-weight: 600;
	}
</style>
