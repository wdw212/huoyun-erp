<template>

	<div class="p-r" v-loading="loading">
		<!-- 顶部搜索 -->
		<search-top ref="searchTop" :queryParams="queryParams" @search="searchConfirm"></search-top>

		<!-- 表格 -->
		<table-list :tableConfig="tableConfig" :tableColumn="tableColumn" :toolbar="true" class="px-2" ref="tableList" :number="true" :multiple="false">
			<template #headerCon>
				<div style="display: flex;flex-wrap: wrap;text-align: center!important;">
					<div style="width: 20%;margin-top: 10px;" v-for="(item,index) in statistic" :key="index">
						<el-statistic :value="item.value" :precision="2" :prefix="item.prefix"
						value-style="font-weight: bold;">
							<template #title>
								<span style="font-size: 15px;">{{item.title}}</span>
							</template>
						</el-statistic>
					</div>
				</div>
				<el-divider />
			</template>
			<template #headerLeft> </template>
			<template #headerRight>
				<!-- <el-button type="primary" plain icon="Plus" @click="addDocument()" class="mb-1 mr-1">新增</el-button> -->
				<!-- <el-button type="danger" plain icon="Delete" @click="" class="mb-1 mr-1" disabled>批量删除</el-button> -->
			</template>
		</table-list>

		<!-- 单据详情 -->
		<el-dialog v-model="dialogFormVisible" title="商务详情" width="80%" :close-on-click-modal="false">
			<el-card>
				<common-form ref="commonForm" v-model:formList="formListNew" @confirm="confirmSubmit"
					@cancel="cancelForm" @itemChange="itemChange" @tabsChange="tabsChange">
					<!-- 订舱信息及备注 -->
					<template #remarkBtn="{formList,saveData}">
						<span style="font-weight: bold;padding-right: 10px;color: #606266;">订舱信息及备注</span>
						<el-button type="primary" @click="saveData.booking_info.push('')">订舱信息及备注</el-button>
					</template>
					<template #remarkList="{formList,saveData}">
						<el-row :gutter="20">
							<el-col class="p-r" v-for="(item,index) in saveData.booking_info" :key="index" :span="6">
								<el-icon class="p-a r_0 t_0 z-1000" style="margin: 5px 15px;"
									@click="saveData.booking_info.splice(index, 1)">
									<Close />
								</el-icon>
								<el-input v-model="saveData.booking_info[index]" :rows="4" type="textarea"
									placeholder="请输入" style="width: 100%" />
							</el-col>
						</el-row>
					</template>

					<!-- 委托抬头新增 -->
					<template #addHeader>
						<el-button type="primary" :icon="Refresh" circle style="margin-left: 10px;"
							@click="refreshCompanyHead" />
						<el-button type="danger" :icon="Plus" circle style="margin-left: 10px;"
							@click="addCompanyHead" />
					</template>

					<!-- 一代联系方式/费用 -->
					<template #order_delegationBtn="{formList,saveData}">
						<el-button type="primary" @click="addDelegation(saveData)">增加</el-button>
					</template>
					<template #order_delegationList="{formList,saveData}">
						<el-row :gutter="20">
							<template v-for="(item,index) in saveData['order_delegation_header.remark']" :key="index">
								<el-col class="mt-1" :span="6">
									<p class="pb">一代联系方式</p>
									<el-input
										v-model="saveData['order_delegation_header.remark'][index]['contact_phone']"
										:rows="3" type="textarea" placeholder="请输入" />
								</el-col>
								<el-col class="p-r mt-1" :span="6">
									<el-icon class="p-a r_0 t_0 z-1000 hand" style="margin: 5px 15px;"
										@click="saveData['order_delegation_header.remark'].splice(index, 1)">
										<Close />
									</el-icon>
									<p class="pb">一代费用</p>
									<el-input v-model="saveData['order_delegation_header.remark'][index]['fee']"
										:rows="3" type="textarea" placeholder="请输入" />
								</el-col>
							</template>
						</el-row>
					</template>

					<!-- 应付款 -->
					<template #AccountsBtn="{saveData,formList}">
						<div>
							<span class="colorr pl-1">业务员请仔细核对费用内容，如有疑问，请与操作员确认！</span>
							<!-- <el-button :type="payment_status==1?'success':'danger'"
							@click="changePaymentStatus">费用{{payment_status==1?'已':'未'}}完结</el-button> -->
							<el-button type="success" plain>费用未完结</el-button>
							<el-button type="success" plain>账单未做</el-button>
							<el-button type="primary" plain @click="toBillPage()">制作账单</el-button>
							<el-button type="primary" plain @click="addAccount()">添加明细</el-button>
						</div>
					</template>
					<template #AccountsPayable="{saveData,formList}">
						<table-list :tableConfig="tableConfigAccounts" :tableColumn="AccountsColumn" :multiple="false"
							:border="true" ref="accountTable" @tableItemChange="tableItemChangeAccounts">
							<template #table_company_header_id>
								<div style="display: flex;justify-content: space-between;">
									<div>费用明细</div>
									<el-button type="warning" size="small" plain @click="addAccountsPage">新增</el-button>
								</div>
							</template>
							<template #bottomCon="{tableData}">
								<el-row :gutter="20">
									<el-col class="p-r" v-for="(item,index) in tableData" :key="index" :span="6">
										<el-input v-model="tableData[index].remark" :rows="5" type="textarea"
											placeholder="请输入" class="mt-1" />
									</el-col>
								</el-row>
							</template>
						</table-list>
					</template>
					
					<!-- 应收款 -->
					<template #PaymentBtn="{saveData,formList}">
						<div>
							<el-button type="primary" @click="addPayment()">添加应收款</el-button>
						</div>
					</template>
					<template #PaymentPayable="{saveData,formList}">
						<table-list :tableConfig="tableConfigPayment" :tableColumn="PaymentColumns" :multiple="false" :border="true" ref="paymentTable"></table-list>
					</template>
					
					<!-- 落箱数据 -->
					<template #shoppingCompany>
						<div style="margin-left: 100px;">
							<el-tooltip placement="top">
							  <!-- 使用带样式的插槽内容 -->
							  <template #content>
								<div class="tooltip-content multiline-text">{{ shipCompany.phone ? shipCompany.phone :'暂无电话' }}</div>
							  </template>
							  <el-button type="text" @click="toShipCompanyUrl">船公司网址</el-button>
							</el-tooltip>
						</div>
					</template>
					<template #template11="{saveData,formList}">
						<el-form-item style="width: 100%;" label="落箱数据" label-width="100px">
							<el-button type="primary" @click="createDrop">生成</el-button>
						</el-form-item>
						<drop-box ref="dropBox"></drop-box>
					</template>
					<template #boxInfo>
						<box-info ref="boxInfo" :boxData="boxData" class="mt-2" @boxInfoChange="boxInfoChange"
							@containerInfo="containerInfo"></box-info>
					</template>

					<!-- 提单信息 -->
				<!-- 	<template #billInfo>
						<BillForm ref="billForm" @saveBill="saveBill"></BillForm>
					</template -->>

					<!-- 文件上传 -->
					<template #fileInfo>
						<file-Table ref="fileInfo" @uploadFile="uploadFile"></file-Table>
					</template>

				</common-form>
			</el-card>
		</el-dialog>

		<el-dialog v-model="remarkVisible" title="备注信息" width="500px" :close-on-click-modal="false">
			<el-input v-model="remark" :rows="5" type="textarea" placeholder="备注内容" />
			<template #footer>
				<div class="dialog-footer">
					<el-button type="primary" @click="updateRemark()"> 确认 </el-button>
				</div>
			</template>
		</el-dialog>
		<el-dialog v-model="billVisible" title="账单列表" width="80%" :close-on-click-modal="false">
			<table-list :tableConfig="tableConfigBill" :tableColumn="tableColumnBill" :toolbar="true" class="px-2" ref="tableListBill" :number="true" :multiple="false">
				<template #headerRight></template>
			</table-list>
		</el-dialog>
		<div  v-show="billBool== true" v-draggable style="width: 60%;top: 20px;z-index: 9999;max-height: 800px;font-size: 12px;overflow: hidden;" class="shadow-lg">
		<!-- <el-dialog v-model="paySureVisible" title="费用确认单" width="90%"  :modal="false"
  :close-on-click-modal="false" draggable  :lock-scroll="false"> -->
			<div v-if="billBool== true"  class="w-100 h-100" style="overflow: scroll;width: 100%;height: 800px;background: #fff;padding: 0 20px" ref="contentContainer">
				<div class="d-flex w-100" style=" flex-shrink: 0;">
					<div class="pt-2 flex-1 bR-0 pr-2 w-100" style="">
						<div class="flex1">
							<img src="../../../assets/pay_sure_logo.png" alt="" style="width: 260px;height: 40px;"/>
							<p class="font-32 font-w">Logistics & Services</p>
						</div>
						<div class="font-32 t-c bB-0 pb-2">费用确认单</div>
						<div class="flex a-center flex-wrap pb-1 bB-0 w-100">
							 <el-checkbox-group v-model="checkList" class="flex a-center flex-wrap py-1 w-100">
								 <el-checkbox label="复选框 A" style="width: 30%;" class="mt-2">
									 <div  class="flex ">
									 	<p style="width: 100px;">委托人：</p>
										<el-input v-model="formBill.delegation_header"></el-input>
									 	<!-- <p class="color0">宁被皓定进出口有限公司+小杨</p> -->
									 </div>
								 </el-checkbox>
								<el-checkbox label="复选框 A" style="width: 30%;" class="mt-2">
									 <div  class="flex">
									 	<p  style="width: 100px;">起运港：</p>
										<el-input v-model="formBill.origin_port"></el-input>
									 	<!-- <p class="color0">Ningbo</p> -->
									 </div>
								</el-checkbox>
								<el-checkbox label="复选框 A" style="width: 30%;" class="mt-2">
									<div class="flex">
										<p style="width: 100px;">提单号：</p>
										<el-input v-model="formBill.bl_no"></el-input>
										<!-- <p class="color0">COSU9503431040</p> -->
									</div>
								</el-checkbox>
								<el-checkbox label="复选框 A" style="width: 30%;" class="mt-2">
									<div class="flex">
										<p style="width: 100px;">合同号：</p>
										<el-input v-model="formBill.contract_no"></el-input>
										<!-- <p class="color0">25NS-2129</p> -->
									</div>
								</el-checkbox>
								<el-checkbox label="复选框 A" style="width: 30%;" class="pt-2">
									<div class="flex">
										<p style="width: 100px;">目的港：</p>
										<el-input v-model="formBill.destination_port"></el-input>
										<!-- <p class="color0">Liverpool</p> -->
									</div>
								</el-checkbox>
								<el-checkbox label="复选框 A" style="width: 30%;" class="mt-2">
									<div class="flex">
										<p style="width: 100px;">船名/航次：</p>
										<el-input v-model="formBill.ship_name"></el-input>
										<!-- <p class="color0">MONACO MAERSK/521W</p> -->
									</div>
								</el-checkbox>
								<el-checkbox label="复选框 A" style="width: 30%;" class="mt-2">
									<div class="flex">
										<p style="width: 100px;">工作编号：</p>
										<el-input v-model="formBill.job_no"></el-input>
										<!-- <p class="color0">HO8-ZH25176</p> -->
									</div>
								</el-checkbox>
								<el-checkbox label="复选框 A" style="width: 30%;" class="mt-2">
									<div class="flex">
										<p style="width: 100px;">开船日期：</p>
										<el-input v-model="formBill.sailing_at"></el-input>
										<!-- <p class="color0">24-May-2025</p> -->
									</div>
								</el-checkbox>
								<el-checkbox label="复选框 A" style="width: 30%;" class="mt-2">
									<div class="flex">
										<p style="width: 100px;">到港日期：</p>
										<el-input v-model="formBill.arrival_at"></el-input>
										<!-- <p class="color0">07-Ju1-2025</p> -->
									</div>
								</el-checkbox>
							</el-checkbox-group>
						</div>
						<div class="bB-0 py-2 w-100">
							<el-table
							    ref="multipleTable"
							    :data="tableData"
							    tooltip-effect="dark"
							    style="width: 100%;text-align: center;"
								:header-row-style="{backgroundColor:' #fff'}"
							    @selection-change="handleSelectionChange">
							    <el-table-column
							      type="selection"
							      width="55">
							    </el-table-column>
								<!-- <el-table-column
								      type="index"
								      width="50">
								    </el-table-column> -->
							    <el-table-column
							      label="费用明细"
								  align="center" width="180">
							      <template v-slot="{row}">
									  <el-select v-model="row.name3" placeholder="请选择费用明细" filterable>
									    <el-option label="代理码头港务港建费" value="shanghai"></el-option>
									    <el-option label="区域二" value="beijing"></el-option>
									  </el-select>
								  </template>
							    </el-table-column>
							    <el-table-column
							      prop="name"
							      label="币种"
								  align="center">
								  <template v-slot="{row}">
								  		<el-select v-model="row.name" placeholder="请选择币种">
										  <el-option label="区域一" value="shanghai"></el-option>
										  <el-option label="区域二" value="beijing"></el-option>
										</el-select>
								  </template>
							    </el-table-column>
								<!-- <el-table-column
								  label="单位"
								  align="center">
								  <template v-slot="{row}">
									  <el-input v-model="row.name"></el-input>
								  </template>
								</el-table-column> -->
								<el-table-column
								  label="数量"
								  align="center">
								  <template v-slot="{row}">
									  <el-input v-model="row.name" type="number"></el-input>
								  </template>
								</el-table-column>
								<el-table-column
								  label="单价"
								  align="center">
								  <template v-slot="{row}">
									  <el-input v-model="row.name" type="number"></el-input>
								  </template>
								</el-table-column>
							    <el-table-column
							      prop="address"
							      label="总计"
								  align="center">
							    </el-table-column>
								<el-table-column
								  label="备注"
								  align="center"
								  width="180">
								  <template v-slot="{row}">
									  <el-input v-model="row.name"></el-input>
								  </template>
								</el-table-column>
								<el-table-column label="操作" align="center" width="180">
								  <template v-slot="scope">
									<el-button
									  size="mini">增加</el-button>
									<el-button
									  size="mini"
									  type="danger"
									  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
								  </template>
								</el-table-column>
							  </el-table>
						</div>
						<div class="pb-2">
							<el-table
							    ref="multipleTable"
							    :data="tableData"
							    tooltip-effect="dark"
							    style="width: 100%;text-align: center;"
								 :span-method="objectSpanMethod"
							    @selection-change="handleSelectionChange">
							    <el-table-column
							      type="selection"
							      width="55">
							    </el-table-column>
								<el-table-column
								      type="index"
								      width="50">
								    </el-table-column>
							    <el-table-column
							      label="箱号"
								  prop="name1"
								  align="center">
								  <template v-slot="{row}">
								  		 <el-input v-model="row.name1"></el-input>
								  </template>
								  </el-table-column>
								<el-table-column
								  label="柜型"
								  align="center"
								  width="100">
								  <template v-slot="{row}">
									  <el-input v-model="row.name2"></el-input>
								  </template>
								</el-table-column>
								<el-table-column
								  label="司机信息"
								  align="center">
								  <template v-slot="{row}">
									  <el-input v-model="row.name2"></el-input>
								  </template>
								</el-table-column>
								<el-table-column label="操作" align="center">
								  <template v-slot="scope">
									<el-button
									  size="mini">增加</el-button>
									<el-button
									  size="mini"
									  type="danger"
									  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
								  </template>
								</el-table-column>
								<el-table-column
								  label="总计"
								  align="center">
								  <template v-slot="{row}">
									  <p>CNY：</p>
									  <p>USD：</p>
								  </template>
								</el-table-column>
							  </el-table>
							  <p class="pt-2">请在收到此费用确认单24小时之内确认回传，否则我司默认以上费用正确无误。谢谢合作!</p>
							  <div class="flex">
								  <div class="w-70">
									  <div class="pt-2 w-100">
										  <el-input
											type="textarea"
											:rows="4"
											placeholder="请输入内容"
											v-model="textarea">
										  </el-input>
									  </div>
									  <div class="pt-2 w-100">
										  <el-input
											type="textarea"
											:rows="4"
											placeholder="请输入内容"
											v-model="textarea">
										  </el-input>
									  </div>
									  <div class="pt-2 w-100">
										  <el-input
											type="textarea"
											:rows="4"
											placeholder="请输入内容"
											v-model="textarea">
										  </el-input>
									  </div>
								  </div>
								  <div class="pl-2">
									  <el-switch
									    v-model="value1">
									  </el-switch>
									  <div class="mt-2">
										 <img style="width: 200px;height: auto;" src="../../../assets/pay_sure_logo1.png" alt="" /> 
									  </div>
								  </div>
								</div>
								<div class="pt-2 bT-0 font-center" style="margin-top: 100px;">
								  <div class="w-60">
									  <el-input
										type="textarea"
										:rows="5"
										placeholder="请输入内容"
										v-model="textarea">
									  </el-input>
								</div>
							  </div>
						</div>
					</div>
					<div style="width: 400px; flex-shrink: 0; " class="pl-2">
						<el-form :inline="true" :model="form" class="demo-form-inline" label-width="100px">
						  <el-form-item label="导出文件名">
						    <el-input v-model="form.name" placeholder=""></el-input>
						  </el-form-item>
						  <el-form-item>
						    <el-button type="primary" @click="onSubmit">导出word</el-button>
						    <el-button type="primary" @click="onSubmit">导出pdf</el-button>
						  </el-form-item>
						</el-form>
						<el-form :inline="true" :model="form" class="demo-form-inline" label-width="100px" >
						  <el-form-item label="模板名字">
						    <el-input v-model="form.name" placeholder=""></el-input>
						  </el-form-item>
						  <el-form-item>
						    <el-button type="primary" @click="onSubmit">保存模板</el-button>
						  </el-form-item>
						</el-form>
						<div class="b-0 px-2 py-1 radius10" style="display: inline-block;">
							<span class="pr-2">模板1</span>
							<el-button class="icon-color-black" icon="Delete" @click="handlePaySureDelete(item)"></el-button>
						</div>
					</div>
				</div>
				<div class="pt-2">
					<div class="dialog-footer">
						<el-button type="primary" @click="submitForm">生成图片</el-button>
						<el-button type="primary" @click="submitForm">保 存</el-button>
						<el-button @click="cancelBill">取 消</el-button>
					</div>
				</div>
			</div>
		<!-- </el-dialog> -->
		</div>
	</div>

</template>

<script setup name="OperatingDocuments">
	import {
		ref,
		onMounted,
		h,
		getCurrentInstance
	} from "vue";
	import SearchTop from "@/components/searchTop/searchTop";
	import TableList from "@/components/tableList/index";
	import CommonForm from "@/components/commonForm/index";
	import DropBox from "@/components/document/dropBox";
	import BoxInfo from "@/components/document/boxInfo";
	import FileTable from "@/components/document/fileTable";
	import BillForm from '@/components/document/BillForm.vue'
	import {
		httpPost,
		httpGet,
		httpPut,
		httpDelete
	} from '@/api/apiCommon';
	import {
		Close,
		Plus,
		Refresh
	} from '@element-plus/icons-vue'
	import {
		useTransition
	} from '@vueuse/core'
	import {
		queryParams,
		formList,
		AccountsColumn,
		amountFormDoc,
		rulesInit,
		statistic,
		PaymentColumn,
		amountFormFin,
		paySureFromList,
		paySureList,
		paySureList1
	} from '@/utils/services';
	import {
		detailInfo,
		keyStatus,
		commonParam
	} from '@/utils/common'
	import {
		getCZY,
		getSW
	} from '@/api/commonList';
	import {
		ElButton
	} from 'element-plus'
	const {
		proxy
	} = getCurrentInstance();

	const dialogFormVisible = ref(false);
	const billVisible = ref(false)
	const editId = ref('');
	const formListNew = ref([]);
	const AccountsColumns = ref([]);
	const PaymentColumns = ref([]);
	const paySureLists = ref([]);
	const paySureList1s = ref([]);
	const loading = ref(true);
	const seletData = ref({});

	const containers = ref([]); //箱子信息
	const order_files = ref([]); //文件信息
	const paySureVisible = ref(false); //文件信息
	const billBool= ref(false)
	const formBill= ref({})
	const contentContainer= ref(null)
	function toBillPage(){
		billBool.value= true
		console.log(contentContainer.value,'contentContainer.value')
		if(contentContainer.value){
			contentContainer.value.scrollTop = 0
			contentContainer.value.scrollLeft = 0
		}
		formBill.value= {
			delegation_header: proxy.$refs.commonForm.saveData.delegation_header,
			job_no: proxy.$refs.commonForm.saveData.job_no,
			contract_no: proxy.$refs.commonForm.saveData.contract_no,
			bl_no: proxy.$refs.commonForm.saveData.bl_no,
			origin_port: proxy.$refs.commonForm.saveData.origin_port,
			destination_port: proxy.$refs.commonForm.saveData.destination_port,
			ship_name: proxy.$refs.commonForm.saveData.ship_name,
			ship_no: proxy.$refs.commonForm.saveData.ship_no,
			sailing_at: proxy.$refs.commonForm.saveData.sailing_at,
			arrival_at: proxy.$refs.commonForm.saveData.arrival_at
		}
		console.log(formBill.value,'formBill.value')
		console.log(proxy.$refs.commonForm.saveData,'formListNew.value[0].formData[0]')
	}
	function cancelBill(){
		billBool.value= false
	}
	// 模板
	const  checkList= ref(['复选框']) 
	const tableData= ref([{name: 1,name1:'MSKU6947553'},{name: 1,name1:'MSKU6947553'},{name: 1,name1:'MSKU6947553'}])
	const form= ref({name: '测试'})
	const value1= ref(true)
	const textarea= ref('我司收款账户公司名称：宁波华奇国际物流有限公司税务登记号：91330212MAE09CKNXD开户行名称：浙江泰隆商业银行宁波鄞州支行（行号：313332070108）开户行账号：33030040201000049084  (RMB)33030040201000049092 (USD)33030040201000049100（欧元）')

	function accountInit() {
		// AccountsColumn.value[4].noShow = true;
		// AccountsColumn.value[7].noShow = true;
		// AccountsColumn.value[3].form.disabled = true;
		// AccountsColumn.value[6].form.disabled = true;
		// AccountsColumn.value[8] = {
		// 	label: '操作',
		// 	prop: 'actions',
		// 	actions: [{
		// 		label: '删除',
		// 		type: 'danger',
		// 		onClick: (row, index) => accountsDelete(row, index)
		// 	}],
		// 	width: '70px'
		// }
		AccountsColumn.value[0].noShow = true;
		AccountsColumn.value[1].noShow = true;
		AccountsColumn.value[2].noShow = true;
		AccountsColumn.value[3].noShow = true;
		AccountsColumn.value[4].noShow = true;
		AccountsColumn.value[5].noShow = true;
		AccountsColumn.value[6].noShow = true;
	}
	accountInit();
	
	const YWY = ref([]);  //业务员
	const CZY = ref([]);  //操作员
	const YWLX = ref([]); //业务类型
	const TT = ref([]); //抬头/公司名称
	const CGS = ref([]); //船公司
	const DZY = ref([]); //单证员
	const SW = ref([]); //商务
	const XHDW = ref([]); //销货单位
	const MT = ref([]); //码头
	onMounted(async () => {
		statistic.value.forEach((item,index)=>{
			const source = ref(0)
			statistic.value[index].value = useTransition(source, {
				duration: 1000,
			})
			source.value = 102658.344 + index*1000000
		})
		CZY.value = await getCZY();
		SW.value = await getSW();
		queryParams.value[7].options = CZY.value;
		queryParams.value[8].options = SW.value;
		// queryParams.value[4].options = YWY.value;
		// 应收款
		PaymentColumns.value = JSON.parse(JSON.stringify(PaymentColumn.value));
		PaymentColumns.value[PaymentColumns.value.length] = {
			label: '操作',
			prop: 'actions',
			actions: [{
				label: '删除',
				type: 'danger',
				onClick: (row, index) => paymentDelete(row, index)
			}],
			width: '70px'
		}
		
		paySureLists.value = JSON.parse(JSON.stringify(paySureList.value));
		paySureLists.value[paySureLists.value.length] = {
			label: '操作',
			prop: 'actions',
			actions: [{
				label: '增加',
				type: 'danger',
				onClick: (row, index) => paymentDelete(row, index)
			},{
				label: '删除',
				type: 'danger',
				onClick: (row, index) => paymentDelete(row, index)
			}],
			width: '70px'
		}
		paySureList1s.value = JSON.parse(JSON.stringify(paySureList1.value));
		paySureList1s.value[paySureList1s.value.length] = {
			label: '操作',
			prop: 'actions',
			actions: [{
				label: '删除',
				type: 'danger',
				onClick: (row, index) => paymentDelete(row, index)
			}],
			width: '70px'
		}
		formListNew.value = JSON.parse(JSON.stringify(formList.value))
		formListNew.value[0].formData[0].formItem[0].options = YWLX.value;
		formListNew.value[0].formData[0].formItem[4].options = YWY.value;
		formListNew.value[0].formData[0].formItem[5].options = CZY.value;
		formListNew.value[0].formData[0].formItem[6].options = DZY.value;
		formListNew.value[0].formData[0].formItem[7].options = SW.value;
		formListNew.value[0].formData[0].formItem[8].options = CGS.value;
		formListNew.value[1].formData[0].formItem[0].options = XHDW.value;
		formListNew.value[1].formData[0].formItem[1].options = TT.value;
		formListNew.value[2].formData[0].formItem[10].options = MT.value;
		formListNew.value[5].formData[2].formItem = JSON.parse(JSON.stringify(amountFormFin.value));
		keyStatus(formList.value, '业务模块', function(form, options) {
			formListNew.value = form;
			// formListNew.value[5].formData[2].formItem = JSON.parse(JSON.stringify(amountFormDoc
			// .value));
			// formListNew.value[5].formData[1].noShow = true;
			loading.value = false;
			seletData.value = options;
			AccountsColumn.value[0].form.options = seletData.value.YFTT;
			// console.log('formListNew', formListNew, seletData.value)
		})
	})

	const searchConfirm = (val) => {
		console.log('searchConfirm', val)
	}

	const remarkVisible = ref(false); //备注弹框
	const remark = ref(''); //备注信息
	function updateRemark(){
		httpPut(`/orders/${editId.value}/update-remark`, {
			remark: remark.value
		}).then(res => {
			remarkVisible.value = false;
			editId.value = '';
			proxy.$modal.msgSuccess("备注成功!");
			proxy.$refs.tableList.getList();
		});
	}

	/** 查询列表 */
	const tableColumn = ref([{
			label: '工作编号',
			prop: 'job_no',
			formatter: (row) => row.job_no || '无'
		},
		{
			label: '委托抬头',
			prop: 'company_name',
			formatter: (row) => {
				var company_name = row?.orderDelegationHeader?.company_header?.company_name || ''
				return company_name
			}
		},
		{
			label: '操作模式',
			prop: 'order_type.name'
		},
		{
			label: '提单号',
			prop: 'bl_no'
		},
		{
			label: '柜型',
			prop: 'container_type'
		},
		{
			label: '目的港',
			prop: 'destination_port'
		},
		{
			label: '开船日期',
			prop: 'sailing_at'
		},
		{
			label: '到港日期',
			prop: 'arrival_at'
		},
		{
			label: '业务员',
			prop: 'business_user.name'
		},
		{
			label: '提货',
			prop: 'is_delivery',
			// formatter: (row) => row.is_delivery === 1 ? '已提货' : (row.is_delivery === 2 ?'超期未提货':'未提货'),
			render: (row, index) => {
				return [
					h(ElButton, {
							type: row.is_delivery == 1 ?'success' : (row.is_delivery == 2 ?'danger':'warning'),
							size: 'small',
							onClick: () => {},
							style: {
								margin: '0px'
							},
							key: row.id
						},
						() => (row.is_delivery == 1 ? '已提货' : (row.is_delivery == 2 ?'超期未提货':'未提货'))
					)
				]
			}
		},
		{
			label: '文件',
			prop: 'file',
			render: (row, index) => {
				return [
					h(ElButton, {
							type: row.order_files_count> 0?'success' : 'danger',
							size: 'small',
							onClick: () => {},
							style: {
								margin: '0px'
							},
							key: row.id
						},
						() => (row.order_files_count> 0 ? '有' : '无')
					)
				]
			}
		},
		{
			label: '费用完结',
			prop: 'payment_status',
			render: (row, index) => {
				return [
					h(ElButton, {
							type: row.payment_status && row.payment_status == 1 ? 'success' : 'danger',
							size: 'small',
							onClick: () => {},
							style: {
								margin: '0px'
							},
							key: row.id
						},
						() => (row.payment_status && row.payment_status == 1 ? '已完结' : '未完结')
					)
				]
			}
		},
		{
			label: '归属时间',
			prop: 'finish_at',
			formatter: (row) => row.finish_at ? row.finish_at.substring(0,10) : ''
		},
		{
			label: '备注',
			prop: 'order_remark',
			render: (row, index) => {
				return [
					h('div', {
						class: 'avoidOverflow2',
						style: {
							margin: '0px',
							cursor: 'pointer',
							color: row.order_remark?'#000':'#888',
							width: '50px',
						},
						onClick: () => {
							remarkVisible.value = true;
							editId.value = row.id;
							remark.value = row.order_remark;
						},
					}, row.order_remark||'暂无')
				]
			}
		},
		{
			label: '操作',
			prop: 'actions',
			actions: [{
					label: '查看详情',
					onClick: (row, index) => handleEdit(row, index)
				},
				{
					label: '申请开票',
					onClick: (row, index) => handleCopy(row, index)
				},
				{
					label: '帐单列表',
					onClick: (row, index) => handleBillList(row, index)
				}
			],
			fixed: "right",
			width: '190px'
		}
	]);
	const tableConfig = ref({
		url: '/orders/business-index',
		requestMethod: httpGet,
		isQuery: true
	})
	
	// 账单列表
	const tableColumnBill = ref([{
			label: '工作编号',
			prop: 'job_no',
			formatter: (row) => row.job_no || '无'
		},{
			label: '操作',
			prop: 'actions',
			actions: [{
					label: '查看详情',
					onClick: (row, index) => handleEdit(row, index)
				},
				{
					label: '申请开票',
					onClick: (row, index) => handleCopy(row, index)
				},
				{
					label: '帐单列表',
					onClick: (row, index) => handleBillList(row, index)
				}
			],
			fixed: "right",
			width: '190px'
		}])
	const tableConfigBill= ref({
		url: '/order-bills',
		requestMethod: httpGet,
		isQuery: false
	})
	const payment_status = ref(0); //费用完结状态
	const changePaymentStatus = () => {   //修改费用完结状态
		if(payment_status.value==1){
			payment_status.value = 0;
			proxy.$refs.commonForm.changeSave({
				'finish_at': '',
			});
		}else{
			httpPut(`/orders/${editId.value}/payment-finish`).then(res => {
				payment_status.value = 1;
				proxy.$refs.commonForm.changeSave({
					'finish_at': res?.finish_at||''
				});
			});
		}
	}
	const addDocument = () => {
		dialogFormVisible.value = true;
		editId.value = '';
		setTimeout(function() {
			resetInfo();

			proxy.$refs.commonForm.resetKey(formListNew.value, true);
			proxy.$refs.commonForm.changeSave({
				'order_delegation_header.remark': [],
			});
			formListNew.value[2].formData[0].formItem[1].value = '';
			formListNew.value[2].formData[0].formItem[1].remark = '';
			proxy.$refs.boxInfo.addBox(true); //箱子数据
			updateKeyRemark(proxy.$refs.commonForm.saveData);

			addDelegation();
		}, 200)
	}
	// 编辑操作处理方法
	const handleEdit = (row) => {
		httpGet(`/orders/${row.id}`).then(res => {
			dialogFormVisible.value = true;
			editId.value = row.id;
			setTimeout(function() {
				saveDataShow(res, 1);
			}, 500)
		});
	}
	//单据复制
	function handleCopy(row) {
		httpGet(`/orders/${row.id}`).then(res => {
			dialogFormVisible.value = true;
			editId.value = '';
			setTimeout(function() {
				saveDataShow(res, 2);
			}, 500)
		});
	}
	
	// 帐单列表
	function handleBillList(row){
		console.log(row,'row')
		billVisible.value = true;
		tableConfigBill.value.data= {order_id: row.id}
		tableConfigBill.value.isQuery= true
	}

	function resetInfo() {
		payment_status.value = 0;
		proxy.$refs.commonForm.activeName = '操作单据';
		containers.value = [];
		proxy.$refs.accountTable.state.tableData = [];
		order_files.value = [];
		proxy.$refs.fileInfo.dafultFile([]);
		billInfo.value = {};
		// proxy.$refs.billForm.updateBill({}, false)
		shipCompany.value = {};
	}

	function saveDataShow(res, type) {
		resetInfo();

		var data = {};
		var nullKey = ['job_no', 'contract_no', 'finish_at', 'commerce_user_id', 'container_type'];
		var defaultKey = ['insurance', 'is_delivery', 'is_finish', 'is_allowed'];  //保持默认不变的值
		for (var key in proxy.$refs.commonForm.saveData) {
			if(!(type==2&&defaultKey.indexOf(key) > -1)){
				if (key.indexOf('.') > -1) {
					var keys = key.split('.');
					var keyData = res[keys[0]]?.[keys[1]] || '';
					data[key] = keyData === 0 ? '0' : (keys[1] == 'remark' ? keyData || [] : keyData || '');
				} else {
					data[key] = res[key] === 0 ? '0' : res[key];
				}
				if (type == 2 && nullKey.indexOf(key) > -1) {
					data[key] = '';
				}
			}
		}
		// console.log('单据数据', data)
		formListNew.value[2].formData[0].formItem[1].value = data.ship_name + '/' + data.ship_no;
		formListNew.value[2].formData[0].formItem[1].remark = data.ship_name + '/' + data.ship_no;
		if (data.shipping_company_id) {
			shipCompany.value = seletData.value.CGS.find(item => item.id === data.shipping_company_id) || {}; //船公司
		}
		payment_status.value = res.payment_status || 0;
		proxy.$refs.boxInfo.updateSaveData(data, seletData.value);
		proxy.$refs.paymentTable.tableData = [];
		addPayment();
		//提单信息
		billInfo.value = res.bl_info || {};
		if(type==2){
			['no','description','volume','gross_weight'].forEach((vv)=>{
				billInfo.value[vv] = '';
			})
		}
		// proxy.$refs.billForm.updateBill(billInfo.value, true) //装箱单

		proxy.$refs.commonForm.changeSave(data);
		if ((type == 2 && payment_status.value == 0) || type == 1) {
			var order_payments = res.order_payments;
			if (type == 2 && payment_status.value == 0) {
				order_payments.forEach((vv) => {
					vv.cny_invoice_number = '';
					vv.usd_invoice_number = '';
				})
			}
			proxy.$refs.accountTable.updateTableData(order_payments);
			countAccounts();
		}

		if (type == 1) {
			containers.value = res.containers; //箱子信息
			proxy.$refs.boxInfo.defaultBox(res.containers);
			order_files.value = res.order_files; //文件
			proxy.$refs.fileInfo.dafultFile(res.order_files);
		} else {
			payment_status.value = 0;
			proxy.$refs.boxInfo.addBox(true); //箱子数据
		}
		updateKeyRemark(data);
	}
	//更新表单字段备注信息
	function updateKeyRemark(data) {
		var remarkList = {
			entered_port_wharf_id: [2, 10],
		}
		for (var key in remarkList) {
			var item = formListNew.value[remarkList[key][0]].formData[0].formItem[remarkList[key][1]];
			var dataNew = item.options ? item.options.find(v => {
				return v.id == data[key]
			}) : {};
			formListNew.value[remarkList[key][0]].formData[0].formItem[remarkList[key][1]].remark = dataNew ? dataNew
				.remark : '';
		}
	}
	//单据删除
	const deleteIds = ref([]);

	function handleDelete(row, index) {
		const _ids = row.id || deleteIds.value;
		proxy.$modal.confirm('是否确认删除选中的的数据项？').then(function() {
			return httpDelete('/orders/' + _ids);
		}).then(() => {
			proxy.$refs.tableList.getList();
			proxy.$modal.msgSuccess("删除成功");
		}).catch(() => {});
	}

	// 委托抬头-一代联系人
	const router = useRouter();

	function addCompanyHead() {
		router.push({
			path: "/company/company-headers",
			query: {
				add: true
			},
		});
	}
	async function refreshCompanyHead() {
		var WTTT = await getTT(commonParam().WTTT_params); //委托公司抬头
		formListNew.value[1].formData[0].formItem[1].options = WTTT;
	}
	const addDelegation = () => {
		var data = proxy.$refs.commonForm.saveData['order_delegation_header.remark'];
		data.push({
			contact_phone: '',
			fee: ''
		})
		proxy.$refs.commonForm.changeSave({
			'order_delegation_header.remark': data
		});
	}
	const deleteDelegation = (index) => {
		var data = proxy.$refs.commonForm.saveData['order_delegation_header.remark'];
		data.splice(index, 1);
		proxy.$refs.commonForm.changeSave({
			'order_delegation_header.remark': data
		});
	}

	//新增费用明细
	function addAccountsPage() {
		router.push({
			path: "/company/company-headers",
			query: {
				add: true
			},
		});
	}
	const addAccount = () => {
		var tableData = proxy.$refs.accountTable.state.tableData;
		var data = {
			company_header_id: null,
			no_invoice_remark: null,
			cny_amount: 0.00,
			cny_invoice_number: null,
			usd_amount: 0.00,
			usd_invoice_number: null,
			// contact_phone: null,
			// contact_person: null,
		}
		tableData.push(data);
		proxy.$refs.accountTable.updateTableData(tableData);
	}
	const addPaySure= () =>{
		var tableData = proxy.$refs.accountTable.state.tableData;
		var data = {
			company_header_id: null,
			no_invoice_remark: null,
			cny_amount: 0.00,
			cny_invoice_number: null,
			usd_amount: 0.00,
			usd_invoice_number: null,
			// contact_phone: null,
			// contact_person: null,
		}
		tableData.push(data);
		proxy.$refs.accountTable.updateTableData(tableData);
	}
	const accountsDelete = (row) => {
		const rowIndex = proxy.$refs.accountTable.state.tableData.findIndex(item => item === row);
		proxy.$refs.accountTable.state.tableData.splice(row.index, 1);
		countAccounts();
		// console.log('accountsDelete', row, rowIndex)
	}

	function tableItemChangeAccounts(item, index) {
		// console.log('tableItemChangeAccounts', item, index)
		var tableData = proxy.$refs.accountTable.state.tableData[index];
		var dataNew = item.options ? item.options.find(v => {
			return v.id == tableData[item.key]
		}) : {};
		if (item.key == 'company_header_id') {
			tableData.remark = dataNew.remark || ''
		}
		tableData[item.key] = item.value;
		proxy.$refs.accountTable.state.tableData[index] = tableData;
		// console.log('tableItemChangeAccounts-tableData', tableData)
		countAccounts();
	}

	function countAccounts() {
		var tableData = proxy.$refs.accountTable.state.tableData;
		let cny_amount = tableData.reduce((accumulator, currentValue) => {
			return accumulator + parseFloat(currentValue.cny_amount) || 0;
		}, 0);
		let usd_amount = tableData.reduce((accumulator, currentValue) => {
			return accumulator + parseFloat(currentValue.usd_amount) || 0;
		}, 0);
		// console.log('计算', usd_amount, cny_amount)
		proxy.$refs.commonForm.changeSave({
			cny_amount_total: parseFloat(cny_amount).toFixed(2),
			usd_amount_total: parseFloat(usd_amount).toFixed(2),
		});
	}

	// 箱子信息变更
	const boxInfoChange = (data) => {
		containers.value = data;
		// console.log('箱子信息变更', containers.value)
	}
	//箱子柜型数据统计
	function containerInfo(info) {
		proxy.$refs.commonForm.changeSave({
			container_type: info
		});
	}

	// 文件上传
	const uploadFile = (file) => {
		order_files.value = file;
		// console.log('uploadFile', file);
	}

	//船公司信息
	const shipCompany = ref({});

	function toShipCompanyUrl() {
		if (shipCompany.value.tracking_url) {
			window.open(shipCompany.value.tracking_url)
		} else {
			proxy.$modal.msgWarning("暂无网址");
		}
	}
	//落箱数据生成
	function createDrop() {
		var saveData = {
			...proxy.$refs.commonForm.saveData,
			boxInfo: containers.value
		};
		proxy.$refs.dropBox.openDrop(saveData, seletData.value);
	}
	//tab变更
	const tabsChange = (tab) => {
		if (tab == '提单信息') {
			setTimeout(function() {
				var saveData = {
					...proxy.$refs.commonForm.saveData,
					boxInfo: containers.value,
					shipCompany: shipCompany.setTime
				};
				// console.log('tab变化', tab=='提单信息', proxy.$refs.billForm);
				// proxy.$refs.billForm.openBill(false, saveData, seletData.value);
			}, 300)
		}
	}
	//提单信息变更
	const billInfo = ref({});
	const saveBill = (val) => {
		billInfo.value = val;
	}
	//单独字段操作
	const itemChange = (data, val, item) => {
		var saveData = proxy.$refs.commonForm.saveData;
		var dataNew = item.options ? item.options.find(v => {
			return v.id == val
		}) : {};
		var updateData = {};
		if (item.key == 'shipping_company_id') {
			shipCompany.value = item.options.find(v => {
				return v.id == val
			})
		} else if (item.key == 'cutoff_status') {
			formListNew.value[0].formData[0].formItem[17].disabled = val == 3 ? true : false;
			formListNew.value[2].formData[0].formItem[7].disabled = val == 3 ? true : false;
			if (val == 1) {
				formListNew.value[0].formData[0].formItem[17].rules = rulesInit('请选择截单日期', 1);
				formListNew.value[2].formData[0].formItem[7].rules = rulesInit('请选择截单日期', 1);
			} else {
				delete formListNew.value[0].formData[0].formItem[17].rules;
				delete formListNew.value[2].formData[0].formItem[7].rules;
			}
			updateData.cutoff_at = '';
			if (val == 3 && saveData.port_open_at) {
				updateData.cutoff_at = saveData.port_open_at;
			}
		} else if (item.key == 'order_type_id') {
			updateData.is_delivery = dataNew.name == '海运整柜' || dataNew.name == '拼箱空运' ? '0' : 1;
			updateData.bl_status = dataNew.name == '海运整柜' || dataNew.name == '拼箱空运' ? 1 : '0';
		} else if (item.key == 'order_delegation_header.company_header_id') {
			updateData['order_delegation_header.contact_person'] = dataNew.contact_person;
			updateData['order_delegation_header.contact_phone'] = dataNew.contact_phone;
		} else if (item.key == 'ship_name' || item.key == 'ship_no') {
			formListNew.value[2].formData[0].formItem[1].value = saveData.ship_name + '/' + saveData.ship_no;
			formListNew.value[2].formData[0].formItem[1].remark = saveData.ship_name + '/' + saveData.ship_no;
		} else if (item.key == 'entered_port_wharf_id') { //进港码头
			formListNew.value[2].formData[0].formItem[10].remark = dataNew ? dataNew.remark : '';
		} else if (item.key == 'port_open_at') { //开港时间
			if (saveData.cutoff_status == 3) updateData.cutoff_at = val;
		} else if (item.key == 'actual_sailing_at') { //实际开船时间
			formListNew.value[0].formData[0].formItem[20].disabled = val ? true : false;
			updateData.sailing_at = val ? val : saveData.sailing_at;
		} else if (item.key == 'actual_arrival_at') { //实际到港时间
			formListNew.value[0].formData[0].formItem[21].disabled = val ? true : false;
			updateData.arrival_at = val ? val : saveData.arrival_at;
		}
		proxy.$refs.boxInfo.updateSaveData(saveData, seletData.value);
		proxy.$refs.commonForm.changeSave(updateData);
		// console.log('编辑字段:cutoff_at', data, proxy.$refs.commonForm.saveData)
	}

	// 单据信息提交
	const confirmSubmit = (data) => {
		// console.log('单据信息提交:', data)
		if(containers.value.findIndex(v=>{return !v.container_type_id})>-1){
			proxy.$modal.msgWarning("请完善箱子信息!");
			return;
		}
		var order_payments = proxy.$refs.accountTable.state.tableData
		var params = {
			...data,
			containers: containers.value,
			order_payments: order_payments,
			order_files: order_files.value,
			// bl_info: proxy.$refs.billForm.save(2),
			payment_status: payment_status.value
		}
		var strKey = ['booking_info', 'order_delegation_header', 'order_payments', 'containers', 'order_files',
			'bl_info'
		];
		strKey.forEach((item) => {
			if (params[item] && JSON.stringify(params[item]) != '[]' && JSON.stringify(params[item]) != '{}') {
				params[item] = JSON.stringify(params[item]);
			} else {
				delete params[item];
			}
		})
		delete params['undefined'];
		console.log('确认提交', params);
		// return;
		if (editId.value) {
			httpPut(`/orders/${editId.value}`, params).then(res => {
				dialogFormVisible.value = false;
				proxy.$modal.msgSuccess("修改成功!");
				proxy.$refs.tableList.getList();
			});
		} else {
			httpPost(`/orders`, params).then(res => {
				dialogFormVisible.value = false;
				proxy.$modal.msgSuccess("新增成功!");
				proxy.$refs.tableList.getList();
			});
		}
	}
	// 单据取消
	const cancelForm = (data) => {
		// console.log('取消:', data)
		dialogFormVisible.value = false;
	}

	//应付款表格数据
	const tableConfigAccounts = ref({
		url: '/orders',
		requestMethod: httpGet,
		isQuery: false
	})
	
	//应付款表格数据
	const tableConfigPayment = ref({
		isQuery: false
	})
	const addPayment = () => {
		proxy.$refs.paymentTable.tableData.push({
			company_header_id: '',
			no_invoice_remark: '',
			cny_amount: '',
			cny_invoice_number:'',
			cny_is_cashed: 0,
			usd_amount: '',
			usd_invoice_number: '',
			usd_is_cashed: 0
		});
	}
	
	/** 删除模板 */
	function handlePaySureDelete(item) {
		proxy.$modal.confirm('是否确认删除此模板？').then(function() {
			return delByIds(item.id);
		}).then(() => {
			getList();
			proxy.$modal.msgSuccess("删除成功");
		}).catch(() => {});
	}
	
	function objectSpanMethod({ row, column, rowIndex, columnIndex }) {
		console.log(rowIndex,1226)
	        if (columnIndex === 6) {
			  if (rowIndex  === 0) {
				return {
				  rowspan: tableData.value.length,
				  colspan: 1
				};
			  } else {
				return {
				  rowspan: 0,
				  colspan: 0
				};
			  }
			}
	}
</script>

<style>
	.font-center .el-textarea__inner{
		text-align: center !important;
	}
	.icon-color-black{
	  color: #333;
	  font-size: 20px;
	  border: none
	}
</style>
<style scoped>
	.dialog-footer{
		text-align: right
	}
</style>