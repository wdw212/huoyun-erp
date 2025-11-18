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
									<el-input v-model="form.job_no" style="width: 130px"
										placeholder="HQ4-WHJ25002"  disabled/>
								</el-form-item>
								<el-form-item label="手机/邮箱：" label-width="87px">
									<el-input v-model="form.email" style="width: 130px" />
								</el-form-item>
								<el-form-item label="税点：" label-width="87px">
									<el-input v-model="percentageValue" style="width: 130px" disabled/>
								</el-form-item>

							</div>
						</el-col>
						<el-col :span="12">
							<div class="section">
								<el-form-item label="发票名称：" label-width="85px">
									<el-select v-model="form.invoice_type_id" placeholder="专用电子发票" style="width:100%" @change="changeInvoiceType($event)">
										<el-option v-for="item in invoiceTypeList" :key="item.id" :label="item.label"
											:value="item.id" />
									</el-select>
								</el-form-item>
								<el-form-item label="备注：" label-width="85px">
									<el-input v-model="form.remark" style="width: 100%" />
								</el-form-item>
								<el-form-item label="税额：" label-width="87px">
									<el-input v-model="calculations.tax_amount" style="width: 100%" disabled/>
								</el-form-item>
							</div>
						</el-col>
					</el-row>
				</el-col>
				<el-col :span="4">
					<div class="logo"><img src="../assets/invoice_logo.png"></div>
				</el-col>
				<!-- 开票日期 -->
				<el-col :span="7">
					<div class="section mb30">
						<el-form-item label="单子完结">
							<el-switch v-model="form.is_finish" class="mb-2" inline-prompt @change="handleSwitch" />
							<el-input v-model="form.commission" style="width: 150px; margin-left: 20px"
								:disabled="form.is_finish" />
						</el-form-item>
						<el-form-item label="开票日期：">
							<el-input v-model="form.invoice_date" style="width: 210px" disabled/>
						</el-form-item>
					</div>
				</el-col>
			</el-row>
			<!-- 大表格定义边框4*4-->
			<div style="width: 100%;overflow-x: auto;margin-bottom: 20px;">
				<div border class="wrapper">
					<div class="flex flex-column">
						<div class="d-flex w-100" style="border-bottom: 1px solid #800;">
							<div style="width: 40px;border-right: 1px solid #800;" class="vertical-text flex0">购买方信息</div>
							<!-- 购买方信息 -->
							<div class="flex-1 pt-1" style="box-sizing: border-box;">
								<div class="section">
									<el-form-item label="名称：" class="society" style="width: 90%;">
										<el-select v-model="form.purchase_entity_id" placeholder="请选择" @change="changePurchaseUscCode($event)">
											<el-option v-for="item in COMPANY_HEADERS_LIST" :key="item.id" :label="item.company_name"
												:value="item.id" place />
										</el-select>
									</el-form-item>
									<el-form-item label="统一社会信用代码：" class="society" style="width: 90%;">
										<el-input v-model="form.purchase_usc_code" disabled/>
									</el-form-item>
								</div>
							</div>
							<div style="width: 40px;border-right: 1px solid #800;border-left: 1px solid #800;" class="vertical-text flex0">销售方信息</div>
							<div class="flex-1">
								<!-- 销售方信息 -->
								<div class="section pt-1">
									<el-form-item label="名称：" class="society" style="width: 90%;">
										<el-select v-model="form.sale_entity_id" placeholder="请选择" @change="changeSaleUscCode($event)" disabled>
											<el-option v-for="item in sellerOptions" :key="item.id" :label="item.name"
												:value="item.id" place />
										</el-select>
									</el-form-item>
									<el-form-item label="统一社会信用代码：" class="society" style="width: 90%;">
										<el-input v-model="form.sale_usc_code" disabled/>
									</el-form-item>
								</div>
							</div>
						</div>
						<div class="d-flex w-100" style="border-bottom: 1px solid #800;">
							<div style="width: 40px;border-right: 1px solid #800;" class="vertical-text flex0">人民币发票</div>
							<div style="vertical-align:top; width: 0" class="flex-1">
								<!-- 项目明细表格 左侧 -->
								<div class="w-100 section">
									<el-table :data="tableDataCNY" border style="width: 100%;font-size: 12px;" fit show-summary sum-text="合计"
										:summary-method="getSummaries">
										<el-table-column type="index" width="50" align="center"></el-table-column>
										<el-table-column prop="name" label="项目名称" width="" align="center">
											<template #default="{row}">
												<el-select v-model="row.fee_type_id" placeholder="我要显示七个字" filterable
													remote @change="changeFeeTypeCNY()">
													<el-option v-for="opt in FEE_TYPES_LIST_CNY" :key="opt.id" :label="opt.name"
														:value="opt.id" />
												</el-select>
											</template>
										</el-table-column>
										<el-table-column label="单位" width="60" align="center">
											<template #default="{ row }">
												<el-input v-model="row.unit" />
											</template>
										</el-table-column>
										<el-table-column label="数量" width="60" align="center">
											<template #default="{ row }">
												<el-input v-model="row.quantity" />
											</template>
										</el-table-column>
										<el-table-column label="金额" width="60" align="center">
											<template #default="{row}">
												<el-input v-model="row.amount" type="number"></el-input>
											</template>
										</el-table-column>
										<el-table-column width="80" align="center">
											<template #header>
												<el-button type="primary" size="mini" @click="addRow"
													:disabled="tableDataCNY.length == 10 ? true : false">增行</el-button>
											</template>
											<template v-if="tableDataCNY.length>1" #default="{ $index }">
												<el-button type="text" @click="delRow($index)" class="del">删除</el-button>
											</template>
										</el-table-column>
									</el-table>
									<div>
										<div>
											<div class="total-btns">
												<!-- <div class="total">合计：</div> -->
												<div class="flex j-end w-100 pr-2">
													<!-- <el-input v-model="total.number" style="width: 100px" /> -->
													<el-form-item label="人民币发票号：">
														<el-input v-model="form.cny_invoice_no" style="width: 180px"
															placeholder="25932000000029068754" />
													</el-form-item>
												</div>
											</div>
				
										</div>
									</div>
								</div>
							</div>
							<!-- 项目明细表格 右侧 -->
							<div style="width: 40px;border-left: 1px solid #800;border-right: 1px solid #800;" class="vertical-text flex0">美金发票</div>
							<div style="vertical-align:top; width: 0" class="flex-1">
								<div class="section w-100 ">
									<el-table :data="tableDataUSD" border style="width: 100%" show-summary sum-text="合计"
										:summary-method="getSummariesR">
										<el-table-column type="index" width="50" align="center"></el-table-column>
										<el-table-column prop="name" label="项目名称" width="" align="center">
											<template #default="{row}">
												<el-select v-model="row.fee_type_id" placeholder="我要显示七个字" filterable
													remote @change="changeFeeTypeUSD()">
													<el-option v-for="opt in FEE_TYPES_LIST_USD" :key="opt.id" :label="opt.name"
														:value="opt.id" />
												</el-select>
											</template>
										</el-table-column>
										<el-table-column label="单位" width="60" align="center">
											<template #default="{ row }">
												<el-input v-model="row.unit" />
											</template>
										</el-table-column>
										<el-table-column label="数量" width="60" align="center">
											<template #default="{ row }">
												<el-input v-model="row.quantity" />
											</template>
										</el-table-column>
										<el-table-column label="金额" width="60" align="center">
											<template #default="{row}">
												<el-input v-model="row.amount" type="number"></el-input>
											</template>
										</el-table-column>
										<el-table-column width="70" align="center">
											<template #header>
												<el-button type="primary" @click="addRoww" :disabled="tableDataUSD.length == 10 ? true : false">增行</el-button>
											</template>
											<template v-if="tableDataUSD.length>1" #default="{ $index }">
												<el-button type="text" @click="delRoww($index)" class="del">删除</el-button>
											</template>
										</el-table-column>
									</el-table>
									<div>
										<div :span="10" :offset="11">
											<div class="total-btns">
												<!-- <div class="total">合计：</div> -->
												<div class="flex j-end w-100 pr-2">
													<!-- <el-input v-model="total.number" style="width: 100px" /> -->
													<el-form-item label="美金发票号：">
														<el-input v-model="form.usd_invoice_no" style="width: 180px"
															placeholder="25932000000029068754" />
													</el-form-item>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="d-flex w-100" style="border-bottom: 1px solid #800;">
							<!-- 人民币备注-->
							<div style="width: 40px;border-right: 1px solid #800;" class="vertical-text flex0">人民币备注</div>
							<div class="flex-1">
								<div class="section mt-1 mx-1">
									<el-input v-model="remarkCNY" :rows="6" type="textarea" placeholder="人民币备注" />
								</div>
							</div>
							<!-- 美元备注-->
							<div style="width: 40px;border-left: 1px solid #800;border-right: 1px solid #800;" class="vertical-text flex0">美元备注</div>
							<div class="flex-1">
								<div class="section mt-1 mx-1">
									<el-input v-model="remarkUSD" :rows="6" type="textarea" placeholder="美元备注" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- 模板信息-->
			<el-row>
				<el-col :span="12">
					<div class="section d-flex">
						<el-form-item label="模板名称：">
							<el-input v-model="templatesName" style="width: 150px" />
						</el-form-item>
						<el-button type="primary" class="ml20" @click="saveInvoicesTemplates">保存模板</el-button>
						<!-- <el-button>删除模板</el-button> -->
					</div>
					<div class="flex-1 pb-2" style="overflow-y: auto;max-height: 100px;">
						<div :class="['b-0','radius10','mr-1','mt-1',invoicesCurrent== index?'colorBlue':'colorBlack']" v-for="(item, index) in invoiceTemplatesList" :key="index" :style="{display: 'inline-block',borderRadius: '5px'}">
							<span class="px-2 py-1" style="display: inline-block;" @click="selectTemplates(item,index)">{{item.name}}</span>
							<el-button class="icon-color-black" :style="{background: invoicesCurrent== index?'#409EFF': '#fff'}" icon="Delete" @click="handlePaySureDelete(item,index)"></el-button>
						</div>
					</div>
				</el-col>
				<el-col :span="12">
					<!-- 操作按钮 -->
					<div class="action-btns">
						<el-button type="primary" @click="exportImg(1)">人民币发票预览</el-button>
						<el-button>美元发票预览</el-button>
						<el-button type="success" @click="submit">保存</el-button>
						<el-button>业务单据</el-button>
					</div>
				</el-col>
			</el-row>
		</el-form>
		<div id="cost-confirmation-content_invoice" style="width: 80%; padding: 20px; position: fixed;z-index: -1;top: -2000px;left: -1000px">
			<div class="p-r">
				<div class="flex j-center">
					<div style="width: 600px;">
						<img class="w-100" v-if="invoiceLogoType== 0" src="../assets/pu_invoice_logo.png">
						<img class="w-100" v-else src="../assets/zhuan_invoice_logo.png">
					</div>
				</div>
				<div class="p-a font-16" style="top: 30%;right: 20px;">
					<div class="mb-2"><span class="color-800">发票号码：</span>{{exportiInvoiceNo}}</div>
					<div><span class="color-800">开票日期：</span>{{form.invoice_date}}</div>
				</div>
			</div>
			<!-- 大表格定义边框4*4-->
			<div style="width: 100%;overflow-x: auto;margin-bottom: 20px;">
				<div border class="wrapper">
					<div class="flex flex-column">
						<div class="d-flex w-100" style="border-bottom: 1px solid #800;">
							<div style="width: 40px;border-right: 1px solid #800;height: 100%;padding-top: 12px;" class="font-14 d-flex flex-column j-center a-center color-800">购<br />买<br />方<br />信<br />息</div>
							<!-- 购买方信息 -->
							<div class="flex-1 pt-1" style="box-sizing: border-box;">
								<div class="section">
									<el-form-item label="名称：" class="society" style="width: 90%;">
										<p>{{form.purchase_entity_id?COMPANY_HEADERS_LIST.filter(itemIndex => (itemIndex.id== form.purchase_entity_id))[0]?.company_name: ''}}</p>
										<!-- <el-select v-model="form.purchase_entity_id" placeholder="请选择" @change="changePurchaseUscCode($event)">
											<el-option v-for="item in COMPANY_HEADERS_LIST" :key="item.id" :label="item.company_name"
												:value="item.id" place />
										</el-select> -->
									</el-form-item>
									<el-form-item label="统一社会信用代码：" class="society" style="width: 90%;">
										<p>{{form.purchase_usc_code}}</p>
										<!-- <el-input v-model="form.purchase_usc_code" disabled/> -->
									</el-form-item>
								</div>
							</div>
							<div style="width: 40px;border-right: 1px solid #800;border-left: 1px solid #800;padding-top: 10px;text-align: center;" class="font-14 color-800">销<br />售<br />方<br />信<br />息</div>
							<div class="flex-1">
								<!-- 销售方信息 -->
								<div class="section pt-1">
									<el-form-item label="名称：" class="society" style="width: 90%;">
										<p>{{form.sale_entity_id?sellerOptions.filter(itemIndex => (itemIndex.id== form.sale_entity_id))[0]?.name: ''}}</p>
										<!-- <el-select v-model="form.sale_entity_id" placeholder="请选择" @change="changeSaleUscCode($event)" disabled>
											<el-option v-for="item in sellerOptions" :key="item.id" :label="item.name"
												:value="item.id" place />
										</el-select> -->
									</el-form-item>
									<el-form-item label="统一社会信用代码：" class="society" style="width: 90%;">
										<p>{{form.sale_usc_code}}</p>
									</el-form-item>
								</div>
							</div>
						</div>
						<div class="d-flex w-100" style="border-bottom: 1px solid #800;">
							<!-- <div style="width: 40px;border-right: 1px solid #800;" class="vertical-text flex0">人民币发票</div> -->
							<div style="vertical-align:top; width: 0" class="flex-1">
								<!-- 项目明细表格 左侧 -->
								<div class="w-100 section exportImg">
									<el-table :data="tableData" border style="width: 100%;font-size: 12px;" fit show-summary sum-text="合计"
										:summary-method="getSummariesToTal">
										<el-table-column type="index" width="50" align="center"></el-table-column>
										<el-table-column prop="name" label="项目名称" width="" align="center">
											<template #default="{row}">
												<p>{{row.fee_type_id?FEE_TYPES_LIST_CNY.filter(itemIndex => (itemIndex.id== row.fee_type_id))[0]?.name: ''}}</p>
												<!-- <el-select v-model="row.fee_type_id" placeholder="我要显示七个字" filterable
													remote @change="changeFeeTypeCNY()">
													<el-option v-for="opt in FEE_TYPES_LIST_CNY" :key="opt.id" :label="opt.name"
														:value="opt.id" />
												</el-select> -->
											</template>
										</el-table-column>
										<el-table-column label="规格型号" width="60" align="center"></el-table-column>
										<el-table-column label="单位" width="150" align="center" prop="unit"></el-table-column>
										<el-table-column label="数量" width="100" align="center" prop="quantity"></el-table-column>
										<el-table-column label="单价" width="60" align="center"></el-table-column>
										<el-table-column label="金额" width="200" align="center" prop="no_tax_amount"></el-table-column>
										<el-table-column label="税率/征收率" width="150" align="center" prop="tax_rate"></el-table-column>
										<el-table-column label="税额" width="200" align="center" prop="tax_amount"></el-table-column>
									</el-table>
								</div>
							</div>
						</div>
						<div class="d-flex w-100 font-16" style="border-bottom: 1px solid #800;height: ;">
							<!-- 人民币备注-->
							<div style="width: 200px;border-right: 1px solid #800;" class="flex0 py-2 color-800 ">价税合计(大写)</div>
							<div class="flex-1 flex2">
								<div class="section mt-1 mx-1">
								
									<p>{{exportTotal}}</p>
									<!-- <el-input v-model="remarkCNY" :rows="6" type="textarea" placeholder="人民币备注" /> -->
								</div>
								<p><span class="color-800 font-12">（小写）</span>￥{{exportTotalNum}}</p>
							</div>
						</div>
						<div class="d-flex w-100" style="border-bottom: 1px solid #800;">
							<!-- 人民币备注-->
							<div style="width: 40px;border-right: 1px solid #800;text-align: center;" class="py-2 color-800 font-14">备<br />注</div>
							<div class="flex-1">
								<div class="section mt-1 mx-1">
									<p v-html="exportRemark"></p>
									<!-- <el-input v-model="remarkCNY" :rows="6" type="textarea" placeholder="人民币备注" /> -->
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import {timeto } from '@/utils/index';
	import { NumberToChinese, convertNumber, convertToMoney } from '@/utils/number-to-chinese.js';
	import html2canvas from "html2canvas";
	import userStore from "@/store/modules/user";
	import {
		ref,
		computed,
		reactive ,
		onMounted,
		nextTick
	} from 'vue'
	import {
		httpPost,
		httpGet,
		httpPut,
		httpDelete
	} from '@/api/apiCommon';
	import {
		getXHDW
	} from '@/api/commonList';
	const {
		proxy
	} = getCurrentInstance();
import { find } from 'lodash';
const Emit= defineEmits(['close'])
	// 添加加载状态
	const isSellerOptionsLoaded = ref(false)
	const templatesName= ref('')
	const remarkCNY = ref('')
	const remarkUSD = ref('')
	const tableDataCNY = ref([{fee_type_id: '',unit: '',quantity: null,amount: 0}])
	const tableDataUSD = ref([{fee_type_id: '',unit: '',quantity: null,amount: 0}])
	const invoiceFormObj = ref(null) //备注
	// 模板
	const invoiceTemplatesList = ref([])
	const invoicesCurrent = ref(9999)
	const rolesListYW= ['SUPER_ADMIN','BUSINESS']
	const rolesListCW= ['SUPER_ADMIN','FINANCE']
	const disabledYWEdit= ref(false) 
	const disabledCWEdit= ref(false) 
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
	const sellerOptions = ref([])
	// 表单数据，不包含计算字段
	const form = ref({
		order_id: '',
	    job_no: '',
	    invoice_type_id: '',
	    email: '',
	    remark: '',
	    tax_rate: '',
	    commission: '',
	    is_finish: true,
	    purchase_entity_id: '',
	    purchase_usc_code: '',
	    sale_entity_id: '',
	    sale_usc_code: '',
	    cny_remark: '',
	    usd_remark: '',
	    invoice_date: timeto(new Date().getTime(), 'ymd', '-'),
	    tax_amount: 0,
		cny_invoice_no: '',
		usd_invoice_no: ''
	})
	onMounted(async () => {
	    try {
			// console.log(userStore().roles,'setKeyInfo')
	        sellerOptions.value = await getXHDW()
	        isSellerOptionsLoaded.value = true
	    } catch (error) {
	        console.error('错误提示：', error)
	    }
	})
	watch([() => props.type, isSellerOptionsLoaded], ([newType, loaded]) => {
		if(loaded){
			invoiceFormObj.value = JSON.parse(JSON.stringify(props.invoiceForm))
			form.value.order_id= invoiceFormObj.value.order_id
			form.value.sale_entity_id= invoiceFormObj.value.seller_id
			console.log(form.value,'form.value')
			changeSaleUscCode(form.value.sale_entity_id)
			showDefaultData(newType)
		}
		
	}, {
		immediate: true
	})
	// 默认的选择
	function showDefaultData(type){
		if (type == 1) {
			remarkCNY.value = invoiceFormObj.value.remark?invoiceFormObj.value.remark: ''
			remarkUSD.value = invoiceFormObj.value.remark? invoiceFormObj.value.remark: ''
			console.log(form.value.sale_entity_id,'form.value.sale_entity_id')
			if (invoiceFormObj.value.orderBillItems.length > 0) {
				tableDataCNY.value = []
				tableDataUSD.value = []
				invoiceFormObj.value.orderBillItems.forEach(item => {
					if (item.currency == 'cny') {
						item.amount = item.quantity * item.price
						tableDataCNY.value.push(item)
					} else if (item.currency == 'usd') {
						item.amount = item.quantity * item.price
						tableDataUSD.value.push(item)
					}
				})
			}else{
				tableDataCNY.value= [{fee_type_id: '',unit: '',quantity: null,amount: 0}]
				tableDataUSD.value= [{fee_type_id: '',unit: '',quantity: null,amount: 0}]
			}
		}
	}
	
	// 计算税额
	// 所有计算字段单独定义
	// 不含税金额*（1+税率）=总金额
	// 税额=总金额-不含税金额
	const calculations = reactive({
			tax_amount: computed(() => {
			  const sum = tableDataCNY.value.reduce((acc, item) => 
			    acc + Number(item.amount || 0), 0
			  )
			  const taxRate = Number(form.value.tax_rate) || 0
			  const result = sum * taxRate
			  console.log(sum,'result')
			  console.log(result,'result')
			  return Number(result.toFixed(2))
			})
	  
	  // 可以添加其他计算字段
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
	const itemOptions = ['服务费', '咨询费', '技术服务费']

	// const total = computed(() => {
	//   return items.value.reduce((sum, item) => sum + (item.formattedValue || 0), 0).toFixed(2)
	// })

	const addRow = () => {
		if (tableDataCNY.value.length < 8) {
			tableDataCNY.value.push({
				fee_type_id: '',
				unit: '',
				quantity: null,
				amount: 0,
			})
		}
	}
	const addRoww = () => {
		if (tableDataUSD.value.length < 8) {
			tableDataUSD.value.push({
				fee_type_id: '',
				unit: '',
				quantity: null,
				formattedValue: 0
			})
		}
	}
	const delRow = (index) => {
		tableDataCNY.value.splice(index, 1)
		remarkCNY.value= changeFeeType(tableDataCNY.value,FEE_TYPES_LIST_CNY.value)
		
	}
	const delRoww = (index) => {
		tableDataUSD.value.splice(index, 1)
		remarkUSD.value= changeFeeType(tableDataUSD.value,FEE_TYPES_LIST_USD.value)
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
		const sumValue = data.reduce((acc, item) => acc + Number(item.amount), 0).toFixed(2);
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
	const FEE_TYPES_LIST_CNY=ref([])
	const FEE_TYPES_LIST_USD=ref([])
	// 项目名称RMB/USD
	function getfeeTypesList(type) {
		httpGet(`/fee-types`, {
			is_paginate: 0,
			type: type
		}).then(res => {
			console.log(res,'res509')
			if(type=== 'cny'){
				FEE_TYPES_LIST_CNY.value= res.data
			}else if(type=== 'usd'){
				FEE_TYPES_LIST_USD.value= res.data
			}
		});
	}
	getfeeTypesList('cny')
	getfeeTypesList('usd')
	
	const COMPANY_HEADERS_LIST= ref([])
	// 委托抬头--购买方单位
	function getCompanyHeadersList() {
		httpGet(`/company-headers`, {
			is_paginate: 0,
			company_type: 0
		}).then(res => {
			COMPANY_HEADERS_LIST.value= res.data
		});
	}
	getCompanyHeadersList()
	
	
	// 获取税点税额
	function changeInvoiceType(e){
		console.log(form.value,'form.value')
		let itemObj= invoiceTypeList.value.find(item =>item.id=== e)
		form.value.tax_rate= itemObj?.tax_rate
		// form.value.tax_amount= itemObj?.tax_number
	}
	// 获取购买方信用代码
	function changePurchaseUscCode(e){
		console.log(e,'ee')
		let itemObj= COMPANY_HEADERS_LIST.value.find(item =>item.id=== e)
		console.log(itemObj,'itemObj')
		form.value.purchase_usc_code= itemObj?.tax_number
	}
	// 获取购买方信息
	function changeSaleUscCode(e){
		let itemObj= sellerOptions.value.find(item =>item.id== e)
		console.log(itemObj,'itemObj')
		form.value.sale_usc_code= itemObj?.tax_number
	}
	// 提交
	function changeFeeTypeCNY(){
		remarkCNY.value= changeFeeType(tableDataCNY.value,FEE_TYPES_LIST_CNY.value)
		// const remarks= tableDataCNY.value
		//   .map(item => {
		// 	const matched = FEE_TYPES_LIST_CNY.value.find(item1 => item1.id === item.fee_type_id);
		// 	// 检查 remark 是否存在且不为空
		// 	return matched && matched.remark != null && String(matched.remark).trim() !== '' 
		// 	  ? String(matched.remark) 
		// 	  : null;
		//   })
		//   .filter(remark => remark !== null)
		//   .join('\n');
		// if(props.type== 1 && invoiceFormObj.value.remark){
			
		// 	remarkCNY.value= invoiceFormObj.value.remark +'\n'+ remarks
		// }else{
		// 	remarkCNY.value= invoiceFormObj.value.remark +'\n'+ remarks
		// }
	}
	function changeFeeTypeUSD(){
		remarkUSD.value= changeFeeType(tableDataUSD.value,FEE_TYPES_LIST_USD.value)
	}
	function changeFeeType(Currencys,list){
		let remarkValue= ''
		const remarks= Currencys
			  .map(item => {
				const matched = list.find(item1 => item1.id === item.fee_type_id);
				// 检查 remark 是否存在且不为空
				return matched && matched.remark != null && String(matched.remark).trim() !== '' 
				  ? String(matched.remark) 
				  : null;
			  })
			  .filter(remark => remark !== null)
			  .join('\n');
			if(props.type== 1 && invoiceFormObj.value.remark){
				remarkValue= invoiceFormObj.value.remark +'\n'+ remarks
			}else{
				remarkValue=  remarks
			}
			return remarkValue
	}
	function saveBillDataShow(){
		form.value.order_id= ''
		form.value.job_no= ''
		form.value.invoice_type_id= ''
		form.value.email= ''
		form.value.remark= ''
		form.value.tax_rate= ''
		form.value.commission= ''
		form.value.is_finish= true
		form.value.purchase_entity_id= ''
		form.value.purchase_usc_code= ''
		form.value.sale_entity_id= ''
		form.value.sale_usc_code= ''
		form.value.cny_remark= ''
		form.value.usd_remark= ''
		form.value.invoice_date= ''
		form.value.cny_invoice_no= ''
		form.value.usd_invoice_no= ''
		tableDataCNY.value= [{fee_type_id: '',unit: '',quantity: null,amount: 0}]
		tableDataUSD.value= [{fee_type_id: '',unit: '',quantity: null,amount: 0}]
		remarkCNY.value= ''
		remarkUSD.value= ''
		invoiceFormObj.value= null
		// calculations.value.tax_amount= 0
	}
	// 保存
	function submit(){
		const data= {
			...form.value,
			cny_invoice_items: JSON.stringify(tableDataCNY.value),
			usd_invoice_items: JSON.stringify(tableDataUSD.value),
			cny_remark: remarkCNY.value,
			usd_remark: remarkUSD.value,
			is_finish: form.value.is_finish== true? 1: 0
		}
		httpPost(`/invoices`, data).then(res => {
			console.log(res,'res111')
			proxy.$modal.msgSuccess("保存成功!");
			saveBillDataShow()
			Emit('close')
		});
	}
	// 保存模板
	function saveInvoicesTemplates(){
		if(!templatesName.value){
			proxy.$modal.msgWarning("请输入模板名称");
			return false
		}
		const data= {
			name: templatesName.value,
			email: form.value.email,
			remark: form.value.remark,
			cny_remark: remarkCNY.value,
			usd_remark: remarkUSD.value,
			cny_invoice_items: JSON.stringify(tableDataCNY.value),
			usd_invoice_items: JSON.stringify(tableDataUSD.value),
			purchase_entity_id: form.value.purchase_entity_id,
			purchase_usc_code: form.value.purchase_usc_code,
		}
		if(invoicesCurrent.value !== 9999){
			httpPut(`/invoice-templates/${invoiceTemplatesList.value[invoicesCurrent.value].id}`, data).then(res => {
				proxy.$modal.msgSuccess("修改成功!");
				invoiceDataList()
			});
		}else{
			httpPost(`/invoice-templates`, data).then(res => {
				proxy.$modal.msgSuccess("保存成功!");
				invoiceDataList()
				// billBool.value = false;
			});
		}
		
	}
	// 模板列表
	function invoiceDataList(){
		httpGet(`/invoice-templates`).then(res => {
			invoiceTemplatesList.value= res.data
		});
	}
	invoiceDataList()
	// 选择模板
	function selectTemplates(item,index){
		if(invoicesCurrent.value == 9999 || invoicesCurrent.value!= index){
			templatesName.value= item.name
			invoicesCurrent.value= index
			form.value.email= item.email
			form.value.remark= item.remark
			form.value.purchase_entity_id= item.purchase_entity_id
			form.value.purchase_usc_code= item.purchase_usc_code
			remarkCNY.value= item.cny_remark
			remarkUSD.value= item.usd_remark
			tableDataCNY.value= item.cny_invoice_items
			tableDataUSD.value= item.usd_invoice_items
		}
		else{
			invoicesCurrent.value= 9999
			templatesName.value= ''
			form.value.email= ''
			form.value.remark= ''
			form.value.purchase_entity_id= ''
			form.value.purchase_usc_code= ''
			if(props.type== 1){
				showDefaultData(props.type)
			}else{
				remarkCNY.value= ''
				remarkUSD.value= ''
				tableDataCNY.value= [{fee_type_id: '',unit: '',quantity: null,amount: 0}]
				tableDataUSD.value= [{fee_type_id: '',unit: '',quantity: null,amount: 0}]
			}
		}
	}
	
	/** 删除模板 */
	function handlePaySureDelete(item,index) {
		proxy.$modal.confirm('确认删除此模板？').then(function() {
			return httpDelete('/invoice-templates/' + item.id);
		}).then(() => {
			invoiceDataList();
			if(invoicesCurrent.value=== index){
				invoicesCurrent.value= 9999
				templatesName.value= ''
				form.value.email= ''
				form.value.remark= ''
				form.value.purchase_entity_id= ''
				form.value.purchase_usc_code= ''
				if(props.type== 1){
					showDefaultData(props.type)
				}else{
					remarkCNY.value= ''
					remarkUSD.value= ''
					tableDataCNY.value= [{fee_type_id: '',unit: '',quantity: null,amount: 0}]
					tableDataUSD.value= [{fee_type_id: '',unit: '',quantity: null,amount: 0}]
				}
			}
			proxy.$modal.msgSuccess("删除成功");
		}).catch(() => {});
	}
	
	const percentageValue = computed(() => {
	  if (form.value.tax_rate === null || form.value.tax_rate === undefined) {
	    return ''
	  }
	  return `${(form.value.tax_rate * 100).toFixed(2)}%`
	})
	
	const tableData= ref([])
	const exportTotal= ref('') //总金额  汉字
	const exportTotalNum= ref('')  //总金额 数字
	const exportRemark= ref('') //备注
	const exportiInvoiceNo= ref('')  //发票号
	const invoiceLogoType= ref(0)  //发票logo  //0 普  1专
	
	// 合计最后一行，在第四列和第六列显示数值，其他为空
	const getSummariesToTal = (param) => {
		const {
			columns,
			data
		} = param;
		const sums = [];
	
		// 初始化所有列汇总值为空
		columns.forEach((column, index) => {
			if (index === 0) {
				sums[index] = '合计';
			} else {
				sums[index] = '';
			}
		});
	
		// 计算第四列（索引为3）的总和
		const sumFourthColumn = data.reduce((acc, item) => {
			// 根据您的数据结构调整字段名，这里假设字段名为 amount
			return acc + Number(item.no_tax_amount || 0);
		}, 0).toFixed(2);
		sums[6] = `${sumFourthColumn}`;
	
		// 计算第六列（索引为5）的总和
		const sumSixthColumn = data.reduce((acc, item) => {
			// 根据您的数据结构调整字段名，这里假设字段名为 tax_amount
			return acc + Number(item.tax_amount || 0);
		}, 0).toFixed(2);
		sums[8] = `${sumSixthColumn}`;
	
		return sums;
	}
	// 不含税金额=金额/（1+税率）
	// 税额=金额- 不含税金额
	// 不含税金额*(1+税率)=总金额
	// function exportImg(type){  //type 1 人民币  2美金
	// 	if(type== 1){
	// 		tableData.value= tableDataCNY.value
	// 		exportRemark.value= remarkCNY.value.replace(/\n/g, '<br>')
	// 		exportiInvoiceNo.value= form.value.cny_invoice_no
	// 	}else{
	// 		tableData.value= tableDataUSD.value
	// 		exportRemark.value= remarkUSD.value.replace(/\n/g, '<br>')
	// 		exportiInvoiceNo.value= form.value.usd_invoice_no
	// 	}
	// 	tableData.value.forEach(item =>{
	// 		item.tax_rate= percentageValue.value?percentageValue.value: '免税'
	// 		item.no_tax_amount= parseFloat(item.amount/(1+(form.value.tax_rate? Number(form.value.tax_rate): 0))).toFixed(2) 
	// 		item.tax_amount= item.amount - item.no_tax_amount
	// 	})
	// 	const converter = new NumberToChinese({ mode: 'money', capital: true });
	// 	exportTotalNum.value= tableData.value.reduce((sum, item) => Number(sum) + Number(item.amount) , 0)
	// 	exportTotal.value= converter.convert(exportTotalNum.value)
	// }
	
	const exportImg = async (type) => {
	  try {
		  if(!form.value.invoice_type_id){
			  proxy.$modal.msgWarning("请选择发票类型");
			  return false
		  }
		invoiceLogoType.value=  invoiceTypeList.value.filter(itemIndex => (itemIndex.id== form.value.invoice_type_id))[0]?.type //0 普  1专
		console.log(invoiceLogoType.value,'invoiceLogoType.value')
		if(type== 1){
			tableData.value= tableDataCNY.value
			exportRemark.value= remarkCNY.value.replace(/\n/g, '<br>')
			exportiInvoiceNo.value= form.value.cny_invoice_no
		}else{
			tableData.value= tableDataUSD.value
			exportRemark.value= remarkUSD.value.replace(/\n/g, '<br>')
			exportiInvoiceNo.value= form.value.usd_invoice_no
		}
		tableData.value.forEach(item =>{
			item.tax_rate= form.value.tax_rate!= 0?percentageValue.value: '免税'
			item.no_tax_amount= parseFloat(item.amount/(1+(form.value.tax_rate? Number(form.value.tax_rate): 0))).toFixed(2) 
			item.tax_amount= item.amount - item.no_tax_amount
		})
		const converter = new NumberToChinese({ mode: 'money', capital: true });
		exportTotalNum.value= tableData.value.reduce((sum, item) => Number(sum) + Number(item.amount) , 0)
		exportTotal.value= converter.convert(exportTotalNum.value)  
		await nextTick()
		const element = document.getElementById('cost-confirmation-content_invoice')
	    
	    const canvas = await html2canvas(element, {
	      scale: 2,
	      useCORS: true,
	      backgroundColor: '#ffffff'
	    })
	    
	    const imageData = canvas.toDataURL('image/png')
	    const link = document.createElement('a')
	    link.href = imageData
	    link.download = `预览_${new Date().toLocaleDateString()}.png`
	    link.click()
	  } catch (error) {
	    console.error('导出图片失败:', error)
	  }
	}
</script>

<style scoped>
	.invoice-container {
		max-width: 1280px;
		margin: 0 auto;
		position: relative;
		z-index: 9999
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
		/* position: absolute; */
		/* left: 42%; */
		/* top: -7px; */
		z-index: 1;
	}

	.mb30 {
		margin-bottom: 30px !important;
	}

	.logo img {
		max-width: 240px;
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
		/* width: 100px; */
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
	.colorBlue{
		background-color: #409EFF;
		color:#fff;
		border: 1px solid #409EFF
	}
	.colorBlack{
		background-color: #fff;
		color:#333;
		border: 1px solid #333
	}
	.color-800{
		color: #800
	}
	
</style>
<style>
	.wrapper .el-table .cell{
		padding: 0 2px  !important;
	}
	.exportImg .el-table__header .cell,.exportImg .el-table__footer .cell{
		color: #800 !important
	}
</style>