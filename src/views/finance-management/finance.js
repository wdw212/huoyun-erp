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