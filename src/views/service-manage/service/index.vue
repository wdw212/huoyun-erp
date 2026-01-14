<template>

	<div class="p-r service" v-loading="loading">
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
		<el-dialog v-model="dialogFormVisible" title="业务详情" width="80%" :close-on-click-modal="false" style="z-index: 999">
			<el-card>
				<common-form ref="commonForm" v-model:formList="formListNew" @confirm="confirmSubmit"
					@cancel="cancelForm" @itemChange="itemChange" @tabsChange="tabsChange" :btnShow="false">
					<!-- 订舱信息及备注 -->
					<template #remarkBtn="{formList,saveData}">
						<span style="font-weight: bold;padding-right: 10px;color: #606266;">订舱信息及备注</span>
						<el-button type="primary" @click="saveData.booking_info.push('')">订舱信息及备注</el-button>
					</template>
					<template #remarkList="{formList,saveData}">
						<el-row :gutter="20">
							<el-col class="p-r mb-1" v-for="(item,index) in saveData.booking_info" :key="index" :span="6">
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
					<template #billInfo>
						<BillForm ref="billForm" @saveBill="saveBill"></BillForm>
					</template>

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
			<el-button type="primary" @click="handleAddBill()"> 新增 </el-button>
			<table-list :tableConfig="tableConfigBill" :tableColumn="tableColumnBill" :toolbar="true" :toolbarRowReset='false' class="px-2" ref="tableListBill" :number="true" :multiple="false"  :show-summary="true" :summary-fields="['cny_amount','usd_amount']">
				<template #headerRight></template>
			</table-list>
		</el-dialog>
		<div v-draggable="{handle: '.custom-handle'}" :style="{width: '1000px',top: '10px',zIndex: '1000',height: '600px',fontSize: '12px',overflow: 'hidden',display: billBool== true?'block': 'none',position: 'fixed'}" class="shadow-lg0 radius10 draggable">
		<!-- <el-dialog v-model="paySureVisible" title="费用确认单" width="90%"  :modal="false"
  :close-on-click-modal="false" draggable  :lock-scroll="false"> -->
			<div  class="w-100 h-100 bill-dialog flex flex-column" style="background: #fff;padding: 0 5px" ref="contentContainer">
				<div class="py-1 w-100" style="height: 50px;">
					<div class="dialog-footer">
						<el-button type="primary" @click="exportToImage">生成图片</el-button>
						<el-button type="primary" @click="openInvoiceForm">申请开票</el-button>
						<el-button type="primary" @click="submitFormBill">保 存</el-button>
						<el-button @click="cancelBill">取 消</el-button>
					</div>
				</div>
				<div class="d-flex w-100 flex-1" style="height: 550px;">
					<div class="pt-1 flex-1 bR-0 pr-1 w-100 flex flex-column " style="font-size: 12px;">
						<div class="custom-handle  w-100">
							<div class="flex1">
								<img :src="formBill.pay_sure_logo" alt="" style="width: 260px;height: 40px;"/>
								<p class="font-32 font-w">Logistics & Services</p>
							</div>
							<div class="font-32 t-c bB-0 pb-2">费用确认单</div>
						</div>
						<div class="flex-1"  style="overflow-y: auto;">
							<div class="flex a-center flex-wrap pb-1 bB-0 w-100 font-12">
								
								 <el-checkbox-group v-model="invoiceForm.checkList" class="flex a-center flex-wrap py-1 w-100">
									 <div style="width: 32%;" class="flex mt-2 mr-1">
										 <el-checkbox label="delegation_header">
											 <div  class="flex ">
												<p style="width: 70px;">委托人：</p>
												<!-- <p class="color0">宁被皓定进出口有限公司+小杨</p> -->
											 </div>
										 </el-checkbox>
										 <el-input v-model="formBill.delegation_header"></el-input>
										<!-- <el-select v-model="formBill.delegation_header" placeholder="请选择委托人" filterable clearable>
										   <el-option v-for="item in seletData.WTTT" :key="item.id" :label="item.company_name" :value="item.id"/>
										 </el-select> -->
									 </div>
									 <div style="width: 32%;" class="flex mt-2 mr-1">
										 <el-checkbox label="origin_port">
											 <div  class="flex">
												<p  style="width: 70px;">起运港：</p>
												<!-- <p class="color0">Ningbo</p> -->
											 </div>
										 </el-checkbox>
										 <el-input v-model="formBill.origin_port"></el-input>
									 </div>
									<div style="width: 32%;" class="flex mt-2 mr-1">
										 <el-checkbox label="bl_no">
											<div class="flex">
												<p style="width: 70px;">提单号：</p>
												<!-- <p class="color0">COSU9503431040</p> -->
											</div>
										 </el-checkbox>
										 <el-input v-model="formBill.bl_no"></el-input>
									</div>
									<div style="width: 32%;" class="flex mt-2 mr-1">
										 <el-checkbox label="contract_no">
											<div class="flex">
												<p style="width: 70px;">合同号：</p>
												<!-- <p class="color0">25NS-2129</p> -->
											</div>
										 </el-checkbox>
										 <el-input v-model="formBill.contract_no"></el-input>
									</div>
									<div style="width: 32%;" class="flex mt-2 mr-1">
										<el-checkbox label="destination_port">
											<div class="flex">
												<p style="width: 70px;">目的港：</p>
												<!-- <p class="color0">Liverpool</p> -->
											</div>
										</el-checkbox>
										<el-input v-model="formBill.destination_port"></el-input>
									</div>
									<div style="width: 32%;" class="flex mt-2 mr-1">
										<el-checkbox label="ship_name">
											<div class="flex">
												<p style="width: 70px;">船名/航次：</p>
												<!-- <p class="color0">MONACO MAERSK/521W</p> -->
											</div>
										</el-checkbox>
										<el-input v-model="formBill.ship_name" style="width: 60%;"></el-input>
										<el-input v-model="formBill.ship_no" style="width: 40%;"></el-input>
									</div>
									<div style="width: 32%;" class="flex mt-2 mr-1">
										<el-checkbox label="job_no">
											<div class="flex">
												<p style="width: 70px;">工作编号：</p>
												<!-- <p class="color0">HO8-ZH25176</p> -->
											</div>
										</el-checkbox>
										<el-input v-model="formBill.job_no"></el-input>
									</div>
									<!-- <div class="flex mt-2 mr-1" style="width: 30%;">
										<el-checkbox label="sailing_at">
											<p style="width: 100px;">开船日期：</p>
										</el-checkbox>
										<div>
											<!-- <el-input v-model="formBill.sailing_at"></el-input> -->
											<!-- <el-date-picker
												  v-model="formBill.sailing_at"
												  type="date"
												  placeholder="选择日期">
												</el-date-picker>
										</div>
									</div> -->
									<div class="flex mt-2 mr-1" style="width: 32%;">
										<el-checkbox label="sailing_at">
											<p style="width: 70px;">开船日期：</p>
										</el-checkbox>
										<div>
											<el-date-picker
											style="width: 100%;"
												  v-model="formBill.sailing_at"
												  type="date"
												  placeholder="选择日期">
												</el-date-picker>
										</div>
									</div>
									<div class="flex mt-2 mr-1" style="width: 32%;">
										<el-checkbox label="arrival_at">
											<p style="width: 70px;">到港日期：</p>
										</el-checkbox>
										<div>
											<!-- <el-input v-model="formBill.sailing_at"></el-input> -->
											<el-date-picker
											style="width: 100%;"
												  v-model="formBill.arrival_at"
												  type="date"
												  placeholder="选择日期">
												</el-date-picker>
										</div>
									</div>
								</el-checkbox-group>
							</div>
							<div class="bB-0 py-1 w-100" style="font-size: 12px;">
								<el-table
									ref="multipleTable"
									:data="orderBillItems"
									tooltip-effect="dark"
									style="text-align: center;"
									:header-row-style="{backgroundColor:' #fff'}"
								   @selection-change="handleSelectionChangeItems"
								   @select-all="handleSelectionChangeItemsAll">
									<el-table-column
									  type="selection"
									  width="30">
									</el-table-column>
									<!-- <el-table-column
										  type="index"
										  width="50">
										</el-table-column> -->
									<el-table-column
									  label="费用明细"
									  align="center">
									  <template v-slot="{row,$index}">
										  <el-select v-model="row.fee_type_id" placeholder="请选择费用明细"  clearable filterable @change="changeCurrency($event,row,$index)">
											<el-option v-for="item in seletData.FYLX" :key="item.id" :label="item.name" :value="item.id"/>
										  </el-select>
									  </template>
									</el-table-column>
									<el-table-column
									  label="备注"
									  align="center"
									  width="120">
									  <template v-slot="{row}">
										  <el-input v-model="row.remark"></el-input>
									  </template>
									</el-table-column>
									<el-table-column
									  prop="name"
									  label="币种"
									  align="center"
									  width="100">
									  <template v-slot="{row}">
										  <!-- <div>{{optionsComm['币种']}}</div> -->
											<el-select v-model="row.currency" placeholder="请选择币种" v-select-zindex="3000">
											  <el-option v-for="item in optionsComm['币种']" :key="item.value" :label="item.label" :value="item.value"/>
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
									  align="center"
									  width="70">
									  <template v-slot="{row}">
										  <el-input v-model="row.quantity" type="number" class="custom-input"></el-input>
									  </template>
									</el-table-column>
									<el-table-column
									  label="单价"
									  align="center"
									  width="80">
									  <template v-slot="{row}">
										  <el-input v-model="row.price" type="number" class="custom-input"></el-input>
									  </template>
									</el-table-column>
									<el-table-column
									  prop="address"
									  label="小计"
									  align="center"
									  width="90">
									  <template v-slot="{row}">
											<p>{{row.quantity * row.price}}</p>
									  </template>
									</el-table-column>
									<el-table-column label="操作" align="center" width="120">
									  <template v-slot="{row,$index}">
										<el-button
										  size="mini" @click="handleAddOrderBill($index)">增</el-button>
										<el-button
										 v-if="orderBillItems.length> 1"
										  size="mini"
										  type="danger"
										  @click="handleDeletePrderBill($index)">删</el-button>
									  </template>
									</el-table-column>
								  </el-table>
							</div>
							<div class="pb-2">
								<div class="d-flex j-end font-14 mb-1" style="margin-right: 120px;">
								  <div>
									  总计：
								  </div>
								  <div class="font-w font-16 d-flex flex-column">
									  <p class="flex-1 flex">CNY：<p class="flex-1" style="text-align: center;">{{totals?totals.totalCNY: 0}}</p></p>
									  <p class="flex-1 flex">USD：<p class="flex-1"  style="text-align: center;">{{totals?totals.totalUSD: 0}}</p></p>
								  </div>
								</div>
								<div class="flex pr-4">
									<el-table
									    v-if="is_show_containers"
										class="flex-1"
										ref="multipleTable"
										:data="orderBillContainers"
										tooltip-effect="dark"
										 :span-method="objectSpanMethod"
										@selection-change="handleSelectionChangeContainers"
										@select-all="handleSelectionChangeContainersAll">
										<el-table-column
										  type="selection"
										  width="30">
										</el-table-column>
										<el-table-column
											  type="index"
											  width="10">
											</el-table-column>
										<el-table-column
										  label="箱号"
										  prop="no"
										  align="center"
										  width="140">
										  <template v-slot="{row}">
												 <el-input v-model="row.no"></el-input>
										  </template>
										  </el-table-column>
										<el-table-column
										  label="柜型"
										  align="center"
										  width="90">
										  <template v-slot="{row}">
											  <el-select v-model="row.container_type" placeholder="请选择柜型" clearable>
												<el-option v-for="item in seletData.XZLX" :key="item.id" :label="item.name" :value="item.id"/>
											  </el-select>
											  <!-- <el-input v-model="row.container_type"></el-input> -->
										  </template>
										</el-table-column>
										<el-table-column
										  label="司机信息"
										  align="center"
										  width="230">
										  <template v-slot="{row}">
											  <el-input v-model="row.driver"></el-input>
										  </template>
										</el-table-column>
										<el-table-column label="操作" align="center" width="120">
										  <template v-slot="{row,$index}">
											<el-button
											  size="mini" @click="handleAddOrderContainers($index)">增</el-button>
											<el-button
											v-if="orderBillContainers.length> 1"
											  size="mini"
											  type="danger"
											  @click="handleDeleteContainers($index)">删</el-button>
										  </template>
										</el-table-column>
									  </el-table>
									  <div>
										  <el-switch
										  	v-model="is_show_containers">
										  </el-switch>
									  </div>
								</div>
								
								  <p class="pt-2">请在收到此费用确认单24小时之内确认回传，否则我司默认以上费用正确无误。谢谢合作!</p>
								  <div class="flex">
									  <div class="w-70">
										  <div class="pt-2 w-100">
											  <el-input
												type="textarea"
												:rows="4"
												placeholder="请输入内容"
												v-model="cost_share">
											  </el-input>
										  </div>
										  <div class="pt-2 w-100">
											  <el-input
												type="textarea"
												:rows="4"
												placeholder="请输入内容"
												v-model="customer_payment_info">
											  </el-input>
										  </div>
										  <div class="pt-2 w-100">
											  <el-input
												type="textarea"
												:rows="4"
												placeholder="请输入内容"
												v-model="company_receipt_info">
											  </el-input>
										  </div>
									  </div>
									  <div class="pl-2">
										  <el-switch
											v-model="is_show_seal">
										  </el-switch>
										  <div class="mt-2" v-if="is_show_seal">
											 <img style="width: 200px;height: auto;" :src="formBill.show_seal" alt="" /> 
										  </div>
									  </div>
									</div>
									<div class="pt-2 bT-0 font-center" style="margin-top: 100px;">
									  <div class="w-60">
										  <el-input
											type="textarea"
											:rows="5"
											placeholder="请输入内容"
											v-model="remarkBill"></el-input>
									</div>
								  </div>
							</div>
						</div>
					</div>
					<div style="width: 200px;padding-left: 5px;" class="pt-2 font-12 bill-right flex flex-column">
						<div class="w-100">
							<el-form :inline="true" :model="formBillTemplates" label-width="60px">
							  <el-form-item label="导出文件名">
								<el-input v-model="formBillTemplates.wordName" placeholder=""></el-input>
							  </el-form-item>
							  <el-form-item>
								  <div>
									  <el-button type="primary" @click="downLoadWord" class="mb-1 mr-1">导出word</el-button>
								  </div>
								  <div>
									  <el-button type="primary" @click="exportToPdf" class="mb-1">导出pdf</el-button>
								  </div>
							  </el-form-item>
							</el-form>
							<el-form :inline="true" :model="formBillTemplates" label-width="60px" >
							  <el-form-item label="模板名字">
								<el-input v-model="formBillTemplates.name" placeholder=""></el-input>
							  </el-form-item>
							  <el-form-item>
								 <!-- <div>
									  <el-button type="primary" @click="addBillTemplates" class="mb-1 mr-1">新增模板</el-button>
								  </div> -->
								  <div>
									  <el-button type="primary" @click="saveBillTemplates" class="mb-1">保存模板</el-button>
								  </div>
							  </el-form-item>
							</el-form>
						</div>
						<div class="flex-1 pb-2" style="overflow-y: auto;">
							<div :class="['b-0','radius10','mr-1','mt-1',billTemplatesCurrent== index?'colorBlue':'colorBlack']" v-for="(item, index) in billTemplatesList" :key="index" :style="{display: 'inline-block',borderRadius: '5px'}">
								<span class="px-2 py-1" style="display: inline-block;" @click="selectTemplates(item,index)">{{item.name}}</span>
								<el-button class="icon-color-black" :style="{background: billTemplatesCurrent== index?'#409EFF': '#fff'}" icon="Delete" @click="handlePaySureDelete(item,index)"></el-button>
							</div>
						</div>
					</div>
				</div>
			</div>
		<!-- </el-dialog> -->
		</div>
		<!-- 单据详情 -->
		<el-dialog v-model="dialogFormVisibleInvoiceForm" title="申请开票列表" width="80%" :close-on-click-modal="false">
			<el-button type="primary" @click="handleAddInvoiceForm()"> 新增 </el-button>
			<table-list :tableConfig="tableConfigInvoice" :tableColumn="tableColumnInvoice" :toolbar="true" :toolbarRowReset='false' class="px-2" ref="tableListInvoiceForm" :number="true" :multiple="false"  :show-summary="true"
            :summary-fields="['tax_rate', 'total_cny_amount', 'total_usd_amount']">
				<template #headerRight></template>
			</table-list>
		</el-dialog>
		<el-dialog v-model="dialogFormVisibleInvoiceFormDetails" title="申请开票" width="80%" :close-on-click-modal="false" style="z-index: 3000;" append-to-body  @close="closeInvoiceFormBtn">
			<!-- <el-card> -->
				<InvoiceForm :invoiceForm="invoiceForm" :type="invoiceType" @close="closeInvoiceForm" ref="invoiceFormRef" :visible="dialogFormVisibleInvoiceFormDetails" />
			<!-- </el-card> -->
		</el-dialog>
		<div 
		    v-draggable="{ handle: '.custom-handle-image' }"
		    :class="['draggable-container', { 'hidden': isNowImageOrPdf === 0 }]"
		    :style="{
		      width: '800px',
		      position: 'fixed',
		      top: '20px',
		      left: '200px',
		      zIndex: isNowImageOrPdf === 0 ? '-1' : '2000',
		      backgroundColor: '#fff'
		    }"
		  >
			<div class="d-flex j-end pr-2 pt-1" v-if="isNowImageOrPdf === 1">
				<el-button type="primary" @click="handleExportImage">生成图片</el-button>
			      <el-button @click="cancelBillImage">关 闭</el-button>
			    </div>
			    <div 
			      id="cost-confirmation-content" 
			      :style="{
			        padding: '40px',
			        height: isNowImageOrPdf === 0 ? 'auto' : '800px', 
			        overflowY: isNowImageOrPdf === 0 ? 'auto' : 'auto'
			      }"
				  @mousedown.prevent
			    >
				<div class=" w-100 custom-handle-image ">
					<div class="flex1">
						<img :src="formBill.pay_sure_logo" alt="" style="width: 260px;height: 40px;"/>
						<p class="font-32 font-w">Logistics & Services</p>
					</div>
					<div class="font-32 t-c bB-0 pb-2">费用确认单</div>
				</div>
				<div class="flex-1"  style="overflow-y: auto;">
					<div class="flex a-center flex-wrap pb-1 bB-0 w-100 font-12">
						
						 <div class="py-1 w-100">
							 <div class="flex a-center">
								 <div class="flex mt-2 mr-1 flex-1">
									 <p style="width: 70px;">委托人：</p>
									 <p>{{formBill.delegation_header}}</p>
								 </div>
								 <div class="flex mt-2 mr-1 flex-1">
								 	 <p  style="width: 70px;">起运港：</p>
								 	 <p>{{formBill.origin_port}}</p>
								  </div>
								 <div class="flex mt-2 mr-1 flex-1">
								 	<p style="width: 70px;">提单号：</p>
								 	<p>{{formBill.bl_no}}</p>
								 </div>
							 </div>
							 <div class="flex a-center">
							 	<div class="flex mt-2 mr-1 flex-1">
							 		<p style="width: 70px;">合同号：</p>
							 		<p>{{formBill.contract_no}}</p>
							 	</div>
							 	<div class="flex mt-2 mr-1 flex-1">
							 		<p style="width: 70px;">目的港：</p>
							 		<p>{{formBill.destination_port}}</p>
							 	</div>
							 	<div class="flex mt-2 mr-1 flex-1">
							 		<p style="width: 70px;">船名/航次：</p>
							 		<p>{{formBill.ship_name}}/</p>
							 		<p>{{formBill.ship_no}}</p>
							 	</div>
							 </div>
							 <div class="flex a-center flex-1">
								 <div class="flex mt-2 mr-1 flex-1">
								 	<p style="width: 70px;">工作编号：</p>
								 	<p>{{formBill.job_no}}</p>
								 </div>
								 <div class="flex mt-2 mr-1 flex-1">
								 	<p style="width: 70px;">开船日期：</p>
								 	<p>{{formBill.sailing_at?formBill.sailing_at.substring(0,10):''}}</p>
								 </div>
								 <div class="flex mt-2 mr-1 flex-1">
								 	<p style="width: 70px;">到港日期：</p>
								 	<p>{{formBill.arrival_at?formBill.arrival_at.substring(0,10):''}}</p>
								 </div>
							 </div>
						</div>
					</div>
					<div class="bB-0 py-1 w-100" style="font-size: 12px;">
						<el-table
							ref="multipleTable"
							:data="orderBillItems"
							tooltip-effect="dark"
							style="text-align: center;"
							:header-row-style="{backgroundColor:' #fff'}"
						   @selection-change="handleSelectionChangeItems"
						   @select-all="handleSelectionChangeItemsAll">
							<el-table-column
							  label="费用明细"
							  align="center">
							  <template v-slot="{row,$index}">
								  <p>{{row.fee_type_id?seletData.FYLX.filter(itemIndex => (itemIndex.id== row.fee_type_id))[0]?.name: ''}}</p>
							  </template>
							</el-table-column>
							<el-table-column
							  label="备注"
							  align="center"
							  prop="remark"
							  width="120"></el-table-column>
							<el-table-column
							  prop="name"
							  label="币种"
							  align="center"
							  width="120">
							  <template v-slot="{row}">
								  <p>{{row.currency?optionsComm['币种'].filter(itemIndex => (itemIndex.value== row.currency))[0]?.label: ''}}</p>
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
							  align="center"
							  prop="quantity"
							  width="90"></el-table-column>
							<el-table-column
							  label="单价"
							  align="center"
							  prop="price"
							  width="100"></el-table-column>
							<el-table-column
							  prop="address"
							  label="小计"
							  align="center"
							  width="120">
							  <template v-slot="{row}">
									<p>{{row.quantity * row.price}}</p>
							  </template>
							</el-table-column>
						</el-table>
					</div>
					<div class="pb-2">
						<div class="d-flex j-end font-14 mb-1" style="margin-right: 20px;">
						  <div>
							  总计：
						  </div>
						  <div class="font-w font-16 d-flex flex-column">
							  <p class="flex-1 flex">CNY：<p class="flex-1" style="text-align: center;">{{totals?totals.totalCNY: 0}}</p></p>
							  <p class="flex-1 flex">USD：<p class="flex-1"  style="text-align: center;">{{totals?totals.totalUSD: 0}}</p></p>
						  </div>
						</div>
						<div class="flex pr-4" v-if="is_show_containers">
							<el-table
								class="flex-1"
								ref="multipleTable"
								:data="orderBillContainers"
								tooltip-effect="dark"
								 :span-method="objectSpanMethod"
								@selection-change="handleSelectionChangeContainers"
								@select-all="handleSelectionChangeContainersAll">
								<el-table-column
									  type="index"
									  width="10">
									</el-table-column>
								<el-table-column
								  label="箱号"
								  prop="no"
								  align="center"
								  width="140"></el-table-column>
								<el-table-column
								  label="柜型"
								  align="center"
								  width="90">
								  <template v-slot="{row}">
									  <p>{{row.container_type?seletData.XZLX.filter(itemIndex => (itemIndex.id== row.container_type))[0]?.name: ''}}</p>
									  <!-- <el-input v-model="row.container_type"></el-input> -->
								  </template>
								</el-table-column>
								<el-table-column
								  label="司机信息"
								  align="center"
								  prop="driver"
								  width="230"></el-table-column>
							</el-table>
						</div>
						
						  <p class="pt-2">请在收到此费用确认单24小时之内确认回传，否则我司默认以上费用正确无误。谢谢合作!</p>
						  <div class="flex">
							  <div class="w-70">
								  <div class="pt-2 w-100" v-if="cost_share">
									  <p v-for="(paragraph, index) in cost_share.split(/\n|\r\n/).filter(p => p.trim())" :key="index">{{ paragraph }}</p >
								  </div>
								  <div class="pt-2 w-100" v-if="customer_payment_info">
									  <p v-for="(paragraph, index) in customer_payment_info.split(/\n|\r\n/).filter(p => p.trim())" :key="index">{{ paragraph }}</p >
									  <!-- <p>{{customer_payment_info}}</p> -->
								  </div>
								  <div class="pt-2 w-100" v-if="company_receipt_info">
									  <p v-for="(paragraph, index) in company_receipt_info.split(/\n|\r\n/).filter(p => p.trim())" :key="index">{{ paragraph }}</p >
									  <!-- <p>{{company_receipt_info}}</p> -->
								  </div>
							  </div>
							  <div class="pl-2">
								 <!-- <el-switch
									v-model="is_show_seal">
								  </el-switch> -->
								  <div class="mt-2" v-if="is_show_seal">
									  <img style="width: 200px;height: auto;" :src="formBill.show_seal" alt="" /> 
									 <!-- <img style="width: 200px;height: auto;" src="../../../assets/pay_sure_logo1.png" alt="" /> -->
								  </div>
							  </div>
							</div>
							<div class="pt-2 bT-0 font-center" style="margin-top: 100px;" v-if="remarkBill">
								<p style="text-align: center;" v-for="(paragraph, index) in remarkBill.split(/\n|\r\n/).filter(p => p.trim())" :key="index">{{ paragraph }}</p >
								<!-- <p style="text-align: center;">{{remarkBill}}</p> -->
						  </div>
					</div>
				</div>
			</div>
		</div>
	</div>

</template>

<script setup name="OperatingDocuments">
	import {
		ref,
		onMounted,
		h,
		getCurrentInstance,
		computed,
		nextTick
	} from "vue";
	import html2canvas from "html2canvas";
	import {
		exportWordImage
	} from "@/utils/exportFile";
	import {jsPDF} from 'jspdf';
	import SearchTop from "@/components/searchTop/searchTop";
	import TableList from "@/components/tableList/index";
	import CommonForm from "@/components/commonForm/index";
	import DropBox from "@/components/document/dropBox";
	import BoxInfo from "@/components/document/boxInfo";
	import FileTable from "@/components/document/fileTable";
	import BillForm from '@/components/document/BillForm.vue'
	import InvoiceForm from '../../../components/InvoiceForm.vue'
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
		commonParam,
		getSelect
	} from '@/utils/common'
	import {
		getCZY,
		getSW,
		optionsComm
	} from '@/api/commonList';
	import {
		ElButton
	} from 'element-plus'
	const {
		proxy
	} = getCurrentInstance();
	
	const tabName= ref('2')
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
	
	const invoiceForm= ref({
		order_id: '',
		job_no: '',
		seller_id: '',
		orderBillItems: [],
		orderBillContainers: [],
		checkList: [],
		remark: ''
	})
	const invoiceType=ref(0)  //0  默认展示  1  带参数战术

	const containers = ref([]); //箱子信息
	const order_files = ref([]); //文件信息
	const paySureVisible = ref(false); //文件信息
	const billBool= ref(false)
	const formBill= ref({})
	const seller_id_bill= ref('')
	const contentContainer= ref(null)
	const orderBillItems= ref([{fee_type_id:'',currency:'',quantity:1,price:'',remark:''}])
	const orderBillContainers= ref([])
	const cost_share= ref('')
	const customer_payment_info= ref('')
	const company_receipt_info= ref('')
	const is_show_seal= ref(true)
	const showContent= ref(true)
	const is_show_containers= ref(true)
	const remarkBill= ref('')
	const formBillTemplates= ref({
		name: '',
		wordName: ''
	})  //模板名称
	const dialogFormVisibleInvoiceForm= ref(false)  //申请开票弹框
	const dialogFormVisibleInvoiceFormDetails= ref(false)
	const saveDataBillAdd= ref(null)  //制作账单时的详情
	// 制作账单
	function handleAddBill(){
		billBool.value= true
		saveBillDataShow(saveDataBillAdd.value,2)
		billDataList()
	}
	// 点击申请开票详情
	function handleAddInvoiceForm(){
		console.log(invoiceForm.value,'922')
		invoiceType.value = 0;
		dialogFormVisibleInvoiceFormDetails.value= true
	}
	// 制作账单
	function toBillPage(){
		console.log(proxy.$refs.commonForm.saveData,'seletData.WTTT')
		billBool.value= true
		saveBillDataShow(proxy.$refs.commonForm.saveData,1)
		billDataList()
	}
	const billEntranceType= ref(0)
	function saveBillDataShow(res,type){ //type 0 详情  1 单据详情进入页面  2 新增进入页面
		if(contentContainer.value){
			contentContainer.value.scrollTop = 0
			contentContainer.value.scrollLeft = 0
		}
		billEntranceType.value= type
		console.log(res,'res')
		console.log(type,'type')
		const delegation_header_id= type== 1 || type== 2? res["order_delegation_header.company_header_id"]:''
		const delegation_header= type== 1 || type== 2? seletData.value.WTTT.filter(itemIndex => (itemIndex.id== delegation_header_id))[0]?.company_name: res.delegation_header
		formBill.value= {
			id: type== 0?res.id: null,
			order_id: editId.value,
			delegation_header: delegation_header,
			job_no: res.job_no,
			contract_no: res.contract_no,
			bl_no: res.bl_no,
			origin_port: res.origin_port,
			destination_port: res.destination_port,
			ship_no: res.ship_no,
			ship_name: res.ship_name,
			ship_no: res.ship_no,
			sailing_at: res.sailing_at,
			arrival_at: res.arrival_at
		}
		formBillTemplates.value.wordName= res.job_no
		seller_id_bill.value= type== 0 || type== 2?saveDataBillAdd.value.order_delegation_header.seller_id :res["order_delegation_header.seller_id"]
		console.log(res,'res')
		httpGet(`/sellers/${seller_id_bill.value}`).then(res => {
			console.log(res,'res908')
			formBill.value.pay_sure_logo= res.logo?res.logo.url:'../../../assets/pay_sure_logo.png'
			formBill.value.show_seal= res.financial_seal?res.financial_seal.url:''
		});
		if(type== 1 || type== 2){
			orderBillContainers.value= []
			if((type== 1 && containers.value.length>0) || (type== 2 && res.containers.length>0)){
				// const item= {no:'',container_type:'',driver:'',totalCNY:'',totalUSD:''}
				console.log(res,'containers.value')
				const containersItem= type== 1?JSON.parse(JSON.stringify(containers.value)):JSON.parse(JSON.stringify(res.containers))
				// console.log(containersItem,'containersItem')
				orderBillContainers.value.push(...containersItem.map(item => ({
				  no: item.no?item.no: '',
				  container_type: item.container_type_id?item.container_type_id: '',
				  driver: item.driver?item.driver: '',
				  totalCNY: 0,
				  totalUSD: 0,
				})))
				console.log(orderBillContainers.value,'orderBillContainers.value')
				// orderBillContainers.value= containersItem.map(item => ({no: item.no,container_type: item.container_type,driver: item.driver,totalCNY: '',totalUSD: ''}))
			}else{
				orderBillContainers.value= [{no:'',container_type:'',driver:'',totalCNY:0,totalUSD:0}]
			}
			orderBillItems.value= [{fee_type_id:'',currency:'',quantity:1,price:'',remark:''}]
			cost_share.value= ''
			customer_payment_info.value= ''
			company_receipt_info.value= ''
			remarkBill.value= res["order_delegation_header.seller_id"]?seletData.value.XHDW.filter(itemIndex => (itemIndex.id== res["order_delegation_header.seller_id"]))[0]?.remark:''
			is_show_seal.value= true
			
		}else{
			orderBillContainers.value= res.order_bill_containers.map(item =>({
				id: item.id,
				no: item.no?item.no: '',
				container_type: item.container_type?item.container_type: '',
				driver: item.driver?item.driver: '',
				totalCNY: 0,
				totalUSD: 0,
			}))
			
			orderBillItems.value= res.order_bill_items
			cost_share.value= res.cost_share
			customer_payment_info.value= res.customer_payment_info
			company_receipt_info.value= res.company_receipt_info
			remarkBill.value= res.remark
			is_show_seal.value= res.is_show_seal=== 1?true: false
		}
		
	}
	function cancelBill(){
		// formBill.value= null
		remarkBill.value= null
		formBillTemplates.value.name= null
		formBillTemplates.value.wordName= null
		cost_share.value= null
		customer_payment_info.value= null
		company_receipt_info.value= null
		is_show_seal.value= true
		billTemplatesCurrent.value= 9999
		// dialogFormVisibleInvoiceForm.value= false
		dialogFormVisibleInvoiceFormDetails.value= false
		billBool.value= false
		seller_id_bill.value= ''
		invoiceForm.value= {
			order_id: '',
			job_no: '',
			seller_id: '',
			orderBillItems: [],
			orderBillContainers: [],
			checkList: [],
			remark: ''
		}
		isNowImageOrPdf.value= 0
		is_show_containers.value= true
	}
	// 模板
	
	// const cost_share= ref('')
	const  checkList= ref([]) 
	const tableData= ref([{name: 1,name1:'MSKU6947553'},{name: 1,name1:'MSKU6947553'},{name: 1,name1:'MSKU6947553'}])
	// const form= ref({name: '测试'})
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
			label: '委托公司',
			prop: 'delegation_header',
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
			label: '操作员',
			prop: 'operate_user.name'
		},
		{
			label: '提货',
			prop: 'bl_status',
			// formatter: (row) => row.is_delivery === 1 ? '已提货' : (row.is_delivery === 2 ?'超期未提货':'未提货'),
			render: (row, index) => {
				return [
					h(ElButton, {
							type: row.bl_status == 1 ?'success' : (row.is_delivery == 2 ?'danger':'warning'),
							size: 'small',
							onClick: () => {},
							style: {
								margin: '0px'
							},
							key: row.id
						},
						() => (row.bl_status == 1 ? '已提货' : (row.is_delivery == 2 ?'超期未提货':'未提货'))
					)
				]
			}
		},
		{
			label: '应收人民币',
			prop: 'receipt_total_cny_amount'
		},
		{
			label: '兑付情况',
			prop: 'receipt_cny_cashed_status'
		},
		{
			label: '应收美金',
			prop: 'receipt_total_usd_amount'
		},
		{
			label: '兑付情况',
			prop: 'receipt_usd_cashed_status'
		},
		{
			label: '毛利润',
			prop: 'gross_profit'
		},
		{
			label: '特殊费用',
			prop: 'special_fee'
		},
		{
			label: '兑付情况',
			prop: 'cashed_status'
		},
		{
			label: '文件',
			prop: 'order_files_count',
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
			label: '开票时间',
			prop: 'invoice_date',
			formatter: (row) => row.invoice_date ? row.invoice_date.substring(0,10) : ''
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
			width: '300',
			actions: [{
					label: '查看详情',
					onClick: (row, index) => handleEdit(row, index)
				},
				{
					label: '帐单列表',
					onClick: (row, index) => handleBillList(row, index)
				},
				{
					label: '申请开票',
					onClick: (row, index) => handleInvoiceList(row, index)
				}
				
			],
			fixed: "right"
		}
	]);
	const tableConfig = ref({
		url: '/orders/business-index',
		requestMethod: httpGet,
		isQuery: true
	})
	
	// 账单列表
	const tableColumnBill = ref([{
			label: '委托人',
			prop: 'delegation_header',
		},{
			label: '工作编号',
			prop: 'job_no',
			formatter: (row) => row.job_no || '无'
		},
		{
			label: '合同号',
			prop: 'contract_no',
			formatter: (row) => row.contract_no || '无'
		},{
			label: '人民币金额',
			prop: 'cny_amount',
			formatter: (row) => row.cny_amount || '无'
		},{
			label: '美金金额',
			prop: 'usd_amount',
			formatter: (row) => row.usd_amount || '无'
		},{
			label: '保存时间',
			prop: 'created_at',
			formatter: (row) => row.created_at || '无'
		},{
			label: '操作',
			prop: 'actions',
			actions: [{
					label: '查看详情',
					onClick: (row, index) => handleDetails(row, index)
				},
				{
						label: '删除',
						type: 'danger',
						onClick: (row, index) => handleDeleteBill(row, index)
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
	const tableColumnInvoice= ref([
		{label: '工作编号',prop: 'job_no',formatter: (row) => row.order.job_no || '无'},
		{label: '开票抬头',prop: 'purchase_entity.name'},
		{label: '销货单位',prop: 'sale_entity.name'},
		{label: '发票类型',prop: 'invoice_type.name'},
		{label: '税额',prop: 'tax_rate'},
		{label: '单子完结',prop: 'is_finish_name',
		render: (row, index) => {
			return [
				h(ElButton, {
						type: row?.order?.is_finish== 1? 'success' : 'danger',
						size: 'small',
						onClick: () => {},
						style: {
							margin: '0px'
						},
						key: row.id
					},
					() => (row?.order?.is_finish== 1?'已完结': '未完结')
				)
			]
		}},
		{label: '人民币金额',prop: 'total_cny_amount'},
		{label: '人民币发票',prop: 'cny_invoice_no'},
		{label: '美金金额',prop: 'total_usd_amount'},
		{label: '美金发票',prop: 'usd_invoice_no'},
		{label: '申请时间',prop: 'created_at'},
		{label: '确认开票时间',prop: 'confirm_at'},
		{ 
			label: '操作',
			prop: 'actions',
			actions: [
				{
					label: '查看详情',
					onClick: (row) => handleInvoiceEdit(row)
				},
				{
					label: '删除',
					type: 'danger',
					onClick: (row, index) => handleInvoiceDelete(row, index)
				},
			],
			fixed: "right",
			width: '190px'
		}])
	const tableConfigInvoice= ref({
		url: '/invoices',
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
    // 申请开票
	const handleInvoiceList = async (row) => {
		
	  try {
		tableConfigInvoice.value.data= {order_id: row.id}
		tableConfigInvoice.value.isQuery= true
	    //  获取订单详情
	    const res = await httpGet(`/orders/${row.id}`);
	    
	   
	    //  设置发票表单数据
	    invoiceForm.value = {
	      ...invoiceForm.value, // 保留原有属性
	      order_id: row.id,
	      job_no: res.job_no,
	      seller_id: res.order_delegation_header?.seller_id // 使用可选链防止错误
	    };
	    
	    //  设置其他状态
	    invoiceType.value = 0;
	    editId.value = row.id;
	    
	    //  等待DOM更新后显示对话框
	    await nextTick();
	    
	    console.log('发票表单数据:', invoiceForm.value);
	    
	    //  显示对话框
	    dialogFormVisibleInvoiceForm.value = true;
	    
	  } catch (error) {
	    console.error('获取订单数据失败:', error);
	    
	    // 如果获取订单失败，仍然可以设置基本数据并显示对话框
	    invoiceForm.value = {
	      ...invoiceForm.value,
	      order_id: row.id,
	      // 其他字段可以设为默认值或空
	      job_no: '',
	      seller_id: ''
	    };
	    
	    invoiceType.value = 0;
	    editId.value = row.id;
		
		
		console.log('发票查询配置:', tableConfigInvoice.value);
	    dialogFormVisibleInvoiceForm.value = true;
	  }
	}
	// 查看详情--发票
	const invoiceFormDetails= ref(null)
	function handleInvoiceEdit(row){
		httpGet(`/invoices/${row.id}`).then(res => {
			invoiceType.value= 2
			dialogFormVisibleInvoiceFormDetails.value = true
			invoiceForm.value = {
			  ...invoiceForm.value,
			  ...res
			};
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
	const handleBillList = async (row) => {
	  try {
	    console.log('当前行数据:', row);
	    
	    // 1. 显示对话框
	    billVisible.value = true;
	    
	    // 2. 设置编辑ID
	    editId.value = row.id;
	    // 3. 设置账单查询配置
	    tableConfigBill.value.data= {order_id: row.id}
	    tableConfigBill.value.isQuery= true
	    
	    // 4. 获取订单详情
	    const res = await httpGet(`/orders/${row.id}`);
	    
	    // 5. 设置账单数据（去掉setTimeout延迟）
	    saveDataBillAdd.value = res;
	    
	  } catch (error) {
	    console.error('获取账单数据失败:', error);
	    // 这里可以添加错误提示，但仍然显示对话框
	    billVisible.value = true;
	  }
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
	
	// 删除账单
	function handleDeleteBill(row, index){
		const _ids = row.id || deleteIds.value;
		proxy.$modal.confirm('是否确认删除选中的的数据项？').then(function() {
			return httpDelete('/order-bills/' + _ids);
		}).then(() => {
			proxy.$refs.tableListBill.getList();
			proxy.$modal.msgSuccess("删除成功");
		}).catch(() => {});
	}
	// 删除发票
	function handleInvoiceDelete(row, index){
		const _ids = row.id || deleteIds.value;
		proxy.$modal.confirm('是否确认删除选中的的数据项？').then(function() {
			return httpDelete('/invoices/' + _ids);
		}).then(() => {
			tableConfigInvoice.value.data= {order_id: editId.value}
			tableConfigInvoice.value.isQuery= true
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
	function handlePaySureDelete(item,index) {
		proxy.$modal.confirm('确认删除此模板？').then(function() {
			return httpDelete('/order-bill-templates/' + item.id);
		}).then(() => {
			billDataList();
			if(billTemplatesCurrent.value=== index){
				billTemplatesCurrent.value= 9999
				formBillTemplates.name= ''
				orderBillItems.value= [{fee_type_id:'',currency:'',quantity:1,price:'',remark:''}]
				company_receipt_info.value= ''
				cost_share.value= ''
				customer_payment_info.value= ''
			}
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
	
	// 费用明细新增
	function handleAddOrderBill(index){
			console.log(index)
			const item= {fee_type_id:'',currency:'',quantity:1,price:'',remark:''}
			orderBillItems.value.splice(index+1, 0, item)
	}
	function handleDeletePrderBill(index){
			if(orderBillItems.value.length> 0){
				orderBillItems.value.splice(index, 1);
				// proxy.$modal.confirm('是否确认删除选中的的数据项？').then(function() {
					
				// })
			}
	}
	
	function handleAddOrderContainers(index){
		const item= {no:'',container_type:'',driver:'',totalCNY:'',totalUSD:''}
		orderBillContainers.value.splice(index+1, 0, item)
	}
	function handleDeleteContainers(index){
			if(orderBillContainers.value.length> 0){
				orderBillContainers.value.splice(index, 1);
				// proxy.$modal.confirm('是否确认删除选中的的数据项？').then(function() {
				// })
			}
	}
	// 计算总金额的计算属性
	const totals = computed(() => {
	  let totalCNY = 0
	  let totalUSD = 0
	  
	  orderBillItems.value.forEach(item => {
	    const quantity = Number(item.quantity) || 1
	    const price = Number(item.price) || 0
	    
	    if (item.currency === 'cny') {
	      totalCNY += (quantity * price.toFixed(2))
	    } else if (item.currency === 'usd') {
	      totalUSD += (quantity * price.toFixed(2))
	    }
	  })
	  console.log(totalCNY,totalUSD,'item.quantity')
	  return { totalCNY, totalUSD }
	})
	watch(totals, (newTotals) => {
		if(orderBillContainers.value && orderBillContainers.value.length> 0){
			orderBillContainers.value.forEach(container => {
			  container.totalCNY = newTotals.totalCNY
			  container.totalUSD = newTotals.totalUSD
			})
		}
	}, { immediate: true })
	
	// function checkData(){
		
	// }
	
	function submitFormBill(){
		console.log(orderBillItems.value,'orderBillItems.value')
		console.log(orderBillContainers.value,'orderBillContainers.value')
		let order_bill_containers = orderBillContainers.value.map(item => ({
			no: item.no ? item.no : '',
			container_type: item.container_type ? item.container_type : '',
			driver: item.driver ? item.driver : '',
			...(item.id && { id: item.id }) // 只有item.id为真值时才添加id属性
		}));
		const data= {
			...formBill.value,
			order_bill_items: JSON.stringify(orderBillItems.value),
			order_bill_containers: JSON.stringify(order_bill_containers),
			cost_share: cost_share.value,
			customer_payment_info: customer_payment_info.value,
			company_receipt_info: company_receipt_info.value,
			is_show_seal: is_show_seal.value=== true?1: 0,
			remark: remarkBill.value,
		}
		if(formBill.value.id){
			httpPut(`/order-bills/${formBill.value.id}`, data).then(res => {
				proxy.$modal.msgSuccess("修改成功!");
				// billBool.value = false;
				cancelBill()
			});
		}else{
			httpPost(`/order-bills`, data).then(res => {
				proxy.$modal.msgSuccess("保存成功!");
				// billBool.value = false;
				cancelBill()
			});
		}
		
	}
	const billType=  ref(1)  //默认显示按钮
	// 账单详情
	function handleDetails(row){
		httpGet(`/order-bills/${row.id}`).then(res => {
			billBool.value = true;
			billType.value= 0
			// editId.value = row.id;
			setTimeout(function() {
				saveBillDataShow(res,0)
			}, 500)
		});
		billDataList()
	}
	// function saveBillDataShow(res,type){
	// 	if(contentContainer.value){
	// 		contentContainer.value.scrollTop = 0
	// 		contentContainer.value.scrollLeft = 0
	// 	}
	// 	console.log(editId.value,'editId')
	// 	formBill.value= {
	// 		order_id: editId.value,
	// 		delegation_header: res.delegation_header,
	// 		job_no:  res.job_no,
	// 		contract_no:  res.contract_no,
	// 		bl_no:  res.bl_no,
	// 		origin_port:  res.origin_port,
	// 		destination_port:  res.destination_port,
	// 		ship_name:  res.ship_name,
	// 		ship_no:  res.ship_no,
	// 		sailing_at:  res.sailing_at,
	// 		arrival_at:  res.arrival_at
	// 	}
		
		
	// }
	
	// 新增模板
	function addBillTemplates(){
		saveBillDataShow(proxy.$refs.commonForm.saveData,1)
	}
	// 保存模板
	function saveBillTemplates(){
		if(!formBillTemplates.value.name){
			proxy.$modal.msgWarning("请输入模板名称");
			return false
		}
		const data= {
			name: formBillTemplates.value.name,
			order_bill_items: JSON.stringify(orderBillItems.value),
			cost_share: cost_share.value,
			customer_payment_info: customer_payment_info.value,
			company_receipt_info: company_receipt_info.value,
		}
		console.log(data,'data1611')
		if(billTemplatesCurrent.value !== 9999){
			httpPut(`/order-bill-templates/${billTemplatesList.value[billTemplatesCurrent.value].id}`, data).then(res => {
				proxy.$modal.msgSuccess("修改成功!");
				billDataList()
			});
		}else{
			httpPost(`/order-bill-templates`, data).then(res => {
				proxy.$modal.msgSuccess("保存成功!");
				billDataList()
				// billBool.value = false;
			});
		}
		
	}
	
	const billTemplatesList= ref([])
	const billTemplatesCurrent= ref(9999)
	// 模板列表
	function billDataList(){
		httpGet(`/order-bill-templates`).then(res => {
			billTemplatesList.value= res.data
		});
	}
	// 选择模板
	function selectTemplates(item,index){
		if(billTemplatesCurrent.value == 9999 || billTemplatesCurrent.value!= index){
			billTemplatesCurrent.value= index
			formBillTemplates.value.name= item.name
			orderBillItems.value= JSON.parse(JSON.stringify(item.order_bill_items))
			company_receipt_info.value= item.company_receipt_info
			cost_share.value= item.cost_share
			customer_payment_info.value= item.customer_payment_info
			
		}
		else{
			billTemplatesCurrent.value= 9999
			formBillTemplates.name= ''
			orderBillItems.value= [{fee_type_id:'',currency:'',quantity:1,price:'',remark:''}]
			company_receipt_info.value= ''
			cost_share.value= ''
			customer_payment_info.value= ''
		}
	}
	const checkListName= ref([
		{label: '委托人：',value:'delegation_header'},
		{label: '起运港：',value:'origin_port'},
		{label: '提单号：',value:'bl_no'},
		{label: '合同号：',value:'contract_no'},
		{label: '目的港：',value:'destination_port'},
		{label: '船名/航次：',value:'ship_name'},
		{label: '工作编号：',value:'job_no'},
		{label: '开船日期：',value:'sailing_at'},
		{label: '到港日期：',value:'arrival_at'},
	])
	function openInvoiceForm(){
		console.log(formBill.value,'formBill.value2042')
		// 处理 checkList 中的选中项
		const selectedItems = checkListName.value
		  .filter(item => invoiceForm.value.checkList.includes(item.value))
		  .map(item => {
			  if(item.value== 'sailing_at' && formBill.value.sailing_at){
				  const sailing_at= formBill.value.sailing_at.substring(0,10)
				  return `${item.label}${sailing_at}`
			  }else if(item.value== 'arrival_at' && formBill.value.arrival_at){
				  const arrival_at= formBill.value.arrival_at.substring(0,10)
				  return `${item.label}${arrival_at}`
			  }else{
				  return `${item.label}${formBill.value[item.value]?formBill.value[item.value]:''}`
			  }
		  })
		  .join('\n');
		
		// 处理 orderBillContainers 中的信息
		const containerInfo = invoiceForm.value.orderBillContainers
		  .map(container => `${container.no} ${container.container_type} ${container.driver}`)
		  .join('\n');
		
		// 组合所有信息到 remark
		invoiceForm.value.remark = [selectedItems, containerInfo]
		  .filter(item => item) // 过滤空字符串
		  .join('\n');
		invoiceForm.value.order_id= editId.value
		invoiceForm.value.job_no= billEntranceType.value== 1? proxy.$refs.commonForm.saveData.job_no: saveDataBillAdd.value.job_no
		invoiceForm.value.seller_id= seller_id_bill.value
		invoiceType.value= 1
		dialogFormVisibleInvoiceFormDetails.value= true
		console.log(invoiceForm.value.remark,'invoiceForm.value.remark');
	}
	
	// 箱号多选
	function handleSelectionChangeContainers(e){
		console.log(e,'ee')
		invoiceForm.value.orderBillContainers= e
	}
	function handleSelectionChangeContainersAll(e){
		console.log(e,'ee')
		invoiceForm.value.orderBillContainers= e
	}
	// 费用明细多选
	function handleSelectionChangeItems(e){
		console.log(e,'ee')
		invoiceForm.value.orderBillItems= e
	}
	function handleSelectionChangeItemsAll(e){
		console.log(e,'ee')
		invoiceForm.value.orderBillItems= e
	}
	// 获取对应币种
	function changeCurrency(e,row,index){
		console.log(e,'e')
		console.log(seletData.value.FYLX,'seletData.value.FYLX')
		if(e){
			row.currency= seletData.value.FYLX.filter(item => item.id== e)[0].type
		}
	}
	
	const closeInvoiceForm = () =>{
		console.log(proxy.$refs.invoiceForm,'proxy.$refs.invoiceForm2183')
		dialogFormVisibleInvoiceFormDetails.value= false
		invoiceForm.value.order_id= ''
		invoiceForm.value.job_no= ''
		invoiceForm.value.seller_id= ''
		invoiceForm.value.orderBillItems= []
		invoiceForm.value.orderBillContainers= []
		invoiceForm.value.checkList= []
		invoiceForm.value.remark= ''
		invoiceForm.value.id= ''
		console.log(invoiceType.value,'invoiceType.value')
		if(invoiceType.value== 0 || invoiceType.value== 2){
			handleInvoiceList({id: editId.value})
		}
	}
	
	function closeInvoiceFormBtn(){
		dialogFormVisibleInvoiceFormDetails.value= false
		console.log(proxy.$refs.invoiceFormRef,'proxy.$refs.invoiceForm2195')
	}
	const isNowImageOrPdf= ref(0)  //1  图片  0pdf或者关闭  不显示在页面
	// 导出图片
	const exportToImage = async () => {
		showBillImage()
	  // try {
	  //   const element = document.getElementById('cost-confirmation-content')
	    
	  //   const canvas = await html2canvas(element, {
	  //     scale: 2,
	  //     useCORS: true,
	  //     backgroundColor: '#ffffff'
	  //   })
	    
	  //   const imageData = canvas.toDataURL('image/png')
	  //   const link = document.createElement('a')
	  //   link.href = imageData
	  //   link.download = `费用确认单_${new Date().toLocaleDateString()}.png`
	  //   link.click()
	  // } catch (error) {
	  //   console.error('导出图片失败:', error)
	  // }
	}
	const handleExportImage= async () => {
	  try {
	    const element = document.getElementById('cost-confirmation-content')
	    
	    const canvas = await html2canvas(element, {
	      scale: 2,
	      useCORS: true,
	      backgroundColor: '#ffffff'
	    })
	    
	    const imageData = canvas.toDataURL('image/png')
	    const link = document.createElement('a')
	    link.href = imageData
	    link.download = `${formBillTemplates.value.wordName}.png`
	    link.click()
	  } catch (error) {
	    console.error('导出图片失败:', error)
	  }
	}
	// 如果需要显示时也重置位置
	const showBillImage = () => {
	  isNowImageOrPdf.value = 1
	  nextTick(() => {
	    const draggableElement = document.querySelector('.draggable-container');
	    if (draggableElement && draggableElement._resetDragPosition) {
	      draggableElement._resetDragPosition();
	    }
	  });
	}
	const cancelBillImage = () => {
	  isNowImageOrPdf.value = 0
	  
	  // 可选：如果需要立即重置拖拽位置
	  nextTick(() => {
	    const draggableElement = document.querySelector('.draggable-container');
	    if (draggableElement && draggableElement._resetDragPosition) {
	      draggableElement._resetDragPosition();
	    }
	  });
	}
	
	async function downLoadWord() {
	  try {
		if(!formBillTemplates.value.wordName){
			proxy.$modal.msgWarning("请输入导出文件名称");
			return false
		}
		cancelBillImage()
		await nextTick()
	    // 深拷贝数据
	    const orderBillItemsData = JSON.parse(JSON.stringify(orderBillItems.value));
	    const orderBillContainersData = JSON.parse(JSON.stringify(orderBillContainers.value));
	    
	    // 处理费用类型名称
	    orderBillItemsData.forEach(item => {
	      item.fee_type_name = item.fee_type_id 
	        ? seletData.value.FYLX?.filter(itemIndex => itemIndex.id == item.fee_type_id)[0]?.name || '' 
	        : '';
	      
	      item.currency_name = item.currency 
	        ? optionsComm['币种']?.filter(itemIndex => itemIndex.value == item.currency)[0]?.label || ''
	        : '';
	    });
	
	    // 处理容器数据
	    orderBillContainersData.forEach((item, itemIndexs) => {
	      item.index = itemIndexs + 1; // 序号从1开始
	      item.container_type_name = item.container_type 
	        ? seletData.value.XZLX?.filter(itemIndex => itemIndex.id == item.container_type)[0]?.name || ''
	        : '';
	    });
	
	    // 准备导出数据
		const wordData = {
		  // 基础信息（普通变量）
		  delegation_header: "XX国际贸易有限公司",
		  origin_port: "上海港（CNSHA）",
		  bl_no: "BL20240601008",
		  contract_no: "CT-2024-SH-LA-001",
		  destination_port: "洛杉矶港（USLA）",
		  ship_name: "COSCO SHIPPING PANAMA",
		  ship_no: "0123W",
		  job_no: "JD-SH-20240601",
		  sailing_at: "2024-06-10",
		  arrival_at: "2024-06-25",
		
		  // 费用明细数组（表格行循环）
		  orderBillItems: [
		    {
		      fee_type_name: "海运费",
		      currency_name: "USD",
		      quantity: 1,
		      price: 1800,
		      total: 1800, // 提前计算总价，避免模板表达式
		      remark: "整箱20GP"
		    },
		    {
		      fee_type_name: "码头操作费（THC）",
		      currency_name: "CNY",
		      quantity: 1,
		      price: 1200,
		      total: 1200,
		      remark: "上海港本地费用"
		    }
		  ],
		
		  // 总计金额
		  totals: {
		    totalCNY: 1200,
		    totalUSD: 1800
		  },
		
		  // 集装箱信息数组（表格行循环）
		  orderBillContainers: [
		    {
		      index: 1,
		      no: "CCLU1234567",
		      container_type_name: "20GP",
		      driver: "王师傅 138XXXX8888"
		    },
		    {
		      index: 2,
		      no: "CCLU7654321",
		      container_type_name: "40HQ",
		      driver: "李师傅 139XXXX9999"
		    }
		  ],
		
		  // 双方信息（普通变量）
		  cost_share: "海运费由客户承担，THC及报关费由我司垫付后结算",
		  customer_payment_info: "付款方式：电汇 | 账号：62220812020XXXX1234 | 开户行：中国工商银行上海浦东分行",
		  company_receipt_info: "收款单位：XX国际物流有限公司 | 税号：91310115MA1G8XXXX | 开户行：中国银行上海外滩支行"
		};
	 //    let data = {
	 //      ...formBill.value,
	 //      orderBillItems: orderBillItemsData,
	 //      orderBillContainers: orderBillContainersData,
	 //      cost_share: cost_share.value,
	 //      customer_payment_info: customer_payment_info.value,
		//   company_receipt_info: company_receipt_info.value,
	 //      remarkBill: remarkBill.value,
		//   totals: totals.value,
	 //      exportDate: new Date().toLocaleDateString('zh-CN'), // 添加导出日期
	 //      totalAmount: orderBillItemsData.reduce((sum, item) => sum + (item.amount || 0), 0) // 计算总金额
	 //    };
		// data.sailing_at= data.sailing_at?data.sailing_at.substring(0,10): ''
		// data.arrival_at= data.arrival_at?data.arrival_at.substring(0,10): ''
	    // 调用导出函数 - 使用正确的路径
	    await exportWordImage(
	      "/test.docx", // 确保模板文件在public/目录下
	      wordData,
	      `${formBillTemplates.value.wordName}.docx`,
	      {
			  pay_sure_logo:[150,75]
		  }
	    );
	
	    // 成功提示
	    // ElMessage.success('导出成功');
	    
	  } catch (error) {
	    console.error('导出失败:', error);
	    // ElMessage.error(`导出失败: ${error.message}`);
	  }
	}
	
	// 导出pdf
	// 导出pdf - 自动分页版本
	const exportToPdf = async () => {
	  return new Promise((resolve, reject) => {
	    try {
	      if(!formBillTemplates.value.wordName){
	        proxy.$modal.msgWarning("请输入导出文件名称");
	        return false
	      }
	      cancelBillImage()
	      nextTick()
	      
	      const element = document.getElementById('cost-confirmation-content')
	      html2canvas(element, {
	        scale: 2,
	        useCORS: true,
	        backgroundColor: '#ffffff'
	      }).then(canvas => {
	        const imgData = canvas.toDataURL('image/png');
	        
	        const pdf = new jsPDF('p', 'mm', 'a4');
	        const pageWidth = pdf.internal.pageSize.getWidth();
	        const pageHeight = pdf.internal.pageSize.getHeight();
	        
	        const imgWidth = pageWidth;
	        const imgHeight = (canvas.height * imgWidth) / canvas.width;
	        
	        let heightLeft = imgHeight;
	        let position = 0;
	        let pageNumber = 1;
	        
	        // 第一页
	        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
	        heightLeft -= pageHeight;
	        
	        // 添加后续页面
	        while (heightLeft >= 0) {
	          position = heightLeft - imgHeight; // 计算新位置
	          pdf.addPage();
	          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
	          heightLeft -= pageHeight;
	          pageNumber++;
	        }
	        
	        pdf.save(`${formBillTemplates.value.wordName}.pdf`);
	        console.log(`PDF生成完成，共${pageNumber}页`);
	        resolve(true);
	      }).catch(reject);
	      
	    } catch (error) {
	      reject(error);
	    }
	  });
	};
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
	.service .el-overlay{
		z-index: 1000 !important
	}
	.el-select-dropdown,
	.el-popper,
	.el-dropdown-menu,
	.el-date-editor .el-picker-panel,
	.el-cascader__dropdown,
	.el-color-dropdown {
	  z-index: 9999 !important;
	}
	
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
	}
	
	input[type="number"] {
	-moz-appearance: textfield;
	}
	.bill-dialog .el-table .cell{
		padding: 0 2px  !important;
	}
	.bill-dialog .el-form-item__label{
		font-size: 12px;
	}
	.bill-dialog .bill-right .el-form--inline .el-form-item{
		margin-right: 0px !important;
		margin-bottom: 5px;
	}
</style>
<style scoped>
	.dialog-footer{
		text-align: right
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
	
	.draggable-container.hidden {
	  /* 使用 transform 和 opacity 隐藏，避免影响布局 */
	  transform: translate(-1000px, -2000px) !important;
	  opacity: 0 !important;
	  z-index: -1 !important;
	  pointer-events: none !important;
	}
	
	/* 拖拽手柄样式 */
	.custom-handle-image {
	  cursor: grab;
	  user-select: none;
	}
	
	.custom-handle-image:active {
	  cursor: grabbing;
	}
</style>