<template>
	
	<!-- 顶部搜索 -->
	<search-top ref="searchTop" :queryParams="queryParams" @search="searchConfirm"></search-top>
	
	<!-- 表格 -->
	<table-list :tableConfig="tableConfig" :tableColumn="tableColumn" :toolbar="true">
		<template #headerCon>
			<div style="display: flex;flex-wrap: wrap;">
				<div style="flex: 1;" v-for="(item,index) in statistic" :key="index">
					<el-statistic :title="item.title" :value="item.value">
						<template #prefix>{{item.prefix}}</template>
					</el-statistic>
				</div>
			</div>
			<el-divider />
		</template>
		<template #headerLeft>
			<span style="color: red;">总计：5票</span>
		</template>
		<template #headerRight>
			<el-button type="primary" plain icon="Plus" @click="" style="margin-right: 10px;">新增</el-button>
		</template>
	</table-list>
	
</template>

<script setup>
	import { ref, onMounted, h } from "vue";
	import SearchTop from "@/components/searchTop/index";
	import TableList from "@/components/tableList/index";
	import { httpPost, httpGet } from '@/api/apiCommon';
	import { Delete, Edit, View } from '@element-plus/icons-vue'
	import { useTransition } from '@vueuse/core'
	
	onMounted(()=>{
		// console.log('onMounted', queryParams);
		statistic.value.forEach((item,index)=>{
			statistic.value[index].value = useTransition(268500, {
				duration: 1500,
			})
		})
	})
	
	const statistic = ref([
		{ title: '应收人民币总和', value: 0, prefix: '￥' },
		{ title: '应收美金总和', value: 0, prefix: '$' },
		{ title: '应付人民币总和', value: 0, prefix: '￥' },
		{ title: '应付美金总和', value: 0, prefix: '$' },
		{ title: '特殊费用总和', value: 0, prefix: '￥' },
		{ title: '已安排总和', value: 0, prefix: '￥' },
		{ title: '未安排总和', value: 0, prefix: '￥' },
		{ title: '毛利人民币总和', value: 0, prefix: '￥' },
		{ title: '毛利美金总和', value: 0, prefix: '$' }
	])
	
	const queryParams = ref([
		{
			type: 'input',
			value: '',
			placeholder: '编号、提单号、分箱数据',
			key: 'keyword'
		},
		{
			type: 'date',
			dateType: 'date',
			value: '',
			placeholder: '开船日期',
			key: 'sailing_at'
		},
		{
			type: 'date',
			dateType: 'month',
			value: '',
			placeholder: '归属月份',
			key: 'sailing_at'
		},
		{
			type: 'select',
			value: '',
			placeholder: '请选择提货',
			key: 'order_type_id',
			options: [
				{label: '已提货', value: '1'},
				{label: '未提货', value: '2'},
				{label: '超期未提货', value: '3'},
			]
		},
		{
			type: 'select',
			value: '',
			placeholder: '付款方式',
			key: 'order_type_id',
			options: [
				{label: '月结', value: '1'},
				{label: '付款买单', value: '2'},
			]
		},
		{
			type: 'select',
			value: '',
			placeholder: '请选择应付人民币兑付',
			key: 'order_type_id',
			options: [
				{label: '应付人民币未兑付', value: '1'},
				{label: '应付人民币已兑付', value: '2'},
			]
		},
		{
			type: 'select',
			value: '',
			placeholder: '请选择应付美金兑付',
			key: 'order_type_id',
			options: [
				{label: '应付美金未兑付', value: '1'},
				{label: '应付美金已兑付', value: '2'},
			]
		},
		{
			type: 'select',
			value: '',
			placeholder: '请选择应收人民币兑付',
			key: 'order_type_id',
			options: [
				{label: '应收人民币未兑付', value: '1'},
				{label: '应收人民币已兑付', value: '2'},
			]
		},
		{
			type: 'select',
			value: '',
			placeholder: '请选择应收美金兑付',
			key: 'order_type_id',
			options: [
				{label: '应收美金未兑付', value: '1'},
				{label: '应收美金已兑付', value: '2'},
			]
		},
		{
			type: 'selectSearch',
			value: '',
			placeholder: '请选择委托抬头',
			key: 'order_type_id',
			reserveKeyword: true,
			style: 'width: 300px',
			options: [],
			remoteMethod: () => {
				
			},
		},
		{
			type: 'select',
			value: '',
			placeholder: '操作模式',
			key: 'order_type_id',
			options: []
		},
		{
			type: 'select',
			value: '',
			placeholder: '业务员',
			key: 'order_type_id',
			options: []
		},
		{
			type: 'select',
			value: '',
			placeholder: '操作员',
			key: 'order_type_id',
			options: []
		},
		{
			type: 'select',
			value: '',
			placeholder: '选择发票',
			key: 'order_type_id',
			options: [
				{label: '已开', value: '1'},
				{label: '未开', value: '2'},
			]
		},
		{
			type: 'select',
			value: '',
			placeholder: '操作费用完结',
			key: 'order_type_id',
			options: [
				{label: '费用未完结', value: '1'},
				{label: '费用已完结', value: '2'},
			]
		},
		{
			type: 'select',
			value: '',
			placeholder: '特殊费用兑付',
			key: 'order_type_id',
			options: [
				{label: '未兑付', value: '1'},
				{label: '已兑付', value: '2'},
			]
		},
		{
			type: 'select',
			value: '',
			placeholder: '毛利润',
			key: 'order_type_id',
			options: [
				{label: '毛利润 > 0', value: '1'},
				{label: '毛利润 = 0', value: '2'},
				{label: '毛利润 < 0', value: '3'},
			]
		},
		{
			type: 'select',
			value: '',
			placeholder: '特殊费用比例',
			key: 'order_type_id',
			options: [
				{label: '符合比例', value: '1'},
				{label: '不符合比例', value: '2'},
			]
		},
		{
			type: 'select',
			value: '',
			placeholder: '销货单位',
			key: 'order_type_id',
			options: []
		}
	])
	const searchConfirm = (val) =>{
		console.log('searchConfirm', val)
	}
	
	/** 查询列表 */
	const tableColumn = ref([
		{label: '工作编号', prop: 'job_no', formatter: (row)=> row.job_no || '无'},
		{label: '操作模式', prop: 'sailing_at'},
		{label: '提单号', prop: 'sailing_at'},
		{label: '操作', prop: 'sailing_at'},
		{label: '业务员', prop: 'sailing_at'},
		{label: '合作单位', prop: 'sailing_at'},
		{label: '柜型', prop: 'sailing_at'},
		{label: '开船日期', prop: 'sailing_at'},
		{label: '提货', prop: 'sailing_at'},
		{label: '应付人民币', prop: 'sailing_at'},
		{label: '兑付情况', prop: 'sailing_at'},
		{label: '应付美金', prop: 'sailing_at'},
		{label: '兑付情况', prop: 'sailing_at'},
		{label: '应收人民币', prop: 'sailing_at'},
		{label: '兑付情况', prop: 'sailing_at'},
		{label: '应收美金', prop: 'sailing_at'},
		{label: '利润归属月份', prop: 'sailing_at'},
		{label: '总利润', prop: 'sailing_at'},
		{label: '税后折扣', prop: 'sailing_at'},
		{label: '兑付情况', prop: 'sailing_at'},
		{label: '是否开票', prop: 'bl_status', formatter: (row)=> row.bl_status === 1 ? '未开票' : '已开票'},
		{ 
			label: '操作',
			prop: 'actions',
			actions: [
				{
					label: '查看详情',
					type: 'primary',
					size: 'small',
					icon: View,
					onClick: (row) => handleEdit(row)
				},
			],
			fixed: "right"
		},
		{
			label: '开票管理',
			prop: 'actions',
			actions: [
				{
					label: '开票管理',
					type: 'primary',
					size: 'small',
					onClick: (row) => handleEdit(row)
				},
			],
			fixed: "right"
		}
	]);
	const tableConfig = ref({
		url: '/orders',
		requestMethod: httpGet,
		isQuery: true
	})
	// 操作处理方法
	const handleEdit = (row) => {
	  console.log('编辑行:', row)
	  // 这里可以打开编辑对话框等操作
	}
	
</script>

<style>
</style>