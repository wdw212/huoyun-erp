<template>
	<div class="invoice-container">
		<div class="header">此页面为一份人民币发票和一份美金发票，需区分普通发票和专用发票(一份普通发票和一份专用发票，需开两份发票)
			如需打印费用单在下方上传，单子完结“是”后不能再增开发票，为此单结束。</div>
		<el-form label-width="120px">
			<!-- 头部信息 -->
			<el-row>
				<el-col :span="11">
					<el-row>
						<el-col :span="12" style="flex: 0 0 44%;">
							<div class="section mb30">
								<el-form-item label="工作编号：" label-width="87px">
									<el-input v-model="form.workNumber" style="width: 130px"
										placeholder="HQ4-WHJ25002" />
								</el-form-item>
								<el-form-item label="手机/邮箱：" label-width="87px">
									<el-input v-model="form.phone" style="width: 130px" />
								</el-form-item>
								<el-form-item label="税点：" label-width="87px">
									<el-input v-model="form.phone" style="width: 130px" />
								</el-form-item>

							</div>
						</el-col>
						<el-col :span="12">
							<div class="section">
								<el-form-item label="发票名称：" label-width="85px">
									<!--  <el-select v-model="form.invoiceType" placeholder="专用电子发票" style="width:130px">
                      <el-option label="普通发票" value="normal" />
                      <el-option label="专用发票" value="special" />
                    </el-select> -->
									<el-select v-model="form.invoiceType" placeholder="专用电子发票" style="width:130px">
										<el-option v-for="item in invoiceTypeList" :key="item.id" :label="item.label"
											:value="item.id" />
									</el-select>
								</el-form-item>
								<el-form-item label="备注：" label-width="85px">
									<el-input v-model="form.email" style="width: 130px" />
								</el-form-item>
								<el-form-item label="税额：" label-width="87px">
									<el-input v-model="form.phone" style="width: 130px" />
								</el-form-item>
							</div>
						</el-col>
					</el-row>
				</el-col>
				<el-col :span="6">
					<div class="logo"><img src="../assets/logo.jpg"></div>
				</el-col>
				<!-- 开票日期 -->
				<el-col :span="7">
					<div class="section mb30">
						<el-form-item label="单子完结">
							<el-switch v-model="value1" class="mb-2" inline-prompt @change="handleSwitch" />
							<el-input v-model="form.number" style="width: 150px; margin-left: 20px"
								:disabled="form.isDisabled" />
						</el-form-item>
						<el-form-item label="开票日期：">
							<el-input v-model="form.email" style="width: 210px" />
						</el-form-item>
					</div>
				</el-col>
			</el-row>
			<!-- 大表格定义边框4*4-->
			<div style="width: 100%;overflow-x: auto;margin-bottom: 20px;">
				<table border class="wrapper">
					<tbody>
						<tr>
							<td style="width: 40px">购买方信息</td>
							<!-- 购买方信息 -->
							<td>
								<div class="section">
									<el-form-item label="名称：" class="society">
										<el-select v-model="buyer.name" style="width: 350px" placeholder="请选择">
											<el-option v-for="item in buyerOptions" :key="item.value" :label="item.label"
												:value="item.value" place />
										</el-select>
									</el-form-item>
									<el-form-item label="统一社会信用代码：" class="society">
										<el-input v-model="buyer.taxNumber" style="width: 350px" />
									</el-form-item>
								</div>
							</td>
							<td style="width: 40px">销售方信息</td>
							<td>
								<!-- 销售方信息 -->
								<div class="section">
									<el-form-item label="名称：" class="society">
										<el-select v-model="seller.name" style="width: 350px" placeholder="请选择">
											<el-option v-for="item in sellerOptions" :key="item.value" :label="item.label"
												:value="item.value" place />
										</el-select>
									</el-form-item>
									<el-form-item label="统一社会信用代码：" class="society">
										<el-input v-model="seller.taxNumber" style="width: 350px" />
									</el-form-item>
								</div>
							</td>
						</tr>
						<tr>
							<td>人民币发票</td>
							<td style="vertical-align:top">
								<!-- 项目明细表格 左侧 -->
								<div class="section">
									<el-table :data="tableDataCNY" border style="width: 100%" fit show-summary sum-text="合计"
										:summary-method="getSummaries">
										<el-table-column type="index" label="序号" width="60"></el-table-column>
										<el-table-column prop="name" label="项目名称" width="160">
											<template #default>
												<el-select v-model="items.fee_type_id" placeholder="我要显示七个字" filterable
													remote>
													<el-option v-for="opt in itemOptions" :key="opt" :label="opt"
														:value="opt" />
												</el-select>
											</template>
										</el-table-column>
										<el-table-column label="单位" width="75">
											<template #default="{ row }">
												<el-input v-model="row.unit" />
											</template>
										</el-table-column>
										<el-table-column label="数量" width="75">
											<template #default="{ row }">
												<el-input v-model="row.quantity" />
											</template>
										</el-table-column>
										<el-table-column label="金额" width="115">
											<template #default="{row}">
												<el-input v-model="row.totalPrice" type="number"></el-input>
											</template>
										</el-table-column>
										<el-table-column width="80">
											<template #header>
												<el-button type="primary" @click="addRow"
													:disabled="items.length == 8 ? true : false">增行</el-button>
											</template>
											<template v-if="items.length>0" #default="{ $index }">
												<el-button type="text" @click="delRow($index)" class="del">删除</el-button>
											</template>
										</el-table-column>
									</el-table>
									<el-row>
										<el-col :span="16" :offset="11">
											<div class="total-btns">
												<!-- <div class="total">合计：</div> -->
												<div class="flex gap-4 items-center">
													<!-- <el-input v-model="total.number" style="width: 100px" /> -->
													<el-form-item label="人民币发票号：">
														<el-input v-model="rmbType" style="width: 180px"
															placeholder="25932000000029068754" />
													</el-form-item>
												</div>
											</div>
				
										</el-col>
									</el-row>
								</div>
							</td>
							<!-- 项目明细表格 右侧 -->
							<td>美金发票</td>
							<td style="vertical-align:top">
								<div class="section">
									<el-table :data="tableDataUSD" border style="width: 100%" show-summary sum-text="合计"
										:summary-method="getSummariesR">
										<el-table-column type="index" label="序号" width="60"></el-table-column>
										<el-table-column prop="name" label="项目名称" width="160">
											<template #default>
												<el-select v-model="itemss.fee_type_id" placeholder="我要显示七个字" filterable
													remote>
													<el-option v-for="opt in itemOptions" :key="opt" :label="opt"
														:value="opt" />
												</el-select>
											</template>
										</el-table-column>
										<el-table-column label="单位" width="75">
											<template #default="{ row }">
												<el-input v-model="row.unit" />
											</template>
										</el-table-column>
										<el-table-column label="数量" width="75">
											<template #default="{ row }">
												<el-input v-model="row.quantity" />
											</template>
										</el-table-column>
										<el-table-column label="金额" width="115">
											<template #default="{row}">
												<el-input v-model="row.totalPrice" type="number"></el-input>
											</template>
										</el-table-column>
										<el-table-column width="80">
											<template #header>
												<el-button type="primary" @click="addRoww">增行</el-button>
											</template>
											<template v-if="itemss.length>0" #default="{ $index }">
												<el-button type="text" @click="delRoww($index)" class="del">删除</el-button>
											</template>
										</el-table-column>
									</el-table>
									<el-row>
										<el-col :span="16" :offset="11">
											<div class="total-btns">
												<!-- <div class="total">合计：</div> -->
												<div class="flex gap-4 items-center">
													<!-- <el-input v-model="total.number" style="width: 100px" /> -->
													<el-form-item label="美金发票号：">
														<el-input v-model="dollarType" style="width: 180px"
															placeholder="25932000000029068754" />
													</el-form-item>
												</div>
											</div>
										</el-col>
									</el-row>
								</div>
							</td>
						</tr>
						<tr>
							<!-- 人民币备注-->
							<td>人民币备注</td>
							<td>
								<div class="section">
									<el-input v-model="remarkCNY" :rows="6" type="textarea" placeholder="人民币备注" />
								</div>
							</td>
							<!-- 美元备注-->
							<td>美元备注</td>
							<td>
								<div class="section">
									<el-input v-model="remarkUSD" :rows="6" type="textarea" placeholder="美元备注" />
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<!-- 模板信息-->
			<el-row>
				<el-col :span="12">
					<div class="section flex">
						<el-form-item label="模板名称：">
							<el-input v-model="form.email" style="width: 150px" />
						</el-form-item>
						<el-button type="primary" class="ml20">保存模板</el-button>
						<el-button>删除模板</el-button>
					</div>
					<div class="mt10">
						<el-button type="primary" class="ml20">模板名称一</el-button>
						<el-button type="primary">模板名称二</el-button>
						<el-button type="primary">模板名称三</el-button>
					</div>
				</el-col>
				<el-col :span="12">
					<!-- 操作按钮 -->
					<div class="action-btns">
						<el-button type="primary">人民币发票预览</el-button>
						<el-button>美元发票预览</el-button>
						<el-button type="success">保存</el-button>
						<el-button>业务单据</el-button>
					</div>
				</el-col>
			</el-row>
		</el-form>
	</div>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue'
	import {
		httpPost,
		httpGet,
		httpPut,
		httpDelete
	} from '@/api/apiCommon';
	const remarkCNY = ref('')
	const tableDataCNY = ref([])
	const tableDataUSD = ref([])
	const invoiceFormObj = ref(null) //备注
	const props = defineProps({
		invoiceForm: {
			type: [Object, Array],
			default: null
		},
		type: {
			type: [Number, String],
			default: 0,
		}
	})
	watch(props.type, (newVal) => {
		if (props.type == 1) {
			invoiceFormObj.value = JSON.parse(JSON.stringify(props.invoiceForm))
			remarkCNY.value = invoiceFormObj.value.remark
			if (invoiceFormObj.value.orderBillItems.length > 0) {
				tableDataCNY.value = []
				tableDataUSD.value = []
				invoiceFormObj.value.orderBillItems.forEach(item => {
					if (item.currency == 'cny') {
						item.totalPrice = item.quantity * item.price
						tableDataCNY.value.push(item)
					} else if (item.currency == 'usd') {
						item.totalPrice = item.quantity * item.price
						tableDataUSD.value.push(item)
					}
				})
			}
		}
	}, {
		immediate: true
	})
	const form = ref({
		workNumber: '',
		phone: '',
		invoiceType: '',
		email: '',
		dollarType: '',
		rmbType: '',
		isDisabled: true,
	})

	const buyer = ref({
		name: '',
		taxNumber: ''
	})

	const seller = ref({
		name: '',
		taxNumber: ''
	})
	const items = ref([{
		name: '',
		unit: '',
		quantity: null,
		formattedValue: 0
	}])
	const itemss = ref([{
		name: '',
		unit: '',
		quantity: null,
		formattedValue: 0
	}])
	const value1 = ref(false)
	const handleSwitch = (val) => {
		if (val == true) {
			console.log(form.value)
			form.value.isDisabled = false
		} else {
			form.value.isDisabled = true
		}
	};
	const buyerOptions = [{
			label: '单位1',
			value: 'unit1'
		},
		{
			label: '单位2',
			value: 'unit2'
		}
	]
	const sellerOptions = [{
			label: '单位1',
			value: 'unit1'
		},
		{
			label: '单位2',
			value: 'unit2'
		}
	]
	const itemOptions = ['服务费', '咨询费', '技术服务费']

	// const total = computed(() => {
	//   return items.value.reduce((sum, item) => sum + (item.formattedValue || 0), 0).toFixed(2)
	// })

	const addRow = () => {
		if (items.value.length < 8) {
			items.value.push({
				name: '',
				unit: '',
				quantity: null,
				formattedValue: 0
			})
		}
	}
	const addRoww = () => {
		if (itemss.value.length < 8) {
			itemss.value.push({
				name: '',
				unit: '',
				quantity: null,
				formattedValue: 0
			})
		}
	}
	const delRow = (index) => {
		items.value.splice(index, 1)
	}
	const delRoww = (index) => {
		itemss.value.splice(index, 1)
	}
	/*小数点后两位*/
	const rawValue = ref('');
	const formattedValue = computed({
		get() {
			return rawValue.value;
		},
		set(value) {
			// 只允许输入小数点后两位的数字
			rawValue.value = value.replace(/[^0-9.]/g, '').replace(/(\.\d\d).*$/, '$1');
		}
	});
	const handleInput = (value) => {
		// 你可以在这里添加更多的逻辑，比如验证等
	};
	// 合计最后一行，只在第五列显示数值，其他为空
	const getSummaries = (param) => {
		const {
			columns,
			data
		} = param;
		const sums = [];

		// 初始化所有列汇总值为空
		columns.forEach((column, index) => {
			if (index === 0) {
				sums[index] = '合计'
			} else {
				sums[index] = '';
			}
		});

		// 计算第五列（索引为4）的总和
		const sumValue = data.reduce((acc, item) => acc + Number(item.formattedValue), 0).toFixed(2);
		sums[4] = `${sumValue}`; // 第五列显示汇总值

		return sums;
	}
	const getSummariesR = (param) => {
		const {
			columns,
			data
		} = param;
		const sums = [];

		// 初始化所有列汇总值为空
		columns.forEach((column, index) => {
			if (index === 0) {
				sums[index] = '合计'
			} else {
				sums[index] = '';
			}
		});

		// 计算第五列（索引为4）的总和
		const sumValue = data.reduce((acc, item) => acc + Number(item.formattedValue), 0).toFixed(2);
		sums[4] = `${sumValue}`; // 第五列显示汇总值

		return sums;
	}
	// 发票名称
	const invoiceTypeList = ref([])

	function getInvoiceTypeList() {
		httpGet(`/invoice-types`, {
			is_paginate: 0
		}).then(res => {
			if (res.data.length > 0) {
				invoiceTypeList.value = res.data
				invoiceTypeList.value.forEach(item => {
					item.label = `${item.type===0?'普':'专'}---${item.name}`
				})
			}
		});
	}
	getInvoiceTypeList()
</script>

<style scoped>
	.invoice-container {
		max-width: 1280px;
		margin: 0 auto;
		position: relative;
	}

	:deep .el-form-item__label {
		color: #800;
	}

	.society :deep .el-form-item__label {
		width: 150px !important;
	}

	.header {
		color: #333;
		font-size: 13px;
		background: #f5f5f5;
		text-align: center;
		padding: 10px;
		margin-bottom: 20px;
	}

	.logo {
		position: absolute;
		left: 42%;
		top: -7px;
		z-index: -1;
	}

	.mb30 {
		margin-bottom: 30px !important;
	}

	.logo img {
		max-width: 300px;
	}

	.flex {
		display: flex;
	}

	.ml20 {
		margin-left: 20px;
	}

	:deep .del {
		color: red;
	}

	.wrapper {
		border-collapse: collapse;
		/* 合并表格边框 */
		/* width: 100%; */
		/* 设置表格宽度 */
		margin: 20px 0 0;
		/* 设置外边距 */
		border: 1px solid #800;
	}

	.wrapper th,
	.wrapper td {
		border: 1px solid #800;
		/* 设置边框 */
		padding: 8px;
		/* 设置内边距 */
		text-align: left;
		/* 文本对齐方式 */
	}

	.section {
		margin-bottom: 10px;
		/* border: 1px solid #ebeef5;
  border-radius: 4px; */
	}

	h3 {
		margin: 0 0 20px 0;
		color: #409eff;
	}

	.total {
		text-align: right;
		padding: 10px;
		font-weight: bold;
		width: 100px;
	}

	.total-btns {
		display: flex;
		align-items: center;
		margin-top: 12px;
	}

	:deep .total-btns .el-form-item {
		margin-bottom: 0;
	}

	.action-btns {
		text-align: center;
	}

	.gap-4 {
		gap: 1rem;
	}

	.items-center {
		align-items: center;
	}
</style>