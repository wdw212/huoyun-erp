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

const optionsComm = {
	'付款方式': [
		{label: '月结', value: 1},
		{label: '付款买单', value: 2},
	],
	'提货': [
		{label: '已提货', value: '1'},
		{label: '未提货', value: '0'},
		{label: '超期未提货', value: '2'},
	],
	'发票': [
		{label: '已开', value: '1'},
		{label: '未开', value: '2'},
	],
	'毛利润': [
		{label: '毛利润 > 0', value: '1'},
		{label: '毛利润 = 0', value: '2'},
		{label: '毛利润 < 0', value: '3'},
	],
	'费用比例': [
		{label: '符合比例', value: '1'},
		{label: '不符合比例', value: '2'},
	],
	'兑付': [
		{label: '未兑付', value: '1'},
		{label: '已兑付', value: '2'},
	],
	'费用完结': [
		{label: '费用未完结', value: '1'},
		{label: '费用已完结', value: '2'},
	],
	'截单状态': [
		{label: '正常截单',value: 1}, 
		{label: '等通知截单',value: 2}, 
		{label: '开港后截单',value: 3}
	],
	'提单状态': [
		{label: '正常提单',value: 1}, 
		{label: '等通知电放',value: 2}, 
		{label: '已电放',value: 3}, 
		{label: '已seawaybil',value: 4}
	]
}

export const queryParams = ref([
	{
		type: 'input',
		value: '',
		placeholder: '编号、提单号、分箱数据',
		key: 'job_no|bl_no'
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

const rulesInit = (message, type) => {
	if(type == 1){
		return { required: true, message, trigger: 'change' }
	}else{
		return { required: true, message, trigger: 'blur' }
	}
}

export const formList = ref([
	{ 
		tabName: '操作单据',
		formData: [
			{
				formItem: [
					{
						type: 'select',
						value: '',
						label: '业务类型',
						placeholder: '请选择业务类型',
						key: 'order_type_id',
						options: [
							{label: '已业务类型', value: '1'},
							{label: '未业务类型', value: '0'},
							{label: '超期未业务类型', value: '2'},
						],
						rules: rulesInit('请选择业务类型', 1)
					},
					{ type: 'input',value: '',label: '工作编号',placeholder: '请输入工作编号',key: 'job_no',rules: rulesInit('请输入工作编号') },
					{ type: 'input',value: '',label: '合同号',placeholder: '请输入合同号',key: 'contract_no',rules: rulesInit('请输入合同号') },
					{ type: 'date',value: '',label: '归属时间',placeholder: '请选择归属时间',key: 'finish_at',rules: rulesInit('请选择归属时间', 1), dateType: 'date' },
					{ type: 'select',value: '',label: '业务员',placeholder: '请选择业务员',key: 'order_type_id',options: [],rules: rulesInit('请选择业务员', 1) },
					{ type: 'select',value: '',label: '操作员',placeholder: '请选择操作员',key: 'operation_user_id',options: [],rules: rulesInit('请选择操作员', 1) },
					{ type: 'select',value: '',label: '单证员',placeholder: '请选择单证员',key: 'document_user_id',options: [],rules: rulesInit('请选择单证员', 1) },
					{ type: 'select',value: '',label: '商务',placeholder: '请选择商务',key: 'commerce_user_id',options: [],rules: rulesInit('请选择商务', 1) },
					{ type: 'select',value: '',label: '船公司',placeholder: '请选择船公司',key: 'shipping_company_id',options: [],rules: rulesInit('请选择船公司', 1) },
					{ type: 'input',value: '',label: '提单号',placeholder: '请输入提单号',key: 'bl_no',rules: rulesInit('请输入提单号') },
					{ type: 'input',value: '',label: '起运港',placeholder: '请输入起运港',key: 'origin_port',rules: rulesInit('请输入起运港') },
					{ type: 'input',value: '',label: '目的港',placeholder: '请输入目的港',key: 'destination_port',rules: rulesInit('请输入目的港') },
					{ type: 'input',value: '',label: '船名',placeholder: '请输入船名',key: 'ship_name',rules: rulesInit('请输入船名') },
					{ type: 'input',value: '',label: '船次',placeholder: '请输入船次',key: 'ship_no',rules: rulesInit('请输入船次') },
					{ type: 'input',value: '',label: '柜型',placeholder: '请输入柜型',key: 'container_type',rules: rulesInit('请输入柜型') },
					{ type: 'select',value: '',label: '支付方式',placeholder: '请选择支付方式',key: 'payment_method',options: optionsComm['付款方式'],rules: rulesInit('请选择支付方式', 1) },
					{ type: 'select',value: '',label: '截单状态',placeholder: '请选择截单状态',key: 'cutoff_status',options: optionsComm['截单状态'],rules: rulesInit('请选择截单状态', 1) },
					{ type: 'dateTime',value: '',label: '截单时间',placeholder: '请选择截单时间',key: 'cutoff_at',rules: rulesInit('请选择截单时间', 1), format: 'YYYY-MM-DD HH:mm' },
					{ type: 'input',value: '',label: '船期',placeholder: '请输入船期',key: 'sailing_schedule',rules: rulesInit('请输入船期') },
					{ type: 'select',value: '',label: '提单状态',placeholder: '请选择提单状态',key: 'bl_status',options: optionsComm['提单状态'],rules: rulesInit('请选择提单状态', 1) },
					{ type: 'date',value: '',label: '开船日期',placeholder: '请选择开船日期',key: 'sailing_at',rules: rulesInit('请选择开船日期', 1), dateType: 'date' },
					{ type: 'date',value: '',label: '到港日期',placeholder: '请选择到港日期',key: 'arrival_at',rules: rulesInit('请选择到港日期', 1), dateType: 'date' },
					{
						type: 'textarea',
						span: 24,
						value: '',
						label: '归属月份',
						placeholder: '归属月份',
						key: 'finish_at'
					},
				]
			},
			{
				label: '应付款',
			}
		]
	},
	{
		tabName: '委托抬头',
		formData:[]
	},
	{
		tabName: '船货信息',
		formData:[]
	},
	{
		tabName: '上传文件',
		formData:[]
	}
])