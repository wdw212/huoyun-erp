<template>
	<div id="tableList">

		<slot name="headerCon"></slot>

		<div class="flex">
			<div style="flex: 1;">
				<slot name="headerLeft"></slot>
			</div>
			<div class="flex">
				<slot name="headerRight"></slot>
				<right-toolbar @queryTable="queryTable" :columns="columns" v-show="toolbar" :toolbarRowReset='toolbarRowReset'></right-toolbar>
			</div>
		</div>

		<el-table v-loading="loading" :data="state.tableData" @selection-change="handleSelectionChange"
			:row-key="rowKey" :max-height="height" :border="border" :size="size"
			:row-class-name="(row,rowIndex)=>tableRowClassName(row,rowIndex)"
			:cell-class-name="(val)=>cellClassName(val)" 
			:show-summary="showSummary"
			@row-click="rowClick" @cell-click="cellClick"
			style="font-size: 12px;"
			:summary-method="getSummaries">
			<el-table-column type="selection" width="55" align="center" v-if="multiple" />
			<el-table-column label="序号" width="55" align="center" v-if="number" type="index"></el-table-column>
			<template v-for="(item,index) in tableColumn" :key="index">
				<!-- 操作列 -->
				<el-table-column v-if="item.type=='edit'&&!item.noShow" :fixed="item.fixed" :label="item.label"
					:align="item.align||'center'" :width="item.width">
					<template #default="{row,$index}">
						<common-form-item :item="item.form" v-model:formValue="row[item.prop]"
							@changeValue="(val)=>itemChange(val, $index)"></common-form-item>
					</template>
					<template #header>
						<slot :name="'table_'+item.prop"></slot>
					</template>
				</el-table-column>

				<!-- 操作按钮列 -->
				<el-table-column v-else-if="!item.noShow&&item.prop=='actions'" :fixed="item.fixed"
					class-name="actionsBtn" :label="item.label" :align="item.align||'center'" :width="item.width">
					<template #default="{row,$index}" >
						<action-buttons :row="row" :index="$index" :actions="item.actions" />
					</template>
				</el-table-column>

				<!-- 展示列 -->
				<el-table-column
					v-else-if="!item.noShow&&item.prop!='actions'&&(!toolbar||(toolbar&&columns[index]&&columns[index].visible))"
					:label="item.label" :align="item.align||'center'" :prop="item.prop" :width="item.width"
					:show-overflow-tooltip="item.tooltip||false" :formatter="item.formatter">
					<template #default="{row,$index}" v-if="item.render">
						<column-render :row="row" :index="$index" :render="item.render" />
					</template>
				</el-table-column>

			</template>
		</el-table>

		<pagination v-show="pageShow&&pageInit.total>0" v-model:page="pageInit.page" :total="pageInit.total"
			v-model:limit="pageInit.page_size" @pagination="getList" />

		<slot name="bottomCon" :tableData="state.tableData"></slot>

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
		defineComponent,
		nextTick
	} from "vue";
	import SearchTop from "@/components/searchTop/searchTop";
	import Pagination from "@/components/Pagination";
	import RightToolbar from "@/components/RightToolbar";
	import {
		ElButton
	} from 'element-plus'
	import commonFormItem from "@/components/commonForm/formItem";
	import {
		httpPost,
		httpGet
	} from '@/api/apiCommon';
	import useTableMenuStore from "@/store/modules/tableMenu";

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
			default: '550'
		},
		toolbar: {
			type: Boolean,
			default: false
		},
		number: {
			type: Boolean,
			default: false
		},
		border: {
			type: Boolean,
			default: false
		},
		showSummary: {
			type: Boolean,
			default: false
		},
		toolbarRowReset: {
			type: Boolean,
			default: true
		},
		summaryFields: {
			type: Array,
			default: () => ['']
		},
		summaryMethod: Function,
		summaryText: {
		  type: String,
		  default: '合计'
		}
	})

	const tableRowClassName = ({row, rowIndex}) => {
		if(props.tableConfig.tableRowClassName){
			return props.tableConfig.tableRowClassName(row, rowIndex)
		}
		return '';
	};
	const cellClassName = ({row,column,rowIndex,columnIndex}) => {
		if(props.tableConfig.cellClassName){
			return props.tableConfig.cellClassName(row,column,rowIndex,columnIndex)
		}
		return '';
	};
	
	function rowClick(row, column){
		emit('rowClick', {row, column});
	}
	
	function cellClick(row, column){
		emit('cellClick', {row, column});
	}

	onMounted(() => {
		// console.log('tableColumn', props.tableColumn);
		Object.assign(state.tableData, []);
		if (props.tableConfig.isQuery) {
			init();
		}
	})

	watch(props.tableConfig, (newVal) => {
		// console.log('tableConfig变更', newVal);
		if (newVal.page) {
			pageInit.value = newVal.page;
		}
		if (newVal.isQuery) {
			init();
		}
	}, {
		deep: true
	})
	function init() {
		if (props.toolbar) {
			columnsInit();
		}
		getList();
	}

	const loading = ref(false);
	const state = reactive({
		tableData: []
	});
	const pageInit = ref({
		page: 1,
		page_size: 15,
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
			// Object.assign(state.tableData, res.data);
			// nextTick(()=>{
				state.tableData= res.data
			// })
			pageInit.value.total = res.meta.total;
			loading.value = false;
		});
	}

	// 多选框选中数据
	function handleSelectionChange(selection) {
		var ids = selection.map(item => item.id);
		emit('selectionChange', {
			selection,
			ids
		});
	}

	// const tableMenu = useTableMenuStore(); //缓存中的列表设置数据vuex
	const tableMenu = JSON.parse(localStorage.getItem('tableMenu')||'{}'); //缓存中的列表设置数据
	const route = useRoute();

	const columns = ref([]);
	const columnsInit = (reset) => {
		columns.value = [];
		// console.log('tableMenu', route.name, tableMenu);
		if (!reset && tableMenu && tableMenu[route.name]) {
			columns.value = tableMenu[route.name];
		} else {
			props.tableColumn.forEach((item, index) => {
				if (item.prop != 'actions') {
					columns.value.push({
						key: index,
						label: item.label,
						visible: true
					})
				}
			})
			// tableMenu.updateMenu(route.name, columns.value);
			tableMenu[route.name] = columns.value;
			localStorage.setItem('tableMenu', JSON.stringify(tableMenu))
		}
	}
	//列设置信息更新
	const queryTable = (type) => {
		// console.log('列设置信息更新');
		if (type == 2) {
			tableMenu[route.name] = columns.value;
			localStorage.setItem('tableMenu', JSON.stringify(tableMenu))
		} else {
			getList();
		}
	}

	const itemChange = (item, index) => {
		var data = state.tableData[index];
		data[item.key] = item.value;
		Object.assign(state.tableData[index], data);
		emit('tableItemChange', item, index)
	}

	//更新表格数据  /* 弃用 */
	const updateTableData = (data) => {
		Object.assign(state.tableData, data);
		console.log('state.tableData-哈哈哈', data, state.tableData)
	}

	const emit = defineEmits(['selectionChange', 'tableItemChange'])
	defineExpose({
		state,
		updateTableData,
		getList
	})

	// 定义独立的操作按钮组件
	const ActionButtons = defineComponent({
		props: {
			row: {
				type: Object,
				required: true
			},
			index: {
				type: Number,
				required: true
			},
			actions: {
				type: Array,
				required: true
			}
		},
		setup(props) {
			return () => h('div', {
					class: 'action-buttons'
				},
				props.actions.map((action, i) => 
					h(ElButton, {
							type: action.type || 'primary',
							size: action.size || 'small',
							icon: action.icon,
							onClick: () => action.onClick(props.row, props.index),
							style: {
								margin: '0px',
								...(typeof action.style === 'function' 
									? action.style(props.row) 
									: action.style || {})
							},
							key: i
						},
						() => action.label
					)
				)
			)
		}
	})

	// 表格特殊展示行
	const ColumnRender = defineComponent({
		props: {
			row: {
				type: Object,
				required: true
			},
			index: {
				type: Number,
				required: true
			},
			render: {
				type: Object,
				required: true
			}
		},
		setup(props) {
			return () => h('div', {
					class: 'column-buttons'
				},
				props.render(props.row, props.index)
			)
		}
	})
	
	// 合计计算方法
	const getSummaries = computed(() => {
	  if (props.summaryMethod) {
	    return props.summaryMethod
	  }
	  return (param) => defaultSummaryMethod(param)
	})
	
	// 默认合计方法
	const defaultSummaryMethod = ({ columns, data }) => {
	  
	  // 空数据检查
	  if (!columns || columns.length === 0) {
	    console.log('警告：列配置为空')
	    return []
	  }
	  
	  if (!data || data.length === 0) {
	    console.log('警告：数据为空，显示空合计行')
	    const sums = []
	    columns.forEach((column, index) => {
	      sums[index] = index === 0 ? props.summaryText : '0.00'
	    })
	    return sums
	  }
	  
	  const sums = []
	  const hasSummaryFields = props.summaryFields && props.summaryFields.length > 0
	  
	  columns.forEach((column, index) => {
	    if (index === 0) {
	      sums[index] = props.summaryText
	      return
	    }
	    
	    const field = column.property || column.prop || ''
	    
	    // 如果指定了 summaryFields，只合计指定字段
	    if (hasSummaryFields && field) {
	      if (!props.summaryFields.includes(field)) {
	        // 非合计字段直接设为空字符串
	        sums[index] = ''
	        return
	      }
	    }
	    
	    // 检查是否应该计算合计
	    const shouldCalculate = !hasSummaryFields || (field && props.summaryFields.includes(field))
	    
	    if (!shouldCalculate) {
	      sums[index] = ''
	      return
	    }
	    
	    // 计算合计值
	    const values = data.map(item => {
	      const val = item[field]
	      // 多种类型处理
	      if (val === null || val === undefined) return 0
	      if (typeof val === 'number') return val
	      if (typeof val === 'string') {
	        // 去除逗号、空格等
	        const num = parseFloat(val.replace(/,/g, '').trim())
	        return isNaN(num) ? 0 : num
	      }
	      return 0
	    })
	    
	    const sum = values.reduce((prev, curr) => prev + curr, 0)
	    
	    // 总是显示数字格式，即使和为0
	    sums[index] = sum.toFixed(2)
	  })
	  
	  console.log('合计结果:', sums)
	  return sums
	}
</script>

<style scoped>
	#tableList {
		padding-bottom: 30px;
	}

	.action-buttons {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px;
	}

	.column-buttons {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px;
	}

	.flex {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}
</style>
<style>
	.el-table.is-scrolling-left .el-table-fixed-column--right.is-first-column:before {
		border-right: 1px solid #dcdfe6;
	}
	.el-table .danger-row {
		background-color: #ffbaba;
	}
	.el-table .warning-row {
		background-color: #ffcb8f;
	}
	.el-table .success-row {
		background-color: #9ce290;
	}
	.el-table .disabled-cell{background-color: #f5f5f5;}
</style>