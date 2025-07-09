<template>
	<div style="padding: 20px;">
		
		<slot name="headerCon"></slot>
		
		<div class="flex mb8">
			<div style="flex: 1;">
				<slot name="headerLeft"></slot>
			</div>
			<div class="flex">
				<slot name="headerRight"></slot>
				<right-toolbar @queryTable="getList" :columns="columns" v-show="toolbar"></right-toolbar>
			</div>
		</div>

		<el-table v-loading="loading" :data="tableData" @selection-change="handleSelectionChange" :row-key="rowKey"
			:size="size" :height="height" style="font-size: 12px;">
			<el-table-column type="selection" width="55" align="center" v-show="multiple" />
			<!-- <el-table-column label="序号" width="50" align="center" v-show="number">
				<template #default="scope">{{scope.row}}</template>
			</el-table-column> -->
			<template v-for="(item,index) in tableColumn" :key="index">
				<!-- 展示列 -->
				<el-table-column 
				v-if="item.prop!='actions'&&(!toolbar||(columns[index]&&columns[index].visible))" 
				:label="item.label" :align="item.align||'center'"
					:prop="item.prop" :width="item.width" :show-overflow-tooltip="item.tooltip||false"
					:formatter="item.formatter">
				</el-table-column>

				<!-- 操作列 -->
				<el-table-column v-if="item.prop=='actions'" :fixed="item.fixed"
				:label="item.label" :align="item.align||'center'" :width="item.width">
					<template #default="{row}">
						<action-buttons :row="row" :actions="item.actions" />
					</template>
				</el-table-column>
			</template>
		</el-table>

		<pagination v-show="pageShow&&pageInit.total>0" v-model:page="pageInit.page" :total="pageInit.total"
			v-model:limit="pageInit.pageSize" @pagination="getList" />

	</div>
</template>

<script setup>
	import {
		ref,
		defineProps,
		watch,
		defineExpose,
		defineEmits,
		onMounted,
		computed,
		defineComponent
	} from "vue";
	import SearchTop from "@/components/searchTop/index";
	import Pagination from "@/components/Pagination";
	import RightToolbar from "@/components/RightToolbar";
	import {
		ElButton
	} from 'element-plus'

	const props = defineProps({
		tableConfig: {},
		tableColumn: {
			type: Array,
			default: () => {
				return []
			}
		},
		multiple: {
			type: Boolean,
			default: true
		},
		pageShow: {
			type: Boolean,
			default: true
		},
		rowKey: {
			type: String,
			default: 'id'
		},
		size: {
			type: String,
			default: 'default'
		},
		height: {
			type: String,
			default: 'auto'
		},
		toolbar: {
			type: Boolean,
			default: false
		},
		number: {
			type: Boolean,
			default: true
		},
	})

	onMounted(() => {
		console.log('组件', props.tableColumn);
		if (props.tableConfig.isQuery) {
			if(props.toolbar){
				columnsInit();
			}
			getList();
		}
	})

	watch(props.tableConfig, (newVal) => {
		console.log('tableConfig变更', newVal);
		if (newVal.page) {
			pageInit.value = newVal.page;
		}
	}, {
		deep: true
	})


	const loading = ref(false);
	const tableData = ref([]);
	const pageInit = ref({
		page: 1,
		pageSize: 15,
		total: 0
	})

	function getList() {
		loading.value = true;
		var {
			url,
			requestMethod
		} = props.tableConfig;
		var params = {
			...pageInit.value,
			...props.tableConfig.data
		};
		requestMethod(url, params).then(res => {
			tableData.value = res.data;
			pageInit.value.total = res.meta.total;
			loading.value = false;
		});
	}

	// 定义独立的操作按钮组件
	const ActionButtons = defineComponent({
		props: {
			row: {
				type: Object,
				required: true
			},
			actions: {
				type: Object,
				required: true
			}
		},
		setup(props) {
			return () => h('div', {
					class: 'action-buttons'
				},
				props.actions.map((action, i) =>
					h(ElButton, {
						type: action.type,
						size: action.size,
						onClick: () => action.onClick(props.row),
						style: {
							marginRight: '10px'
						},
						key: i
					},
					() => action.label
				))
			)
		}
	})

	// 多选框选中数据
	function handleSelectionChange(selection) {
		var ids = selection.map(item => item.id);
		emit('selectionChange', {
			selection,
			ids
		});
	}
	
	const columns = ref([]);
	const columnsInit = () => {
		columns.value = [];
		props.tableColumn.forEach((item, index)=>{
			if(item.prop!='actions'){
				columns.value.push({
					key: index,
					label: item.label,
					visible: true
				})
			}
		})
	}

	const emit = defineEmits(['selectionChange'])
	defineExpose({

	})
</script>

<style scoped>
	.action-buttons {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px;
	}
	.flex{
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}
</style>