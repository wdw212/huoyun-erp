import { optionsComm } from '@/api/commonList';
import { ElButton, ElInput, ElSelect } from 'element-plus'
import { httpPost, httpGet } from '@/api/apiCommon';

export const statistic = ref([
	{ title: '应收人民币总和', value: 0, prefix: '￥', key: 'receipt_total_cny_amount' },
	{ title: '应付人民币总和', value: 0, prefix: '￥', key: 'payment_total_cny_amount' },
	{ title: '毛利人民币总和', value: 0, prefix: '￥', key: 'total_cny_gross_profit' },
	{ title: '特殊费用总和', value: 0, prefix: '￥', key: 'total_special_amount' },
	{ title: '未安排总和', value: 0, prefix: '￥', key: 'uncashed_amount' },
	{ title: '应收美金总和', value: 0, prefix: '$', key: 'receipt_total_usd_amount' },
	{ title: '应付美金总和', value: 0, prefix: '$', key: 'payment_total_usd_amount' },
	{ title: '毛利美金总和', value: 0, prefix: '$', key: 'total_usd_gross_profit' },
	{ title: '已安排总和', value: 0, prefix: '￥', key: 'cashed_amount' },
	{ title: '毛利利润总和', value: 0, prefix: '￥', key: 'total_gross_profit' }
])

export const queryParamsOrderCutOff = ref([
	{
		type: 'input',
		value: '',
		placeholder: '工作编号，提单号，合同号，备注',
		key: 'keyword'
	},
	{
		type: 'select',
		value: '',
		placeholder: '委托客户',
		key: 'order_type_id',
		options: []
	},
	{
		type: 'select',
		value: '',
		placeholder: '操作模式',
		key: 'is_fee_finish',
		options: []
	},
	{
		type: 'date',
		dateType: 'date',
		value: '',
		placeholder: '接单时间',
		key: 'start_arrival_date'
	},
	{
		type: 'select',
		value: '',
		placeholder: '截单状态',
		key: 'is_claimed',
		options: [
			{label: '是', value: '1'},
			{label: '否', value: '0'},
		]
	},
	{
		type: 'select',
		value: '',
		placeholder: '结单状态',
		key: 'is_claimed',
		options: [
			{label: '是', value: '1'},
			{label: '否', value: '0'},
		]
	}
])
export const queryParamsCheckOpenPort = ref([
	{
		type: 'input',
		value: '',
		placeholder: '船名，航次',
		key: 'keyword'
	},
	{
		type: 'select',
		value: '',
		placeholder: '开港状态',
		key: 'order_type_id',
		options: []
	}
])
export const queryParamsCarArrangement = ref([
	{
		type: 'input',
		value: '',
		placeholder: '提单号，箱号，封号，司机信息，备注',
		key: 'keyword'
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
		type: 'date',
		dateType: 'date',
		value: '',
		placeholder: '装柜日期',
		key: 'start_arrival_date'
	},
	{
		type: 'select',
		value: '',
		placeholder: '是否进港',
		key: 'is_claimed',
		options: [
			{label: '是', value: '1'},
			{label: '否', value: '0'},
		]
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
	{ type: 'input',value: '',label: '总计人民币￥',key: 'cny_amount_total', span: 6, disabled: true, placeholder: ' '},
	{ type: 'input',value: '',label: '总计美金$',key: 'usd_amount_total', span: 6, disabled: true, placeholder: ' ' },
])

//财务单据合计信息
export const amountFormFin = ref([
	{ type: 'textarea', label: '整单备注',key: 'title1', span: 24, placeholder: '0.00' },
	{ type: 'input', labelWidth: '200px',label: '应付人民币￥',key: 'title2', placeholder: '0.00', span: 12, disabled: true },
	{ type: 'input', labelWidth: '200px',label: '应付美金$',key: 'title3', placeholder: '0.00', span: 12, disabled: true },
	{ type: 'input', labelWidth: '200px',label: '特殊费用人民币￥',key: 'title2', placeholder: '0.00', span: 12 },
	{ type: 'select', labelWidth: '200px',label: '特殊费用人民币兑付情况',key: 'title2', placeholder: '0.00', span: 12, options: optionsComm['兑付'],clearable: false, defaultValue: 0 },
	{ type: 'input', labelWidth: '200px',label: '应收人民币￥',key: 'title2', placeholder: '0.00', span: 12, disabled: true },
	{ type: 'input', labelWidth: '200px',label: '应收美金$',key: 'title3', placeholder: '0.00', span: 12, disabled: true },
	{ type: 'input', labelWidth: '200px',label: '毛利人民币￥',key: 'title2', placeholder: '0.00', span: 12, disabled: true },
	{ type: 'input', labelWidth: '200px',label: '毛利美金$',key: 'title3', placeholder: '0.00', span: 12, disabled: true },
	{ type: 'input', labelWidth: '200px',label: '总利润（以人民币计）￥',key: 'title2', placeholder: '0.00', span: 12, disabled: true },
	{ key: 'title2', span: 6, soltName: '发票未开' },
	{ type: 'input', labelWidth: '200px',key: 'title2', span: 6, placeholder: '当月美金汇率：0', disabled: true },
])

export const formList = ref([
	{ 
		formData: [
			{
				label: '',
				// disabled: true,  //整个板块的表单框禁用
				formItem: [
					{ type: 'input',value: '',label: '起运港',placeholder: '请输入起运港',key: 'origin_port',rules: rulesInit('请输入起运港'), inputType:2 },
					{ type: 'select',value: '',label: '开港状态',placeholder: '请选择开港状态',key: 'cutoff_status',options: optionsComm['已开港'], defaultValue: 1 },
					{ type: 'input',value: '',label: '船名',placeholder: '请输入船名',key: 'ship_name',inputType: 2 },
					{ type: 'input',value: '',label: '航次',placeholder: '请输入航次',key: 'ship_no',inputType: 2 },
					{ type: 'input',value: '',label: '落箱',placeholder: '请输入落箱',key: 'ship_no',inputType: 2 },
					{ type: 'input',value: '',label: '进港码头',placeholder: '请输入进港码头',key: 'ship_no',inputType: 2 },
					{ type: 'date',value: '',label: '开港时间',placeholder: '请选择开港时间',key: 'sailing_at', dateType: 'date' },
					{ type: 'date',value: '',label: '截港时间',placeholder: '请选择截港时间',key: 'sailing_at', dateType: 'date' },
					{ label: '生成', soltName: 'remarkBtn' }
				]
			},
			{
				label: '',
				// disabled: true,  //整个板块的表单框禁用
				formItem: [
					{ label: '列表', soltName: 'remarkList' },
				]
			},
		]
	}
])

export const formListCarArrangement=  ref([
	{ 
		formData: [
			{
				label: '',
				// disabled: true,  //整个板块的表单框禁用
				formItem: [
					{ type: 'input',value: '',label: '提单号',placeholder: '请输入提单号',key: 'origin_port',rules: rulesInit('请输入提单号'), inputType:2 },
					{ type: 'input',value: '',label: '船名',placeholder: '请输入船名',key: 'ship_name',inputType: 2 },
					{ type: 'input',value: '',label: '航次',placeholder: '请输入航次',key: 'ship_no',inputType: 2 },
					{ type: 'input',value: '',label: '进港码头',placeholder: '请输入进港码头',key: 'ship_no',inputType: 2 },
					{ type: 'input',value: '',label: '落箱数据生成',placeholder: '请输入落箱数据生成',key: 'ship_no',inputType: 2 },
					{ type: 'select',value: '',label: '操作员',placeholder: '请选择操作员',key: 'ship_no' },
				]
			},
			{
				soltName: 'boxInfo',
				noCard: true
			}
		]
	}
])
//应付款列表
export const AccountsColumn = ref([
	{
		label: '费用明细', prop: 'company_header_id',type: 'edit',width: '320px',
		form: {
			type: 'select',placeholder: '请选择合作单位',key: 'company_header_id',
			filterable: true, options: [],  labelName: 'company_name', valueName: 'id',
			showLabel: 'label', snapshotLabelKey: 'company_header_name', snapshotLoadOnVisible: true,
			// method: 'get', url: '/company-headers',popover:true
		}
	},
	{label: '不开票备注', type: 'edit', prop: 'no_invoice_remark',
		form: {
			type: 'input',key: 'no_invoice_remark',popover:true
		}
	},
	{label: '人民币费用', type: 'edit', prop: 'cny_amount',
		form: {
			type: 'input',key: 'cny_amount', inputType: 3
		}
	},
	{label: '人民币发票号', type: 'edit', prop: 'cny_invoice_number',width: '200px',
		form: {
			type: 'input',key: 'cny_invoice_number',clearable:true,popover:true,placeholder: ' '
		}
	},
	{label: '人民币兑付情况', type: 'edit', prop: 'cny_is_cashed',noShow:true,
		form: {
			type: 'select',key: 'cny_is_cashed',options: optionsComm['兑付'],clearable: false,
		}
	},
	{label: '美金费用', type: 'edit', prop: 'usd_amount',
		form: {
			type: 'input',key: 'usd_amount', inputType: 3
		}
	},
	{label: '美金发票号', type: 'edit', prop: 'usd_invoice_number',width: '200px',
		form: {
			type: 'input',key: 'usd_invoice_number',clearable:true,popover:true,placeholder: ' '
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
			method: 'get', url: '/company-headers',popover:true, showLabel: 'label',
			snapshotLabelKey: 'company_header_name', snapshotLoadOnVisible: true
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
	},
	{}
]);
