import { optionsComm } from '@/api/commonList';
import { ElButton, ElInput, ElSelect } from 'element-plus'
import { httpPost, httpGet } from '@/api/apiCommon';

export const tableColumnInvoice = ref([
	{label: '开票单据', prop: 'job_no', formatter: (row)=> row.job_no || '无'},
	{label: '开票抬头', prop: 'job_no'},
	{label: '销货单位', prop: 'job_no'},
	{label: '发票类型', prop: 'job_no'},
	{label: '税点', prop: 'job_no'},
	{label: '单子完结', prop: 'job_no'},
	{label: '人民币金额', prop: 'job_no'},
	{label: '人民币发票号', prop: 'job_no'},
	{label: '美金金额', prop: 'job_no'},
	{label: '美金发票号', prop: 'job_no'},
	{label: '申请时间', prop: 'job_no'},
	{label: '确认开票时间', prop: 'job_no'},
	{label: '操作', prop: 'actions'},
])

export const tableColumnInvoiceTot = ref([
	{label: '', prop: 'title'},
	{label: '已兑付金额', prop: 'number1'},
	{label: '未兑付金额', prop: 'number1'},
	{label: '合计', prop: 'number1'}
])

export const tablemMonthProfit = ref([
	{label: 'ID', prop: 'job_no', formatter: (row)=> row.job_no || '无'},
	{label: '名字', prop: 'job_no'},
	{label: '毛利润', prop: 'job_no'},
	{label: '基本业绩', prop: 'job_no', cellClick: true},
	{label: '报销费', prop: 'job_no', cellClick: true},
	{label: '电话费', prop: 'job_no', cellClick: true},
	{label: '公积金', prop: 'job_no', cellClick: true},
	{label: '社保费', prop: 'job_no', cellClick: true},
	{label: '小计', prop: 'job_no'},
	{label: '操作费', prop: 'job_no', cellClick: true},
	{label: '利润调整', prop: 'job_no', cellClick: true},
	{label: '净利润', prop: 'job_no'},
	{label: '备注', prop: 'job_no', cellClick: true},
])

export const bxfForm = ref({
	title: '报销费',
	formData: [
		{
			// label: '报销费',
			type: 'input',
			key: 'money',
			placeholder: '报销费',
			value: ''
		},
		{
			// label: '报销费备注',
			type: 'textarea',
			key: 'remark',
			placeholder: '报销费备注',
			value: ''
		}
	]
})

export const tablemLogColumn = ref([
	{label: '操作时间', prop: 'job_no', width: '200px'},
	{label: '操作人', prop: 'job_no', width: '200px'},
	{label: '操作记录', prop: 'job_no'},
])

export const queryParamsBill = ref([
	{
		type: 'input',
		value: '',
		placeholder: '编号、单据号、抬头、发票号、金额',
		key: 'keyword'
	},
	{
		type: 'date',
		dateType: 'daterange',
		value: '',
		startPlaceholder: '开船日期开始时间',
		endPlaceholder: '开船日期结束时间',
		placeholder: '开船日期',
		key: 'start_sailing_dates'
	},
	{
		type: 'selectSearch',
		value: '',
		placeholder: '请选择委托抬头',
		key: 'order_delegation_header',
		reserveKeyword: true,
		style: 'width: 300px',
		options: [],
		remoteMethod: () => {
			
		},
	},
	{
		type: 'selectSearch',
		value: '',
		placeholder: '请选择全部抬头',
		key: 'order_delegation_header',
		reserveKeyword: true,
		style: 'width: 300px',
		options: [],
		remoteMethod: () => {
			
		},
	},
	{
		type: 'select',
		value: '',
		placeholder: '业务员',
		key: 'business_user_id',
		labelName: 'name',
		valueName: 'id',
		options: []
	},
	{
		type: 'date',
		dateType: 'date',
		value: '',
		placeholder: '兑换时间',
		key: 'start_arrival_date'
	},
	{
		type: 'select',
		value: '',
		placeholder: '销货单位',
		key: 'order_type_id',
		options: []
	}
])
export const queryParamsBill1 = ref([
	{
		type: 'select',
		value: '',
		placeholder: '兑付',
		key: 'order_type_id',
		options: optionsComm['兑付']
	},
	{
		type: 'select',
		value: '',
		placeholder: '人民币金额',
		key: 'order_type_id',
		options: optionsComm['人民币金额']
	},
	{
		type: 'select',
		value: '',
		placeholder: '是否开票',
		key: 'order_type_id',
		options: optionsComm['是否开票']
	},
	{
		type: 'select',
		value: '',
		placeholder: '有无发票号',
		key: 'order_type_id',
		options: optionsComm['有无发票号']
	},
])

export const queryParamsPublic = ref([
	{
		type: 'input',
		value: '',
		placeholder: '编号、单据号、抬头、发票号、金额',
		key: 'keyword'
	},
	{
		type: 'date',
		dateType: 'date',
		value: '',
		placeholder: '选择日期',
		key: 'start_arrival_date'
	},
	{
		type: 'selectSearch',
		value: '',
		placeholder: '请选择抬头',
		key: 'order_delegation_header',
		reserveKeyword: true,
		style: 'width: 300px',
		options: [],
		remoteMethod: () => {
			
		},
	},
	{
		type: 'select',
		value: '',
		placeholder: '选择用途',
		key: 'order_type_id',
		options: []
	},
])

export const queryParamsReal = ref([
	{
		type: 'input',
		value: '',
		placeholder: '请输入关键字',
		key: 'keyword'
	},
	{
		type: 'date',
		dateType: 'date',
		value: '',
		placeholder: '请选择月份',
		key: 'start_arrival_date'
	},
	{
		type: 'select',
		value: '',
		placeholder: '月份类型',
		key: 'start_arrival_date'
	},
	{
		type: 'select',
		value: '',
		placeholder: '收款类型',
		key: 'start_arrival_date'
	},
	{
		type: 'select',
		value: '',
		placeholder: '发票类型',
		key: 'start_arrival_date'
	},
	{
		type: 'select',
		value: '',
		placeholder: '是否包含美金',
		key: 'start_arrival_date'
	},
])

export const queryParamsComparison = ref([
	{
		type: 'input',
		value: '',
		placeholder: '发票号或金额',
		key: 'keyword'
	},
	{
		type: 'date',
		dateType: 'date',
		value: '',
		placeholder: '请选择月份',
		key: 'start_arrival_date'
	},
	{
		type: 'select',
		value: '',
		placeholder: '请选择金额类别',
		key: 'start_arrival_date'
	},
	{
		type: 'select',
		value: '',
		placeholder: '金额对比',
		key: 'start_arrival_date'
	}
])