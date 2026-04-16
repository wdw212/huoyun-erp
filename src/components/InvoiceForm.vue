<template>
	<div>
		<div class="invoice-container">
			<div class="header">此页面为一份人民币发票和一份美金发票，需区分普通发票和专用发票(一份普通发票和一份专用发票，需开两份发票)
				如需打印费用单在下方上传，单子完结“是”后不能再增开发票，为此单结束。</div>
			<el-form label-width="120px">
				<!-- 头部信息 -->
				<el-row>
					<el-col :span="10">
						<el-row>
							<el-col :span="10" style="flex: 0 0 44%;">
								<div class="section mb30">
									<el-form-item label="工作编号：" label-width="87px">
										<el-input v-model="form.job_no" style="width: 130px"
											placeholder=""  disabled/>
									</el-form-item>
									<el-form-item label="邮箱：" label-width="87px">
										<el-input v-model="form.email" style="width: 130px" :disabled="editDisabled" />
									</el-form-item>
									<el-form-item label="税点：" label-width="87px">
										<el-input v-model="percentageValue" style="width: 130px" disabled/>
									</el-form-item>

								</div>
							</el-col>
							<el-col :span="12">
								<div class="section">
									<el-form-item label="发票名称：" label-width="85px">
										<el-select
											v-model="form.invoice_type_id"
											placeholder="请选择发票名称"
											style="width:100%"
											@change="changeInvoiceType($event)"
											:value-key="'id'"
											clearable
											filterable
											:disabled="editDisabled"
										>
											<template #label="{ label, value }">
												<span>{{ getSelectDisplayLabel(label, value) }}</span>
											</template>
											<el-option
												v-for="item in invoiceTypeListWithSnapshot"
												:key="item.id"
												:label="item.label"
												:value="getRenderedOptionValue(form.invoice_type_id, item.id)"
											>
												<div :class="['invoice-type-option', { 'is-snapshot': item.__snapshot }]">
													<span class="invoice-type-option__name">{{ item.label }}</span>
													<span
														v-if="item.__snapshot"
														class="invoice-type-option__tag is-snapshot"
													>
														历史快照
													</span>
													<span v-else class="invoice-type-option__tag">
														{{ item.typeLabel }}
													</span>
												</div>
											</el-option>
										</el-select>
									</el-form-item>
									<el-form-item label="备注：" label-width="85px">
										<el-input v-model="form.remark" style="width: 100%"  :disabled="editDisabled"/>
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
					<el-col :span="10">
						<div class="section mb30" style="margin-left: 80px;">
							<el-form-item label="单子完结">
								<el-switch v-model="form.is_finish" class="mb-2" inline-prompt @change="handleSwitch" :disabled="settlementFieldsDisabled" />
								<el-input v-model="form.commission" type="number" style="width: 150px; margin-left: 20px"
									:disabled="!form.is_finish || settlementFieldsDisabled" />
							</el-form-item>
							<el-form-item label="开票日期：">
								<el-input v-model="form.invoice_date" style="width: 210px" disabled/>
							</el-form-item>
							<el-form-item label="确认开票时间：">
								<el-input :model-value="form.confirm_at || ''" style="width: 210px" disabled />
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
											
											<el-tooltip effect="dark" :content="purchaseEntityDisplayName" placement="top" >
												<el-select v-model="form.purchase_entity_id" placeholder="请选择" @change="changePurchaseUscCode($event)" clearable  filterable :disabled="editDisabled" :value-key="'id'">
													<template #label="{ label, value }">
														<span>{{ getSelectDisplayLabel(label, value) }}</span>
													</template>
													<el-option v-for="item in purchaseEntityOptionsWithSnapshot" :key="item.id" :label="item.company_name"
														:value="getRenderedOptionValue(form.purchase_entity_id, item.id)" place>
														<div :class="['invoice-type-option', { 'is-snapshot': item.__snapshot }]">
															<span class="invoice-type-option__name">{{ item.company_name }}</span>
															<span
																v-if="item.__snapshot"
																class="invoice-type-option__tag is-snapshot"
															>
																历史快照
															</span>
														</div>
													</el-option>
												</el-select>
											</el-tooltip>
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
											<el-select v-model="form.sale_entity_id" placeholder="请选择" @change="changeSaleUscCode($event)" disabled filterable :value-key="'id'">
												<template #label="{ label, value }">
													<span>{{ getSelectDisplayLabel(label, value) }}</span>
												</template>
												<el-option v-for="item in sellerOptions" :key="item.id" :label="item.name"
													:value="getRenderedOptionValue(form.sale_entity_id, item.id)" place />
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
													<el-tooltip effect="dark" :content="getFeeTypeOptionsWithSnapshot(FEE_TYPES_LIST_CNY, row).find((v) => v.id == row.fee_type_id)?.name" placement="top" >
														<el-select v-model="row.fee_type_id" placeholder="请选择费用类型" :disabled="editDisabled"
															@change="changeFeeTypeCNY()">
															<el-option v-for="opt in getFeeTypeOptionsWithSnapshot(FEE_TYPES_LIST_CNY, row)" :key="opt.id" :label="opt.name"
																:value="opt.id" />
														</el-select>
													</el-tooltip>
												</template>
											</el-table-column>
											<el-table-column label="单位" width="90" align="center">
												<template #default="{ row }">
													<el-input v-model="row.unit" :disabled="editDisabled" class="t-c" />
												</template>
											</el-table-column>
											<el-table-column label="数量" width="90" align="center">
												<template #default="{ row }">
													<el-input v-model="row.quantity" :disabled="editDisabled" class="t-c" />
												</template>
											</el-table-column>
											<el-table-column label="金额" width="90" align="center">
												<template #default="{row}">
													<el-input v-model="row.amount" :formatter="(value) => value.replace(/[^0-9|.]/g, '')"
    :parser="(value) => value.replace(/\$\s?|(,*)/g, '')" :disabled="editDisabled" class="t-c"></el-input>
												</template>
											</el-table-column>
											<el-table-column width="60" align="center" v-if="!editDisabled">
												<template #header>
													<el-button type="primary" size="small" @click="addRow"
														:disabled="tableDataCNY.length >= 10">增行</el-button>
												</template>
												<template v-if="tableDataCNY.length>1" #default="{ $index }">
													<el-button type="text" @click="delRow($index)" class="del" size="small">删除</el-button>
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
																placeholder="" :disabled="invoiceNumberDisabled"/>
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
													<el-tooltip effect="dark" :content="getFeeTypeOptionsWithSnapshot(FEE_TYPES_LIST_USD, row).find((v) => v.id == row.fee_type_id)?.name" placement="top" >
														<el-select v-model="row.fee_type_id" placeholder="请选择费用类型" :disabled="editDisabled"
															@change="changeFeeTypeUSD()">
															<el-option v-for="opt in getFeeTypeOptionsWithSnapshot(FEE_TYPES_LIST_USD, row)" :key="opt.id" :label="opt.name"
																:value="opt.id" />
														</el-select>
													</el-tooltip>
												</template>
											</el-table-column>
											<el-table-column label="单位" width="90" align="center">
												<template #default="{ row }">
													<el-input v-model="row.unit" :disabled="editDisabled" class="t-c" />
												</template>
											</el-table-column>
											<el-table-column label="数量" width="90" align="center">
												<template #default="{ row }">
													<el-input v-model="row.quantity" :disabled="editDisabled" class="t-c" />
												</template>
											</el-table-column>
											<el-table-column label="金额" width="90" align="center">
												<template #default="{row}">
													<el-input v-model="row.amount" :formatter="(value) => value.replace(/[^0-9|.]/g, '')"
    :parser="(value) => value.replace(/\$\s?|(,*)/g, '')" :disabled="editDisabled" class="t-c"></el-input>
												</template>
											</el-table-column>
											<el-table-column width="60" align="center" v-if="!editDisabled">
												<template #header>
													<el-button type="primary" @click="addRoww" :disabled="tableDataUSD.length >= 10" size="small">增行</el-button>
												</template>
												<template v-if="tableDataUSD.length>1" #default="{ $index }">
													<el-button type="text" @click="delRoww($index)" class="del" size="small">删除</el-button>
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
																placeholder="" :disabled="invoiceNumberDisabled" />
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
										<el-input v-model="remarkCNY" :rows="6" type="textarea" placeholder="" style="color: #000;" :disabled="editDisabled"/>
									</div>
								</div>
								<!-- 美元备注-->
								<div style="width: 40px;border-left: 1px solid #800;border-right: 1px solid #800;" class="vertical-text flex0">美元备注</div>
								<div class="flex-1">
									<div class="section mt-1 mx-1">
										<el-input v-model="remarkUSD" :rows="6" type="textarea" placeholder="美元备注" :disabled="editDisabled" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- 模板信息-->
				<el-row>
					<el-col :span="12">
						<div class="section d-flex" v-if="props.roleType!='finance'">
							<el-form-item label="模板名称：">
								<el-input v-model="templatesName" style="width: 150px" />
							</el-form-item>
							<el-button type="primary" class="ml20" @click="saveInvoicesTemplates">保存模板</el-button>
							<!-- <el-button>删除模板</el-button> -->
						</div>
						<div class="flex-1 pb-2" style="overflow-y: auto;max-height: 100px;" v-if="props.roleType!='finance'">
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
							<el-button  @click="exportImg(2)">美元发票预览</el-button>
							<el-button
								v-if="showConfirmInvoiceButton"
								:type="confirmInvoiceButtonType"
								:disabled="confirmInvoiceButtonDisabled"
								@click="toggleConfirmInvoice"
							>
								{{ confirmInvoiceButtonText }}
							</el-button>
							<el-button type="success" @click="submit" v-if="canSaveInvoice">保存</el-button>
							<el-button @click="openDetails">{{ detailsButtonText }}</el-button>
						</div>
					</el-col>
				</el-row>
			</el-form>
			<div id="cost-confirmation-content_invoice" style="width: 1000px; padding: 20px; position: fixed;z-index: -1;top: -2000px;left: -1000px">
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
											<p>{{ purchaseEntityDisplayName }}</p>
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
													<p>{{row.fee_type_id?getFeeTypeOptionsWithSnapshot(FEE_TYPES_LIST_CNY, row).filter(itemIndex => (itemIndex.id== row.fee_type_id))[0]?.name: ''}}</p>
													<!-- <el-select v-model="row.fee_type_id" placeholder="我要显示七个字" filterable
														remote @change="changeFeeTypeCNY()">
														<el-option v-for="opt in FEE_TYPES_LIST_CNY" :key="opt.id" :label="opt.name"
															:value="opt.id" />
													</el-select> -->
												</template>
											</el-table-column>
											<el-table-column label="规格型号" width="60" align="center"></el-table-column>
											<el-table-column label="单位" width="100" align="center" prop="unit"></el-table-column>
											<el-table-column label="数量" width="50" align="center" prop="quantity"></el-table-column>
											<el-table-column label="单价" width="60" align="center"></el-table-column>
											<el-table-column label="金额" width="200" align="center" prop="no_tax_amount"></el-table-column>
											<el-table-column label="税率/征收率" width="50" align="center" prop="tax_rate"></el-table-column>
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
		<DocumentDetails v-model:visible="dialogFormVisibleDetails" :editId="form.order_id" :type="invoiceType"/>
	</div>
</template>

<script setup>
	import {timeto } from '@/utils/index';
	import { NumberToChinese, convertNumber, convertToMoney } from '@/utils/number-to-chinese.js';
	import html2canvas from "html2canvas";
	import useUserStore from "@/store/modules/user";
	import DocumentDetails from "@/components/documentDetails/index";
	import {
		ref,
		computed,
		reactive ,
		onMounted,
		nextTick,
		watch
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
	import {
		buildSelectSnapshotOption,
		normalizeSelectSnapshotValue
	} from '@/utils/selectSnapshot';
	const {
		proxy
	} = getCurrentInstance();
	const router = useRouter();
	const Emit= defineEmits(['close'])
	const userStore = useUserStore()  //vuex缓存的用户信息
	// 添加加载状态
	const isSellerOptionsLoaded = ref(false)
	const templatesName= ref('')
	const remarkCNY = ref('')
	const remarkUSD = ref('')
	const INVOICE_ITEM_MAX_COUNT = 10
	const createEmptyInvoiceItem = () => ({ fee_type_id: '', unit: '', quantity: null, amount: 0 })
	const cloneInvoiceData = (value, fallback = []) => {
		if (value === null || value === undefined) {
			return Array.isArray(fallback) ? [...fallback] : fallback
		}
		if (typeof value === 'string') {
			const trimmedValue = value.trim()
			if (!trimmedValue) {
				return Array.isArray(fallback) ? [...fallback] : fallback
			}
			if (
				(trimmedValue.startsWith('[') && trimmedValue.endsWith(']')) ||
				(trimmedValue.startsWith('{') && trimmedValue.endsWith('}'))
			) {
				try {
					return JSON.parse(trimmedValue)
				} catch (error) {
					console.warn('发票数据 JSON 解析失败，回退默认值', error)
				}
			}
		}
		try {
			return JSON.parse(JSON.stringify(value))
		} catch (error) {
			console.warn('发票数据拷贝失败，回退默认值', error)
			return Array.isArray(fallback) ? [...fallback] : fallback
		}
	}
	const pickInvoiceItemAmount = (row = {}) => {
		const candidates = [
			row.amount,
			row.price,
			row.cny_amount,
			row.usd_amount,
		]
		const matched = candidates.find(item => item !== null && item !== undefined && String(item).trim() !== '')
		return matched ?? 0
	}
	const normalizeInvoiceItemRow = (row = {}, options = {}) => {
		if (!row || typeof row !== 'object') {
			return createEmptyInvoiceItem()
		}
		const { preserveIdentity = false } = options
		const normalizedRow = {
			...row,
			fee_type_id: row.fee_type_id ?? '',
			fee_type_name: row.fee_type_name ?? '',
			unit: row.unit ?? '',
			quantity: row.quantity ?? null,
			amount: pickInvoiceItemAmount(row),
		}
		if (!preserveIdentity) {
			delete normalizedRow.id
			delete normalizedRow.invoice_id
		}
		return normalizedRow
	}
	const cloneInvoiceItemRows = (rows = [], options = {}) => {
		const clonedRows = cloneInvoiceData(rows, [])
		if (!Array.isArray(clonedRows)) {
			return []
		}
		return clonedRows
			.filter(row => row && typeof row === 'object')
			.map(row => normalizeInvoiceItemRow(row, options))
	}
	const tableDataCNY = ref([createEmptyInvoiceItem()])
	const tableDataUSD = ref([createEmptyInvoiceItem()])
	const invoiceFormObj = ref(null) //备注
	// 模板
	const invoiceTemplatesList = ref([])
	const invoicesCurrent = ref(9999)
	const invoiceTypeSnapshotApplied = ref(false)
	const purchaseEntitySnapshotApplied = ref(false)
	const rolesListYW= ['SUPER_ADMIN','BUSINESS']
	const rolesListCW= ['SUPER_ADMIN','FINANCE']
	const disabledYWEdit= ref(false) 
	const disabledCWEdit= ref(false) 
	const dialogFormVisibleDetails= ref(false) 
	const props = defineProps({
		invoiceForm: {
			type: [Object, Array],
			default: null
		},
		type: {  //0  业务默认展示 新增  1  业务带参数战术 新增   2 业务 查看详情
			type: [Number, String],
			default: 0,
		},
		visible: { 
			type: Boolean,
			default: false,
		},
		roleType: { 
			type: String,
			default: 'normal',
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
	    is_finish: false,
	    purchase_entity_id: '',
	    purchase_usc_code: '',
	    sale_entity_id: '',
	    sale_usc_code: '',
	    cny_remark: '',
	    usd_remark: '',
	    invoice_date: '',
	    tax_amount: 0,
		confirm_at: '',
		cny_invoice_no: '',
		usd_invoice_no: ''
	})
	// ========= 快照防追改 =========
	const SNAP_PREFIX = '__snap_'
	const toSnapToken = (id) => SNAP_PREFIX + id
	const isSnapToken = (val) => typeof val === 'string' && val.startsWith(SNAP_PREFIX)
	const parseSnapId = (val) => isSnapToken(val) ? Number(val.slice(SNAP_PREFIX.length)) : val
	const normalizeInvoiceTypeValue = (val) => {
		const real = parseSnapId(val)
		if (real === null || real === undefined || real === '') return ''
		const numberValue = Number(real)
		if (Number.isFinite(numberValue) && numberValue > 0) return numberValue
		return real
	}
	const getRenderedOptionValue = (currentValue, optionValue) => {
		const normalizedCurrentValue = normalizeSelectSnapshotValue(currentValue)
		if (typeof normalizedCurrentValue === 'string' && typeof optionValue === 'number') {
			return String(optionValue)
		}
		if (
			typeof normalizedCurrentValue === 'number' &&
			typeof optionValue === 'string' &&
			optionValue !== '' &&
			!Number.isNaN(Number(optionValue))
		) {
			return Number(optionValue)
		}
		return optionValue
	}
	const getSelectDisplayLabel = (label, value) => {
		const safeLabel = (label ?? '').toString().trim()
		if (safeLabel) {
			return safeLabel
		}
		return normalizeSelectSnapshotValue(value)
	}
	const findOptionById = (options = [], value) => {
		const normalizedValue = normalizeSelectSnapshotValue(value)
		return (Array.isArray(options) ? options : []).find(item => String(item?.id) === String(normalizedValue))
	}
	const resolveInvoiceJobNo = () => (
		form.value.job_no ||
		invoiceFormObj.value?.job_no ||
		props.invoiceForm?.job_no ||
		props.invoiceForm?.order?.job_no ||
		''
	)
	const syncInvoiceDerivedFields = () => {
		form.value.job_no = resolveInvoiceJobNo()
		const invoiceTypeOption = findOptionById(invoiceTypeListWithSnapshot.value, form.value.invoice_type_id)
		if (invoiceTypeOption && invoiceTypeOption.tax_rate !== undefined && invoiceTypeOption.tax_rate !== null && invoiceTypeOption.tax_rate !== '') {
			form.value.tax_rate = invoiceTypeOption.tax_rate
		}
		const purchaseEntityOption = findOptionById(purchaseEntityOptionsWithSnapshot.value, form.value.purchase_entity_id)
		if (purchaseEntityOption && purchaseEntityOption.tax_number) {
			form.value.purchase_usc_code = purchaseEntityOption.tax_number
		}
		const sellerOption = findOptionById(sellerOptions.value, form.value.sale_entity_id)
		if (sellerOption) {
			form.value.sale_usc_code = sellerOption.tax_number || sellerOption.usc_code || form.value.sale_usc_code || ''
		}
	}
	const loadSellerOptions = async (forceRefresh = false) => {
		try {
			if (!forceRefresh && sellerOptions.value.length > 0 && isSellerOptionsLoaded.value) {
				return
			}
			console.log(userStore.userRoleCode,'setKeyInfo454')
			sellerOptions.value = await getXHDW({ _: Date.now() })
			isSellerOptionsLoaded.value = true
		} catch (error) {
			console.error('错误提示：', error)
		}
	}
	onMounted(async () => {
		await loadSellerOptions()
	})
	const invoiceType= ref(0)
	const editDisabled= ref(false);
	const confirmInvoice = ref(false)
	const isSuperAdmin = computed(() => userStore.userRoleCode === 'SUPER_ADMIN')
	const isFinanceRole = computed(() => props.roleType === 'finance')
	const canConfirmInvoice = computed(() => isFinanceRole.value || isSuperAdmin.value)
	const isConfirmed = computed(() => !!form.value.confirm_at)
	const hasCurrentInvoiceNumber = computed(() => {
		return [form.value.cny_invoice_no, form.value.usd_invoice_no].some(value => String(value || '').trim() !== '')
	})
	const isLockedForBusiness = computed(() => {
		return hasCurrentInvoiceNumber.value || isConfirmed.value
	})
	const canEnableConfirmInvoice = computed(() => canConfirmInvoice.value && !confirmInvoice.value)
	const canDisableConfirmInvoice = computed(() => {
		if (!confirmInvoice.value) {
			return false
		}
		if (isSuperAdmin.value) {
			return true
		}
		return canConfirmInvoice.value && !isConfirmed.value
	})
	const showConfirmInvoiceButton = computed(() => canConfirmInvoice.value)
	const confirmInvoiceButtonText = computed(() => {
		if (!confirmInvoice.value) {
			return '未确认开票'
		}
		return '确认开票'
	})
	const detailsButtonText = computed(() => {
		return isFinanceRole.value ? '财务单据' : '业务单据'
	})
	const confirmInvoiceButtonType = computed(() => {
		if (!confirmInvoice.value) {
			return 'danger'
		}
		return 'success'
	})
	const confirmInvoiceButtonDisabled = computed(() => {
		return confirmInvoice.value && !canDisableConfirmInvoice.value
	})
	const invoiceNumberDisabled = computed(() => {
		if (isSuperAdmin.value) {
			return false
		}
		if (isFinanceRole.value) {
			return isConfirmed.value || isNoInvoiceScenario.value
		}
		return true
	})
	const settlementFieldsDisabled = computed(() => {
		if (isSuperAdmin.value || isFinanceRole.value) {
			return false
		}
		return editDisabled.value
	})
	const canSaveInvoice = computed(() => {
		if (isSuperAdmin.value || isFinanceRole.value) {
			return true
		}
		return !isLockedForBusiness.value
	})
	function toggleConfirmInvoice() {
		if (canEnableConfirmInvoice.value) {
			confirmInvoice.value = true
			return
		}
		if (canDisableConfirmInvoice.value) {
			confirmInvoice.value = false
		}
	}
	const resetInvoiceTypeSnapshotState = () => {
		invoiceTypeSnapshotApplied.value = false
		purchaseEntitySnapshotApplied.value = false
	}
	watch([() => props.visible, () => props.type], 
	  async ([isVisible, newType]) => {
		  // 只有当弹框显示、数据加载完成且有类型时才执行
		  console.log('newType', newType)
		  if (isVisible) {
			await loadSellerOptions(true)
			invoiceType.value= newType
			editDisabled.value = false
			confirmInvoice.value = false
			resetInvoiceTypeSnapshotState()
		    invoicesCurrent.value= 9999
			templatesName.value= ''
			invoiceFormObj.value = JSON.parse(JSON.stringify(props.invoiceForm))
			if([0,1,3].includes(newType)){
				form.value.id = ''
				form.value.invoice_type_id = ''
				form.value.email = ''
				form.value.remark = ''
				form.value.tax_rate = ''
				form.value.commission = ''
				form.value.is_finish = false
				form.value.purchase_entity_id = ''
				form.value.purchase_usc_code = ''
				form.value.sale_entity_id = ''
				form.value.sale_usc_code = ''
				form.value.cny_remark = ''
				form.value.usd_remark = ''
				form.value.invoice_date = ''
				form.value.tax_amount = 0
				form.value.confirm_at = ''
				form.value.cny_invoice_no = ''
				form.value.usd_invoice_no = ''
				form.value.order_id= invoiceFormObj.value.order_id
				form.value.sale_entity_id= invoiceFormObj.value.seller_id
				form.value.job_no= invoiceFormObj.value.job_no
				remarkCNY.value= ''
				remarkUSD.value= ''
				console.log(form.value,'form.value')		
				changeSaleUscCode(form.value.sale_entity_id)
			}else if([2,4].includes(newType)){
			form.value= JSON.parse(JSON.stringify(props.invoiceForm))
			form.value.invoice_type_id = normalizeInvoiceTypeValue(form.value.invoice_type_id)
			form.value.purchase_entity_id= form.value.purchase_entity_id? Number(form.value.purchase_entity_id): ''
			form.value.sale_entity_id= form.value.sale_entity_id? Number(form.value.sale_entity_id): ''
			form.value.is_finish = Number(props.invoiceForm?.is_finish ?? props.invoiceForm?.order?.is_finish ?? 0) === 1
			form.value.commission = props.invoiceForm?.commission ?? props.invoiceForm?.order?.commission ?? ''
			confirmInvoice.value = !!form.value.confirm_at
			if (form.value.sale_entity_id && !form.value.sale_usc_code) {
				changeSaleUscCode(form.value.sale_entity_id)
			}
			console.log(form.value,'497')
			}
			syncInvoiceDerivedFields()
			if([0,1,2].includes(newType)){
				const currentInvoiceLocked = [props.invoiceForm?.cny_invoice_no, props.invoiceForm?.usd_invoice_no]
					.some(value => String(value || '').trim() !== '') || !!props.invoiceForm?.confirm_at
				if (currentInvoiceLocked && !isSuperAdmin.value) {
					editDisabled.value = true
				}
			}
		    showDefaultData(newType)
			nextTick(() => {
				syncInvoiceDerivedFields()
			})
		  }
	}, {
		immediate: true
	})
	// 默认的选择
	const ensureTableItems = (tableRef) => {
		const raw = Array.isArray(tableRef.value) ? tableRef.value : []
		tableRef.value = raw.filter(item => item && typeof item === 'object')
	}
	const ensureTableHasAtLeastOne = (tableRef) => {
		ensureTableItems(tableRef)
		if (tableRef.value.length === 0) {
			tableRef.value = [createEmptyInvoiceItem()]
		}
	}

	function showDefaultData(type){
		if(type== 0||type== 3){
			tableDataCNY.value= [{fee_type_id: '',unit: '',quantity: null,amount: 0}]
			tableDataUSD.value= [{fee_type_id: '',unit: '',quantity: null,amount: 0}]
		}else if (type == 1) {
			// type==1 业务带参数新增：备注由费用类型自动生成，不从订单 remark 带入（remark 里是单据号）
			remarkCNY.value = ''
			remarkUSD.value = ''
			console.log(form.value.sale_entity_id,'form.value.sale_entity_id')
			const orderBillItems = cloneInvoiceItemRows(invoiceFormObj.value.orderBillItems)
			if (orderBillItems.length > 0) {
				
				const hasCNY = orderBillItems.some(item => item.currency === 'cny');
				const hasUSD = orderBillItems.some(item => item.currency === 'usd');
				tableDataCNY.value = hasCNY ? [] : [createEmptyInvoiceItem()]
				tableDataUSD.value = hasUSD ? [] : [createEmptyInvoiceItem()]
				console.log(hasCNY); // true
				console.log(tableDataCNY.value,'tableDataCNY.value'); // true
				orderBillItems.forEach(item => {
					if (item.currency == 'cny') {
						item.amount = item.quantity * item.price
						tableDataCNY.value.push(item)
					} else if (item.currency == 'usd') {
						item.amount = item.quantity * item.price
						tableDataUSD.value.push(item)
					}
				})
			}else{
				tableDataCNY.value= [createEmptyInvoiceItem()]
				tableDataUSD.value= [createEmptyInvoiceItem()]
			}
		}else if(type == 2|| type == 4){
			if(type==4 && !isSuperAdmin.value){ editDisabled.value= true };
			remarkCNY.value= invoiceFormObj.value.cny_remark
			remarkUSD.value= invoiceFormObj.value.usd_remark
			const cnyItems = cloneInvoiceItemRows(invoiceFormObj.value.cny_invoice_items, { preserveIdentity: true })
			const usdItems = cloneInvoiceItemRows(invoiceFormObj.value.usd_invoice_items, { preserveIdentity: true })
			tableDataCNY.value = cnyItems.length > 0 ? cnyItems : [createEmptyInvoiceItem()]
			tableDataUSD.value = usdItems.length > 0 ? usdItems : [createEmptyInvoiceItem()]
			// 快照防追改：表单数据已就绪，应用 token
			nextTick(() => {
				applyInvoiceTypeSnapshotToken()
				applyPurchaseEntitySnapshotToken()
				applySnapshotTokens()
			})
		}
		ensureTableHasAtLeastOne(tableDataCNY)
		ensureTableHasAtLeastOne(tableDataUSD)
		// 业务的时间新增都清零
		if([0,1,3].includes(type)){
			form.value.invoice_date= ''
		}else if([2,4].includes(type)){
			
		} else{
			form.value.invoice_date= timeto(new Date().getTime(), 'ymd', '-')
		}
	}
	
	// 计算税额
	// 所有计算字段单独定义
	// 不含税金额*（1+税率）=总金额
	// 税额=总金额-不含税金额
	const normalizeTaxRateValue = (value) => {
		const numericValue = Number(value) || 0
		if (numericValue <= 0) {
			return 0
		}
		return numericValue > 1 ? (numericValue / 100) : numericValue
	}
	const calculations = reactive({
			tax_amount: computed(() => {
			  const sum = tableDataCNY.value.reduce((acc, item) => 
			    acc + Number(item.amount || 0), 0
			  )
			  const taxRate = normalizeTaxRateValue(form.value.tax_rate)
			  if (!sum || !taxRate) {
			  	return '0.00'
			  }
			  const result = sum - (sum / (1 + taxRate))
			  return result.toFixed(2)
			})
	  
	  // 可以添加其他计算字段
	})
	watch(() => calculations.tax_amount, (value) => {
		form.value.tax_amount = value || '0.00'
	}, {
		immediate: true
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
		ensureTableItems(tableDataCNY)
		if (tableDataCNY.value.length < INVOICE_ITEM_MAX_COUNT) {
			tableDataCNY.value = [...tableDataCNY.value, createEmptyInvoiceItem()]
		}
	}
	const addRoww = () => {
		ensureTableItems(tableDataUSD)
		if (tableDataUSD.value.length < INVOICE_ITEM_MAX_COUNT) {
			tableDataUSD.value = [...tableDataUSD.value, createEmptyInvoiceItem()]
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
		const sumValue = data.reduce((acc, item) => acc + Number(item.amount), 0).toFixed(2);
		sums[4] = `${sumValue}`; // 第五列显示汇总值

		return sums;
	}
	// 发票名称
	const invoiceTypeList = ref([])
	const COMPANY_HEADERS_LIST= ref([])
	const originalInvoiceTypeId = computed(() => {
		return normalizeInvoiceTypeValue(
			invoiceFormObj.value?.invoice_type_id ||
			props.invoiceForm?.invoice_type_id ||
			''
		)
	})
	const invoiceTypeSnapshotName = computed(() => {
		return (
			invoiceFormObj.value?.invoice_type_name ||
			props.invoiceForm?.invoice_type_name ||
			props.invoiceForm?.invoice_type?.name ||
			''
		).trim()
	})
	const normalizeInvoiceTypeOption = (item) => ({
		...item,
		label: item?.name || '',
		typeLabel: item?.type === 0 ? '普通发票' : '专用发票',
	})
	const invoiceTypeSnapshotOption = computed(() => {
		const realId = normalizeInvoiceTypeValue(form.value.invoice_type_id)
		const originalId = originalInvoiceTypeId.value
		const snapshotName = invoiceTypeSnapshotName.value
		if (!realId || !snapshotName || !originalId || String(realId) !== String(originalId)) {
			return null
		}

		const currentOption = invoiceTypeList.value.find(item => item.id == realId)
		if (currentOption && (currentOption.name || '').trim() === snapshotName) {
			return null
		}

		return {
			id: toSnapToken(realId),
			label: snapshotName,
			name: snapshotName,
			type: currentOption?.type ?? props.invoiceForm?.invoice_type?.type ?? null,
			typeLabel: currentOption?.type === 0 ? '普通发票' : '专用发票',
			__snapshot: true,
		}
	})
	const applyInvoiceTypeSnapshotToken = () => {
		if (invoiceTypeSnapshotApplied.value) {
			return
		}

		const snapshotOption = invoiceTypeSnapshotOption.value
		if (!snapshotOption) {
			invoiceTypeSnapshotApplied.value = true
			return
		}

		form.value.invoice_type_id = snapshotOption.id
		invoiceTypeSnapshotApplied.value = true
	}
	const purchaseEntitySnapshotName = computed(() => {
		return (
			invoiceFormObj.value?.purchase_entity?.name ||
			props.invoiceForm?.purchase_entity?.name ||
			''
		).trim()
	})
	const originalPurchaseEntityId = computed(() => {
		const rawValue = invoiceFormObj.value?.purchase_entity_id || props.invoiceForm?.purchase_entity_id || ''
		const normalizedValue = normalizeSelectSnapshotValue(rawValue)
		if (normalizedValue === '' || normalizedValue === null || normalizedValue === undefined) {
			return ''
		}
		const numberValue = Number(normalizedValue)
		return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : normalizedValue
	})
	const purchaseEntitySnapshotOption = computed(() => {
		const rawValue = normalizeSelectSnapshotValue(form.value.purchase_entity_id)
		const realId = rawValue === '' || rawValue === null || rawValue === undefined
			? ''
			: (Number.isFinite(Number(rawValue)) && Number(rawValue) > 0 ? Number(rawValue) : rawValue)
		const originalId = originalPurchaseEntityId.value
		const snapshotName = purchaseEntitySnapshotName.value
		if (!realId || !snapshotName || !originalId || String(realId) !== String(originalId)) {
			return null
		}

		const currentOption = COMPANY_HEADERS_LIST.value.find(item => item.id == realId)
		const snapshotMeta = buildSelectSnapshotOption({
			fieldKey: 'purchase_entity_id',
			originValue: realId,
			snapshotLabel: snapshotName,
			options: COMPANY_HEADERS_LIST.value,
			valueKey: 'id',
			labelKey: 'company_name',
		})
		if (!snapshotMeta) {
			return null
		}

		return {
			...(currentOption || {}),
			id: snapshotMeta.token,
			company_name: snapshotName,
			__snapshot: true,
		}
	})
	const purchaseEntityOptionsWithSnapshot = computed(() => {
		const snapshotOption = purchaseEntitySnapshotOption.value
		if (!snapshotOption) {
			return COMPANY_HEADERS_LIST.value
		}
		return [
			snapshotOption,
			...COMPANY_HEADERS_LIST.value,
		]
	})
	const purchaseEntityDisplayName = computed(() => {
		const currentOption = purchaseEntityOptionsWithSnapshot.value.find(
			item => item.id == form.value.purchase_entity_id
		)
		return currentOption?.company_name || ''
	})
	const applyPurchaseEntitySnapshotToken = () => {
		if (purchaseEntitySnapshotApplied.value) {
			return
		}

		const snapshotOption = purchaseEntitySnapshotOption.value
		if (!snapshotOption) {
			purchaseEntitySnapshotApplied.value = true
			return
		}

		form.value.purchase_entity_id = snapshotOption.id
		purchaseEntitySnapshotApplied.value = true
	}

	function getInvoiceTypeList() {
		httpGet(`/invoice-types`, {
			is_paginate: 0
		}).then(res => {
			if (res.data.length > 0) {
				invoiceTypeList.value = res.data.map(normalizeInvoiceTypeOption)
			}
		});
	}
	getInvoiceTypeList()
	const FEE_TYPES_LIST_CNY=ref([])
	const FEE_TYPES_LIST_USD=ref([])

	const invoiceTypeListWithSnapshot = computed(() => {
		const snapshotOption = invoiceTypeSnapshotOption.value
		if (!snapshotOption) {
			return invoiceTypeList.value
		}

		return [
			snapshotOption,
			...invoiceTypeList.value,
		]
	})

	// 费用类型：按行返回含快照的选项列表
	const resolveFeeTypeList = (listSource) => {
		if (Array.isArray(listSource)) return listSource
		if (Array.isArray(listSource?.value)) return listSource.value
		return []
	}
	const getFeeTypeOptionsWithSnapshot = (listSource, row) => {
		const list = resolveFeeTypeList(listSource)
		const rawId = row.fee_type_id
		const realId = parseSnapId(rawId)
		if (!realId) return list
		const cnyList = Array.isArray(FEE_TYPES_LIST_CNY.value) ? FEE_TYPES_LIST_CNY.value : []
		const usdList = Array.isArray(FEE_TYPES_LIST_USD.value) ? FEE_TYPES_LIST_USD.value : []
		const inferredName = cnyList.find(item => item.id == realId)?.name || usdList.find(item => item.id == realId)?.name || ''
		const snapshotName = (row.fee_type_name || inferredName || '').trim()
		if (!snapshotName) return list
		const matched = list.find(item => item.id == realId)
		if (matched && (matched.name || '') === snapshotName && !isSnapToken(rawId)) return list
		const token = isSnapToken(rawId) ? rawId : toSnapToken(realId)
		const snapshotOption = { id: token, name: snapshotName, __snapshot: true }
		return [snapshotOption, ...list]
	}

	// 编辑模式：费用类型需要快照 token 防追改（发票类型不再转 token）
	const applySnapshotTokens = () => {
		// 费用类型（CNY 行）
		const cnyList = Array.isArray(FEE_TYPES_LIST_CNY.value) ? FEE_TYPES_LIST_CNY.value : []
		tableDataCNY.value.forEach(row => {
			if (row.fee_type_id && !isSnapToken(row.fee_type_id) && row.fee_type_name) {
				const matched = cnyList.find(item => item.id == row.fee_type_id)
				if (!matched || (matched.name || '') !== row.fee_type_name) {
					row.fee_type_id = toSnapToken(row.fee_type_id)
				}
			}
		})
		// 费用类型（USD 行）
		const usdList = Array.isArray(FEE_TYPES_LIST_USD.value) ? FEE_TYPES_LIST_USD.value : []
		tableDataUSD.value.forEach(row => {
			if (row.fee_type_id && !isSnapToken(row.fee_type_id) && row.fee_type_name) {
				const matched = usdList.find(item => item.id == row.fee_type_id)
				if (!matched || (matched.name || '') !== row.fee_type_name) {
					row.fee_type_id = toSnapToken(row.fee_type_id)
				}
			}
		})
	}
	// 列表加载完毕后应用 token
	watch([invoiceTypeList, FEE_TYPES_LIST_CNY, FEE_TYPES_LIST_USD, COMPANY_HEADERS_LIST], () => {
		nextTick(() => {
			applyInvoiceTypeSnapshotToken()
			applyPurchaseEntitySnapshotToken()
			applySnapshotTokens()
			syncInvoiceDerivedFields()
		})
	})
	watch(sellerOptions, () => {
		nextTick(() => {
			syncInvoiceDerivedFields()
		})
	}, {
		deep: true
	})
	const isNoInvoiceScenario = computed(() => purchaseEntityDisplayName.value === '不开票')
	watch(isNoInvoiceScenario, (active) => {
		if (!active || isSuperAdmin.value) {
			return
		}
		form.value.cny_invoice_no = ''
		form.value.usd_invoice_no = ''
	}, {
		immediate: true
	})

	// 提交时还原快照 token 为真实 ID
	const normalizeSnapshotData = (data) => {
		data.invoice_type_id = normalizeInvoiceTypeValue(data.invoice_type_id)
		data.purchase_entity_id = normalizeInvoiceTypeValue(
			normalizeSelectSnapshotValue(data.purchase_entity_id)
		)
		const normItems = (jsonStr) => {
			const items = JSON.parse(jsonStr || '[]')
			items.forEach(item => { item.fee_type_id = parseSnapId(item.fee_type_id) })
			return JSON.stringify(items)
		}
		data.cny_invoice_items = normItems(data.cny_invoice_items)
		data.usd_invoice_items = normItems(data.usd_invoice_items)
		return data
	}
	// 项目名称RMB/USD
	function getfeeTypesList(type) {
		httpGet(`/fee-types`, {
			is_paginate: 0,
			type: type
		}).then(res => {
			console.log(res,'res509')
			if(type=== 'cny'){
				FEE_TYPES_LIST_CNY.value= Array.isArray(res.data) ? res.data : []
			}else if(type=== 'usd'){
				FEE_TYPES_LIST_USD.value= Array.isArray(res.data) ? res.data : []
			}
		});
	}
	getfeeTypesList('cny')
	getfeeTypesList('usd')
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
		const realId = normalizeInvoiceTypeValue(normalizeSelectSnapshotValue(e))
		let itemObj= invoiceTypeList.value.find(item => String(item.id) === String(realId))
		form.value.tax_rate= itemObj?.tax_rate ?? ''
		// form.value.tax_amount= itemObj?.tax_number
	}
	// 获取购买方信用代码
	function changePurchaseUscCode(e){
		const realId = normalizeInvoiceTypeValue(normalizeSelectSnapshotValue(e))
		console.log(realId,'ee')
		let itemObj= COMPANY_HEADERS_LIST.value.find(item =>item.id == realId)
		console.log(itemObj,'itemObj')
		form.value.purchase_usc_code= itemObj?.tax_number
	}
	// 获取购买方信息
	function changeSaleUscCode(e){
		const realId = normalizeInvoiceTypeValue(normalizeSelectSnapshotValue(e))
		let itemObj= sellerOptions.value.find(item => String(item.id) === String(realId))
		console.log(itemObj,'itemObj')
		form.value.sale_usc_code = itemObj?.tax_number || itemObj?.usc_code || form.value.sale_usc_code || ''
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
		const safeList = Array.isArray(list) ? list : []
		const remarks= Currencys
			  .map(item => {
				const matched = safeList.find(item1 => item1.id === parseSnapId(item.fee_type_id));
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
		form.value.confirm_at= ''
		form.value.cny_invoice_no= ''
		form.value.usd_invoice_no= ''
		confirmInvoice.value = false
		tableDataCNY.value= [{fee_type_id: '',unit: '',quantity: null,amount: 0}]
		tableDataUSD.value= [{fee_type_id: '',unit: '',quantity: null,amount: 0}]
		remarkCNY.value= ''
		remarkUSD.value= ''
		invoiceFormObj.value= null
		// calculations.value.tax_amount= 0
	}
	// 保存
	function submit(){
		if(!form.value.invoice_type_id){
			proxy.$modal.msgWarning("请选择发票名称");
			return false
		}
		if(!form.value.purchase_entity_id){
			proxy.$modal.msgWarning("请选择购买方信息名称");
			return false
		}
		const data = {
		  ...form.value,
		  ...(form.value.id && { id: form.value.id }), // 只有id有值时才会包含id字段
		  cny_invoice_items: JSON.stringify(tableDataCNY.value),
		  usd_invoice_items: JSON.stringify(tableDataUSD.value),
		  cny_remark: remarkCNY.value,
		  usd_remark: remarkUSD.value,
		  is_finish: form.value.is_finish == true ? 1 : 0,
		  confirm_invoice: confirmInvoice.value ? 1 : 0
		}
		if (isNoInvoiceScenario.value && !isSuperAdmin.value) {
			data.cny_invoice_no = ''
			data.usd_invoice_no = ''
		}
		normalizeSnapshotData(data)
		console.log(data,'data851')
		if(form.value.id){
			httpPut(`/invoices/${data.id}`, data).then(res => {
				proxy.$modal.msgSuccess("保存成功!");
				saveBillDataShow()
				Emit('close')
			});
		}else{
			httpPost(`/invoices`, data).then(res => {
				proxy.$modal.msgSuccess("保存成功!");
				saveBillDataShow()
				Emit('close')
			});
		}
		
	}
	async function openDetails(){
		const orderId = form.value?.order_id || props.invoiceForm?.order_id;
		if (!orderId) {
			proxy.$modal.msgWarning("未找到关联单据");
			return;
		}
		if (props.roleType === 'finance') {
			await router.push({
				name: 'FinancialDocuments',
				query: {
					order_id: String(orderId),
				},
			});
			Emit('close');
			return;
		}
		dialogFormVisibleDetails.value= true
	}
	// 保存模板
	function saveInvoicesTemplates(){
		if(!templatesName.value){
			proxy.$modal.msgWarning("请输入模板名称");
			return false
		}
		const data= {
			name: templatesName.value,
			invoice_type_id: normalizeInvoiceTypeValue(form.value.invoice_type_id),
			email: form.value.email,
			remark: form.value.remark,
			cny_remark: remarkCNY.value,
			usd_remark: remarkUSD.value,
			cny_invoice_items: JSON.stringify(tableDataCNY.value),
			usd_invoice_items: JSON.stringify(tableDataUSD.value),
			purchase_entity_id: normalizeInvoiceTypeValue(
				normalizeSelectSnapshotValue(form.value.purchase_entity_id)
			),
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
			invoiceTemplatesList.value= (res.data || []).map(item => ({
				...item,
				invoice_type_id: normalizeInvoiceTypeValue(item.invoice_type_id),
				cny_invoice_items: cloneInvoiceItemRows(item.cny_invoice_items),
				usd_invoice_items: cloneInvoiceItemRows(item.usd_invoice_items),
			}))
		});
	}
	invoiceDataList()
	// 选择模板
	function selectTemplates(item,index){
		if(invoicesCurrent.value == 9999 || invoicesCurrent.value!= index){
			templatesName.value= item.name
			invoicesCurrent.value= index
			form.value.invoice_type_id= normalizeInvoiceTypeValue(item.invoice_type_id)
			form.value.email= item.email
			form.value.remark= item.remark
			form.value.purchase_entity_id= item.purchase_entity_id? Number(item.purchase_entity_id):''
			form.value.purchase_usc_code= item.purchase_usc_code
			remarkCNY.value= item.cny_remark
			remarkUSD.value= item.usd_remark
			tableDataCNY.value= cloneInvoiceItemRows(item.cny_invoice_items)
			tableDataUSD.value= cloneInvoiceItemRows(item.usd_invoice_items)
		}
		else{
			invoicesCurrent.value= 9999
			templatesName.value= ''
			form.value.invoice_type_id= ''
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
	  const normalizedRate = normalizeTaxRateValue(form.value.tax_rate)
	  if (!normalizedRate) {
	  	return ''
	  }
	  return `${(normalizedRate * 100).toFixed(2)}%`
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
		const currentInvoiceTypeId = normalizeInvoiceTypeValue(form.value.invoice_type_id)
		const latestInvoiceType = invoiceTypeList.value.find(itemIndex => itemIndex.id == currentInvoiceTypeId)
		const fallbackInvoiceType = invoiceTypeListWithSnapshot.value.find(itemIndex => itemIndex.id == form.value.invoice_type_id)
		invoiceLogoType.value= latestInvoiceType?.type ?? fallbackInvoiceType?.type //0 普  1专
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

	:deep .invoice-container .el-form-item__label {
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

	.invoice-type-option {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		width: 100%;
	}

	.invoice-type-option__name {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.invoice-type-option__tag {
		flex: none;
		padding: 2px 8px;
		border-radius: 999px;
		background: #f0f9eb;
		color: #67c23a;
		font-size: 12px;
		line-height: 1.2;
	}

	.invoice-type-option__tag.is-snapshot {
		background: #fff3cd;
		color: #c67a00;
	}

	.invoice-type-option.is-snapshot {
		color: #c67a00;
		font-weight: 600;
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
	.el-select-dropdown__item:has(.invoice-type-option.is-snapshot) {
		background: #fff9e8;
	}

	.el-select-dropdown__item.selected:has(.invoice-type-option.is-snapshot),
	.el-select-dropdown__item.hover:has(.invoice-type-option.is-snapshot),
	.el-select-dropdown__item.is-hovering:has(.invoice-type-option.is-snapshot) {
		background: #ffefc2;
	}

	.wrapper .el-table .cell{
		padding: 0 2px  !important;
	}
	.exportImg .el-table__header .cell,.exportImg .el-table__footer .cell{
		color: #800 !important
	}
	.wrapper .el-textarea .el-textarea__inner{
		color: #000 !important;
	}
	.t-c .el-input__inner{
		text-align: center !important;
	}
</style>

