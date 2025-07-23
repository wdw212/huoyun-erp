<template>
	<div id="boxInfo" class="flex1" style="width: 100%;height: 800px;">
		
		<el-card class="mr-2 h-100">
			<template #header>
				<el-row justify="space-between" class="pb">
					<span class="font-16">箱号列表</span>
					<el-text type="primary" @click="">添加箱号</el-text>
				</el-row>
			</template>
			<el-aside width="200px">
				<div v-for="(item, index) in 5" :key="index"
					style="text-align: center;">
					<el-popconfirm class="box-item" title="是否删除选中项" @confirm=""
					:disabled="index==0?false:true">
						<template #reference>
							<el-text size="large" :type="index==0?'primary':''" class="hand">测试箱号</el-text>
						</template>
					</el-popconfirm>
				</div>
			</el-aside>
		</el-card>
		
		<div class="flex-1" style="height: 100%;overflow-y: auto;">
			<common-form ref="boxInfoForm" :formList="formList" @confirm="confirmSubmit" :tabShow="false" :btnShow="false">
				<!-- 进港数据 -->
				<template #caseNumber6="{saveData,formList}">
					<el-form-item style="width: 100%;" label="进港数据" label-width="auto">
						<el-button type="primary" @click="">生成</el-button>
					</el-form-item>
				</template>
				<!-- 件毛体 -->
				<template #caseNumber11Btn="{saveData,formList}">
					<el-form-item style="width: 100%;" label="件毛体" label-width="auto">
						<el-button type="primary" @click="addTableList11">新增</el-button>
					</el-form-item>
				</template>
				<template #caseNumber11Table="{saveData,formList}">
					<table-list :tableConfig="tableConfig11" :tableColumn="tableColumn11" :multiple="false" :border="true" ref="tableListJMT" class="mb-2">
						<template #bottomCon="{tableData}">
							<el-row :gutter="20">
								<el-col class="p-r" v-for="(item,index) in tableData" :key="index" :span="8">
									<el-input v-model="tableData[index].maotiyi5" :rows="3" type="textarea" placeholder="请输入" resize="none" class="mt-1"/>
								</el-col>
							</el-row>
						</template>
					</table-list>
				</template>
				<!-- 装柜地址 -->
				<template #caseNumber12Btn="{saveData,formList}">
					<el-form-item style="width: 100%;" label="装柜地址" label-width="auto">
						<el-button type="primary" @click="addTableList12">新增</el-button>
					</el-form-item>
				</template>
				<template #caseNumber12Table="{saveData,formList}">
					<table-list :tableConfig="tableConfig12" :tableColumn="tableColumn12" :multiple="false" :border="true" ref="tableListZGDZ">
						<template #bottomCon="{tableData}">
							<el-row :gutter="20">
								<el-col class="p-r" v-for="(item,index) in tableData" :key="index" :span="8">
									<el-input v-model="tableData[index].maotiyi4" :rows="3" type="textarea" placeholder="请输入" resize="none" class="mt-1"/>
								</el-col>
							</el-row>
						</template>
					</table-list>
				</template>
				<!-- 装柜数据 -->
				<template #caseNumber16="{saveData,formList}">
					<el-form-item style="width: 100%;" label="装柜数据" label-width="auto">
						<el-button type="primary" @click="">生成</el-button>
					</el-form-item>
				</template>
				<!-- 装箱单 -->
				<template #caseNumber17="{saveData,formList}">
					<el-form-item style="width: 100%;" label="装箱单" label-width="auto">
						<el-button type="primary" @click="openPackForm=true">生成</el-button>
					</el-form-item>
				</template>
			</common-form>
		</div>
		
		<el-dialog v-model="openPackForm" width="1400px" append-to-body>
			<PackForm v-if="openPackForm"></PackForm>
		</el-dialog>
		
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
	import { optionsComm } from '@/api/commonList';
	import CommonForm from "@/components/commonForm/index";
	import TableList from "@/components/tableList/index";
	import PackForm from '@/components/PackForm.vue'
	
	const { proxy } = getCurrentInstance();
	const props = defineProps({
		boxData: {
			type: Array,
			default: () => {
				return {}
			}
		},
	})
	
	const openPackForm = ref(false);
	
	// 单据信息提交
	const confirmSubmit = (data) => {
		// console.log('编辑行:', row)
		var saveData = {
			...data,
			order_payments: proxy.$refs.accountTable.tableData,
			order_receipts: proxy.$refs.paymentTable.tableData
		};
		console.log('确认提交', data)
	}

	const formList = ref([
		{
			tabName: '',
			formData:[
				{
					formItem: [
						{ type: 'input',value: '',label: '箱号',placeholder: '请输入箱号',key: 'caseNumber1'},
						{ type: 'input',value: '',label: '封号',placeholder: '请输入封号',key: 'caseNumber2' },
						{ type: 'select',value: '',label: '柜型',placeholder: '请选择柜型',key: 'caseNumber3',options: optionsComm['柜型'] },
						{ type: 'input',value: '',label: '序列号',placeholder: '请输入序列号',key: 'caseNumber4' },
						{ type: 'select',value: '',label: '预提',placeholder: '请选择预提',key: 'caseNumber7',options: [] },
						{ type: 'select',value: '',label: '提箱码头',placeholder: '请选择提箱码头',key: 'caseNumber8',options: [] },
						{ type: 'select',value: '',label: '落箱',placeholder: '请选择落箱',key: 'caseNumber9',options: [] },
						{ type: 'select',value: '',label: '是否进港',placeholder: '请选择是否进港',key: 'caseNumber10',options: optionsComm['是否进港'] },
						{ type: 'input',value: '',label: '司机信息',placeholder: '请输入司机信息',key: 'caseNumber5' },
						{ label: '进港数据', soltName: 'caseNumber6' },
						{ label: '件毛体', soltName: 'caseNumber11Btn' },
						{ soltName: 'caseNumber11Table', value: [], span: 24 },
						{ type: 'select',value: '',label: '车队',placeholder: '请选择车队',key: 'caseNumber13',options: [] },
						{ type: 'input',value: '',label: '货重',placeholder: '请输入货重',key: 'caseNumber15' },
						{ type: 'dateTime',value: '',label: '装柜时间',placeholder: '请选择装柜时间',key: 'caseNumber14', format: 'YYYY-MM-DD HH:mm' },
						{ span: 6 },
						{ label: '装柜地址', soltName: 'caseNumber12Btn' },
						{ label: '装柜数据', soltName: 'caseNumber16' },
						{ label: '装箱单', soltName: 'caseNumber17' },
						{ soltName: 'caseNumber12Table', value: [], span: 24 },
					]
				}
			]
		},
	]);
	
	//件毛体表格数据
	const tableConfig11 = ref({
		url: '/orders',
		requestMethod: httpGet,
		isQuery: false
	})
	const tableColumn11 = ref([
		{
			label: '提单号', prop: 'maotiyi1',type: 'edit',width: '350px',
			form: {
				type: 'input',key: 'maotiyi1',popover:true
			}
		},
		{label: '件数', type: 'edit', prop: 'maotiyi2',
			form: {
				type: 'input',key: 'maotiyi2',
			}
		},
		{label: '毛重', type: 'edit', prop: 'maotiyi3',
			form: {
				type: 'input',key: 'maotiyi3',
			}
		},
		{label: '体积', type: 'edit', prop: 'maotiyi4',
			form: {
				type: 'input',key: 'maotiyi4'
			}
		},
		{
			label: '操作',
			prop: 'actions',
			actions: [{
				label: '删除',
				type: 'danger',
				icon: 'delete',
				onClick: (row, index) => delete11(row, index)
			}],
			width: '80px'
		}
	]);
	const addTableList11 = () => {
		console.log('tableListJMT', proxy.$refs.tableListJMT.tableData);
		proxy.$refs.tableListJMT.tableData.push({
			maotiyi1: '箱号',
			maotiyi2: '',
			maotiyi3: '',
			maotiyi4: '',
			maotiyi5: '',
		});
	}
	const delete11 = (row) => {
		const rowIndex = proxy.$refs.tableListJMT.tableData.findIndex(item => item === row);
		proxy.$refs.tableListJMT.tableData.splice(row.index, 1)
		// console.log('paymentDelete', row, rowIndex)
	}
	
	//装柜地址表格数据
	const tableConfig12 = ref({
		url: '/orders',
		requestMethod: httpGet,
		isQuery: false
	})
	const tableColumn12 = ref([
		{
			label: '装柜地址', prop: 'maotiyi1',type: 'edit',
			form: {
				type: 'select',key: 'maotiyi1',options: [],popover:true
			}
		},
		{label: '地址', type: 'edit', prop: 'maotiyi2',
			form: {
				type: 'input',key: 'maotiyi2',
			}
		},
		{label: '联系人/电话', type: 'edit', prop: 'maotiyi3',width: '260px',
			form: {
				type: 'input',key: 'maotiyi3',
			}
		},
		{
			label: '操作',
			prop: 'actions',
			actions: [{
				label: '删除',
				type: 'danger',
				icon: 'delete',
				onClick: (row, index) => delete12(row, index)
			}],
			width: '80px'
		}
	]);
	const addTableList12 = () => {
		proxy.$refs.tableListZGDZ.tableData.push({
			maotiyi1: '',
			maotiyi2: '',
			maotiyi3: '',
			maotiyi4: '',
		});
	}
	const delete12 = (row) => {
		const rowIndex = proxy.$refs.tableListZGDZ.tableData.findIndex(item => item === row);
		proxy.$refs.tableListZGDZ.tableData.splice(row.index, 1)
		// console.log('paymentDelete', row, rowIndex)
	}

	onMounted(() => {
		console.log('boxInfo', props);
		proxy.$refs.boxInfoForm.resetKey(formList.value);
	})

	const emit = defineEmits([])
	defineExpose({
		
	})
</script>

<style>
</style>