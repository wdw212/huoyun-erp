<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryRef" :inline="true" label-width="10px">
			<el-form-item label="" prop="keyword" style="width: 200px">
				<el-input v-model="queryParams.keyword" placeholder="编号,提单号,操作,目的港,分箱数据,备注" clearable
					@keyup.enter="handleQuery" />
			</el-form-item>

			<el-form-item label="" prop="sailing_at" style="width: 200px">
				<el-date-picker v-model="queryParams.sailing_at" value-format="YYYY-MM-DD" type="daterange"
					range-separator="-" start-placeholder="开船开始时间" end-placeholder="开船结束时间" />
			</el-form-item>
			<el-form-item label="" prop="finish_at" style="width: 200px">
				<el-date-picker v-model="queryParams.finish_at" placeholder="请选择月份" value-format="YYYY-MM"
					type="month"></el-date-picker>
			</el-form-item>
			<el-form-item label="" prop="order_type_id" style="width: 200px">
				<el-select v-model="queryParams.order_type_id" placeholder="请选择类型" clearable>
					<el-option v-for="item in ORDER_TYPE" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item label="" prop="is_fee_finish" style="width: 200px">
				<el-select v-model="queryParams.is_fee_finish" placeholder="请选择操作类型完结" clearable>
					<el-option v-for="item in IS_FEE_FINISH" :key="item.value" :label="item.label"
						:value="item.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="" prop="company_header_id" style="width: 200px">
				<el-select v-model="queryParams.company_header_id" placeholder="请选择委托抬头" clearable>
					<el-option v-for="item in COMPANY_HEADER" :key="item.id" :label="item.company_name"
						:value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item label="" prop="business_user_id" style="width: 200px">
				<el-select v-model="queryParams.business_user_id" placeholder="请选择业务员" clearable>
					<el-option v-for="item in BUSINESS_USER" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item label="" prop="commerce_user_id" style="width: 200px">
				<el-select v-model="queryParams.commerce_user_id" placeholder="请选择商务" clearable>
					<el-option v-for="item in COMMERCE_USER" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item label="" prop="is_delivery" style="width: 200px">
				<el-select v-model="queryParams.is_delivery" placeholder="请选择提货" clearable>
					<el-option v-for="item in IS_DELIVERY" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="" prop="payment_method" style="width: 200px">
				<el-select v-model="queryParams.payment_method" placeholder="请选择付款方式" clearable>
					<el-option v-for="item in PAYMENT_METHOD" :key="item.value" :label="item.label"
						:value="item.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="" prop="seller_id" style="width: 200px">
				<el-select v-model="queryParams.seller_id" placeholder="请选择销货单位销货单位" clearable>
					<el-option v-for="item in SELLER" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item label="" prop="caozuoyuepiao" style="width: 200px">
				<el-select v-model="queryParams.caozuoyuepiao" placeholder="请选择操作票数" clearable>
					<el-option v-for="item in []" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
				<el-button icon="Refresh" @click="resetQuery">重置</el-button>
			</el-form-item>
		</el-form>

		<el-row :gutter="10" class="mb8" justify="end">
			<el-col :span="1.5">
				<el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete">批量删除</el-button>
			</el-col>
			<right-toolbar @queryTable="getList" :columns="columns"></right-toolbar>
		</el-row>

		<el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange"
			style="font-size: 12px;">
			<el-table-column type="selection" width="55" align="center" />
			<!-- <el-table-column label="序号" align="center" prop="propcolumn" /> -->
			<el-table-column label="工作编号" align="center" prop="job_no" v-if="columns[0].visible" />
			<el-table-column label="委托抬头" align="center" prop="propcolumn" v-if="columns[1].visible" />
			<el-table-column label="操作模式" align="center" prop="order_type.name" v-if="columns[2].visible" />
			<el-table-column label="提单号" align="center" prop="bl_no" v-if="columns[3].visible" />
			<el-table-column label="柜型" align="center" prop="container_type" v-if="columns[4].visible" />
			<el-table-column label="目的港" align="center" prop="destination_port" v-if="columns[5].visible" />
			<el-table-column label="开船日期" align="center" prop="sailing_at" v-if="columns[6].visible" />
			<el-table-column label="到港日期" align="center" prop="arrival_at" v-if="columns[7].visible" />
			<el-table-column label="业务员" align="center" prop="business_user.name" v-if="columns[8].visible" />
			<el-table-column label="提货" align="center" prop="propcolumn" v-if="columns[9].visible" />
			<el-table-column label="文件" align="center" prop="propcolumn" v-if="columns[10].visible" />
			<el-table-column label="费用完结" align="center" prop="propcolumn" v-if="columns[11].visible" />
			<el-table-column label="创建时间" align="center" prop="created_at" v-if="columns[12].visible" />
			<el-table-column label="备注" align="center" prop="remark" v-if="columns[13].visible" />
			<el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width">
				<template #default="scope">
					<el-button plain type="primary" size="small" @click="handleUpdate(scope.row)">修改</el-button>
					<el-button plain type="primary" size="small" @click="handleCopy(scope.row)">复制</el-button>
					<el-button plain type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" v-model:page="queryParams.page" v-model:limit="queryParams.pageSize"
			@pagination="getList" />


		<!-- 添加或修改对话框 -->
		<el-dialog :title="title" v-model="open" width="1400px" :close-on-click-modal="false">
			<el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
				<el-card>
					<el-tabs v-model="activeName" class="demo-tabs">
						<el-tab-pane label="操作单据" name="操作单据">
							<el-card>
								<el-row>
									<el-form-item label="业务类型" prop="order_type_id" style="width: 300px">
										<el-select v-model="form.order_type_id" placeholder="请选择" clearable>
											<el-option v-for="item in ORDER_TYPE" :key="item.id" :label="item.name"
												:value="item.id" />
										</el-select>
									</el-form-item>

									<el-form-item label="工作编号" prop="job_no" style="width: 300px">
										<el-input v-model="form.job_no" placeholder="请输入" />
									</el-form-item>

									<el-form-item label="合同号" prop="contract_no" style="width: 300px">
										<el-input v-model="form.contract_no" placeholder="请输入" />
									</el-form-item>

									<el-form-item label="归属时间" prop="finish_at" style="width: 300px">
										<el-date-picker v-model="form.finish_at" placeholder="请选择"
											value-format="YYYY-MM-DD" type="date"></el-date-picker>
									</el-form-item>

									<el-form-item label="业务员" prop="business_user_id" style="width: 300px">
										<el-select v-model="form.business_user_id" placeholder="请选择" clearable
											filterable>
											<el-option v-for="item in BUSINESS_USER" :key="item.id" :label="item.name"
												:value="item.id" />
										</el-select>
									</el-form-item>

									<el-form-item label="操作员" prop="operation_user_id" style="width: 300px">
										<el-select v-model="form.operation_user_id" placeholder="请选择" clearable
											filterable>
											<el-option v-for="item in OPERATION_USER" :key="item.id" :label="item.name"
												:value="item.id" />
										</el-select>
									</el-form-item>

									<el-form-item label="单证员" prop="document_user_id" style="width: 300px">
										<el-select v-model="form.document_user_id" placeholder="请选择" clearable
											filterable>
											<el-option v-for="item in DOCUMENT_USER" :key="item.id" :label="item.name"
												:value="item.id" />
										</el-select>
									</el-form-item>

									<el-form-item label="商务" prop="commerce_user_id" style="width: 300px">
										<el-select v-model="form.commerce_user_id" placeholder="请选择" clearable
											filterable>
											<el-option v-for="item in COMMERCE_USER" :key="item.id" :label="item.name"
												:value="item.id" />
										</el-select>
									</el-form-item>

									<el-form-item label="船公司" prop="shipping_company_id" style="width: 300px">
										<el-select v-model="form.shipping_company_id" placeholder="请选择" clearable
											filterable @change="getShoppingCompany">
											<el-option v-for="item in SHIPPING_COMPANY" :key="item.id"
												:label="item.name" :value="item.id" />
										</el-select>
									</el-form-item>

									<el-form-item label="提单号" prop="bl_no" style="width: 300px">
										<el-input v-model="form.bl_no" placeholder="请输入"
											@input="handleInputTaxNumber('bl_no', form.bl_no, 1)" />
									</el-form-item>

									<el-form-item label="起运港" prop="origin_port" style="width: 300px">
										<el-input v-model="form.origin_port" placeholder="请输入"
											@input="handleInputTaxNumber('origin_port', form.origin_port, 2)" />
									</el-form-item>

									<el-form-item label="目的港" prop="destination_port" style="width: 300px">
										<el-input v-model="form.destination_port" placeholder="请输入"
											@input="handleInputTaxNumber('destination_port', form.destination_port, 2)" />
									</el-form-item>

									<el-form-item label="船名" prop="ship_name" style="width: 300px">
										<el-input v-model="form.ship_name" placeholder="请输入"
											@input="handleInputTaxNumber('ship_name', form.ship_name,2)" />
									</el-form-item>

									<el-form-item label="航次" prop="ship_no" style="width: 300px">
										<el-input v-model="form.ship_no" placeholder="请输入"
											@input="handleInputTaxNumber('ship_no', form.ship_no,2)" />
									</el-form-item>


									<el-form-item label="柜型" prop="container_type" style="width: 300px">
										<el-input v-model="form.container_type" placeholder="请输入"
											@input="handleInputTaxNumber('container_type', form.container_type, 1)" />
									</el-form-item>

									<el-form-item label="支付方式" prop="payment_method" style="width: 300px">
										<el-select v-model="form.payment_method" placeholder="请选择" clearable>
											<el-option v-for="item in PAYMENT_METHOD" :key="item.value"
												:label="item.label" :value="item.value" />
										</el-select>
									</el-form-item>

									<el-form-item label="截单状态" prop="cutoff_status" style="width: 300px">
										<el-select v-model="form.cutoff_status" placeholder="请选择" clearable>
											<el-option v-for="item in CUTOFF_STATUS" :key="item.value"
												:label="item.label" :value="item.value" />
										</el-select>
									</el-form-item>

									<el-form-item label="截单时间" prop="cutoff_at" style="width: 300px">
										<el-date-picker v-model="form.cutoff_at" placeholder="请选择"
											format="YYYY-MM-DD HH:mm" type="datetime"></el-date-picker>
									</el-form-item>

									<el-form-item label="船期" prop="sailing_schedule" style="width: 300px">
										<el-input v-model="form.sailing_schedule" placeholder="请输入" />
									</el-form-item>


									<el-form-item label="提单状态" prop="bl_status" style="width: 300px">
										<el-select v-model="form.bl_status" placeholder="请选择" clearable>
											<el-option v-for="item in BL_STATUS" :key="item.value" :label="item.label"
												:value="item.value" />
										</el-select>
									</el-form-item>

									<el-form-item label="开船日期" prop="sailing_at" style="width: 300px">
										<el-date-picker v-model="form.sailing_at" placeholder="请选择"
											value-format="YYYY-MM-DD" type="date"></el-date-picker>
									</el-form-item>

									<el-form-item label="到港日期" prop="arrival_at" style="width: 300px">
										<el-date-picker v-model="form.arrival_at" placeholder="请选择"
											value-format="YYYY-MM-DD" type="date"></el-date-picker>
									</el-form-item>

									<el-form-item label="提货" prop="is_delivery" style="width: 300px">
										<el-select v-model="form.is_delivery" placeholder="请选择" clearable>
											<el-option v-for="item in IS_DELIVERY" :key="item.value" :label="item.label"
												:value="item.value" />
										</el-select>
									</el-form-item>

									<el-form-item label="订舱信息及备注" prop="remark" style="width: 300px">
										<!-- <el-input v-model="form.remark" placeholder="请输入" type="textarea" /> -->
										<el-button type="primary" @click="form.remark.push('')">添加订舱信息及备注</el-button>
									</el-form-item>


									<span v-for="(item, index) in form.remark" :key="index"
										class="input-wrapper mr20 mb20" style="width: 300px; position: relative;">
										<!-- 漂浮的 div -->
										<div class="floating-div" @click="form.remark.splice(index, 1);">×</div>

										<!-- el-input -->
										<el-input v-model="form.remark[index]" placeholder="请输入" type="textarea"
											:rows="4" />
									</span>
								</el-row>
							</el-card>

							<el-card class="mt20">
								<el-row :gutter="10" class="mb8" justify="space-between">
									<el-col :span="1.5">
										应付款
									</el-col>
									<el-col :span="1.5">
										<span style="color: red;">业务员请仔细核对费用内容，如有疑问，请与操作确认！</span>
										<el-button type="danger" plain>费用未完结</el-button>
										<el-button type="primary" plain
											@click="form.orderPaymentsList.push({})">添加明细</el-button>
									</el-col>
								</el-row>

								<el-table :data="form.orderPaymentsList">
									<el-table-column label="费用明细" align="center" prop="company_header_id" width="280px">
										<template #default="scope">
											<el-select v-model="scope.row.company_header_id" filterable
												placeholder="请选择合作单位" :loading="loadingHeaders" clearable
												style="width: 250px;">
												<el-option v-for="item in COMPANY_HEADER" :key="item.id"
													:label="item.company_name" :value="item.id" />
											</el-select>
										</template>
									</el-table-column>
									<el-table-column label="不开票备注" align="center" prop="no_invoice_remark">
										<template #default="scope">
											<el-input v-model="scope.row.no_invoice_remark" placeholder="请输入" />
										</template>
									</el-table-column>

									<el-table-column label="人民币费用" align="center" prop="cny_amount">
										<template #default="scope">
											<el-input v-model="scope.row.cny_amount" placeholder="请输入" />
										</template>
									</el-table-column>
									<el-table-column label="人民币发票号" align="center" prop="cny_invoice_number"
										width="230px">
										<template #default="scope">
											<el-input v-model="scope.row.cny_invoice_number" placeholder="请输入"
												style="width: 200px;" />
										</template>
									</el-table-column>
									<el-table-column label="美金费用" align="center" prop="usd_amount">
										<template #default="scope">
											<el-input v-model="scope.row.usd_amount" placeholder="请输入" />
										</template>
									</el-table-column>
									<el-table-column label="美金发票号" align="center" prop="usd_invoice_number"
										width="230px">
										<template #default="scope">
											<el-input v-model="scope.row.usd_invoice_number" placeholder="请输入"
												style="width: 200px;" />
										</template>
									</el-table-column>
									<!-- <el-table-column label="联系人" align="center" prop="contact_person">
										<template #default="scope">
											<el-input v-model="scope.row.contact_person" placeholder="请输入" />
										</template>
									</el-table-column> -->
									<!-- <el-table-column label="联系方式" align="center" prop="contact_phone">
										<template #default="scope">
											<el-input v-model="scope.row.contact_phone" placeholder="请输入" />
										</template>
									</el-table-column> -->
									<!-- <el-table-column label="备注" align="center" prop="remark">
										<template #default="scope">
											<el-input v-model="scope.row.remark" placeholder="请输入" type="textarea" />
										</template>
									</el-table-column> -->
									<el-table-column label="操作" align="center" style="width: 80px;">
										<template #default="scope">
											<el-button plain type="danger" icon="Delete"
												@click="handleDeleteOrderPayment(scope)">删除</el-button>
										</template>
									</el-table-column>
								</el-table>

								<span v-for="(item, index) in form.orderPaymentsList" :key="index" class="mr20 mt20"
									style="width: 300px; display: inline-block;">
									<el-input v-model="form.orderPaymentsList[index].remark" placeholder="请输入"
										type="textarea" :rows="4" />
								</span>
							</el-card>


							<el-card class="mt20">
								<div class="mb10">合计</div>
								<el-form-item label="整单备注:" prop="title1">
									<el-input v-model="form.title1" placeholder="请输入" type="textarea" />
								</el-form-item>
								<el-row>
									<el-form-item label="总计人民币" prop="title2" style="width: 300px">
										<el-input v-model="form.title2" placeholder="请输入" type="number" />
									</el-form-item>
									<el-form-item label="总计美元" prop="title3" style="width: 300px">
										<el-input v-model="form.title3" placeholder="请输入" type="number" />
									</el-form-item>
								</el-row>
							</el-card>

						</el-tab-pane>

						<el-tab-pane label="委托抬头" name="委托抬头">

							<el-card>
								<el-row>
									<el-form-item label="销货单位" prop="seller_id" style="width: 400px">
										<el-select v-model="form.order_delegation_header.seller_id"
											placeholder="请选择销货单位" clearable>
											<el-option v-for="item in SELLER" :key="item.id" :label="item.name"
												:value="item.id" />
										</el-select>
									</el-form-item>

									<el-form-item label="公司抬头" prop="company_header_id" style="width: 400px">
										<el-select v-model="form.order_delegation_header.company_header_id" filterable
											placeholder="请选择" :remote-method="getListHeadersData"
											:loading="loadingHeaders" @change="orderDelegationHeaderChange">
											<el-option v-for="item in COMPANY_HEADER" :key="item.id"
												:label="item.company_name" :value="item.id" />
										</el-select>
									</el-form-item>

									<el-form-item label="联系人" prop="contact_person" style="width: 400px">
										<el-input v-model="form.order_delegation_header.contact_person"
											placeholder="请输入" disabled />
									</el-form-item>

									<el-form-item label="电话" prop="contact_phone" style="width: 400px">
										<el-input v-model="form.order_delegation_header.contact_phone" placeholder="请输入"
											disabled />
									</el-form-item>

									<el-form-item label="" prop="order_delegation_header_button" style="width: 400px">
										<el-button type="primary"
											@click="form.order_delegation_header.remark.push({})">增加</el-button>
									</el-form-item>
								</el-row>

								<el-row>
									<div v-for="(item, index) in form.order_delegation_header.remark" :key="index"
										class="mr20 mb20">
										<el-row>
											<div>
												<div class="mb10">一代联系方式</div>
												<el-input v-model="item.contact_phone" placeholder="请输入" type="textarea"
													rows="4" style="width: 300px;" />
											</div>

											<div class="ml20">
												<div class="mb10">
													<el-row justify="space-between">
														<div>一代费用</div>
														<div class="mr10"
															@click="form.order_delegation_header.remark.splice(index, 1)">
															×</div>
													</el-row>
												</div>
												<el-input v-model="item.fee" placeholder="请输入" type="textarea" rows="4"
													style="width: 300px;" />
											</div>
										</el-row>
									</div>
								</el-row>
							</el-card>

						</el-tab-pane>

						<el-tab-pane label="箱子信息" name="箱子信息">
							<el-card>
								<el-row>
									<el-form-item label="提单号" prop="template0" style="width: 300px">
										<el-input v-model="form.bl_no" placeholder="请输入" disabled />
									</el-form-item>

									<el-form-item label="船名/航次" prop="template0" style="width: 300px">
										<el-tooltip class="box-item" effect="dark"
											:content="(form.ship_name || '') + '/' + (form.ship_no || '')"
											placement="top">
											<el-input :value="(form.ship_name || '') + '/' + (form.ship_no || '')"
												placeholder="请输入" disabled />
										</el-tooltip>
									</el-form-item>

									<el-form-item label="" prop="template0" style="width: 300px">
									</el-form-item>

									<el-form-item label="" prop="template0" style="width: 300px">
									</el-form-item>

									<el-form-item label="截单状态" prop="template1" style="width: 300px">
										<el-select v-model="form.template1" placeholder="请选择" clearable>
											<el-option v-for="item in CUTOFF_STATUS" :key="item.value"
												:label="item.label" :value="item.value" />
										</el-select>
									</el-form-item>

									<el-form-item label="开港时间" prop="template2" style="width: 300px">
										<el-date-picker v-model="form.template2" placeholder="请选择"
											format="YYYY-MM-DD HH:mm" type="datetime"></el-date-picker>
									</el-form-item>

									<el-form-item label="实际开船时间" prop="template3" style="width: 300px">
										<el-date-picker v-model="form.template3" placeholder="请选择" format="YYYY-MM-DD"
											type="date"></el-date-picker>
									</el-form-item>

									<el-form-item label="" prop="template4" style="width: 300px">
										<el-tooltip class="box-item" effect="dark"
											:content="shoppingCompanyObj.phone ? shoppingCompanyObj.phone :'暂无电话'"
											placement="top">
											<el-button type="text" @click="toShhoppingCompanyUrl">船公司网址</el-button>
										</el-tooltip>
										<!-- <el-link type="primary" href="https://www.baidu.com"
											target="_blank">船公司网址</el-link> -->
									</el-form-item>

									<el-form-item label="截单时间" prop="template5" style="width: 300px">
										<el-date-picker v-model="form.template5" placeholder="请选择"
											format="YYYY-MM-DD HH:mm" type="datetime"></el-date-picker>
									</el-form-item>

									<el-form-item label="截港时间" prop="template6" style="width: 300px">
										<el-date-picker v-model="form.template6" placeholder="请选择"
											format="YYYY-MM-DD HH:mm" type="datetime"></el-date-picker>
									</el-form-item>

									<el-form-item label="实际到港时间" prop="template7" style="width: 300px">
										<el-date-picker v-model="form.template7" placeholder="请选择" format="YYYY-MM-DD"
											type="date"></el-date-picker>
									</el-form-item>

									<el-form-item label="进港码头" prop="template8" style="width: 300px">
										<el-tooltip class="box-item" effect="dark"
											:content="form.template8 ? form.template8 :'暂无'" placement="top">
											<el-select v-model="form.template8" placeholder="请选择" clearable filterable>
												<el-option v-for="item in WHARVES_COMPANY" :key="item.id"
													:label="item.name" :value="item.id" />
											</el-select>
										</el-tooltip>
									</el-form-item>

									<el-form-item label="保险" prop="template9" style="width: 300px">
										<el-select v-model="form.template9" placeholder="请选择" clearable>
											<el-option key="保险1" label="保险1" value="保险1" />
											<el-option key="保险2" label="保险2" value="保险2" />
											<el-option key="保险3" label="保险3" value="保险3" />
										</el-select>
									</el-form-item>

									<el-form-item label="提货" prop="template10" style="width: 300px">
										<el-select v-model="form.template10" placeholder="请选择" clearable>
											<el-option v-for="item in IS_DELIVERY" :key="item.value" :label="item.label"
												:value="item.value" />
										</el-select>
									</el-form-item>

									<el-form-item label="落箱数据" prop="template11" style="width: 300px">
										<el-button type="primary">生成</el-button>
									</el-form-item>

									<el-form-item label="" prop="template12" style="width: 300px">
										<!-- <el-button type="primary">生成</el-button> -->
									</el-form-item>

									<el-form-item label="截单状态" prop="template13" style="width: 300px">
										<el-select v-model="form.template13" placeholder="请选择" clearable>
											<el-option key="未完结" label="未完结" value="未完结" />
											<el-option key="已完结" label="已完结" value="已完结" />
										</el-select>
									</el-form-item>

									<el-form-item label="提单状态" prop="template14" style="width: 300px">
										<el-select v-model="form.template14" placeholder="请选择" clearable>
											<el-option v-for="item in BL_STATUS" :key="item.value" :label="item.label"
												:value="item.value" />
										</el-select>
									</el-form-item>

									<el-form-item label="是否放行" prop="template15" style="width: 300px">
										<el-select v-model="form.template15" placeholder="请选择" clearable>
											<el-option key="未放行" label="未放行" value="未放行" />
											<el-option key="已放行" label="已放行" value="已放行" />
										</el-select>
									</el-form-item>

									<el-form-item label="" prop="template15" style="width: 300px">

									</el-form-item>

									<el-form-item label="备注" prop="template15" style="width: 300px">
										<el-input v-model="form.template15" placeholder="请输入" type="textarea"
											:rows="4" />
									</el-form-item>
								</el-row>
							</el-card>

							<el-form class="mt20" :model="caseNumberActive" ref="caseNumberActiveRef" :inline="true"
								label-width="70px">
								<el-container style="height: 800px">
									<el-card>
										<el-aside style="background-color: #FFF;" width="200px">
											<el-row justify="space-between">
												<el-text class="mx-1">箱号列表</el-text>
												<el-text class="mx-1" type="primary"
													@click="addCaseNumberList()">添加箱号</el-text>
											</el-row>

											<div v-for="(item, index) in form.caseNumberList" :key="index"
												style="text-align: center;">
												<el-popconfirm class="box-item" title="是否删除选中项"
													@confirm="delectCaseNumber">
													<template #reference>
														<el-text v-if="activeSelect == index" size="large"
															type="primary">{{ item.caseNumber1 }}</el-text>
														<el-text v-else size="large"
															@click="selectCaseNumber(index)">{{ item.caseNumber1 }}</el-text>
													</template>
												</el-popconfirm>

											</div>
										</el-aside>
									</el-card>

									<el-card class="ml20" style="width: 1100px;">
										<el-container>
											<el-scrollbar height="800px">
												<el-row>
													<el-form-item label="箱号" prop="caseNumber1" style="width: 220px">
														<el-input v-model="caseNumberActive.caseNumber1"
															placeholder="请输入" />
													</el-form-item>

													<el-form-item label="封号" prop="caseNumber2" style="width: 220px">
														<el-input v-model="caseNumberActive.caseNumber2"
															placeholder="请输入" />
													</el-form-item>

													<el-form-item label="柜型" prop="caseNumber3" style="width: 220px">
														<el-select v-model="caseNumberActive.caseNumber3"
															placeholder="请选择" clearable>
															<el-option key="20GP" label="20GP" value="20GP" />
															<el-option key="40HQ" label="40HQ" value="40HQ" />
															<el-option key="45HQ" label="45HQ" value="45HQ" />
															<el-option key="40RH" label="40RH" value="40RH" />
															<el-option key="其他" label="其他" value="其他" />
														</el-select>
													</el-form-item>

													<el-form-item label="序列号" prop="caseNumber4" style="width: 220px">
														<el-input v-model="caseNumberActive.caseNumber4"
															placeholder="请输入" />
													</el-form-item>

													<el-form-item label="预提" prop="caseNumber7" style="width: 220px">
														<el-tooltip class="box-item" effect="dark"
															:content="caseNumberActive.caseNumber7 ? caseNumberActive.caseNumber7 :'暂无'"
															placement="top">
															<el-select v-model="caseNumberActive.caseNumber7"
																placeholder="请选择" clearable filterable>
																<el-option key="预提1" label="预提1" value="预提1" />
																<el-option key="预提2" label="预提2" value="预提2" />
															</el-select>
														</el-tooltip>
													</el-form-item>

													<el-form-item label="提箱码头" prop="caseNumber8" style="width: 220px">
														<el-tooltip class="box-item" effect="dark"
															:content="caseNumberActive.caseNumber8 ? caseNumberActive.caseNumber8 :'暂无'"
															placement="top">
															<el-select v-model="caseNumberActive.caseNumber8"
																placeholder="请选择" clearable filterable>
																<el-option v-for="item in WHARVES_COMPANY"
																	:key="item.id" :label="item.name"
																	:value="item.id" />
															</el-select>
														</el-tooltip>
													</el-form-item>

													<el-form-item label="落箱" prop="caseNumber9" style="width: 220px">
														<el-tooltip class="box-item" effect="dark"
															:content="caseNumberActive.caseNumber9 ? caseNumberActive.caseNumber9 :'暂无'"
															placement="top">
															<el-select v-model="caseNumberActive.caseNumber9"
																placeholder="请选择" clearable filterable>
																<el-option key="落箱1" label="落箱1" value="落箱1" />
																<el-option key="落箱2" label="落箱2" value="落箱2" />
															</el-select>
														</el-tooltip>
													</el-form-item>

													<el-form-item label="是否进港" prop="caseNumber10" style="width: 220px">
														<el-select v-model="caseNumberActive.caseNumber10"
															placeholder="请选择" clearable>
															<el-option key="未进港" label="未进港" value="未进港" />
															<el-option key="已进港" label="已进港" value="已进港" />
														</el-select>
													</el-form-item>

													<el-form-item label="司机信息" prop="caseNumber5" style="width: 220px">
														<el-tooltip class="box-item" effect="dark"
															:content="caseNumberActive.caseNumber5 ? caseNumberActive.caseNumber5 :'暂无'"
															placement="top">
															<el-input v-model="caseNumberActive.caseNumber5"
																placeholder="请输入" />
														</el-tooltip>
													</el-form-item>

													<el-form-item label="进港数据" prop="caseNumber6" style="width: 220px">
														<el-button type="primary">生成</el-button>
													</el-form-item>

													<el-form-item label="件毛体" prop="caseNumber11" style="width: 220px">
														<el-button type="primary" @click="caseNumberActive.caseNumber11.push({
															maotiyi1: form.bl_no
														})">新增</el-button>
													</el-form-item>

													<el-table :data="caseNumberActive.caseNumber11"
														style="width: 1000px; margin-bottom: 20px;">
														<el-table-column label="提单号" align="center" prop="maotiyi1"
															width="300">
															<template #default="scope">
																<el-input v-model="scope.row.maotiyi1"
																	placeholder="请输入" />
															</template>
														</el-table-column>

														<el-table-column label="件数" align="center" prop="maotiyi2">
															<template #default="scope">
																<el-input v-model="scope.row.maotiyi2" type="number"
																	placeholder="请输入" />
															</template>
														</el-table-column>

														<el-table-column label="毛重" align="center" prop="maotiyi3">
															<template #default="scope">
																<el-input v-model="scope.row.maotiyi3" type="number"
																	placeholder="请输入" />
															</template>
														</el-table-column>

														<el-table-column label="体积" align="center" prop="maotiyi4">
															<template #default="scope">
																<el-input v-model="scope.row.maotiyi4" type="number"
																	placeholder="请输入" />
															</template>
														</el-table-column>

														<!-- <el-table-column label="备注" align="center" prop="maotiyi5">
															<template #default="scope">
																<el-input v-model="scope.row.maotiyi5"
																	placeholder="请输入" />
															</template>
														</el-table-column> -->

														<el-table-column label="操作" align="center" style="width: 80px;">
															<template #default="scope">
																<el-button plain type="danger" icon="Delete"
																	@click="caseNumberActive.caseNumber11.splice(scope.$index, 1)">删除</el-button>
															</template>
														</el-table-column>
													</el-table>

													<el-col :span="24">
														<span v-for="(item, index) in caseNumberActive.caseNumber11"
															:key="index" class="input-wrapper mr20 mb20"
															style="width: 300px;">
															<el-input
																v-model="caseNumberActive.caseNumber11[index].maotiyi5"
																placeholder="请输入" type="textarea" :rows="4" />
														</span>
													</el-col>

													<el-form-item label="车队" prop="caseNumber13" style="width: 220px">
														<el-select v-model="caseNumberActive.caseNumber13"
															placeholder="请选择" clearable>
															<el-option v-for="item in FLEETS_COMPANY" :key="item.id"
																:label="item.name" :value="item.id" />
														</el-select>
													</el-form-item>

													<el-form-item label="货重" prop="caseNumber15" style="width: 220px">
														<el-input v-model="caseNumberActive.caseNumber15"
															placeholder="请输入" />
													</el-form-item>

													<el-form-item label="装柜时间" prop="caseNumber14" style="width: 220px">
														<el-date-picker v-model="caseNumberActive.caseNumber14"
															placeholder="请选择" format="YYYY-MM-DD HH:mm"
															type="datetime"></el-date-picker>
													</el-form-item>

													<el-form-item label="" prop="caseNumber12" style="width: 220px">

													</el-form-item>

													<el-form-item label="装柜地址" prop="caseNumber12" style="width: 220px">
														<el-button type="primary"
															@click="caseNumberActive.caseNumber12.push({})">新增</el-button>
													</el-form-item>

													<el-form-item label="装柜数据" prop="caseNumber16" style="width: 220px">
														<el-button type="primary">生成</el-button>
													</el-form-item>

													<el-form-item label="装箱单" prop="caseNumber17" style="width: 220px">
														<el-button type="primary"
															@click="openPackForm = true">生成</el-button>
													</el-form-item>

													<el-table :data="caseNumberActive.caseNumber12"
														style="width: 1000px; margin-bottom: 20px;">
														<el-table-column label="装柜地址" align="center" prop="maotiyi1"
															width="300">
															<template #default="scope">
																<el-tooltip class="box-item" effect="dark"
																	:content="scope.row.maotiyi1 ? '装柜地址'+scope.row.maotiyi1 :'暂无'"
																	placement="top">
																	<el-select v-model="scope.row.maotiyi1"
																		placeholder="请选择" clearable filterable
																		@change="zgdzChange($event, scope)">
																		<el-option key="1" label="装柜地址1" value="1" />
																		<el-option key="2" label="装柜地址2" value="2" />
																	</el-select>
																</el-tooltip>
															</template>
														</el-table-column>

														<el-table-column label="地址" align="center" prop="maotiyi2"
															width="300">
															<template #default="scope">
																<el-input v-model="scope.row.maotiyi2" placeholder="请输入"
																	disabled />
															</template>
														</el-table-column>

														<el-table-column label="联系人/电话" align="center" prop="maotiyi3">
															<template #default="scope">
																<el-tooltip class="box-item" effect="dark"
																	:content="scope.row.maotiyi3 ? scope.row.maotiyi3 :'暂无'"
																	placement="top">
																	<el-input v-model="scope.row.maotiyi3"
																		placeholder="请输入" />
																</el-tooltip>
															</template>
														</el-table-column>


														<!-- <el-table-column label="备注" align="center" prop="maotiyi4">
															<template #default="scope">
																<el-input v-model="scope.row.maotiyi4"
																	placeholder="请输入" />
															</template>
														</el-table-column> -->

														<el-table-column label="操作" align="center" style="width: 80px;">
															<template #default="scope">
																<el-button plain type="danger" icon="Delete"
																	@click="caseNumberActive.caseNumber12.splice(scope.$index, 1)">删除</el-button>
															</template>
														</el-table-column>
													</el-table>

													<el-col :span="24">
														<span v-for="(item, index) in caseNumberActive.caseNumber12"
															:key="index" class="input-wrapper mr20 mb20"
															style="width: 300px;">
															<el-input
																v-model="caseNumberActive.caseNumber12[index].maotiyi4"
																placeholder="请输入" type="textarea" :rows="4" />
														</span>
													</el-col>
												</el-row>
											</el-scrollbar>
										</el-container>
									</el-card>

								</el-container>
							</el-form>
						</el-tab-pane>
						<el-tab-pane label="提单信息" name="提单信息">
							<BillForm v-if="open"></BillForm>
						</el-tab-pane>

						<el-tab-pane label="上传文件" name="上传文件">
							<div>
								<el-upload ref="uploadRef" :action="baseUrl + '/uploads/file'"
									v-model:file-list="order_files" :on-change="handleFilesChange" :auto-upload="false"
									multiple :show-file-list="false" :on-success="handleUploadSuccess"
									:on-error="handleUploadError">
									<el-button type="primary">点击上传</el-button>
								</el-upload>

								<el-table :data="order_files">
									<el-table-column label="文件名" align="center" prop="name" />
									<el-table-column label="大小" align="center" prop="size">
										<template #default="scope">
											{{ (scope.row.size / 1024).toFixed(2) }} KB
										</template>
									</el-table-column>
									<el-table-column label="状态" align="center" prop="status">
										<template #default="scope">
											<span v-if="scope.row.status === 'success'">上传成功</span>
											<span v-else-if="scope.row.status === 'error'">上传失败</span>
											<span v-else>等待上传</span>
										</template>
									</el-table-column>
									<el-table-column label="操作" align="center" width="280"
										class-name="small-padding fixed-width">
										<template #default="scope">
											<el-button type="success"
												v-if="order_files[scope.$index].status === 'success'"
												@click="toUploadFile(form.order_files[scope.$index].url)">查看详情</el-button>
											<el-button plain type="danger" icon="Delete"
												@click="removeFile(scope.$index)">删除</el-button>
										</template>
									</el-table-column>
								</el-table>

								<el-button type="success" @click="submitUploadFiles">确定上传</el-button>
							</div>
						</el-tab-pane>
					</el-tabs>
				</el-card>


			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button type="primary" @click="submitForm">保 存</el-button>
					<el-button @click="cancel">取 消</el-button>
				</div>
			</template>
		</el-dialog>

		<!--  -->
		<el-dialog title="" v-model="openPackForm" width="1400px" append-to-body>
			<PackForm v-if="openPackForm"></PackForm>
		</el-dialog>
	</div>
</template>

<script setup name="OperatingDocument">
	import {
		listData,
		getData,
		delByIds,
		addData,
		updateData
	} from "@/api/operation-page/operating-document";
	import {
		listData as shippingCompaniesListData
	} from "@/api/system/pull-down-options/shippingCompanies";
	import {
		listData as wharvesListData
	} from "@/api/system/pull-down-options/wharves";
	import {
		listData as fleetsListData
	} from "@/api/system/pull-down-options/fleets";
	import {
		listUser as userListData
	} from "@/api/system/user";
	import {
		listData as orderTypesListData
	} from "@/api/system/system-parameter/order-types";
	import {
		listData as listHeadersData
	} from "@/api/company/headers";
	import {
		listData as listSellersData
	} from "@/api/system/system-parameter/sellers";
	import {
		ref,
		watch
	} from "vue";
	// import InvoiceForm from '@/components/InvoiceForm.vue'
	import BillForm from '@/components/BillForm.vue'
	import PackForm from '@/components/PackForm.vue'
	import useUserStore from '@/store/modules/user'

	const baseUrl = import.meta.env.VITE_APP_BASE_API;
	// console.log("baseUrl", baseUrl);

	const {
		proxy
	} = getCurrentInstance();

	const userStore = useUserStore()

	const dataList = ref([]);
	const open = ref(false);
	const openPackForm = ref(false)
	const loading = ref(true);
	const ids = ref([]);
	const single = ref(true);
	const multiple = ref(true);
	const total = ref(0);
	const title = ref("");
	const activeName = ref('操作单据')
	const activeSelect = ref(0)

	const shoppingCompanyObj = ref({
		phone: null,
		tracking_url: null,
	})

	const data = reactive({
		form: {},
		caseNumberActive: {},
		queryParams: {
			page: 1,
			pageSize: 15,
			keyword: null,
			sailing_at: [],
			finish_at: null,
			order_type_id: null,
			is_fee_finish: null,
			company_header_id: null,
			business_user_id: null,
			commerce_user_id: null,
			is_delivery: null,
			payment_method: null,
			seller_id: null,
			caozuoyuepiao: null
		},
		rules: {
			order_type_id: [{
				required: true,
				message: "选择类型不能为空",
				trigger: "blur"
			}],
			business_user_id: [{
				required: true,
				message: "业务员不能为空",
				trigger: "blur"
			}],
			sailing_at: [{
				required: true,
				message: "开船日期不能为空",
				trigger: "blur"
			}],
			bl_no: [{
				required: true,
				message: "提单号不能为空",
				trigger: "blur"
			}, {
				pattern: /^[A-Z0-9\+\-\*]+$/, // 正则表达式：只允许大写字母和数字+-*
				message: "提单号只能包含大写字母、数字、+、-、*",
				trigger: "blur"
			}],
			origin_port: [{
				required: true,
				message: "起运港不能为空",
				trigger: "blur"
			}, {
				pattern: /^[A-Z0-9+\-*,， ]+$/, // 正则表达式：只允许大写字母、数字、+-* 和空格
				message: "起运港只能包含大写字母和数字",
				trigger: "blur"
			}],
			destination_port: [{
				required: true,
				message: "目的港不能为空",
				trigger: "blur"
			}, {
				pattern: /^[A-Z0-9+\-*,， ]+$/, // 正则表达式：只允许大写字母、数字、+-* 和空格
				message: "目的港只能包含大写字母和数字",
				trigger: "blur"
			}],
			ship_name: [{
				required: true,
				message: "船名不能为空",
				trigger: "blur"
			}, {
				pattern: /^[A-Z0-9+\-*,， ]+$/, // 正则表达式：只允许大写字母、数字、+-* 和空格
				message: "船名只能包含大写字母和数字",
				trigger: "blur"
			}],
			ship_no: [{
				required: true,
				message: "航次不能为空",
				trigger: "blur"
			}, {
				pattern: /^[A-Z0-9+\-*,， ]+$/, // 正则表达式：只允许大写字母、数字、+-* 和空格
				message: "航次只能包含大写字母和数字",
				trigger: "blur"
			}],
			container_type: [{
				required: true,
				message: "柜型不能为空",
				trigger: "blur"
			}, {
				pattern: /^[A-Z0-9\+\-\*]+$/, // 正则表达式：只允许大写字母和数字+-*
				message: "柜型只能包含大写字母、数字、+、-、*",
				trigger: "blur"
			}]
		}
	});

	// 列显隐信息
	const columns = ref([]);

	let columnsJSon = window.localStorage.getItem('columns' + userStore.id)

	// console.log(columns.value);
	if (columnsJSon == null) {
		columns.value = [{
			key: 0,
			label: `工作编号`,
			visible: true
		}, {
			key: 1,
			label: `委托抬头`,
			visible: true
		}, {
			key: 2,
			label: `操作模式`,
			visible: true
		}, {
			key: 3,
			label: `提单号`,
			visible: true
		}, {
			key: 4,
			label: `柜型`,
			visible: true
		}, {
			key: 5,
			label: `目的港`,
			visible: true
		}, {
			key: 6,
			label: `开船日期`,
			visible: true
		}, {
			key: 7,
			label: `到港日期`,
			visible: true
		}, {
			key: 8,
			label: `业务员`,
			visible: true
		}, {
			key: 9,
			label: `提货`,
			visible: true
		}, {
			key: 10,
			label: `文件`,
			visible: true
		}, {
			key: 11,
			label: `费用完结`,
			visible: true
		}, {
			key: 12,
			label: `创建时间`,
			visible: true
		}, {
			key: 13,
			label: `备注`,
			visible: true
		}]
	} else {
		columns.value = JSON.parse(columnsJSon)
	}


	// 监听columns
	watch(columns, (val) => {
		window.localStorage.setItem('columns' + userStore.id, JSON.stringify(val));
	}, {
		deep: true
	})

	const {
		queryParams,
		form,
		caseNumberActive,
		rules
	} = toRefs(data);


	// 付款方式
	const PAYMENT_METHOD = ref([{
		label: '月结',
		value: 1
	}, {
		label: '付款买单',
		value: 2
	}])
	// 截单状态
	const CUTOFF_STATUS = ref([{
		label: '正常截单',
		value: 1
	}, {
		label: '等通知截单',
		value: 2
	}, {
		label: '开港后截单',
		value: 3
	}])
	// 提单状态
	const BL_STATUS = ref([{
		label: '正常提单',
		value: 1
	}, {
		label: '等通知电放',
		value: 2
	}, {
		label: '已电放',
		value: 3
	}, {
		label: '已seawaybil',
		value: 4
	}])
	// 提货
	const IS_DELIVERY = ref([{
		label: '未提货',
		value: 0
	}, {
		label: '已提货',
		value: 1
	}])
	const IS_FEE_FINISH = ref({
		label: '费用未完结',
		value: 0
	}, {
		label: '费用已完结',
		value: 1
	})
	// 船公司
	const SHIPPING_COMPANY = ref([])
	// 码头
	const WHARVES_COMPANY = ref([])
	// 车队
	const FLEETS_COMPANY = ref([])
	// 业务员
	const BUSINESS_USER = ref([])
	// 操作员
	const OPERATION_USER = ref([])
	// 单证员
	const DOCUMENT_USER = ref([])
	// 商务
	const COMMERCE_USER = ref([])
	// 单据类型
	const ORDER_TYPE = ref([])
	// 销货公司
	const SELLER = ref([])

	function getSelectOption() {
		shippingCompaniesListData({
			is_paginate: 0
		}).then(response => {
			SHIPPING_COMPANY.value = response.data
		})
		wharvesListData({
			is_paginate: 0
		}).then(response => {
			WHARVES_COMPANY.value = response.data
		})
		fleetsListData({
			is_paginate: 0
		}).then(response => {
			FLEETS_COMPANY.value = response.data
		})
		userListData({
			is_paginate: 0,
			code: 'BUSINESS'
		}).then(response => {
			BUSINESS_USER.value = response.data
		})
		userListData({
			is_paginate: 0,
			code: 'OPERATE'
		}).then(response => {
			OPERATION_USER.value = response.data
		})
		userListData({
			is_paginate: 0,
			code: 'DOCUMENT'
		}).then(response => {
			DOCUMENT_USER.value = response.data
		})
		userListData({
			is_paginate: 0,
			code: 'COMMERCE'
		}).then(response => {
			COMMERCE_USER.value = response.data
		})
		orderTypesListData().then(response => {
			ORDER_TYPE.value = response.data
		})
		listSellersData({
			is_paginate: 0
		}).then(response => {
			SELLER.value = response.data
		})
	}
	getSelectOption()

	const COMPANY_HEADER = ref([]);
	const loadingHeaders = ref(false);
	async function getListHeadersData(keyword) {
		loadingHeaders.value = true
		const res = await listHeadersData({
			keyword: '测试'
		})
		COMPANY_HEADER.value = res.data
		loadingHeaders.value = false
	}
	getListHeadersData('')


	/** 查询列表 */
	function getList() {
		loading.value = true;

		// queryParams.value.order_payments = queryParams.value.sailing_at[0]
		if (queryParams.value.sailing_at.length > 0) {
			queryParams.value.sailing_start_at = queryParams.value.sailing_at[0]
			queryParams.value.sailing_end_at = queryParams.value.sailing_at[1]
		}

		listData(queryParams.value).then(response => {
			dataList.value = response.data;
			total.value = response.meta.total;
			loading.value = false;
		});
	}

	// 取消按钮
	function cancel() {
		open.value = false;
		reset();
	}

	// 表单重置
	function reset() {
		form.value = {
			id: null,
			order_type_id: null,
			job_no: null,
			contract_no: null,
			finish_at: null,
			operation_user_id: null,
			business_user_id: null,
			document_user_id: null,
			commerce_user_id: null,
			shipping_company_id: null,
			container_type: null,
			bl_no: null,
			ship_name: null,
			ship_no: null,
			origin_port: null,
			destination_port: null,
			sailing_at: null,
			arrival_at: null,
			sailing_schedule: null,
			bl_status: null,
			is_delivery: null,
			payment_method: null,
			cutoff_status: null,
			cutoff_at: null,
			remark: [],

			// 委托抬头
			order_delegation_header: {
				seller_id: null,
				company_header_id: null,
				contact_person: null,
				contact_phone: null,
				remark: [{
					contact_phone: null,
					fee: null
				}]
			},

			// 文件列表
			order_files: [],

			orderPaymentsList: [],
			order_payments: null,

			caseNumberList: [{
				caseNumber1: '箱号',
				caseNumber2: null,
				caseNumber3: null,
				caseNumber4: null,
				caseNumber5: null,
				caseNumber6: null,
				caseNumber7: null,
				caseNumber8: null,
				caseNumber9: null,
				caseNumber10: null,
				caseNumber11: [{}],
				caseNumber12: [{}],
				caseNumber13: null,
				caseNumber14: null,
				caseNumber15: null,
				caseNumber16: null,
			}],
			template1: null,
			template2: null,
			template3: null,
			template4: null,
			template5: null,
			template6: null,
			template7: null,
			template8: null,
			template9: null,
			template10: null,
			template11: null,
			template12: null,
			template13: null,
			template14: null,
			template15: null,

		};
		proxy.resetForm("formRef");

		caseNumberActive.value = {
			caseNumber1: null,
			caseNumber2: null,
			caseNumber3: null,
			caseNumber4: null,
			caseNumber5: null,
			caseNumber6: null,
			caseNumber7: null,
			caseNumber8: null,
			caseNumber9: null,
			caseNumber10: null,
			caseNumber11: [{}],
			caseNumber12: [{}],
			caseNumber13: null,
			caseNumber14: null,
			caseNumber15: null,
			caseNumber16: null,
		}
		proxy.resetForm("caseNumberActiveRef");

		caseNumberActive.value = form.value.caseNumberList[0]

		activeName.value = '操作单据'
	}

	/** 搜索按钮操作 */
	function handleQuery() {
		queryParams.value.page = 1;
		getList();
	}

	/** 重置按钮操作 */
	function resetQuery() {
		proxy.resetForm("queryRef");
		handleQuery();
	}

	// 多选框选中数据
	function handleSelectionChange(selection) {
		ids.value = selection.map(item => item.id);
		single.value = selection.length != 1;
		multiple.value = !selection.length;
	}

	/** 新增按钮操作 */
	function handleAdd() {
		reset();
		open.value = true;
		title.value = "新增";
	}

	/** 修改按钮操作 */
	function handleUpdate(row) {
		reset();
		const _id = row.id || ids.value
		getData(_id).then(response => {
			// form.value = response;
			form.value = Object.assign({}, form.value, response);
			form.value.orderPaymentsList = response.order_payments || []

			caseNumberActive.value.caseNumber11[0].maotiyi1 = form.value.bl_no

			if (form.value.order_delegation_header == null) {
				form.value.order_delegation_header = {
					seller_id: null,
					company_header_id: null,
					contact_person: null,
					contact_phone: null,
					remark: [{
						contact_phone: null,
						fee: null
					}]
				}
			}

			// if (form.value.remark) {
			// 	form.value.remark = JSON.parse(form.value.remark) || []
			// } else {
			// 	form.value.remark = []
			// }

			open.value = true;
			title.value = "修改";
		});
	}

	function handleCopy(row) {
		reset();
		const _id = row.id || ids.value
		getData(_id).then(response => {
			// form.value = response;
			form.value = Object.assign({}, form.value, response);
			form.value.id = null;

			caseNumberActive.value.caseNumber11[0].maotiyi1 = form.value.bl_no

			// if (form.value.remark) {
			// 	form.value.remark = JSON.parse(form.value.remark) || []
			// } else {
			// 	form.value.remark = []
			// }
			// form.value.remark = JSON.parse(form.value.remark) || []
			if (form.value.orderPaymentsList.length > 0) {
				form.value.orderPaymentsList.forEach(item => {
					item.id = null
				})
			}
			open.value = true;
			title.value = "复制";
		});
	}

	/** 提交按钮 */
	function submitForm() {
		proxy.$refs["formRef"].validate(valid => {
			if (valid) {
				form.value.order_payments = JSON.stringify(form.value.orderPaymentsList)
				form.value.remark = JSON.stringify(form.value.remark)
				// form.value.order_delegation_header.remark = JSON.stringify(form.value.order_delegation_header
				// 	.remark)
				form.value.order_delegation_header = JSON.stringify(form.value.order_delegation_header)

				form.value.order_files = JSON.stringify(form.value.order_files)

				// console.log(form.value);

				if (form.value.id != null) {
					updateData(form.value).then(response => {
						proxy.$modal.msgSuccess("修改成功");
						open.value = false;
						getList();
					});
				} else {
					addData(form.value).then(response => {
						proxy.$modal.msgSuccess("新增成功");
						open.value = false;
						getList();
					});
				}
			}
		});
	}

	/** 删除按钮操作 */
	function handleDelete(row) {
		const _ids = row.id || ids.value;
		proxy.$modal.confirm('是否确认删除选中的的数据项？').then(function() {
			return delByIds(_ids);
		}).then(() => {
			getList();
			proxy.$modal.msgSuccess("删除成功");
		}).catch(() => {});
	}

	function handleDeleteOrderPayment(scope) {
		// console.log(scope.$index);
		form.value.orderPaymentsList.splice(scope.$index, 1)
	}
	const handleInputTaxNumber = (lable, value, isChar = 0) => {
		// console.log(value, value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase());
		// form.value[lable] = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase(); // 转换为大写
		if (isChar == 0) {
			form.value[lable] = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase(); // 转换为大写
		} else if (isChar == 1) {
			form.value[lable] = value.replace(/[^a-zA-Z0-9\+\-\*]/g, "").toUpperCase(); // 转换为大写
		} else if (isChar == 2) {
			form.value[lable] = value.replace(/[^a-zA-Z0-9+\-*,， ]/g, "").toUpperCase();
		}
	}

	function addCaseNumberList() {
		form.value.caseNumberList.push({
			caseNumber1: '箱号',
			caseNumber2: null,
			caseNumber3: null,
			caseNumber4: null,
			caseNumber5: null,
			caseNumber6: null,
			caseNumber7: null,
			caseNumber8: null,
			caseNumber9: null,
			caseNumber10: null,
			caseNumber11: [{}],
			caseNumber12: [{}],
			caseNumber13: null,
			caseNumber14: null,
			caseNumber15: null,
			caseNumber16: null,
		})
		activeSelect.value = form.value.caseNumberList.length - 1

		caseNumberActive.value = form.value.caseNumberList[activeSelect.value]
		caseNumberActive.value.caseNumber11[caseNumberActive.value.caseNumber11.length - 1].maotiyi1 = form.value.bl_no
	}

	function delectCaseNumber() {
		form.value.caseNumberList.splice(activeSelect.value, 1)

		activeSelect.value = form.value.caseNumberList.length - 1
		caseNumberActive.value = form.value.caseNumberList[activeSelect.value]
	}

	function selectCaseNumber(index) {
		activeSelect.value = index
		caseNumberActive.value = form.value.caseNumberList[activeSelect.value]
	}

	function zgdzChange(e, scope) {
		// console.log(e, scope);

		caseNumberActive.value.caseNumber12[scope.$index].maotiyi2 = '山东省-济南市-历下区'
		caseNumberActive.value.caseNumber12[scope.$index].maotiyi3 = '17684751358'
		caseNumberActive.value.caseNumber12[scope.$index].maotiyi4 = '备注1'
	}

	function orderDelegationHeaderChange(e) {
		console.log(e, COMPANY_HEADER,1615);
		if(e){
			COMPANY_HEADER.value.map(item => {
				if (item.id == e) {
					form.value.order_delegation_header.contact_person = item.contact_person
					form.value.order_delegation_header.contact_phone = item.contact_phone
				}
			})
		}else{
			form.value.order_delegation_header.contact_person= ''
			form.value.order_delegation_header.contact_phone= ''
		}
		
	}

	function getShoppingCompany() {
		shoppingCompanyObj.value = {
			phone: null,
			tracking_url: null
		}

		if (form.value.shipping_company_id) {
			SHIPPING_COMPANY.value.map(item => {
				if (item.id == form.value.shipping_company_id) {
					shoppingCompanyObj.value.phone = item.phone
					shoppingCompanyObj.value.tracking_url = item.tracking_url
				}
			})
		}
	}

	function toShhoppingCompanyUrl() {
		if (shoppingCompanyObj.value.tracking_url) {
			window.open(shoppingCompanyObj.value.tracking_url)
		} else {
			proxy.$modal.msgSuccess("暂无网址");
		}
	}

	function toUploadFile(url) {
		window.open(url)
	}


	const uploadRef = ref()
	const order_files = ref([])

	function handleFilesChange(uploadFile, uploadFiles) {
		// 更新文件列表
		// this.fileList = uploadFiles.map(file => file.raw);
		// console.log(uploadFiles);
		// console.log(order_files.value);
	}

	// 手动触发上传
	const submitUploadFiles = () => {
		uploadRef.value.submit()
	}

	const handleUploadSuccess = (response) => {
		console.log('上传成功:', response);
		form.value.order_files.push({
			file: response.path,
			url: response.url
		})
	};

	const handleUploadError = (error) => {
		console.error('上传失败:', error);
	};
	const removeFile = (index) => {
		console.log(order_files.value);
		order_files.value.splice(index, 1) // 从本地文件列表中移除
		form.value.order_files.splice(index, 1) // 从表单数据中移除
		// uploadRef.value.clearFiles() // 清空上传组件中的文件
		// uploadRef.value.handleStart(order_files.value) // 重新设置文件列表
	}

	getList();
</script>

<style>
	/* 父容器样式 */
	.input-wrapper {
		position: relative;
		/* 让子元素可以相对于它定位 */
		display: inline-block;
		width: 300px;
	}

	/* 漂浮的 div 样式 */
	.floating-div {
		position: absolute;
		/* 绝对定位 */
		top: 0px;
		/* 调整距离顶部的距离 */
		right: 5px;
		/* 调整距离左侧的距离 */
		/* background-color: #fff; */
		/* 背景色，避免遮挡输入框内容 */
		/* padding: 2px 5px; */
		/* 内边距 */
		/* border: 1px solid #ccc; */
		/* 边框 */
		/* border-radius: 4px; */
		/* 圆角 */
		font-size: 20px;
		/* 字体大小 */
		z-index: 1;
		/* 确保在输入框上方 */
	}
</style>