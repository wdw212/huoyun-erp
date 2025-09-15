import { optionsComm } from '@/api/commonList';
import { ElButton, ElInput, ElSelect } from 'element-plus'
import { httpPost, httpGet } from '@/api/apiCommon';

export const statistic = ref([
	{ title: '应收人民币总和', value: 0, prefix: '￥' },
	{ title: '应付人民币总和', value: 0, prefix: '￥' },
	{ title: '毛利人民币总和', value: 0, prefix: '￥' },
	{ title: '特殊费用总和', value: 0, prefix: '￥' },
	{ title: '未安排总和', value: 0, prefix: '￥' },
	{ title: '应收美金总和', value: 0, prefix: '$' },
	{ title: '应付美金总和', value: 0, prefix: '$' },
	{ title: '毛利美金总和', value: 0, prefix: '$' },
	{ title: '已安排总和', value: 0, prefix: '￥' },
	{ title: '毛利利润总和', value: 0, prefix: '￥' }
])

export const queryParamsDocu = ref([
	{
		type: 'input',
		value: '',
		placeholder: '编号、提单号、分箱数据',
		key: 'keyword'
	},
	{
		type: 'date',
		// dateType: 'month',
		value: '',
		startPlaceholder: '开船开始日期',
		endPlaceholder: '开船结束日期',
		key: 'sailing_at'
	},
	{
		type: 'date',
		dateType: 'month',
		value: '',
		placeholder: '请选择月份',
		key: 'finish_at'
	},
	{
		type: 'select',
		value: '',
		placeholder: '请选择类型',
		key: 'order_type_id',
		options: []
	},
	{
		type: 'select',
		value: '',
		placeholder: '请选择操作类型完结',
		key: 'is_fee_finish',
		options: []
	},
	{
		type: 'select',
		value: '',
		placeholder: '请选择委托抬头',
		key: 'company_header_id',
		options: []
	},
	{
		type: 'select',
		value: '',
		placeholder: '请选择业务员',
		key: 'business_user_id',
		options: []
	},
	{
		type: 'select',
		value: '',
		placeholder: '请选择商务',
		key: 'commerce_user_id',
		options: []
	},
	{
		type: 'select',
		value: '',
		placeholder: '请选择提货',
		key: 'is_delivery',
		options: optionsComm['提货']
	},
	{
		type: 'select',
		value: '',
		placeholder: '请选择付款方式',
		key: 'payment_method',
		options: optionsComm['付款方式']
	},
	{
		type: 'select',
		value: '',
		placeholder: '请选择销货单位',
		key: 'seller_id',
		options: []
	},
	{
		type: 'select',
		value: '',
		placeholder: '请选择操作票数',
		key: 'caozuoyuepiao',
		options: []
	},
])

export const queryParams = ref([
	{
		type: 'input',
		value: '',
		placeholder: '编号、提单号、分箱数据',
		key: 'keyword'
	},
	{
		type: 'date',
		dateType: 'month',
		value: '',
		placeholder: '开船日期',
		key: 'sailing_at'
	},
	{
		type: 'date',
		dateType: 'month',
		value: '',
		placeholder: '归属月份',
		key: 'finish_at'
	},
	{
		type: 'select',
		value: '',
		placeholder: '请选择提货',
		key: 'is_delivery',
		options: optionsComm['提货']
	},
	{
		type: 'select',
		value: '',
		placeholder: '付款方式',
		key: 'payment_method',
		options: optionsComm['付款方式']
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
		placeholder: '操作模式',
		key: 'order_type_id',
		options: []
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
		type: 'select',
		value: '',
		placeholder: '操作员',
		key: 'operation_user_id',
		labelName: 'name',
		valueName: 'id',
		options: []
	},
	{
		type: 'select',
		value: '',
		placeholder: '选择发票',
		key: 'order_type_id',
		options: optionsComm['发票']
	},
	{
		type: 'select',
		value: '',
		placeholder: '操作费用完结',
		key: 'order_type_id',
		options: optionsComm['费用完结']
	},
	{
		type: 'select',
		value: '',
		placeholder: '特殊费用兑付',
		key: 'order_type_id',
		options: optionsComm['兑付']
	},
	{
		type: 'select',
		value: '',
		placeholder: '毛利润',
		key: 'order_type_id',
		options: optionsComm['毛利润']
	},
	{
		type: 'select',
		value: '',
		placeholder: '特殊费用比例',
		key: 'order_type_id',
		options: optionsComm['费用比例']
	},
	{
		type: 'select',
		value: '',
		placeholder: '销货单位',
		key: 'order_type_id',
		options: []
	}
])

export const rulesInit = (message, type) => {
	if(type == 1){
		return { required: true, message, trigger: 'change' }
	}else{
		return { required: true, message, trigger: 'blur' }
	}
}

const commonInfo = [
	{
		label: '应付款',
		soltLabel: 'AccountsBtn',
		soltName: 'AccountsPayable',
		formItem: []
	},
	{
		label: '应收款',
		soltLabel: 'PaymentBtn',
		soltName: 'PaymentPayable',
		// noShow: true,
		formItem: []
	},
	{
		label: '合计',
		formItem: []
	}
]

// 操作单据合计
export const amountFormDoc = ref([
	{ type: 'textarea',value: '',label: '整单备注',key: 'remark', span: 24 },
	{ type: 'input',value: '',label: '总计人民币￥',key: 'cny_amount_total', span: 6, disabled: true },
	{ type: 'input',value: '',label: '总计美金$',key: 'usd_amount_total', span: 6, disabled: true },
])

//财务单据合计信息
export const amountFormFin = ref([
	{ type: 'textarea', label: '整单备注',key: 'title1', span: 24 },
	{ type: 'input', labelWidth: '200px',label: '应付人民币￥',key: 'title2', span: 12, disabled: true },
	{ type: 'input', labelWidth: '200px',label: '应付美金$',key: 'title3', span: 12, disabled: true },
	{ type: 'input', labelWidth: '200px',label: '特殊费用人民币￥',key: 'title2', span: 12 },
	{ type: 'select', labelWidth: '200px',label: '特殊费用人民币兑付情况',key: 'title2', span: 12, options: optionsComm['兑付'],clearable: false, defaultValue: 0 },
	{ type: 'input', labelWidth: '200px',label: '应收人民币￥',key: 'title2', span: 12, disabled: true },
	{ type: 'input', labelWidth: '200px',label: '应收美金$',key: 'title3', span: 12, disabled: true },
	{ type: 'input', labelWidth: '200px',label: '毛利人民币￥',key: 'title2', span: 12, disabled: true },
	{ type: 'input', labelWidth: '200px',label: '毛利美金$',key: 'title3', span: 12, disabled: true },
	{ type: 'input', labelWidth: '200px',label: '总利润（以人民币计）￥',key: 'title2', span: 12, disabled: true },
	{ key: 'title2', span: 6, soltName: '发票未开' },
	{ type: 'input', labelWidth: '200px',key: 'title2', span: 6, placeholder: '当月美金汇率：0', disabled: true },
])

export const formList = ref([
	{ 
		tabName: '操作单据',
		formData: [
			{
				label: '',
				formItem: [
					{
						type: 'select',
						value: '',
						label: '业务类型',
						placeholder: '请选择业务类型',
						key: 'order_type_id',
						options: [], labelName: 'name', valueName: 'id',
						rules: rulesInit('请选择业务类型', 1)
					},
					{ type: 'input',value: '',label: '工作编号',placeholder: '请输入工作编号',key: 'job_no', rules: rulesInit('请填写工作编号')},
					{ type: 'input',value: '',label: '合同号',placeholder: '请输入合同号',key: 'contract_no' },
					{ type: 'date',value: '',label: '归属时间',placeholder: '请选择归属时间',key: 'finish_at', dateType: 'date' },
					{ type: 'select',value: '',label: '业务员',placeholder: '请选择业务员',key: 'business_user_id',options: [],rules: rulesInit('请选择业务员', 1),labelName: 'name', valueName: 'id', },
					{ type: 'select',value: '',label: '操作员',placeholder: '请选择操作员',key: 'operation_user_id',options: [],labelName: 'name', valueName: 'id', },
					{ type: 'select',value: '',label: '单证员',placeholder: '请选择单证员',key: 'document_user_id',options: [],rules: rulesInit('请选择单证员', 1),labelName: 'name', valueName: 'id', },
					{ type: 'select',value: '',label: '商务',placeholder: '请选择商务',key: 'commerce_user_id',options: [],labelName: 'name', valueName: 'id', },
					{ type: 'select',value: '',label: '船公司',placeholder: '请选择船公司',key: 'shipping_company_id',options: [],labelName: 'name', valueName: 'id' },
					{ type: 'input',value: '',label: '提单号',placeholder: '请输入提单号',key: 'bl_no', inputType: 2 },
					{ type: 'input',value: '',label: '起运港',placeholder: '请输入起运港',key: 'origin_port',rules: rulesInit('请输入起运港'), inputType:2 },
					{ type: 'input',value: '',label: '目的港',placeholder: '请输入目的港',key: 'destination_port',rules: rulesInit('请输入目的港'), inputType:2 },
					{ type: 'input',value: '',label: '船名',placeholder: '请输入船名',key: 'ship_name',inputType: 2 },
					{ type: 'input',value: '',label: '航次',placeholder: '请输入航次',key: 'ship_no',inputType: 2 },
					{ type: 'input',value: '',label: '柜型',placeholder: '请输入柜型',key: 'container_type', disabled: true },
					{ type: 'select',value: '',label: '支付方式',placeholder: '请选择支付方式',key: 'payment_method',options: optionsComm['付款方式'], defaultValue: 1 },
					{ type: 'select',value: '',label: '截单状态',placeholder: '请选择截单状态',key: 'cutoff_status',options: optionsComm['截单状态'], defaultValue: 1 },
					{ type: 'dateTime',value: '',label: '截单时间',placeholder: '请选择截单时间',key: 'cutoff_at', format: 'YYYY-MM-DD HH:mm',rules: rulesInit('请选择截单时间', 1) },
					{ type: 'input',value: '',label: '船期',placeholder: '请输入船期',key: 'sailing_schedule' },
					{ type: 'select',value: '',label: '提单状态',placeholder: '请选择提单状态',key: 'bl_status',options: optionsComm['提单状态'], defaultValue: '0' },
					{ type: 'date',value: '',label: '开船日期',placeholder: '请选择开船日期',key: 'sailing_at', dateType: 'date' },
					{ type: 'date',value: '',label: '到港日期',placeholder: '请选择到港日期',key: 'arrival_at', dateType: 'date' },
					{ type: 'select',value: '',label: '提货',placeholder: '请选择提货',key: 'is_delivery',options: optionsComm['提货'], defaultValue: 1 },
					{ label: '订舱信息及备注', soltName: 'remarkBtn' },
					{ label: '', soltName: 'remarkList',key: 'booking_info',span: 24, defaultValue: [''] },
				]
			},
		]
	},
	{
		tabName: '委托抬头',
		formData:[
			{
				label: '委托抬头',
				formItem: [
					{ type: 'select',value: '',label: '销货单位',placeholder: '请选择销货单位',key: 'order_delegation_header.seller_id',options: [],labelName: 'name', valueName: 'id',span: 6 },
					{ type: 'select',value: '',label: '公司抬头',placeholder: '请选择公司抬头',key: 'order_delegation_header.company_header_id',options: [],  labelName: 'company_name', valueName: 'id', filterable: true, labelWidth: '80px', afterSolt: 'addHeader',span: 10 },
					{ type: 'input',value: '',label: '联系人',placeholder: '请输入联系人',key: 'order_delegation_header.contact_person', disabled: true,span: 8 },
					{ type: 'input',value: '',label: '联系电话',placeholder: '请输入联系电话',key: 'order_delegation_header.contact_phone', disabled: true,span: 8 },
					{ label: '', soltName: 'order_delegationBtn' },
					{ value: [], label: '', soltName: 'order_delegationList',key: 'order_delegation_header.remark',span: 24 },
				]
			},
		]
	},
	{
		tabName: '箱子信息',
		formData:[
			{
				label: '',
				formItem: [
					{ type: 'input',value: '',label: '提单号',placeholder: '请输入提单号',key: 'bl_no', disabled: true, popover: true},
					{ type: 'show',value: '',label: '船名/航次',placeholder: '请输入船名/航次', popover: true },
					{ span: 12 },
					{ type: 'select',value: '',label: '截单状态',placeholder: '请选择截单状态',key: 'cutoff_status',options: optionsComm['截单状态'], defaultValue: 1 },
					{ type: 'dateTime',value: '',label: '开港时间',placeholder: '请选择开港时间',key: 'port_open_at', format: 'YYYY-MM-DD HH:mm' },
					{ type: 'date',value: '',label: '实际开船时间',placeholder: '请选择实际开船时间',key: 'actual_sailing_at', dateType: 'date' },
					{ label: '', soltName: 'shoppingCompany' },
					{ type: 'dateTime',value: '',label: '截单时间',placeholder: '请选择截单时间',key: 'cutoff_at', format: 'YYYY-MM-DD HH:mm',rules: rulesInit('请选择截单时间', 1) },
					{ type: 'dateTime',value: '',label: '截港时间',placeholder: '请选择截港时间',key: 'port_close_at', format: 'YYYY-MM-DD HH:mm' },
					{ type: 'date',value: '',label: '实际到港时间',placeholder: '请选择实际到港时间',key: 'actual_arrival_at', dateType: 'date' },
					{ type: 'select',value: '',label: '进港码头',placeholder: '请选择进港码头',key: 'entered_port_wharf_id',options: [], labelName: 'name', valueName: 'id',popover: true, clearable: true, filterable: true },
					{ type: 'select',value: '',label: '保险',placeholder: '请选择保险',key: 'insurance',options: optionsComm['保险'], defaultValue: '0' },
					{ type: 'select',value: '',label: '提货',placeholder: '请选择提货',key: 'is_delivery',options: optionsComm['提货'], defaultValue: 1 },
					{ label: '落箱数据', soltName: 'template11' },
					{ type: 'select',value: '',label: '结单状态',placeholder: '请选择结单状态',key: 'is_finish',options: optionsComm['完结状态'] },
					{ type: 'select',value: '',label: '提单状态',placeholder: '请选择提单状态',key: 'bl_status',options: optionsComm['提单状态'], defaultValue: '0' },
					{ type: 'select',value: '',label: '是否放行',placeholder: '请选择是否放行',key: 'is_allowed',options: optionsComm['放行'], defaultValue: '0' },
					{ span: 12 },
					{ type: 'textarea',value: '',label: '备注',placeholder: '请输入备注',key: 'remark' },
				]
			},
			{
				soltName: 'boxInfo',
				noCard: true
			}
		]
	},
	{
		tabName: '提单信息',
		formData:[
			{
				soltName: 'billInfo',
				// noCard: true
			}
		]
	},
	{
		tabName: '上传文件',
		formData:[
			{
				soltName: 'fileInfo',
				noCard: true
			}
		]
	},
	{
		tabName: '公共',
		noTab: true,   //不需要展示tab标签
		commonShow: true,   //是否在每个tab标签下展示
		formData:[
			...commonInfo
		]
	},
])


//应付款列表
export const AccountsColumn = ref([
	{
		label: '费用明细', prop: 'company_header_id',type: 'edit',width: '320px',
		form: {
			type: 'select',placeholder: '请选择合作单位',key: 'company_header_id',
			filterable: true, options: [],  labelName: 'company_name', valueName: 'id',
			// method: 'get', url: '/company-headers',popover:true
		}
	},
	{label: '不开票备注', type: 'edit', prop: 'no_invoice_remark',
		form: {
			type: 'input',key: 'no_invoice_remark',
		}
	},
	{label: '人民币费用', type: 'edit', prop: 'cny_amount',
		form: {
			type: 'input',key: 'cny_amount',
		}
	},
	{label: '人民币发票号', type: 'edit', prop: 'cny_invoice_number',width: '200px',
		form: {
			type: 'input',key: 'cny_invoice_number',clearable:true,popover:true
		}
	},
	{label: '人民币兑付情况', type: 'edit', prop: 'cny_is_cashed',noShow:true,
		form: {
			type: 'select',key: 'cny_is_cashed',options: optionsComm['兑付'],clearable: false,
		}
	},
	{label: '美金费用', type: 'edit', prop: 'usd_amount',
		form: {
			type: 'input',key: 'usd_amount',
		}
	},
	{label: '美金发票号', type: 'edit', prop: 'usd_invoice_number',width: '200px',
		form: {
			type: 'input',key: 'usd_invoice_number',clearable:true,popover:true
		}
	},
	{label: '美金兑付情况', type: 'edit', prop: 'usd_is_cashed',noShow:true,
		form: {
			type: 'select',key: 'usd_is_cashed',options: optionsComm['兑付'],clearable: false,
		}
	},
	{}
])

//应收款列表
export const PaymentColumn = ref([
	{
		label: '公司名称', prop: 'company_header_id',type: 'edit',width: '320px',
		form: {
			type: 'selectSearch',placeholder: '请选择应收抬头',key: 'company_header_id',
			remoteShowSuffix: true, options: [],  labelName: 'company_name', valueName: 'id',
			method: 'get', url: '/company-headers',popover:true
		}
	},
	{label: '人民币费用', type: 'edit', prop: 'cny_amount',
		form: {
			type: 'input',key: 'cny_amount',
		}
	},
	{label: '人民币发票', type: 'edit', prop: 'cny_invoice_number',width: '200px',
		form: {
			type: 'input',key: 'cny_invoice_number',popover:true
		}
	},
	{label: '人民币兑付情况', type: 'edit', prop: 'cny_is_cashed',noShow:true,
		form: {
			type: 'select',key: 'cny_is_cashed',options: optionsComm['兑付'],clearable: false,
		}
	},
	{label: '美金费用', type: 'edit', prop: 'usd_amount',
		form: {
			type: 'input',key: 'usd_amount',
		}
	},
	{label: '美金发票', type: 'edit', prop: 'usd_invoice_number',width: '200px',
		form: {
			type: 'input',key: 'usd_invoice_number',popover:true
		}
	},
	{label: '美金兑付情况', type: 'edit', prop: 'usd_is_cashed',noShow:true,
		form: {
			type: 'select',key: 'usd_is_cashed',options: optionsComm['兑付'],clearable: false,
		}
	}
]);