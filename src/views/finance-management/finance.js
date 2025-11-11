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